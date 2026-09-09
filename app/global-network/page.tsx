import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, Building2, Globe2, MapPin, Mail, Handshake, Snowflake } from 'lucide-react';

// Service tiers are described by hub relationship rather than by country list — a real regional
// breakdown (Section 6, item 5) would be stronger, but only once the geographies are confirmed.
const SERVICE_TIERS = [
  {
    icon: Globe2,
    title: 'Direct-served markets',
    desc: 'Countries reached directly from our India and Philippines hubs, with established customs, logistics, and documentation pathways.',
  },
  {
    icon: Handshake,
    title: 'Partner-served markets',
    desc: 'Countries reached through distribution partners under the Trade & Partners program, extending our reach beyond directly served geographies.',
  },
  {
    icon: MapPin,
    title: 'Named-patient / case-by-case markets',
    desc: 'For specialty medicines requiring named-patient regulatory pathways, sourcing and delivery are confirmed on a per-case, per-country basis in coordination with the receiving institution’s regulatory requirements.',
  },
];
import contactData from '@/lib/data/contactData.json';
import sectionDetail from '@/lib/data/sectionDetailData.json';

export const metadata: Metadata = {
  title: 'Global Network | Bishnoi Omniverse',
  description:
    'Our operating footprint: the India sourcing hub in New Delhi, the Philippines logistics hub in Metro Manila, the wider Getmeds access network, and our UN Global Compact engagement.',
};

const IMG = {
  hero: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/36/Manila_Skyline_March_2020.jpg/1920px-Manila_Skyline_March_2020.jpg',
  india: 'https://upload.wikimedia.org/wikipedia/commons/d/da/Skyline_of_Cannaught_Place%2C_New_Delhi.jpg',
  philippines:
    'https://upload.wikimedia.org/wikipedia/commons/thumb/3/36/Manila_Skyline_March_2020.jpg/1920px-Manila_Skyline_March_2020.jpg',
};

const NETWORK = [
  {
    name: 'Getmeds Philippines',
    desc: 'Everyday essential medicines and healthcare services across the Philippine archipelago.',
  },
  {
    name: 'Getmeds Healthcare (India)',
    desc: 'Pharmaceutical export engine enabling named-patient access to oncology and critical-care therapies.',
  },
  {
    name: 'Getmeds Vanuatu',
    desc: 'Specialty pharmacy presence in the Pacific, providing local access to cancer treatments.',
  },
  {
    name: 'Getmeds Latin America',
    desc: 'Cross-border distribution partnerships across Latin American markets.',
  },
  {
    name: 'Getmeds Southeast Asia',
    desc: 'Regional supply lines across emerging Southeast Asian territories.',
  },
];

export default function GlobalNetworkPage() {
  const [india, philippines] = contactData.globalOffices.locations;

  return (
    <div className="w-full">
      <section className="page-hero">
        <div className="hero-media">
          <img src={IMG.hero} alt="The Metro Manila skyline, home to our Asia-Pacific logistics hub" loading="eager" />
        </div>
        <div className="hero-content">
          <span className="eyebrow on-dark">Global Network</span>
          <h1>Two hubs, one continuous line of supply</h1>
          <p className="lede">
            Sourcing runs through New Delhi. Regional logistics run through Metro Manila. Together
            they serve hospitals, clinics, and trade partners across more than 50 countries.
          </p>
        </div>
      </section>

      {/* The two operating hubs */}
      <section className="section section-tight">
        <div className="wrap">
          <span className="eyebrow">Operating Hubs</span>
          <h2 className="mb-4">Where the supply is sourced and where it is consolidated</h2>
          {/* Network narrative, relocated from the homepage's Operating Footprint section. */}
          <p className="lead-block text-ink-soft leading-relaxed mb-10">
            {sectionDetail.globalNetwork.narrative}
          </p>

          <div className="grid-2">
            {[
              { office: india, img: IMG.india, role: 'Sourcing Hub', href: '/llp', hrefLabel: 'Bishnoi Omniverse LLP' },
              {
                office: philippines,
                img: IMG.philippines,
                role: 'Logistics & Operations Hub',
                href: '/corp',
                hrefLabel: 'Bishnoi Omniverse Corp',
              },
            ].map(({ office, img, role, href, hrefLabel }) => (
              <div key={office.region}>
                <img
                  src={img}
                  alt={office.region}
                  className="w-full h-[260px] object-cover rounded mb-6"
                  loading="lazy"
                />
                <span className="tag">{role}</span>
                <h3 className="font-sans text-xl font-bold text-ink mt-3 mb-2">{office.entity}</h3>
                <p className="text-sm text-ink-soft leading-relaxed mb-5">{office.desc}</p>

                <div className="info-card !p-6 space-y-4">
                  <div className="flex items-start gap-3">
                    <MapPin className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                    <div>
                      <span className="text-xs font-semibold uppercase tracking-wide text-muted block mb-1">
                        Address
                      </span>
                      <span className="text-sm text-ink">{office.address}</span>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Mail className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                    <div>
                      <span className="text-xs font-semibold uppercase tracking-wide text-muted block mb-1">
                        Email
                      </span>
                      <span className="text-sm text-ink">{office.email}</span>
                    </div>
                  </div>
                </div>

                <Link
                  href={href}
                  className="inline-flex items-center gap-1.5 no-underline text-sm font-semibold text-accent-dark hover:underline mt-5"
                >
                  {hrefLabel} <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* The wider access network */}
      <section className="section section-line section-2col">
        <div className="wrap">
          <div className="grid-2 items-start">
            <div>
              <span className="eyebrow">Access Network</span>
              <h2 className="mb-3">The Getmeds pharmaceutical access network</h2>
              <p className="text-ink-soft max-w-md">
                Beyond the two Omniverse hubs, the wider group operates pharmaceutical access
                businesses that extend reach into the Pacific, Latin America, and Southeast Asia.
              </p>
              <Link
                href="/global#getmeds"
                className="inline-flex items-center gap-1.5 no-underline text-sm font-semibold text-accent-dark hover:underline mt-6"
              >
                See the full group structure <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <ul className="space-y-4 m-0 p-0 list-none">
              {NETWORK.map((item) => (
                <li key={item.name} className="flex items-start gap-3">
                  <Building2 className="w-4 h-4 text-accent shrink-0 mt-1" strokeWidth={1.75} />
                  <div>
                    <h3 className="font-sans text-base font-bold text-ink mb-1">{item.name}</h3>
                    <p className="text-sm text-ink-soft leading-relaxed m-0">{item.desc}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* UN Global Compact */}
      <section className="section">
        <div className="wrap grid-2 items-start">
          <div>
            <span className="eyebrow">United Nations Global Compact</span>
            <h2 className="mb-3">Participation, and where it can be checked</h2>
            <p className="text-ink-soft max-w-md">
              We publish our participation status rather than describing it in general terms, so it
              can be verified independently.
            </p>
          </div>
          <div className="lead-block">
            <ul className="space-y-4 m-0 p-0 list-none">
              <li className="flex items-start gap-3">
                <Globe2 className="w-4 h-4 text-accent shrink-0 mt-1" strokeWidth={1.75} />
                <span className="text-sm text-ink-soft leading-relaxed">
                  <strong className="text-ink">Active Participant since November 2024</strong>, with
                  Communications on Progress filed for 2025 and 2026 — checkable at{' '}
                  <a
                    href="https://unglobalcompact.org"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-accent-dark hover:underline"
                  >
                    unglobalcompact.org
                  </a>
                  .
                </span>
              </li>
              <li className="flex items-start gap-3">
                <Globe2 className="w-4 h-4 text-accent shrink-0 mt-1" strokeWidth={1.75} />
                <span className="text-sm text-ink-soft leading-relaxed">
                  <strong className="text-ink">
                    UN Global Compact Forward Faster Now | APAC Conference 2026
                  </strong>{' '}
                  — 11–12 August 2026, Colombo, Sri Lanka. Represented by leadership including
                  Director Mr. Naresh Kumar Bishnoi, advancing SDG Ambition and sustainable
                  healthcare standards.
                </span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      <section className="section section-line section-white">
        <div className="wrap">
          <div className="grid-2 items-start">
            <div className="heading-lg">
              <span className="eyebrow">How We Serve Each Region</span>
              <h2 className="mb-0">Regional Service Model</h2>
            </div>
            <div className="lead-block">
              <p className="text-ink-soft leading-relaxed m-0">
                Reach is not uniform, and saying so is more useful than a single number. Markets fall
                into three tiers, by how the supply actually gets there.
              </p>
            </div>
          </div>

          <div className="grid-3 mt-14">
            {SERVICE_TIERS.map((tier) => {
              const Icon = tier.icon;
              return (
                <div key={tier.title} className="pillar">
                  <Icon className="w-10 h-10 text-accent mb-5" strokeWidth={1.5} />
                  <h3>{tier.title}</h3>
                  <p>{tier.desc}</p>
                </div>
              );
            })}
          </div>

          <div className="info-card mt-12 flex items-start gap-5">
            <Snowflake className="w-9 h-9 text-accent shrink-0" strokeWidth={1.5} />
            <div>
              <h3 className="font-sans text-lg font-bold text-ink mb-2">
                Cold-Chain &amp; Logistics Capability
              </h3>
              <p className="text-sm text-ink-soft leading-relaxed m-0">
                Temperature-sensitive products — including named-patient oncology and biosimilar
                shipments — move under continuous cold-chain monitoring from the point of dispatch
                through delivery, with temperature-log documentation provided alongside each
                shipment.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="section-dark section-tight">
        <div className="wrap text-center max-w-2xl mx-auto">
          <span className="eyebrow on-dark">Work With Either Hub</span>
          <h2>Route your requirement to the hub that can move it fastest.</h2>
          <p className="mt-2 mb-8">
            Tell us the destination market and we will route sourcing and logistics accordingly.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/contact?type=quote" className="btn btn-primary">
              Request a Quote <ArrowRight />
            </Link>
            <Link href="/trade-partners" className="btn btn-outline">
              Trade &amp; Partners
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
