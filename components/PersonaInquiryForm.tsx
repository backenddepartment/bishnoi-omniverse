'use client';

import React, { useId, useRef, useState } from 'react';
import contactData from '@/lib/data/contactData.json';
import { InquiryGuard, type InquiryGuardHandle } from '@/components/InquiryGuard';
import { CAPTCHA_ENABLED, DOCUMENT_EXTENSIONS, collectFiles, phoneInput, sendInquiry } from '@/lib/inquiry';
import { SuccessDialog } from '@/components/SuccessDialog';
import { AttachmentPicker } from '@/components/attachments/AttachmentPicker';

// Fields sent as the email's own header rows (or its message panel) rather than as detail rows.
const CORE_FIELDS = ['email', 'phone', 'additionalNotes', 'message'];

/** One field of an inquiry form, as written in contactData.json. */
export type FormField = {
  name: string;
  label: string;
  type: string;
  placeholder?: string;
  required?: boolean;
  options?: string[];
  accept?: string;
  hint?: string;
  /** Takes a whole row of the form. */
  wide?: boolean;
};
export type Persona = {
  id: string;
  category: string;
  tagline: string;
  buttonText: string;
  inquiryType: string;
  nameField: string;
  formFields: FormField[];
};

export const PERSONAS = contactData.personas as Persona[];

/** A persona's name without its leading "For ", for menus and pickers outside the contact page. */
export const personaName = (persona: Persona) => persona.category.replace(/^For\s+/i, '');

/**
 * Starting values for a persona's form when the inquiry is about a catalog product: hospitals list
 * it as an item requested, the other personas get it at the top of their notes / message box.
 */
export function productPrefill(persona: Persona, product: string, size?: string): Record<string, string> {
  const item = size ? `${product} (size: ${size})` : product;
  if (persona.id === 'hospital') return { itemsRequested: item };
  const notesField = persona.formFields.find((f) => f.type === 'textarea')?.name;
  return notesField ? { [notesField]: `Inquiry about: ${item}\n\n` } : {};
}

interface Props {
  persona: Persona;
  /** Values the form opens with. Read once: key the form to start it again with new ones. */
  initialData?: Record<string, string>;
  /** Catalog products the inquiry is about, sent as the email's linked item list. Read at send time. */
  items?: { name: string; url: string }[];
  /** Called when the visitor closes the confirmation of a sent inquiry. */
  onSent?: () => void;
}

/**
 * One persona's inquiry form, as on the contact page: its fields from contactData.json, the
 * human check, and a success dialog that clears the form once closed.
 */
export function PersonaInquiryForm({ persona, initialData, items, onSent }: Props) {
  const [formData, setFormData] = useState<Record<string, string>>(initialData ?? {});
  const [submitted, setSubmitted] = useState<boolean>(false);
  // Chosen files, by field name (formData keeps only their names, for display).
  const [files, setFiles] = useState<Record<string, File[]>>({});
  const [sending, setSending] = useState<boolean>(false);
  const [sendError, setSendError] = useState<string>('');
  const [captchaToken, setCaptchaToken] = useState<string>('');
  const guardRef = useRef<InquiryGuardHandle>(null);
  // Each label points at its field, so screen readers announce it and clicking it focuses the field.
  const uid = useId();
  const fieldId = (name: string) => `${uid}-${name}`;

  // The form's fields sit two to a row. A field marked wide takes a whole row, and so does one
  // that would otherwise be left alone in a row with an empty place beside it.
  const fullWidth = new Set<string>();
  let inRow: string[] = [];
  const closeRow = () => {
    if (inRow.length === 1) fullWidth.add(inRow[0]);
    inRow = [];
  };
  for (const field of persona.formFields) {
    if (field.type === 'textarea') continue;
    if (field.wide) {
      closeRow();
      fullWidth.add(field.name);
    } else {
      inRow.push(field.name);
      if (inRow.length === 2) inRow = [];
    }
  }
  closeRow();

  const handleInputChange = (fieldName: string, value: string) => {
    setFormData((prev) => ({ ...prev, [fieldName]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (sending) return;
    setSendError('');
    setSending(true);

    const chosen = persona.formFields
      .filter((field) => field.type === 'file')
      .flatMap((field) => files[field.name] ?? []);
    const collected = await collectFiles(chosen, DOCUMENT_EXTENSIONS, 'Tender spec / PO / product list');
    if (!collected.ok) {
      setSendError(collected.error);
      setSending(false);
      return;
    }

    const result = await sendInquiry(
      {
        // Every inquiry type goes to the inbox that receives the medical equipment inquiries.
        // The email's Inquiry Type row says which of the four it is.
        formType: 'product',
        inquiryType: persona.inquiryType,
        name: formData[persona.nameField] ?? '',
        email: formData.email ?? '',
        phone: formData.phone ?? '',
        message: formData.additionalNotes ?? formData.message ?? '',
        details: persona.formFields
          .filter((field) => field.type !== 'file' && !CORE_FIELDS.includes(field.name))
          .map((field) => ({ label: field.label, value: formData[field.name] ?? '' })),
        items,
        files: collected.files,
      },
      { captchaToken, honeypot: guardRef.current?.honeypot() ?? '' }
    );

    // Turnstile tokens are single-use: a retry always needs a fresh one.
    guardRef.current?.reset();
    setSending(false);
    if (result.ok) {
      setSubmitted(true);
    } else {
      setSendError(result.message);
    }
  };

  return (
    <>
      {/* Once sent, the confirmation opens over the page; closing it clears the form. */}
      {submitted && (
        <SuccessDialog
          title="Inquiry Sent!"
          onClose={() => {
            setSubmitted(false);
            setFormData({});
            setFiles({});
            onSent?.();
          }}
        >
          <p>
            Thank you. Your inquiry for <strong>{persona.category}</strong> has been received.
            A Bishnoi Omniverse case manager will contact you within <strong>24 hours</strong>.
          </p>
        </SuccessDialog>
      )}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-end">
          {persona.formFields.map((field) => {
            if (field.type === 'textarea') return null;
            return (
              <div key={field.name} className={fullWidth.has(field.name) ? 'sm:col-span-2' : ''}>
                <label className="field-label" htmlFor={field.type === 'file' ? undefined : fieldId(field.name)}>
                  {field.label} {field.required && <span className="text-accent">*</span>}
                </label>

                {field.type === 'select' ? (
                  <select
                    id={fieldId(field.name)}
                    required={field.required}
                    value={formData[field.name] || ''}
                    onChange={(e) => handleInputChange(field.name, e.target.value)}
                    className="field-select"
                  >
                    <option value="">Select an option...</option>
                    {field.options?.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                ) : field.type === 'file' ? (
                  // Several files, each a card that opens a preview; formData keeps only
                  // their names.
                  <AttachmentPicker
                    files={files[field.name] ?? []}
                    required={field.required}
                    onChange={(picked) => {
                      setFiles((prev) => ({ ...prev, [field.name]: picked }));
                      handleInputChange(field.name, picked.map((file) => file.name).join(', '));
                    }}
                  />
                ) : (
                  <input
                    id={fieldId(field.name)}
                    type={field.type}
                    inputMode={field.type === 'tel' ? 'tel' : undefined}
                    required={field.required}
                    placeholder={field.placeholder}
                    value={formData[field.name] || ''}
                    onChange={(e) =>
                      handleInputChange(
                        field.name,
                        field.type === 'tel' ? phoneInput(e.target.value) : e.target.value
                      )
                    }
                    className="field-input"
                  />
                )}
                {field.hint && <p className="text-xs text-muted mt-1.5 mb-0">{field.hint}</p>}
              </div>
            );
          })}
        </div>

        {persona.formFields.map((field) => {
          if (field.type !== 'textarea') return null;
          return (
            <div key={field.name}>
              <label className="field-label" htmlFor={fieldId(field.name)}>
                {field.label} {field.required && <span className="text-accent">*</span>}
              </label>
              <textarea
                id={fieldId(field.name)}
                rows={3}
                required={field.required}
                placeholder={field.placeholder}
                value={formData[field.name] || ''}
                onChange={(e) => handleInputChange(field.name, e.target.value)}
                className="field-textarea"
              />
            </div>
          );
        })}

        <InquiryGuard ref={guardRef} onToken={setCaptchaToken} />

        {sendError && (
          <p className="inquiry-error" role="alert">
            {sendError}
          </p>
        )}

        <div className="pt-1">
          {/* Stays disabled until "Verify you are human" has passed, and while sending. */}
          <button type="submit" disabled={sending || (CAPTCHA_ENABLED && !captchaToken)} className="ct-submit">
            {sending ? 'Sending…' : 'Submit'}
          </button>
        </div>
      </form>
    </>
  );
}
