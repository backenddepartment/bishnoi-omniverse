'use client';

import React, { useEffect, useRef, useState } from 'react';
import { ArrowRight, Phone } from 'lucide-react';
import contactData from '@/lib/data/contactData.json';
import { InquiryGuard, type InquiryGuardHandle } from '@/components/InquiryGuard';
import { CAPTCHA_ENABLED, DOCUMENT_EXTENSIONS, collectFiles, sendInquiry } from '@/lib/inquiry';

// Fields sent as the email's own header rows (or its message panel) rather than as detail rows.
const CORE_FIELDS = ['email', 'phone', 'additionalNotes', 'message'];
import contactbg from '@/app/assets/contactbg.png';
import team from '@/app/assets/team.jpg';
import { PatternSection, SectionHead, Prose, Split, Stepper } from '@/components/about/Patterns';
import {
  ContactChannelCards,
  OfficeCards,
  QuoteBox,
  UploadPrompt,
  RouteCards,
  TalkPanel,
} from '@/components/about/contact/ContactBlocks';
import { PH_TEL_HREF } from '@/lib/contactChannels';

const IMG = {
  hero: contactbg.src,
  portrait: team.src,
};

// The response steps drawn beside the "What Happens After You Reach Out" copy.
const NEXT_STEPS = [
  { title: 'We review your requirement and any files you send' },
  { title: 'We contact you if anything needs clarifying' },
  { title: 'We check sourcing options and documents with our suppliers' },
  { title: 'You receive a quotation with quantities, prices, lead times and documents' },
];

export default function ContactPage() {
  const { pageHeader, directContact, quoteSection, listSection, assistSection, personas, whatHappens, closing } =
    contactData;

  const [activePersonaId, setActivePersonaId] = useState<string>('doctor');
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState<boolean>(false);
  // Chosen files, by field name (formData keeps only their names, for display).
  const [files, setFiles] = useState<Record<string, File | null>>({});
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

  // Route buttons around the page (hero, quote box, upload area, route cards, closing panel) select a
  // persona and bring the visitor to it. Choosing the persona already open keeps what they typed,
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
      .map((field) => files[field.name])
      .filter((file): file is File => !!file);
    const collected = await collectFiles(chosen, DOCUMENT_EXTENSIONS, 'Tender spec / PO / product list');
    if (!collected.ok) {
      setSendError(collected.error);
      setSending(false);
      return;
    }

    const result = await sendInquiry(
      {
        // Institutional supply is where product pages send buyers, so it is an equipment inquiry.
        formType: activePersona.id === 'hospital' ? 'product' : 'contact',
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
      {/* Page Header */}
      <section className="page-hero page-hero-banner">
        <div className="hero-media">
          <img src={IMG.hero} alt="A calm hospital waiting area" loading="eager" />
        </div>
        <div className="hero-content">
          <span className="eyebrow on-dark">{pageHeader.title}</span>
          <h1>{pageHeader.headline}</h1>
          <p className="lede">{pageHeader.subheadline}</p>
          <div className="hero-actions">
            <button type="button" onClick={() => goToPersona('hospital')} className="btn btn-primary">
              Request a Quote
            </button>
            <a href={PH_TEL_HREF} className="btn btn-outline">
              <Phone className="w-4 h-4" strokeWidth={1.5} aria-hidden="true" /> Talk to Our Team
            </a>
          </div>
        </div>
      </section>

      {/* 1 · Contact details */}
      <PatternSection>
        <SectionHead eyebrow={directContact.eyebrow} title={directContact.title} />
        <Prose paras={directContact.paragraphs} className="max-w-3xl mb-10" />
        <ContactChannelCards email={directContact.email} phone={directContact.hotline} />
        <OfficeCards offices={directContact.offices} />
      </PatternSection>

      {/* 2 · Request a quote */}
      <PatternSection tone="paper">
        <Split side="right" media={<QuoteBox onRequest={() => goToPersona('hospital')} />}>
          <SectionHead eyebrow={quoteSection.eyebrow} title={quoteSection.title} />
          <Prose paras={quoteSection.paragraphs} />
        </Split>
      </PatternSection>

      {/* 3 · Send your list */}
      <PatternSection>
        <Split side="right" media={<UploadPrompt onOpen={() => goToPersona('hospital', 'form')} />}>
          <SectionHead eyebrow={listSection.eyebrow} title={listSection.title} />
          <Prose paras={listSection.paragraphs} />
        </Split>
      </PatternSection>

      {/* 4 · Inquiry routes, then the persona tabs and the form itself */}
      <section className="section ap-paper">
        <div className="wrap">
          <SectionHead eyebrow={assistSection.eyebrow} title={assistSection.title} />
          <Prose paras={assistSection.paragraphs} className="max-w-3xl mb-10" />
          <RouteCards activeId={activePersonaId} onSelect={(id) => goToPersona(id)} />

          {/* Persona Selector */}
          <div ref={personaTabsRef} className="scroll-target grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-12 mb-12">
            {personas.map((p) => {
              const selected = p.id === activePersonaId;
              return (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => {
                    setActivePersonaId(p.id);
                    setSubmitted(false);
                    setFormData({});
                    setFiles({});
                    setSendError('');
                  }}
                  aria-pressed={selected}
                  className={`p-5 text-left rounded-xl border transition flex flex-col justify-between ${
                    selected ? 'border-ink bg-ink text-white' : 'border-line bg-surface text-ink hover:border-accent'
                  }`}
                >
                  <div>
                    <h3 className="font-sans text-lg font-bold leading-snug m-0">{p.category}</h3>
                  </div>
                  <span className={`mt-4 text-xs font-semibold flex items-center gap-1 ${selected ? 'text-accent' : 'text-accent-dark'}`}>
                    Select <ArrowRight className="w-3 h-3" />
                  </span>
                </button>
              );
            })}
          </div>

          {/* Active Persona Form */}
          <div ref={formRef} className="scroll-target info-card max-w-4xl !p-8 !rounded-2xl">
            <div className="border-b border-line pb-6 mb-6">
              <span className="text-xs font-semibold uppercase tracking-wide text-muted block mb-1">Active Selection</span>
              <h3 className="font-sans text-xl font-bold text-ink">{activePersona.category}</h3>
              <p className="text-sm text-ink-soft mt-2 italic">&quot;{activePersona.tagline}&quot;</p>
            </div>

            {submitted ? (
              <div className="p-6 bg-ink text-white rounded space-y-3">
                <h4 className="font-sans text-lg font-bold text-white m-0">Inquiry Submitted Successfully</h4>
                <p className="text-sm !text-[#d7d2c1] leading-relaxed">
                  Thank you. Your inquiry for <strong className="text-white">{activePersona.category}</strong> has been
                  received. A dedicated Bishnoi Omniverse case manager will contact you within{' '}
                  <strong className="text-white">24 hours</strong>.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setSubmitted(false);
                    setFormData({});
                    setFiles({});
                  }}
                  className="btn btn-outline !py-2 !px-4 !text-xs mt-2"
                >
                  Submit Another Request
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {activePersona.formFields.map((field) => {
                    if (field.type === 'textarea') return null;
                    return (
                      <div
                        key={field.name}
                        className={
                          field.wide || field.name === 'additionalNotes' || field.name === 'message'
                            ? 'sm:col-span-2'
                            : ''
                        }
                      >
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
                          // File inputs can't be controlled; only the chosen file's name is kept.
                          <input
                            type="file"
                            accept={field.accept}
                            required={field.required}
                            onChange={(e) => {
                              const file = e.target.files?.[0] ?? null;
                              setFiles((prev) => ({ ...prev, [field.name]: file }));
                              handleInputChange(field.name, file?.name ?? '');
                            }}
                            className="field-input"
                          />
                        ) : (
                          <input
                            type={field.type}
                            required={field.required}
                            placeholder={field.placeholder}
                            value={formData[field.name] || ''}
                            onChange={(e) => handleInputChange(field.name, e.target.value)}
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
                        rows={4}
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

                <div className="pt-2">
                  {/* Stays disabled until "Verify you are human" has passed, and while sending. */}
                  <button
                    type="submit"
                    disabled={sending || (CAPTCHA_ENABLED && !captchaToken)}
                    className="btn btn-primary w-full sm:w-auto justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {sending ? 'Sending…' : activePersona.buttonText}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* 5 · Next steps */}
      <section className="section-dark section">
        <div className="wrap grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">
          <div>
            <SectionHead eyebrow={whatHappens.eyebrow} title={whatHappens.title} onDark />
            <Prose paras={whatHappens.paragraphs} />
          </div>
          <Stepper
            vertical
            steps={NEXT_STEPS}
            className="[&_.ap-step-marker]:!bg-ink [&_.ap-step_h3]:!text-white [&_.ap-step_h3]:!mt-3"
          />
        </div>
      </section>

      {/* Closing · talk to us */}
      <TalkPanel
        eyebrow={closing.eyebrow}
        title={closing.title}
        text={closing.text}
        portrait={IMG.portrait}
        email={directContact.email}
        onRequestQuote={() => goToPersona('hospital')}
      />
    </div>
  );
}
