import React from 'react';
import Link from 'next/link';
import {
  Ambulance, BedDouble, Building2, FileCheck2, Globe2, Handshake, HeartHandshake,
  HeartPulse, Hospital, Route, Snowflake, Split, Stethoscope, Syringe, UserCheck,
} from 'lucide-react';
import businessesData from '@/lib/data/businessesData.json';
import { WhatWeDoBand } from '@/components/WhatWeDoBand';
import { FadeIn } from '@/components/FadeIn';
import storyHeroImg from '@/app/assets/aboutusstorybg.png';
import cphiImg from '@/app/assets/cphi.jpeg';
import whatWeDoBandImg from '@/app/assets/backgroundabout.png';
import familiesImg from '@/app/assets/families.jpg';
import teamImg from '@/app/assets/team.jpg';
import howWeWorkImg from '@/app/assets/howwework.jpg';
import askImg from '@/app/assets/documents.png';

// Local assets: the two Wikimedia URLs previously used here both 404'd, leaving a broken hero.
const IMG = {
  hero: storyHeroImg.src,
  whoWeAre: cphiImg.src,
  whatWeDoBand: whatWeDoBandImg.src,
  howWeWork: howWeWorkImg.src,
  ask: askImg.src,
};

// The rotating statement line. Hospitals and clinics get orange icon chips; patients get faces.
const MARQUEE_HOSPITAL_ICONS = [Hospital, BedDouble, Ambulance];
const MARQUEE_CLINIC_ICONS = [Stethoscope, HeartPulse, Syringe];

// Placeholder faces cropped out of photography the site already ships — objectPosition is what
// frames each one. Swap in three dedicated avatar files here when there are some.
const MARQUEE_AVATARS = [
  { src: familiesImg.src, objectPosition: '32% 42%', alt: '' },
  { src: teamImg.src, objectPosition: '58% 34%', alt: '' },
  { src: familiesImg.src, objectPosition: '62% 55%', alt: '' },
];

// What We Do — the two supply lines plus the network that moves them, in the same terms the
// homepage uses, so a reader arriving from either page sees one story.
const WHAT_WE_DO = [
  {
    icon: Building2,
    title: 'Hospital Supplies',
    desc: 'IV and infusion therapy, blood bank and transfusion products, surgical connectivity, airway management, and medical gas — specification-documented consumables for institutional procurement.',
    ctaText: 'Browse the catalog',
    ctaHref: '/catalog',
  },
  {
    icon: Snowflake,
    title: 'Specialty Medicines',
    desc: 'Named-patient and cross-border access to oncology therapies, rare biosimilars, and critical-care medicines that are not yet registered in your market, delivered under monitored cold chain.',
    ctaText: 'Find a specialty medicine',
    ctaHref: '/contact?type=find-medicine',
  },
  {
    icon: Globe2,
    title: 'Sourcing, Logistics & Trade',
    desc: "A dual-hub sourcing and fulfilment network connecting India's manufacturing base and Southeast Asia's logistics corridor to hospitals, distributors, and manufacturer partners worldwide.",
    ctaText: 'Trade & partners',
    ctaHref: '/trade-partners',
  },
];

// Who We Serve — the four intake routes. The homepage carries the same four as photo tiles; here
// they are one line each, because an About reader wants the list, not the sell.
const WHO_WE_SERVE = [
  {
    icon: Building2,
    title: 'Hospitals & Procurement Teams',
    desc: 'Tender-line quoting with certification references attached to every item.',
  },
  {
    icon: UserCheck,
    title: 'Clinicians & Oncology Teams',
    desc: 'Named-patient and cross-border access to therapies not yet registered in your market.',
  },
  {
    icon: Handshake,
    title: 'Distributors & Manufacturer Partners',
    desc: 'Cross-border reach into markets that are hard to serve directly, through our two-hub network.',
  },
  {
    icon: HeartHandshake,
    title: 'Patients & Families',
    desc: 'Guidance through the named-patient process, coordinated with your treating doctor.',
  },
];

// Operating principles, distinct from the homepage's commercial framing.
const PRINCIPLES = [
  {
    icon: FileCheck2,
    title: 'Clear Product Documents',
    desc: 'Product information depends on the product and destination. We provide the available certificates, specifications, and supporting documents for each product so you can review the information you need.',
  },
  {
    icon: Split,
    title: 'Separate Supply Processes',
    desc: 'Hospital orders and patient-specific requests have different requirements. We handle each request through the appropriate process to keep documentation, approvals, and delivery requirements clear.',
  },
  {
    icon: Route,
    title: 'Connected Supply Network',
    desc: 'Our New Delhi and Metro Manila hubs support product sourcing, consolidation, and distribution. Our teams work together to manage the supply process from product sourcing to delivery.',
  },
];

export default function AboutPage() {
  const { vision } = businessesData;

  return (
    <div className="w-full about-page">
      <section className="page-hero page-hero-slide">
        <div className="hero-media">
          <img
            src={IMG.hero}
            alt="Driving innovation for modern business: Bishnoi Omniverse representatives at CPHI Japan 2026, and the team at a company summit"
            loading="eager"
          />
        </div>
        {/* The hero image carries its own headline, so the page's heading is kept for screen
            readers and search engines only. */}
        <h1 className="sr-only">About Us — The healthcare supply business inside the Bishnoi Group</h1>
      </section>

      <section className="section section-tight section-white">
        <div className="wrap grid-2 items-start">
          <div className="heading-lg">
            <span className="eyebrow">Who We Are</span>
            <h2 className="mb-6">{vision.title}</h2>
            <img
              src={IMG.whoWeAre}
              alt="Four members of the Bishnoi Omniverse team in business dress outside the CPHI exhibition venue"
              className="w-full h-56 md:h-64 object-cover object-center rounded-2xl"
              loading="lazy"
            />
          </div>
          <div className="lead-block">
            <p className="font-poppins text-xl font-semibold text-accent leading-snug mb-4">{vision.lead}</p>
            <p className="text-ink-soft leading-relaxed">{vision.paragraph}</p>
            <Link href="/global" className="btn btn-outline on-accent mt-4">
              See the full group structure
            </Link>
          </div>
        </div>
      </section>

      {/* Statement line, marqueeing right to left. The track holds the sentence twice so it can
          loop at -50%; the whole thing is decorative, with the sentence given to assistive tech
          once through the heading above it. */}
      <section className="marquee-line">
        <h2 className="sr-only">Built for hospitals, clinics, and patients</h2>
        <div className="marquee-track" aria-hidden="true">
          {[0, 1].map((copy) => (
            <div key={copy} className="marquee-group">
              <span>Built for Hospitals</span>
              <span className="marquee-cluster">
                {MARQUEE_HOSPITAL_ICONS.map((Icon, idx) => (
                  <span key={idx} className="marquee-chip">
                    <Icon strokeWidth={1.75} />
                  </span>
                ))}
              </span>
              <span>, Clinics</span>
              <span className="marquee-cluster">
                {MARQUEE_CLINIC_ICONS.map((Icon, idx) => (
                  <span key={idx} className="marquee-chip">
                    <Icon strokeWidth={1.75} />
                  </span>
                ))}
              </span>
              <span>, and Patients</span>
              <span className="marquee-cluster">
                {MARQUEE_AVATARS.map((avatar, idx) => (
                  <span key={idx} className="marquee-chip marquee-avatar">
                    <img
                      src={avatar.src}
                      alt={avatar.alt}
                      style={{ objectPosition: avatar.objectPosition }}
                      loading="lazy"
                    />
                  </span>
                ))}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* What We Do — the plain statement of the business, ahead of the principles that govern it.
          Sits on a full-width photographic band, with the content lifted onto a white panel that
          overlaps it. WhatWeDoBand owns the section element and its two scroll effects. */}
      <WhatWeDoBand image={IMG.whatWeDoBand}>
        <div className="grid-2 items-start">
          <div className="heading-lg">
            <span className="eyebrow">What We Do</span>
            <h2 className="mb-0">We source, document, and deliver medical products</h2>
          </div>
          <div className="lead-block">
            <p className="text-ink-soft leading-relaxed m-0">
              Bishnoi Omniverse supplies hospital-grade equipment, consumables, and hard-to-source
              specialty medicines. Two supply lines, run through one sourcing, documentation, and
              logistics discipline.
            </p>
          </div>
        </div>

        <div className="grid-3 mt-12 what-we-do">
          {WHAT_WE_DO.map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.title} className="pillar">
                <Icon className="w-10 h-10 text-accent mb-5" strokeWidth={1.5} aria-hidden="true" />
                <h3>{item.title}</h3>
                <p>{item.desc}</p>
                <Link href={item.ctaHref} className="btn btn-outline on-accent mt-5">
                  {item.ctaText}
                </Link>
              </div>
            );
          })}
        </div>
      </WhatWeDoBand>

      {/* Who We Serve — one line per audience. The full treatment lives on /global. */}
      <section className="section section-white pt-0">
        <div className="wrap">
          <div className="grid-2 items-start">
            <div className="heading-lg">
              <span className="eyebrow">Who We Serve</span>
              <h2 className="mb-0">Hospitals, clinics, laboratories, and trade&nbsp;partners</h2>
            </div>
            <div className="lead-block">
              <p className="text-ink-soft leading-relaxed m-0">
                We provide medical equipment, medical supplies, and healthcare products for hospitals,
                clinics, laboratories, healthcare professionals, and business partners. Each group has
                its own intake route, documentation set, and point of contact.
              </p>
            </div>
          </div>

          {/* grid-4 rather than Tailwind columns, so these follow the site's own breakpoints:
              four across, two at 900px, one at 560px. */}
          <div className="grid-4 mt-12">
            {WHO_WE_SERVE.map((item, idx) => {
              const Icon = item.icon;
              // The first audience card is shown in its orange state from the start.
              return (
                <div
                  key={item.title}
                  className={`border border-line rounded-2xl p-6 card-hover${idx === 0 ? ' is-active' : ''}`}
                >
                  <Icon className="w-10 h-10 text-accent mb-5" strokeWidth={1.5} aria-hidden="true" />
                  <h3 className="font-sans text-base font-bold text-ink mb-2">{item.title}</h3>
                  <p className="text-sm text-ink-soft leading-relaxed m-0">{item.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How We Work — full-width band on the team photo, mirrored so the wall is on the left.
          The heading sits on the left and the three principles on the right, each over its own
          dark fade. */}
      <section id="values" className="how-we-work">
        <img
          src={IMG.howWeWork}
          alt="A Bishnoi Omniverse team member talking a client through a requirement at her desk"
          className="how-we-work-media"
          loading="lazy"
        />
        <div className="wrap how-we-work-inner">
          <FadeIn className="how-we-work-head" from="left">
            <div className="heading-lg">
              <span className="eyebrow on-dark">Our Approach</span>
              <h2>How We Work</h2>
            </div>
            <p className="how-we-work-lead">
              We keep the process simple: clear product information, reliable supply support, and
              direct communication from inquiry to delivery.
            </p>
          </FadeIn>
          <FadeIn className="how-we-work-panel" from="right">
            <ul className="how-we-work-list">
              {PRINCIPLES.map((principle) => {
                const Icon = principle.icon;
                return (
                  <li key={principle.title}>
                    <span className="how-we-work-icon" aria-hidden="true">
                      <Icon strokeWidth={1.5} />
                    </span>
                    <div>
                      <h3>{principle.title}</h3>
                      <p>{principle.desc}</p>
                    </div>
                  </li>
                );
              })}
            </ul>
          </FadeIn>
        </div>
      </section>

      {/* Our Business & Network and Sustainability & Governance — one section, two columns, each
          with its own heading. Entity and footprint detail live on /global and /global-network. */}
      <section className="section section-white">
        <div className="wrap grid-2 items-start">
          <div>
            <div className="heading-lg">
              <span className="eyebrow">Our Business &amp; Network</span>
              <h2>How We Source and Deliver Healthcare Products</h2>
            </div>
            <p className="text-ink-soft leading-relaxed m-0">
              Bishnoi Omniverse is the healthcare supply business of the Bishnoi Group. It trades
              through two registered entities, each running its own hub — New Delhi sources, Metro
              Manila consolidates and moves — so a hospital, a clinician, or a distributor deals
              with a single accountable counterparty from quotation through to handover. Between
              them we serve hospitals, clinics, and trade partners across more than 50 countries.
            </p>
            <Link href="/global-network" className="btn btn-outline on-accent mt-6">
              See the full operating footprint
            </Link>
          </div>
          <div>
            <div className="heading-lg">
              <span className="eyebrow">Sustainability &amp; Governance</span>
              <h2>Governed to one standard, commercial and philanthropic alike</h2>
            </div>
            <p className="text-ink-soft leading-relaxed m-0">
              Bishnoi Omniverse&apos;s approach to sustainability is set at the Bishnoi Group level,
              where the Group has been an active UN Global Compact participant since November 2024,
              filing Communications on Progress for 2025 and 2026. This commitment sits alongside
              the Group&apos;s long-standing philanthropic work through the Naresh Bishnoi
              Foundation, reflecting a view that responsible sourcing, transparent documentation,
              and social-impact work are governed under the same standard rather than run as
              separate initiatives.
            </p>
          </div>
        </div>
      </section>

      {/* Closing banner: the documents photo with an orange gradient bar across its foot, carrying
          the question prompt and the two routes (FAQs, email). */}
      <section className="about-ask">
        <img
          src={IMG.ask}
          alt="A Bishnoi Omniverse team member working through documents at an office workstation"
          className="about-ask-media"
          loading="lazy"
        />
        <div className="about-ask-bar">
          <div className="wrap about-ask-inner">
            <h2 className="about-ask-title">
              Suggestions?
              <br />
              Questions?
            </h2>
            <div className="about-ask-actions">
              <Link href="/faq" className="about-ask-btn is-light">
                See FAQs
              </Link>
              <a href="mailto:contact@bishnoi.ai" className="about-ask-btn is-orange">
                Send an Email
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
