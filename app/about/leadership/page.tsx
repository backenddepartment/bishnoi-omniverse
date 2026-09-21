import React from 'react';
import { FileCheck2, UserCheck, RouteOff } from 'lucide-react';
import founderImg from '@/app/assets/CEO.png';
import groupImpactImg from '@/app/assets/bishnoiteam.jpg';
import suppliesImg from '@/app/assets/supplies.jpg';
import doctorsImg from '@/app/assets/doctors.jpg';
import sourcingImg from '@/app/assets/sourcing.jpg';

const IMG = {
  hero: 'https://upload.wikimedia.org/wikipedia/commons/a/a0/Facial_plastic_surgeon_wearing_surgical_loupes_and_headlight_during_an_operating_room_procedure.jpg',
  // Imported rather than referenced by path, so the build fingerprints it and adds the GitHub Pages
  // sub-path (/bishnoi-omniverse) — a bare "/file.jpg" path breaks there.
  founder: founderImg.src,
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
    img: suppliesImg.src,
    imgAlt: 'Hospital-grade consumables prepared for institutional supply',
    title: 'Documentation before delivery',
    desc: 'No product ships without the certification and testing paperwork behind it already in hand — not promised, not “available on request.” If a manufacturer can’t produce a Certificate of Analysis or the applicable compliance mark before shipment, we don’t carry that product.',
  },
  {
    icon: UserCheck,
    img: doctorsImg.src,
    imgAlt: 'Clinicians reviewing a case together',
    title: 'Named accountability',
    desc: 'Every institutional order has a single point of contact on our side, from initial quote to delivered shipment. Procurement teams working with named-patient or cold-chain-sensitive orders should never have to chase down which hub or which person owns their request.',
  },
  {
    icon: RouteOff,
    img: sourcingImg.src,
    imgAlt: 'Sourcing and logistics across our India and Philippines hubs',
    title: 'Confirm-then-commit sourcing',
    desc: 'For categories with binding regulatory pathways — named-patient access to unregistered medicines, in particular — we confirm the regulatory route with the receiving country before committing to a sourcing timeline, rather than promising a delivery date and working backward.',
  },
];

export default function LeadershipPage() {
  return (
    <div className="w-full">
      <section className="page-hero page-hero-banner">
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
        {/* From 1024px the portrait column is only as wide as the portrait, so the biography sits
            right beside it rather than across an empty half-width column. */}
        <div className="wrap grid-2 items-start lg:grid-cols-[minmax(0,420px)_minmax(0,1fr)] lg:gap-12">
          <div className="heading-lg">
            <span className="eyebrow">Founder</span>
            <h2 className="mb-6">Naresh Bishnoi</h2>
            <img
              src={IMG.founder}
              alt="Naresh Bishnoi, Founder and Chairman of the Bishnoi Group"
              // The portrait is a cut-out with a transparent background; the soft fill gives the
              // rounded frame an edge against the white section.
              className="w-full aspect-[3/4] object-cover object-top rounded-2xl bg-paper-2"
              style={{ maxWidth: 420 }}
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
                  <div className="pillar-media">
                    <img src={principle.img} alt={principle.imgAlt} className="pillar-img" loading="lazy" />
                    <Icon className="pillar-media-icon" strokeWidth={1.5} aria-hidden="true" />
                  </div>
                  <h3>{principle.title}</h3>
                  <p>{principle.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="section section-line section-white">
        <div className="wrap">
          {/* Heading runs full width; the image and the paragraph sit side by side beneath it, so
              the text starts level with the top of the image rather than with the heading. */}
          <div className="heading-lg text-center">
            <span className="eyebrow">Group Leadership</span>
            <h2 className="mb-0" style={{ fontSize: 'clamp(32px, 3.6vw, 46px)', fontWeight: 500 }}>
              Bishnoi Group &amp; Social Impact Leadership
            </h2>
          </div>

          <div className="grid-2 items-start mt-10">
            <img
              src={groupImpactImg.src}
              alt="The Bishnoi Group team"
              className="w-full h-auto rounded-2xl"
              loading="lazy"
            />
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
        </div>
      </section>
    </div>
  );
}
