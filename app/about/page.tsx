import React from 'react';
import Link from 'next/link';
import { ArrowRight, FileCheck2, Route, Split } from 'lucide-react';
import businessesData from '@/lib/data/businessesData.json';
import facilityImg from '@/app/assets/contactbg.png';
import structureImg from '@/app/assets/omniverseabout.png';

// Local assets: the two Wikimedia URLs previously used here both 404'd, leaving a broken hero.
const IMG = {
  hero: facilityImg.src,
  structure: structureImg.src,
};

// Same four figures as the homepage proof strip, reformatted for a company-overview context.
// Every one is substantiated by existing site content — no new numbers.
const BY_THE_NUMBERS = [
  { stat: '2', label: 'Operating hubs — India & Philippines' },
  { stat: '2', label: 'Supply lines — hospital supplies & specialty medicines' },
  { stat: '50+', label: 'Countries served' },
  { stat: '2024', label: 'UN Global Compact participant since' },
];

// Operating principles, distinct from the homepage's commercial framing.
const PRINCIPLES = [
  {
    icon: FileCheck2,
    title: 'Document, don’t declare',
    desc: 'Certification varies by product and destination market, so we publish it per product — registration references, Certificates of Analysis, cylinder certifications — instead of one blanket safety claim that nobody can verify.',
  },
  {
    icon: Split,
    title: 'Keep the two workflows separate',
    desc: 'Institutional procurement and named-patient access run under different rules, different paperwork, and different clocks. We staff and run them as separate tracks so a tender never sits behind a clinical case, or the reverse.',
  },
  {
    icon: Route,
    title: 'Own both ends of the route',
    desc: 'Sourcing in New Delhi and consolidation in Metro Manila are our own hubs, not brokered relationships. One counterparty is accountable from manufacturer qualification through to handover.',
  },
];

export default function AboutPage() {
  const { vision } = businessesData;

  return (
    <div className="w-full about-page">
      <section className="page-hero">
        <div className="hero-media">
          <img src={IMG.hero} alt="A calm, modern healthcare facility" loading="eager" />
        </div>
        <div className="hero-content">
          <span className="eyebrow on-dark">About Us</span>
          <h1>The healthcare supply business inside the Bishnoi Group</h1>
          <p className="lede">
            Bishnoi Omniverse is the healthcare infrastructure and hospital supply business within
            the wider Bishnoi Group, which also includes the Getmeds pharmaceutical access network
            and the Naresh Bishnoi Foundation&apos;s philanthropic initiatives.
          </p>
        </div>
      </section>

      <section className="section section-tight section-white">
        <div className="wrap grid-2 items-start">
          <div className="heading-lg">
            <span className="eyebrow">Group Structure</span>
            <h2 className="mb-6">{vision.title}</h2>
            <img
              src={IMG.structure}
              alt="Bishnoi Omniverse"
              className="w-full h-auto rounded-2xl"
              loading="lazy"
            />
          </div>
          <div className="lead-block">
            <p className="font-poppins text-xl font-semibold text-accent leading-snug mb-4">{vision.lead}</p>
            <p className="text-ink-soft leading-relaxed">{vision.paragraph}</p>
            <Link
              href="/global"
              className="inline-flex items-center gap-1.5 no-underline text-sm font-semibold text-accent-dark hover:underline mt-2"
            >
              See the full group structure <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </section>

      <section className="section section-line section-white">
        <div className="wrap">
          <div className="grid-2 items-start">
            <div className="heading-lg">
              <span className="eyebrow">How We Operate</span>
              <h2 className="mb-0">Three operating principles</h2>
            </div>
            <div className="lead-block">
              <p className="text-ink-soft leading-relaxed m-0">
                These are the rules the supply business actually runs on — the ones a procurement
                officer or a hospital pharmacist can hold us to.
              </p>
            </div>
          </div>

          <div id="values" className="grid-3 mt-14">
            {PRINCIPLES.map((principle) => {
              const Icon = principle.icon;
              return (
                <div key={principle.title} className="pillar">
                  <Icon className="w-10 h-10 text-accent mb-5" strokeWidth={1.5} />
                  <h3>{principle.title}</h3>
                  <p>{principle.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="section section-white pt-0">
        <div className="wrap grid-2 items-start">
          <div className="heading-lg">
            <span className="eyebrow">Where We Operate</span>
            <h2 className="mb-3">Two hubs, one continuous line of supply</h2>
            <p className="text-ink-soft max-w-md">
              Bishnoi Omniverse LLP in New Delhi sources; Bishnoi Omniverse Corp in Metro Manila
              consolidates and moves. Between them we serve hospitals, clinics, and trade partners
              across more than 50 countries.
            </p>
          </div>
          <div className="lead-block space-y-6">
            <div>
              <h3 className="font-sans text-base font-bold text-ink mb-1">
                India Hub — Sourcing · Bishnoi Omniverse LLP
              </h3>
              <p className="text-sm text-ink-soft leading-relaxed m-0">
                Okhla Industrial Area, Phase III, New Delhi, India 110020
              </p>
            </div>
            <div>
              <h3 className="font-sans text-base font-bold text-ink mb-1">
                Philippines Hub — Logistics &amp; Operations · Bishnoi Omniverse Corp
              </h3>
              <p className="text-sm text-ink-soft leading-relaxed m-0">
                Unit 301 &amp; 305, 17 Vatican Bldg., Vatican City Drive, B.F. Resort Village, Talon
                II, Las Piñas City, Metro Manila, Philippines
              </p>
            </div>
            <Link
              href="/global-network"
              className="inline-flex items-center gap-1.5 no-underline text-sm font-semibold text-accent-dark hover:underline"
            >
              See the full operating footprint <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </section>

      <section className="section section-line section-white pt-0">
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

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-14">
            {BY_THE_NUMBERS.map((item) => (
              <div key={item.label} className="border-l-2 border-accent pl-5">
                <div className="font-poppins text-4xl font-semibold text-ink leading-none mb-2">
                  {item.stat}
                </div>
                <div className="text-sm text-ink-soft leading-snug">{item.label}</div>
              </div>
            ))}
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
                  Request a Quote <ArrowRight />
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
