'use client';

import React, { useEffect, useRef, useState } from 'react';
import { ArrowUpRight, ChevronDown, Phone } from 'lucide-react';
import contactData from '@/lib/data/contactData.json';
import { PERSONAS, PersonaInquiryForm, productPrefill } from '@/components/PersonaInquiryForm';
import contactbg from '@/app/assets/contact.webp';
import { AboutHero, PatternSection, SectionHead } from '@/components/about/Patterns';
import { ContactChannels, OfficeCards } from '@/components/about/contact/ContactBlocks';
import { GuideAccordion } from '@/components/about/contact/GuideAccordion';
import { PH_TEL_HREF } from '@/lib/contactChannels';

const IMG = {
  hero: contactbg.src,
};

export default function ContactPage() {
  const { pageHeader, directContact, formSection, quoteSection, listSection, assistSection, whatHappens, guide } =
    contactData;
  const personas = PERSONAS;

  const [activePersonaId, setActivePersonaId] = useState<string>('doctor');
  // A product carried in from the catalog (?product=…&size=…), as the form's starting values.
  const [prefill, setPrefill] = useState<Record<string, string> | undefined>(undefined);
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
    const target = personas.find((p) => p.id === persona);
    if (target && product) {
      setPrefill(productPrefill(target, product, params.get('size') ?? undefined));
    }
  }, []);

  const activePersona = personas.find((p) => p.id === activePersonaId) || personas[0];

  // Buttons around the page (the hero, and the guide under the form) select a persona and bring
  // the visitor to it. Choosing the persona already open keeps what they typed,
  // including a product carried in from ?product=.
  const selectPersona = (id: string) => {
    if (id !== activePersonaId) {
      setActivePersonaId(id);
      setPrefill(undefined);
    }
  };
  const goToPersona = (id: string, target: 'tabs' | 'form' = 'tabs') => {
    selectPersona(id);
    requestAnimationFrame(() => {
      (target === 'form' ? formRef : personaTabsRef).current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
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
        {/* On phones the form comes first and the ways to reach us drop beneath it. */}
        <div className="wrap ct-reach-wrap">
          <div className="ct-ways">
            <SectionHead eyebrow={directContact.eyebrow} title={directContact.title} />
            <ContactChannels emails={directContact.emails} phones={directContact.phones} />
          </div>

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
                {/* Keyed so a persona change, or a product arriving from the catalog, starts it afresh. */}
                <PersonaInquiryForm
                  key={`${activePersona.id}:${prefill ? 'prefill' : ''}`}
                  persona={activePersona}
                  initialData={prefill}
                />
              </div>
            </div>
          </div>

          <div className="ct-offices mt-16">
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
