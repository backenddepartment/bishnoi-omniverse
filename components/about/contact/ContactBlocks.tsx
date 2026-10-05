import React from 'react';
import type { LucideIcon } from 'lucide-react';
import {
  ArrowRight,
  Building2,
  FileSpreadsheet,
  FileText,
  FileType,
  Handshake,
  Linkedin,
  Mail,
  MessageCircle,
  Phone,
  Share2,
  Stethoscope,
  UploadCloud,
} from 'lucide-react';
import { LINKEDIN_HREF, MESSAGING_DISPLAY, PH_TEL_HREF, VIBER_HREF, WHATSAPP_HREF, telHref } from '@/lib/contactChannels';

/**
 * Page-specific pieces of the Contact Us page. They only lay out and route: every button that leads
 * to the inquiry form calls back into the page, which selects the persona and scrolls to the form.
 */

/* ---------- Section 1: the ways to reach us, beside the form ---------- */

/**
 * The ways to reach us as blocks in a row: a small icon tile and a title, then the details
 * beneath, each with its own icon.
 */
export function ContactChannels({ emails, phones }: { emails: string[]; phones: string[] }) {
  const channels: { icon: LucideIcon; title: string; lines: { icon: LucideIcon; node: React.ReactNode }[] }[] = [
    {
      icon: Mail,
      title: 'Email',
      lines: emails.map((email) => ({ icon: Mail, node: <a href={`mailto:${email}`}>{email}</a> })),
    },
    {
      icon: Phone,
      title: 'Phone',
      lines: phones.map((phone) => ({ icon: Phone, node: <a href={telHref(phone)}>{phone}</a> })),
    },
    {
      icon: MessageCircle,
      title: 'WhatsApp and Viber',
      lines: [
        {
          icon: MessageCircle,
          node: (
            <>
              <a href={WHATSAPP_HREF} target="_blank" rel="noopener noreferrer">
                {MESSAGING_DISPLAY}
              </a>
              <span className="ct-channel-note">WhatsApp</span>
            </>
          ),
        },
        // No new tab: this link opens the Viber app, and would leave an empty tab behind.
        {
          icon: Phone,
          node: (
            <>
              <a href={VIBER_HREF}>{MESSAGING_DISPLAY}</a>
              <span className="ct-channel-note">Viber</span>
            </>
          ),
        },
      ],
    },
    {
      icon: Share2,
      title: 'Social Network',
      lines: [
        {
          icon: Linkedin,
          node: (
            <a href={LINKEDIN_HREF} target="_blank" rel="noopener noreferrer">
              LinkedIn
            </a>
          ),
        },
      ],
    },
  ];

  return (
    <div className="ct-channels">
      {channels.map(({ icon: Icon, title, lines }) => (
        <div key={title} className="ct-channel">
          <h3>
            <span className="ct-channel-icon" aria-hidden="true">
              <Icon strokeWidth={2} />
            </span>
            {title}
          </h3>
          <ul>
            {lines.map(({ icon: LineIcon, node }, i) => (
              <li key={i}>
                <LineIcon strokeWidth={2} aria-hidden="true" />
                <span>{node}</span>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

export type Office = { country: string; entity: string; address: string; mapQuery: string };

/**
 * The two offices. Each is its details — country and name in the orange sweep, address — set
 * straight on the section, and beneath them, in a frame of its own, a small lazy-loaded Google
 * Maps embed.
 */
export function OfficeCards({ offices }: { offices: Office[] }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-12">
      {offices.map((o) => (
        <div key={o.entity} className="flex flex-col">
          <span className="office-country">{o.country}</span>
          <h3 className="office-name">{o.entity}</h3>
          <p className="text-[15px] leading-relaxed text-ink m-0 mb-6">{o.address}</p>
          <iframe
            title={`Map showing the ${o.entity} office, ${o.country}`}
            src={`https://www.google.com/maps?q=${encodeURIComponent(o.mapQuery)}&output=embed`}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="block w-full h-64 mt-auto rounded-2xl border border-line"
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
    // Full-bleed closing band: edge to edge, sitting directly on the footer.
    <section className="ap-cta-band">
      <div>
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
