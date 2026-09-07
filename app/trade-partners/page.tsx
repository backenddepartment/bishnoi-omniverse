import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, Factory, Handshake, Ship } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Trade & Partners | Bishnoi Omniverse',
  description:
    'A cross-border sourcing and distribution network built on two hubs — India and the Philippines — open to distribution partners and manufacturer partners who need reach into markets that are difficult to serve directly.',
};

const IMG = {
  hero: 'https://upload.wikimedia.org/wikipedia/commons/5/59/Shipping_cranes_by_Cartagena.jpg',
};

const PARTNER_TYPES = [
  {
    icon: Factory,
    title: 'Manufacturer Partners',
    desc: 'Device and pharmaceutical manufacturers looking for reach into markets they do not serve directly. We handle sourcing qualification, documentation, and onward distribution through our two hubs.',
    asks: [
      'Product category and registration status by market',
      'Certifications held — CE, CMDR, WHO-GMP, ISO 13485',
      'Manufacturing capacity and lead times',
    ],
  },
  {
    icon: Handshake,
    title: 'Distribution Partners',
    desc: 'Distributors and regional wholesalers who need a consolidated line of supply for hospital consumables or specialty medicines, drawn from India’s manufacturing base.',
    asks: [
      'Markets served and institutional customer base',
      'Product categories in demand and volumes',
      'Import licensing and regulatory status in your market',
    ],
  },
  {
    icon: Ship,
    title: 'Logistics & Corridor Partners',
    desc: 'Freight, cold-chain, and customs partners working the India–Southeast Asia corridor, where consolidation through Metro Manila shortens the route into Asia-Pacific markets.',
    asks: [
      'Corridors and modes covered',
      'Cold-chain capability and monitoring standards',
      'Customs and clearance experience by destination',
    ],
  },
];

export default function TradePartnersPage() {
  return (
    <div className="w-full">
      <section className="page-hero">
        <div className="hero-media">
          <img src={IMG.hero} alt="Container cranes at a shipping port" loading="eager" />
        </div>
        <div className="hero-content">
          <span className="eyebrow on-dark">Trade &amp; Partners</span>
          <h1>Two hubs, built for markets that are hard to serve directly</h1>
          <p className="lede">
            A cross-border sourcing and distribution network built on two hubs — India and the
            Philippines — open to distribution partners and manufacturer partners who need reach
            into markets that are difficult to serve directly.
          </p>
          <div className="hero-actions">
            <Link className="btn btn-primary" href="/contact?type=partner">
              Explore a Partnership <ArrowRight />
            </Link>
            <Link className="btn btn-outline" href="/global-network">
              See the Operating Footprint
            </Link>
          </div>
        </div>
      </section>

      <section className="section section-tight">
        <div className="wrap grid-2">
          <div>
            <span className="eyebrow">The Model</span>
            <h2 className="mb-0">Sourcing through India. Consolidation through the Philippines.</h2>
          </div>
          <div className="lead-block">
            <p className="text-ink-soft leading-relaxed">
              Bishnoi Omniverse LLP in New Delhi works directly with certified manufacturers across
              India&apos;s pharmaceutical and medical-device base. Bishnoi Omniverse Corp in Metro
              Manila consolidates and moves that supply through the Southeast Asian logistics
              corridor.
            </p>
            <p className="text-ink-soft leading-relaxed">
              For a partner, that means one accountable counterparty on both ends of the route —
              qualification and documentation at source, consolidation and cold-chain handling in
              transit.
            </p>
          </div>
        </div>
      </section>

      <section className="section section-line section-2col">
        <div className="wrap">
          <span className="eyebrow">Who We Work With</span>
          <h2 className="mb-10">Three partnership routes</h2>

          <div className="grid-3">
            {PARTNER_TYPES.map((type) => {
              const Icon = type.icon;
              return (
                <div key={type.title} className="pillar">
                  <Icon className="w-5 h-5 text-accent mb-4" strokeWidth={1.75} />
                  <h3>{type.title}</h3>
                  <p className="mb-4">{type.desc}</p>
                  <ul className="space-y-2 m-0 p-0 list-none">
                    {type.asks.map((ask) => (
                      <li key={ask} className="text-sm text-muted leading-relaxed flex items-start gap-2">
                        <span className="text-accent shrink-0 mt-0.5">—</span>
                        <span>{ask}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="wrap grid-2 items-start">
          <div>
            <span className="eyebrow">How Onboarding Runs</span>
            <h2 className="mb-3">Qualification before commitment</h2>
            <p className="text-ink-soft max-w-md">
              We qualify a partner the same way we qualify a product line — on documentation, not on
              introductions.
            </p>
          </div>
          <div className="timeline">
            {[
              {
                step: '1',
                title: 'Introduction',
                desc: 'Tell us your product categories or markets, the certifications you hold, and where you need reach.',
              },
              {
                step: '2',
                title: 'Documentation Review',
                desc: 'We review certifications, registration status, and manufacturing or licensing credentials against the destination markets in scope.',
              },
              {
                step: '3',
                title: 'Commercial Terms',
                desc: 'Scope, territories, volumes, and terms are agreed in writing before any supply moves.',
              },
              {
                step: '4',
                title: 'First Consignment',
                desc: 'A first consignment runs through the full documentation and logistics process, so both sides can check the route end to end.',
              },
            ].map((step) => (
              <div key={step.step} className="tl-item">
                <span className="tl-year">Step {step.step}</span>
                <h3>{step.title}</h3>
                <p>{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-dark section-tight">
        <div className="wrap text-center max-w-2xl mx-auto">
          <span className="eyebrow on-dark">Partner With Us</span>
          <h2>Tell us which markets you need to reach.</h2>
          <p className="mt-2 mb-8">
            Send your product categories, certifications, and target territories — a case manager
            responds within 24 hours.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/contact?type=partner" className="btn btn-primary">
              Start a Partnership Conversation <ArrowRight />
            </Link>
            <Link href="/quality" className="btn btn-outline">
              Quality &amp; Compliance
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
