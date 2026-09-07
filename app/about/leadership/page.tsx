import React from 'react';
import Link from 'next/link';
import { ArrowRight, FileCheck2, UserCheck, RouteOff } from 'lucide-react';

const IMG = {
  hero: 'https://upload.wikimedia.org/wikipedia/commons/a/a0/Facial_plastic_surgeon_wearing_surgical_loupes_and_headlight_during_an_operating_room_procedure.jpg',
  // Served from /public so a missing file degrades to a broken image instead of failing the build.
  // Drop the portrait at public/founder-naresh-bishnoi.jpg and it renders here with no code change.
  founder: '/founder-naresh-bishnoi.jpg',
};

// The two operating hubs, described structurally. Deliberately no individual names — only the
// functions each hub is accountable for are confirmed.
const OPERATING_HUBS = [
  {
    entity: 'Bishnoi Omniverse LLP',
    place: 'New Delhi, India',
    desc: 'Leads sourcing, manufacturer qualification, and documentation for the hospital supplies and specialty medicines lines.',
  },
  {
    entity: 'Bishnoi Omniverse Corp',
    place: 'Metro Manila, Philippines — legally tied to Getmeds Philippines Inc. / 2MG Inc.',
    desc: 'Leads Asia-Pacific logistics, cold-chain fulfillment, and regional distribution.',
  },
];

const SOURCING_PRINCIPLES = [
  {
    icon: FileCheck2,
    title: 'Documentation before delivery',
    desc: 'No product ships without the certification and testing paperwork behind it already in hand — not promised, not “available on request.” If a manufacturer can’t produce a Certificate of Analysis or the applicable compliance mark before shipment, we don’t carry that product.',
  },
  {
    icon: UserCheck,
    title: 'Named accountability',
    desc: 'Every institutional order has a single point of contact on our side, from initial quote to delivered shipment. Procurement teams working with named-patient or cold-chain-sensitive orders should never have to chase down which hub or which person owns their request.',
  },
  {
    icon: RouteOff,
    title: 'Confirm-then-commit sourcing',
    desc: 'For categories with binding regulatory pathways — named-patient access to unregistered medicines, in particular — we confirm the regulatory route with the receiving country before committing to a sourcing timeline, rather than promising a delivery date and working backward.',
  },
];

export default function LeadershipPage() {
  return (
    <div className="w-full">
      <section className="page-hero">
        <div className="hero-media">
          <img src={IMG.hero} alt="Leadership guiding hospital procurement worldwide" loading="eager" />
        </div>
        <div className="hero-content">
          <span className="eyebrow on-dark">About Us</span>
          <h1>Leadership</h1>
          <p className="lede">The people and regional teams steering Bishnoi Omniverse&apos;s global supply mission.</p>
        </div>
      </section>

      <section className="section-tight section-white">
        <div className="wrap grid-2 items-start">
          <div className="heading-lg">
            <span className="eyebrow">Founder</span>
            <h2 className="mb-6">Naresh Bishnoi</h2>
            <img
              src={IMG.founder}
              alt="Naresh Bishnoi, Founder and Chairman of the Bishnoi Group"
              className="w-full max-w-xs aspect-[3/4] object-cover object-top rounded-2xl"
              loading="lazy"
            />
          </div>
          <div className="lead-block">
            <p className="font-poppins text-xl font-semibold text-accent leading-snug mb-4">
              Founder &amp; Chairman, Bishnoi Group
            </p>
            <p className="text-ink-soft leading-relaxed">
              A proud member of the Bishnoi Group, Naresh Bishnoi founded the Omniverse ecosystem to close the
              gap between the world&apos;s medical resources and the hospitals and patients who need them most —
              spanning healthcare infrastructure, pharmaceutical access, global logistics, and social
              philanthropy across borders.
            </p>
            <p className="text-ink-soft leading-relaxed">
              Under his leadership, Bishnoi Omniverse has built its dual-hub sourcing and logistics model —
              connecting India&apos;s manufacturing base with Southeast Asia&apos;s distribution corridor — while
              extending the Group&apos;s commitments as an active participant in the United Nations Global Compact
              since November 2024, with Communications on Progress filed for 2025 and 2026. Mr. Bishnoi
              represents the Group at major regional forums, including the UN Global Compact Forward Faster
              Now | APAC Conference 2026 in Colombo, Sri Lanka, where sustainable healthcare supply and
              SDG-aligned business practice were central themes.
            </p>
          </div>
        </div>
      </section>

      {/* Operating Structure — replaces the old "Two Hubs, Led Locally" placeholder, which promised
          regional leadership teams that were never named. This describes the structure instead. */}
      <section className="section section-line section-white">
        <div className="wrap">
          <div className="grid-2 items-start">
            <div className="heading-lg">
              <span className="eyebrow">How Bishnoi Omniverse Is Organized</span>
              <h2 className="mb-0">Operating Structure &amp; Governance</h2>
            </div>
            <div className="lead-block">
              <p className="text-ink-soft leading-relaxed m-0">
                Bishnoi Omniverse operates as the healthcare infrastructure and hospital supply business
                within the wider Bishnoi Group, structured around two operating hubs and two accountable
                functions:
              </p>
            </div>
          </div>

          <div className="grid-2 items-start mt-14">
            {OPERATING_HUBS.map((hub) => (
              <div key={hub.entity} className="info-card">
                <h3 className="font-sans text-lg font-bold text-ink mb-1">{hub.entity}</h3>
                <div className="text-sm font-semibold text-ink-soft mb-3">{hub.place}</div>
                <p className="text-sm text-ink-soft leading-relaxed">{hub.desc}</p>
              </div>
            ))}
          </div>

          <p className="lead-block text-ink-soft leading-relaxed mt-10 mb-0">
            Each product category is assigned a named quality and regulatory owner internally, and every
            order — whether a hospital purchase order or a named-patient specialty request — is tracked from
            sourcing through delivery by the hub responsible for that market. This structure is designed to
            keep accountability close to the product: the team that qualifies a manufacturer is the same team
            that stands behind the documentation you receive with your order.
          </p>
        </div>
      </section>

      <section className="section section-line section-white">
        <div className="wrap">
          <div className="grid-2 items-start">
            <div className="heading-lg">
              <span className="eyebrow">Leadership Philosophy</span>
              <h2 className="mb-0">How We Make Sourcing Decisions</h2>
            </div>
            <div className="lead-block">
              <p className="text-ink-soft leading-relaxed m-0">
                Three principles guide every sourcing and partnership decision at Bishnoi Omniverse:
              </p>
            </div>
          </div>

          <div className="grid-3 mt-14">
            {SOURCING_PRINCIPLES.map((principle) => {
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

      <section className="section section-line section-white">
        <div className="wrap grid-2 items-start">
          <div className="heading-lg">
            <span className="eyebrow">Group Leadership</span>
            <h2 className="mb-0">Bishnoi Group &amp; Social Impact Leadership</h2>
          </div>
          <div className="lead-block">
            <p className="text-ink-soft leading-relaxed m-0">
              Bishnoi Omniverse sits within the wider Bishnoi Group, which also includes the Getmeds
              pharmaceutical access network (operating in the Philippines, India, Vanuatu, Latin America, and
              Southeast Asia) and the Naresh Bishnoi Foundation, the Group&apos;s philanthropic and
              social-impact arm. Leadership across the Group participates jointly in the Group&apos;s UN Global
              Compact commitments, reflecting a shared view that commercial healthcare supply and
              social-impact work are run under the same governance standards rather than as separate efforts.
            </p>
          </div>
        </div>
      </section>

      <section className="section-dark section-tight">
        <div className="wrap text-center max-w-2xl mx-auto">
          <span className="eyebrow on-dark">Partner With Us</span>
          <h2>Building the world&apos;s most trusted supply line for medicine that can&apos;t wait.</h2>
          <div className="flex flex-wrap justify-center gap-4 mt-8">
            <Link href="/contact" className="btn btn-primary">
              Get In Touch <ArrowRight />
            </Link>
            <Link href="/about" className="btn btn-outline">
              Read Our Story
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
