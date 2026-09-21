import React from 'react';
import Link from 'next/link';
import {
  Ambulance, ArrowRight, BedDouble, Building2, FileCheck2, Globe2, Handshake, HeartHandshake,
  HeartPulse, Hospital, Route, Snowflake, Split, Stethoscope, Syringe, UserCheck,
} from 'lucide-react';
import businessesData from '@/lib/data/businessesData.json';
import { WhatWeDoBand } from '@/components/WhatWeDoBand';
import { FadeIn } from '@/components/FadeIn';
import facilityImg from '@/app/assets/aboutushero.png';
import cphiImg from '@/app/assets/cphi.jpeg';
import whatWeDoBandImg from '@/app/assets/backgroundabout.png';
import suppliesImg from '@/app/assets/supplies.jpg';
import medicinesImg from '@/app/assets/medicines.jpg';
import sourcingImg from '@/app/assets/sourcing.jpg';
import familiesImg from '@/app/assets/families.jpg';
import teamImg from '@/app/assets/team.jpg';

// Local assets: the two Wikimedia URLs previously used here both 404'd, leaving a broken hero.
const IMG = {
  hero: facilityImg.src,
  whoWeAre: cphiImg.src,
  whatWeDoBand: whatWeDoBandImg.src,
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

// Our Business & Network — the two registered entities, each with the hub it runs. Business
// structure and operating footprint were two sections saying the same thing; they are one now.
const OUR_BUSINESS = [
  {
    name: 'Bishnoi Omniverse LLP',
    role: 'India Hub · Sourcing',
    desc: 'Manufacturer qualification, specification review, and certification documentation, run out of New Delhi.',
    address: 'Okhla Industrial Area, Phase III, New Delhi, India 110020',
    href: '/llp',
  },
  {
    name: 'Bishnoi Omniverse Corp',
    role: 'Philippines Hub · Logistics & Operations',
    desc: 'Consolidation, cold-chain handling, export documentation, and delivery, run out of Metro Manila.',
    address: 'Unit 301 & 305, 17 Vatican Bldg., Vatican City Drive, B.F. Resort Village, Talon II, Las Piñas City, Metro Manila, Philippines',
    href: '/corp',
  },
];

// Operating principles, distinct from the homepage's commercial framing.
const PRINCIPLES = [
  {
    icon: FileCheck2,
    img: suppliesImg.src,
    imgAlt: 'Certification documentation packed alongside hospital-grade consumables',
    title: 'Clear Product Documents',
    desc: 'Product information depends on the product and destination. We provide the available certificates, specifications, and supporting documents for each product so you can review the information you need.',
  },
  {
    icon: Split,
    img: medicinesImg.src,
    imgAlt: 'Specialty medicines handled through their own supply process',
    title: 'Separate Supply Processes',
    desc: 'Hospital orders and patient-specific requests have different requirements. We handle each request through the appropriate process to keep documentation, approvals, and delivery requirements clear.',
  },
  {
    icon: Route,
    img: sourcingImg.src,
    imgAlt: 'Sourcing and consolidation across our New Delhi and Metro Manila hubs',
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
            alt="Bishnoi Omniverse team members at an international exhibition, and the wider team at a company event"
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
            {WHO_WE_SERVE.map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.title} className="border border-line rounded-2xl p-6 card-hover">
                  <Icon className="w-10 h-10 text-accent mb-5" strokeWidth={1.5} aria-hidden="true" />
                  <h3 className="font-sans text-base font-bold text-ink mb-2">{item.title}</h3>
                  <p className="text-sm text-ink-soft leading-relaxed m-0">{item.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="section section-line section-white">
        <div className="wrap">
          <div className="grid-2 items-start">
            <div className="heading-lg">
              <span className="eyebrow">Our Approach</span>
              <h2 className="mb-0">How We Work</h2>
            </div>
            <div className="lead-block">
              <p className="text-ink-soft leading-relaxed m-0">
                We keep the process simple: clear product information, reliable supply support, and
                direct communication from inquiry to delivery.
              </p>
            </div>
          </div>

          {/* One row per principle, alternating which side the photograph sits on. */}
          <div id="values" className="principle-rows mt-14">
            {PRINCIPLES.map((principle, idx) => {
              const Icon = principle.icon;
              // Each half enters from the edge it already sits against, so a reversed row's
              // photograph comes in from the left and its copy from the right.
              const reversed = idx % 2 === 1;
              return (
                <div
                  key={principle.title}
                  className={`grid-2 principle-row${reversed ? ' principle-row-reversed' : ''}`}
                >
                  <FadeIn className="principle-copy" from={reversed ? 'right' : 'left'}>
                    <Icon className="w-10 h-10 text-accent mb-5" strokeWidth={1.5} aria-hidden="true" />
                    <h3 className="text-ink text-4xl font-medium mb-3 leading-tight">{principle.title}</h3>
                    <p className="text-ink-soft leading-relaxed m-0 text-[19px]">{principle.desc}</p>
                  </FadeIn>
                  <FadeIn className="principle-media" from={reversed ? 'left' : 'right'}>
                    <img src={principle.img} alt={principle.imgAlt} loading="lazy" />
                  </FadeIn>
                </div>
              );
            })}
          </div>
        </div>
      </section>


      {/* Our Business & Network — one section: who the trading entities are and where each one
          runs. The detail behind the footprint stays on /global-network. */}
      <section className="section section-white pt-0">
        <div className="wrap">
          <div className="grid-2 items-start">
            <div className="heading-lg">
              <span className="eyebrow">Our Business &amp; Network</span>
              <h2 className="mb-0">How We Source and Deliver Healthcare Products</h2>
            </div>
            <div className="lead-block">
              <p className="text-ink-soft leading-relaxed m-0">
                Bishnoi Omniverse is the healthcare supply business of the Bishnoi Group. It trades
                through two registered entities, each running its own hub — New Delhi sources, Metro
                Manila consolidates and moves — so a hospital, a clinician, or a distributor deals
                with a single accountable counterparty from quotation through to handover. Between
                them we serve hospitals, clinics, and trade partners across more than 50 countries.
              </p>
              <Link
                href="/global-network"
                className="inline-flex items-center gap-1.5 no-underline text-sm font-semibold text-accent-dark hover:underline mt-4"
              >
                See the full operating footprint <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          <div className="grid-2 mt-12">
            {OUR_BUSINESS.map((entity) => (
              <div key={entity.name} className="border border-line rounded-2xl p-8">
                <span className="eyebrow">{entity.role}</span>
                <h3 className="font-sans text-lg font-bold text-ink mb-2">{entity.name}</h3>
                <p className="text-sm text-ink-soft leading-relaxed m-0">{entity.desc}</p>
                <p className="text-sm text-muted leading-relaxed mt-4 pt-4 border-t border-line mb-0">
                  {entity.address}
                </p>
                <Link
                  href={entity.href}
                  className="inline-flex items-center gap-1.5 no-underline text-sm font-semibold text-accent-dark hover:underline mt-4"
                >
                  Entity details <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section section-line section-white">
        <div className="wrap">
          <div className="grid-2 items-start">
            <div className="heading-lg">
              <span className="eyebrow">Sustainability &amp; Governance</span>
              <h2 className="mb-0">Governed to one standard, commercial and philanthropic alike</h2>
            </div>
            <div className="lead-block">
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
        </div>
      </section>

      <section className="section section-white pt-0 pb-24">
        <div className="wrap">
          <div className="section-dark rounded-3xl px-8 py-20">
            <div className="heading-lg text-center max-w-2xl mx-auto">
              <span className="eyebrow on-dark text-[#f8ae85]">Work With Us</span>
              <h2>Send us the requirement, and we&apos;ll send back the quote and the paperwork.</h2>
              <p className="mt-2 mb-8">
                Whether you run a hospital, treat patients, or manufacture the products the world
                needs — a case manager responds within 24 hours.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link href="/contact?type=quote" className="btn btn-primary">
                  Request a Quote
                </Link>
                <Link href="/global" className="btn btn-outline">
                  See The Group Structure
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
