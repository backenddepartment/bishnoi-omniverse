import React from 'react';
import type { LucideIcon } from 'lucide-react';
import {
  ArrowRight,
  Building2,
  FileSpreadsheet,
  FileText,
  FileType,
  Handshake,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  Stethoscope,
  UploadCloud,
} from 'lucide-react';
import { IconCards } from '@/components/about/Patterns';
import { PH_TEL_HREF, VIBER_HREF, WHATSAPP_HREF } from '@/lib/contactChannels';

/**
 * Page-specific pieces of the Contact Us page. They only lay out and route: every button that leads
 * to the inquiry form calls back into the page, which selects the persona and scrolls to the form.
 */

const linkClass = 'font-semibold text-ink underline decoration-accent/40 underline-offset-4 hover:text-accent-dark';

/* ---------- Section 1: contact cards (P3) ---------- */

export function ContactChannelCards({ email, phone }: { email: string; phone: string }) {
  return (
    <IconCards
      cols={3}
      items={[
        {
          icon: Mail,
          title: 'Email',
          text: (
            <a href={`mailto:${email}`} className={linkClass}>
              {email}
            </a>
          ),
        },
        {
          icon: Phone,
          title: 'Phone',
          text: (
            <>
              <a href={PH_TEL_HREF} className={linkClass}>
                {phone}
              </a>
              <span className="block text-sm text-muted mt-1">Philippines line</span>
            </>
          ),
        },
        {
          icon: MessageCircle,
          title: 'WhatsApp and Viber',
          text: (
            <span className="flex flex-wrap gap-x-5 gap-y-1">
              <a href={WHATSAPP_HREF} target="_blank" rel="noopener noreferrer" className={linkClass}>
                WhatsApp
              </a>
              <a href={VIBER_HREF} target="_blank" rel="noopener noreferrer" className={linkClass}>
                Viber
              </a>
            </span>
          ),
        },
      ]}
    />
  );
}

export type Office = { country: string; entity: string; address: string; mapQuery: string };

/** The two offices, each with a small lazy-loaded Google Maps embed. */
export function OfficeCards({ offices }: { offices: Office[] }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-5">
      {offices.map((o) => (
        <div key={o.entity} className="rounded-2xl border border-line bg-white overflow-hidden flex flex-col">
          <div className="p-7">
            <span className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-accent-dark mb-3">
              <MapPin className="w-4 h-4 text-accent" strokeWidth={1.5} aria-hidden="true" />
              {o.country}
            </span>
            <h3 className="text-lg font-semibold text-ink leading-snug m-0 mb-2">{o.entity}</h3>
            <p className="text-[15px] leading-relaxed text-ink-soft m-0">{o.address}</p>
          </div>
          <iframe
            title={`Map showing the ${o.entity} office, ${o.country}`}
            src={`https://www.google.com/maps?q=${encodeURIComponent(o.mapQuery)}&output=embed`}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="block w-full h-56 border-0 border-t border-line mt-auto"
          />
        </div>
      ))}
    </div>
  );
}

/* ---------- Section 2: quotation box (P1 media column) ---------- */

const QUOTE_CHECKLIST = [
  'Product names, sizes or catalog references',
  'Specifications or preferred brands',
  'Quantities',
  'Delivery location',
  'Tender reference, if any',
];

export function QuoteBox({ onRequest }: { onRequest: () => void }) {
  return (
    <div className="rounded-2xl bg-white border border-line border-l-4 !border-l-accent p-8 shadow-[0_14px_36px_rgba(15,14,12,0.08)]">
      <FileText className="w-10 h-10 text-accent mb-4" strokeWidth={1.5} aria-hidden="true" />
      <h3 className="text-lg font-semibold text-ink m-0 mb-4">What to include</h3>
      <ul className="list-none p-0 m-0 mb-7 space-y-2.5">
        {QUOTE_CHECKLIST.map((item) => (
          <li key={item} className="flex items-start gap-3 text-[15px] text-ink-soft leading-snug">
            <span className="mt-[7px] h-1.5 w-1.5 rounded-full bg-accent shrink-0" aria-hidden="true" />
            {item}
          </li>
        ))}
      </ul>
      <button type="button" onClick={onRequest} className="btn btn-primary">
        Request a Quote <ArrowRight className="w-4 h-4" strokeWidth={1.5} aria-hidden="true" />
      </button>
    </div>
  );
}

/* ---------- Section 3: upload area (P1 media column) ---------- */

const FILE_KINDS: { icon: LucideIcon; label: string }[] = [
  { icon: FileText, label: 'PDF' },
  { icon: FileType, label: 'Word' },
  { icon: FileSpreadsheet, label: 'Excel' },
];

/**
 * Looks like a drop zone, but is a button into the form's hospital route, which carries the real
 * file field, so there is only ever one uploader on the page.
 */
export function UploadPrompt({ onOpen }: { onOpen: () => void }) {
  return (
    <button
      type="button"
      onClick={onOpen}
      className="group w-full rounded-2xl border-2 border-dashed border-line bg-paper px-6 py-12 text-center transition hover:border-accent focus-visible:border-accent"
      aria-label="Submit your equipment list in the request form"
    >
      <UploadCloud className="w-10 h-10 text-accent mx-auto mb-4" strokeWidth={1.5} aria-hidden="true" />
      <span className="block text-lg font-semibold text-ink mb-1">Submit Equipment List</span>
      <span className="block text-sm text-muted mb-8">Attach it in the request form</span>
      <span className="flex justify-center gap-6 sm:gap-10">
        {FILE_KINDS.map(({ icon: Icon, label }) => (
          <span key={label} className="flex flex-col items-center gap-2">
            <span className="flex h-16 w-14 items-center justify-center rounded-lg bg-white border border-line transition group-hover:border-accent">
              <Icon className="w-7 h-7 text-accent" strokeWidth={1.5} aria-hidden="true" />
            </span>
            <span className="text-xs font-semibold text-ink-soft">{label}</span>
          </span>
        ))}
      </span>
    </button>
  );
}

/* ---------- Section 4: route cards (P3) ---------- */

const ROUTES: { persona: string; icon: LucideIcon; title: string; text: string; cta: string }[] = [
  {
    persona: 'hospital',
    icon: Building2,
    title: 'Hospitals and Procurement Teams',
    text: 'Quotation and requirement forms.',
    cta: 'Request a Quote',
  },
  {
    persona: 'doctor',
    icon: Stethoscope,
    title: 'Doctors and Hospital Pharmacies',
    text: 'Specialty medicine for a specific patient.',
    cta: 'Specialty Medicine Form',
  },
  {
    persona: 'partner',
    icon: Handshake,
    title: 'Manufacturers, Suppliers and Partners',
    text: 'Supplier and Partnership Inquiry.',
    cta: 'Supplier & Partnership Inquiry',
  },
];

export function RouteCards({ activeId, onSelect }: { activeId: string; onSelect: (persona: string) => void }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
      {ROUTES.map(({ persona, icon: Icon, title, text, cta }) => {
        const active = persona === activeId;
        return (
          <div
            key={persona}
            className={`rounded-2xl bg-white p-7 flex flex-col border transition ${
              active ? 'border-accent' : 'border-line'
            }`}
          >
            <Icon className="w-10 h-10 text-accent mb-4" strokeWidth={1.5} aria-hidden="true" />
            <h3 className="text-lg font-semibold text-ink leading-snug m-0 mb-2">{title}</h3>
            <p className="text-[15px] leading-relaxed text-ink-soft m-0 mb-6">{text}</p>
            <button
              type="button"
              onClick={() => onSelect(persona)}
              aria-pressed={active}
              className={`btn mt-auto self-start ${active ? 'btn-primary' : 'btn-outline on-accent'}`}
            >
              {cta} <ArrowRight className="w-4 h-4" strokeWidth={1.5} aria-hidden="true" />
            </button>
          </div>
        );
      })}
    </div>
  );
}

/* ---------- Closing: P9 panel with a portrait ---------- */

/**
 * The kit's <CtaBand> takes link CTAs only; this one's primary button has to select the quote route
 * on this same page, so it reuses the band's `ap-cta` classes with buttons of its own.
 */
export function TalkPanel({
  eyebrow,
  title,
  text,
  portrait,
  email,
  onRequestQuote,
}: {
  eyebrow: string;
  title: string;
  text: string;
  portrait: string;
  email: string;
  onRequestQuote: () => void;
}) {
  return (
    <section className="section section-white pt-0 pb-24">
      <div className="wrap">
        <div className="ap-cta is-dark has-aside">
          <div className="ap-cta-aside">
            <img
              src={portrait}
              alt="A smiling member of the Bishnoi Omniverse team in a meeting"
              loading="lazy"
              className="block w-full max-w-[280px] rounded-2xl object-cover"
              style={{ aspectRatio: '4 / 5', objectPosition: '58% 35%' }}
            />
          </div>
          <div className="ap-cta-copy">
            <span className="eyebrow on-dark">{eyebrow}</span>
            <h2>{title}</h2>
            <p>{text}</p>
            <div className="ap-cta-actions">
              <button type="button" onClick={onRequestQuote} className="btn btn-primary">
                Request a Quote
              </button>
              <a href={PH_TEL_HREF} className="btn btn-outline">
                <Phone className="w-4 h-4" strokeWidth={1.5} aria-hidden="true" /> Call
              </a>
              <a href={`mailto:${email}`} className="btn btn-outline">
                <Mail className="w-4 h-4" strokeWidth={1.5} aria-hidden="true" /> Email
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
