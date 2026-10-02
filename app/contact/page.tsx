'use client';

import React, { useEffect, useRef, useState } from 'react';
import { ArrowUpRight, ChevronDown, Phone } from 'lucide-react';
import contactData from '@/lib/data/contactData.json';
import { InquiryGuard, type InquiryGuardHandle } from '@/components/InquiryGuard';
import { CAPTCHA_ENABLED, DOCUMENT_EXTENSIONS, collectFiles, phoneInput, sendInquiry } from '@/lib/inquiry';
import { SuccessDialog } from '@/components/SuccessDialog';
import { AttachmentPicker } from '@/components/attachments/AttachmentPicker';

// Fields sent as the email's own header rows (or its message panel) rather than as detail rows.
const CORE_FIELDS = ['email', 'phone', 'additionalNotes', 'message'];
import contactbg from '@/app/assets/contact.png';
import { AboutHero, PatternSection, SectionHead } from '@/components/about/Patterns';
import { ContactChannels, OfficeCards } from '@/components/about/contact/ContactBlocks';
import { GuideAccordion } from '@/components/about/contact/GuideAccordion';
import { PH_TEL_HREF } from '@/lib/contactChannels';

const IMG = {
  hero: contactbg.src,
};

/** One field of an inquiry form, as written in contactData.json. */
type FormField = {
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
type Persona = {
  id: string;
  category: string;
  tagline: string;
  buttonText: string;
  inquiryType: string;
  nameField: string;
  formFields: FormField[];
};

export default function ContactPage() {
  const { pageHeader, directContact, formSection, quoteSection, listSection, assistSection, whatHappens, guide } =
    contactData;
  const personas = contactData.personas as Persona[];

  const [activePersonaId, setActivePersonaId] = useState<string>('doctor');
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState<boolean>(false);
  // Chosen files, by field name (formData keeps only their names, for display).
  const [files, setFiles] = useState<Record<string, File[]>>({});
  const [sending, setSending] = useState<boolean>(false);
  const [sendError, setSendError] = useState<string>('');
  const [captchaToken, setCaptchaToken] = useState<string>('');
  const guardRef = useRef<InquiryGuardHandle>(null);
  const personaTabsRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLDivElement>(null);

  // CTAs across the site carry ?type=... so a visitor lands on the right intake route
  // (institutional quote, named-patient access, patient guidance, or partnership).
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const type = params.get('type');
    if (!type) return;
    const routes: Record<string, string> = {
      quote: 'hospital',
      'hospital-supply': 'hospital',
      'hospital-supplies': 'hospital',
      hospital: 'hospital',
      'find-medicine': 'doctor',
      specialty: 'doctor',
      doctor: 'doctor',
      patient: 'patient',
      partner: 'partner',
      trade: 'partner',
    };
    const persona = routes[type];
    if (persona) {
      setActivePersonaId(persona);
      // Take the visitor straight to the tab they came for. Deferred a frame so the selected tab
      // has rendered; its scroll-margin-top (.scroll-target) keeps it clear of the sticky header.
      requestAnimationFrame(() => {
        personaTabsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    }

    // Arriving from a product page (?product=…&size=…): carry the item into the request, so the
    // buyer edits it rather than retyping it.
    const product = params.get('product');
    if (persona === 'hospital' && product) {
      const size = params.get('size');
      setFormData({ itemsRequested: size ? `${product} (size: ${size})` : product });
    }
  }, []);

  const activePersona = personas.find((p) => p.id === activePersonaId) || personas[0];

  // The form's fields sit two to a row. A field marked wide takes a whole row, and so does one
  // that would otherwise be left alone in a row with an empty place beside it.
  const fullWidth = new Set<string>();
  let inRow: string[] = [];
  const closeRow = () => {
    if (inRow.length === 1) fullWidth.add(inRow[0]);
    inRow = [];
  };
  for (const field of activePersona.formFields) {
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

  // Buttons around the page (the hero, and the guide under the form) select a persona and bring
  // the visitor to it. Choosing the persona already open keeps what they typed,
  // including a product carried in from ?product=.
  const selectPersona = (id: string) => {
    if (id !== activePersonaId) {
      setActivePersonaId(id);
      setSubmitted(false);
      setFormData({});
      setFiles({});
      setSendError('');
    }
  };
  const goToPersona = (id: string, target: 'tabs' | 'form' = 'tabs') => {
    selectPersona(id);
    requestAnimationFrame(() => {
      (target === 'form' ? formRef : personaTabsRef).current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  };

  const handleInputChange = (fieldName: string, value: string) => {
    setFormData((prev) => ({ ...prev, [fieldName]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (sending) return;
    setSendError('');
    setSending(true);

    const chosen = activePersona.formFields
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
        inquiryType: activePersona.inquiryType,
        name: formData[activePersona.nameField] ?? '',
        email: formData.email ?? '',
        phone: formData.phone ?? '',
        message: formData.additionalNotes ?? formData.message ?? '',
        details: activePersona.formFields
          .filter((field) => field.type !== 'file' && !CORE_FIELDS.includes(field.name))
          .map((field) => ({ label: field.label, value: formData[field.name] ?? '' })),
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
    <div className="w-full contact-page">
      {/* Page Header · P5, the same band as Vision & Values: a designed 1920×820 slide with its
          left half kept clear, so the copy sits there in ink with no scrim and the headline in
          the orange sweep. */}
      <AboutHero
        banner
        overlay="none"
        eyebrow={pageHeader.title}
        title={pageHeader.headline}
        lede={pageHeader.subheadline}
        image={IMG.hero}
        imageAlt="A stethoscope and pulse oximeter on a desk, beside photographs of a hand typing a message on a phone and of the team talking with students at community health events"
        imagePosition="center"
        actions={
          <>
            <button type="button" onClick={() => goToPersona('hospital')} className="btn btn-primary">
              Request a Quote
            </button>
            <a href={PH_TEL_HREF} className="btn btn-outline on-light">
              <Phone className="w-4 h-4" strokeWidth={1.5} aria-hidden="true" /> Talk to Our Team
            </a>
          </>
        }
      />

      {/* 1 · The ways to reach us, set out in a row, and under them the inquiry form in a card
          across the page, with the kind of inquiry chosen from a dropdown at its head. Under
          that, the offices with their maps. */}
      <section className="section section-white">
        <div className="wrap">
          <SectionHead eyebrow={directContact.eyebrow} title={directContact.title} />
          <ContactChannels emails={directContact.emails} phones={directContact.phones} />

          <div className="ct-reach">
            <div ref={personaTabsRef} className="scroll-target ct-form-card">
              <span className="ct-form-eyebrow">{formSection.eyebrow}</span>
              <h2 className="ct-form-title">{formSection.title}</h2>

              <label className="field-label" htmlFor="inquiry-type">
                Inquiry Type
              </label>
              <div className="ct-persona">
                <select id="inquiry-type" value={activePersonaId} onChange={(e) => selectPersona(e.target.value)}>
                  {personas.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.category}
                    </option>
                  ))}
                </select>
                <ChevronDown strokeWidth={2} aria-hidden="true" />
              </div>
              <p className="ct-form-tagline">&quot;{activePersona.tagline}&quot;</p>

              <div ref={formRef} className="scroll-target">
            {/* Once sent, the confirmation opens over the page; closing it clears the form. */}
            {submitted && (
              <SuccessDialog
                title="Inquiry Sent!"
                onClose={() => {
                  setSubmitted(false);
                  setFormData({});
                  setFiles({});
                }}
              >
                <p>
                  Thank you. Your inquiry for <strong>{activePersona.category}</strong> has been received.
                  A Bishnoi Omniverse case manager will contact you within <strong>24 hours</strong>.
                </p>
              </SuccessDialog>
            )}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-end">
                  {activePersona.formFields.map((field) => {
                    if (field.type === 'textarea') return null;
                    return (
                      <div key={field.name} className={fullWidth.has(field.name) ? 'sm:col-span-2' : ''}>
                        <label className="field-label">
                          {field.label} {field.required && <span className="text-accent">*</span>}
                        </label>

                        {field.type === 'select' ? (
                          <select
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

                {activePersona.formFields.map((field) => {
                  if (field.type !== 'textarea') return null;
                  return (
                    <div key={field.name}>
                      <label className="field-label">
                        {field.label} {field.required && <span className="text-accent">*</span>}
                      </label>
                      <textarea
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
              </div>
            </div>
          </div>

          <div className="mt-16">
            <OfficeCards offices={directContact.offices} />
          </div>
        </div>
      </section>

      {/* 3 · The guide: what used to be four sections (request a quote, send your list, inquiry
          routes, next steps) as cards that open one at a time, beside a headline and two buttons.
          Each card's arrow takes the visitor back up to the part of the form it is about. No
          padding on top: it follows on from the form section, white as well, with that section's
          own padding as the space between them. */}
      <PatternSection className="!pt-0">
        <GuideAccordion
          eyebrow={guide.eyebrow}
          title={guide.title}
          text={guide.text}
          actions={
            <>
              <button type="button" onClick={() => goToPersona('hospital')} className="ap-guide-btn">
                <span className="ap-guide-btn-label">Request a Quote</span>
                <span className="ap-guide-btn-arrow" aria-hidden="true">
                  <ArrowUpRight strokeWidth={1.5} />
                </span>
              </button>
              <a href={PH_TEL_HREF} className="btn btn-outline on-light">
                Talk to Our Team
              </a>
            </>
          }
          items={[
            {
              ...quoteSection,
              actionLabel: 'Go to the quotation form',
              onAction: () => goToPersona('hospital'),
            },
            {
              ...listSection,
              actionLabel: 'Go to the form to attach your list',
              onAction: () => goToPersona('hospital', 'form'),
            },
            {
              ...assistSection,
              actionLabel: 'Go to the inquiry forms',
              onAction: () => goToPersona(activePersonaId),
            },
            {
              ...whatHappens,
              actionLabel: 'Go to the inquiry form',
              onAction: () => goToPersona(activePersonaId, 'form'),
            },
          ]}
        />
      </PatternSection>
    </div>
  );
}
