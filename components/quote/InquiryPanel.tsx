'use client';

import React, { forwardRef, useEffect, useId, useImperativeHandle, useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { INQUIRY_TYPES, type InquiryType } from '@/components/catalog/InquiryMenu';
import { PERSONAS, PersonaInquiryForm, personaName, type Persona } from '@/components/PersonaInquiryForm';

export interface InquiryPanelHandle {
  /** Open the given type's form straight away, skipping the type cards. */
  open: (type: InquiryType) => void;
}

interface Props {
  subtitle: string;
  /** Values a type's form starts with, worked out when the form opens. */
  prefillFor?: (persona: Persona) => Record<string, string>;
  /** Catalog products the inquiry is about, sent as the email's linked item list. */
  items?: { name: string; url: string }[];
  /** Shown between the type picker and the form, e.g. a summary of what is being sent. */
  note?: React.ReactNode;
  /** Called once a sent inquiry's confirmation is closed. */
  onSent?: () => void;
}

/**
 * Send Inquiry, as on the product page: who is asking first (four cards and Continue), then that
 * type's form, which keeps a dropdown to change type. A link in with ?inquiry=<type> (the catalog's
 * Send Inquiry menu) skips straight to that form.
 */
export const InquiryPanel = forwardRef<InquiryPanelHandle, Props>(function InquiryPanel(
  { subtitle, prefillFor, items, note, onSent },
  ref
) {
  const uid = useId();
  const [choice, setChoice] = useState<InquiryType | null>(null);
  const [inquiry, setInquiry] = useState<{ type: InquiryType; prefill: Record<string, string> } | null>(null);
  const persona = inquiry ? PERSONAS.find((p) => p.id === inquiry.type) : undefined;

  const start = (type: InquiryType) => {
    const next = PERSONAS.find((p) => p.id === type);
    if (!next) return;
    setChoice(type);
    setInquiry({ type, prefill: prefillFor?.(next) ?? {} });
  };
  useImperativeHandle(ref, () => ({ open: start }));

  useEffect(() => {
    const type = new URLSearchParams(window.location.search).get('inquiry');
    if (type && PERSONAS.some((p) => p.id === type)) start(type as InquiryType);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="ct-form-card pdp-inquiry-card">
      <h2 id={`${uid}-title`} className="pdp-inquiry-title">
        Send Inquiry
      </h2>
      <p className="pdp-inquiry-sub">{subtitle}</p>

      {inquiry && persona ? (
        <>
          <label className="field-label" htmlFor={`${uid}-type`}>
            Inquiry Type
          </label>
          <div className="ct-persona">
            <select id={`${uid}-type`} value={inquiry.type} onChange={(e) => start(e.target.value as InquiryType)}>
              {PERSONAS.map((p) => (
                <option key={p.id} value={p.id}>
                  {personaName(p)}
                </option>
              ))}
            </select>
            <ChevronDown strokeWidth={2} aria-hidden="true" />
          </div>
          <p className="ct-form-tagline">&quot;{persona.tagline}&quot;</p>

          {note}

          {/* Keyed so a change of type starts that type's form afresh. */}
          <PersonaInquiryForm
            key={inquiry.type}
            persona={persona}
            initialData={inquiry.prefill}
            items={items}
            onSent={onSent}
          />
        </>
      ) : (
        <>
          <p id={`${uid}-types`} className="pdp-inquiry-label">
            Inquiry Type:
          </p>
          <div role="radiogroup" aria-labelledby={`${uid}-types`} className="pdp-inquiry-types">
            {INQUIRY_TYPES.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                type="button"
                role="radio"
                aria-checked={choice === id}
                onClick={() => setChoice(id)}
                className={`pdp-inquiry-type${choice === id ? ' is-selected' : ''}`}
              >
                <Icon aria-hidden="true" />
                <span>{label}</span>
              </button>
            ))}
          </div>
          <button
            type="button"
            disabled={!choice}
            onClick={() => choice && start(choice)}
            className="ct-submit pdp-inquiry-continue"
          >
            Continue
          </button>
        </>
      )}
    </div>
  );
});
