import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, BadgeCheck, Globe2, Handshake, Ship } from 'lucide-react';
import {
  PatternSection,
  SectionHead,
  Prose,
  AboutHero,
  Split,
  DiagramSplit,
  IconCards,
  CtaBand,
} from '@/components/about/Patterns';
import { FadeIn } from '@/components/FadeIn';
import { OrgChart } from '@/components/about/group-structure/OrgChart';
import hospitalsImg from '@/app/assets/hospitals.png';
import suppliesImg from '@/app/assets/supplies.jpg';
import corpImg from '@/app/assets/CORPIMAGE.png';
import llpImg from '@/app/assets/LLPIMAGE.png';

export const metadata: Metadata = {
  title: 'Group Structure | Bishnoi Omniverse',
  description:
    'Who you are dealing with: the Bishnoi Group at a glance, where Bishnoi Omniverse fits, and how its India and Philippine entities divide responsibility.',
};

/* ---------- Entity cards (P1 twin cards) ---------- */

type Entity = {
  name: string;
  href: string;
  image: string;
  imageAlt: string;
  /** The approved sentence, verbatim, with the entity name set in bold. */
  text: React.ReactNode;
};

const ENTITIES: Entity[] = [
  {
    name: 'Bishnoi Omniverse LLP',
    href: '/llp',
    image: llpImg.src,
    imageAlt: 'Glass and brick facade of an office building, representing Bishnoi Omniverse LLP in New Delhi',
    text: (
      <>
        <strong className="text-ink">Bishnoi Omniverse LLP</strong> is registered at Okhla Industrial
        Area, Phase III, New Delhi 110020, India, and is responsible for sourcing, supplier review and
        documentation.
      </>
    ),
  },
  {
    name: 'Bishnoi Omniverse Corp',
    href: '/corp',
    image: corpImg.src,
    imageAlt: 'White office building with balconies, representing Bishnoi Omniverse Corp in Metro Manila',
    text: (
      <>
        <strong className="text-ink">Bishnoi Omniverse Corp</strong> is registered at Unit 301 and 305,
        17 Vatican Building, Vatican City Drive, B.F. Resort Village, Talon II, Las Piñas City, Metro
        Manila, Philippines, and is responsible for operations, logistics and customer service.
      </>
    ),
  },
];

function EntityCard({ entity }: { entity: Entity }) {
  return (
    <Link
      href={entity.href}
      className="group flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-white transition duration-300 hover:-translate-y-0.5 hover:border-accent"
    >
      {/* The source images are title slides with text on the left; zooming in from the top-right
          corner keeps only the building. */}
      <div className="relative overflow-hidden" style={{ aspectRatio: '16 / 10' }}>
        <img
          src={entity.image}
          alt={entity.imageAlt}
          loading="lazy"
          className="absolute inset-0 h-full w-full object-cover"
          style={{ objectPosition: 'right top', transform: 'scale(2)', transformOrigin: 'right top' }}
        />
      </div>
      <div className="flex flex-1 flex-col p-7">
        <h3 className="mb-3 flex items-center justify-between gap-3 text-lg font-semibold text-ink">
          {entity.name}
          <ArrowRight
            className="h-6 w-6 shrink-0 text-accent transition-transform duration-300 group-hover:translate-x-1"
            strokeWidth={1.5}
            aria-hidden="true"
          />
        </h3>
        <p className="m-0 text-[15px] leading-relaxed text-ink-soft">{entity.text}</p>
      </div>
    </Link>
  );
}

/* ---------- Page ---------- */

export default function GroupStructurePage() {
  return (
    <div className="w-full">
      {/* Hero · P5 */}
      <AboutHero
        eyebrow="Group Structure"
        title="The Strength of a Group, Focused on Your Supply"
        lede="Bishnoi Omniverse is the healthcare supply business of the Bishnoi Group. Being part of a wider group gives our customers access to broader experience and relationships, with one clear, accountable business to deal with."
        image={hospitalsImg.src}
        imageAlt="Modern white hospital building with blue glass windows"
        imagePosition="center 35%"
        short
      />

      {/* 1 · The Bishnoi Group · P8 */}
      <PatternSection tone="white">
        <DiagramSplit
          diagram={
            <>
              <OrgChart />
              <p className="mt-5 flex items-center justify-center gap-2 text-sm text-ink-soft">
                <BadgeCheck className="h-6 w-6 shrink-0 text-accent" strokeWidth={1.5} aria-hidden="true" />
                UN Global Compact participant since November 2024
              </p>
            </>
          }
        >
          <SectionHead eyebrow="The Bishnoi Group" title="One Group, Three Areas of Work" />
          <Prose
            paras={[
              'The Bishnoi Group, founded by Naresh Bishnoi, brings together healthcare supply, access to medicines and community work. Bishnoi Omniverse supplies healthcare providers. The Getmeds network supplies medicines across the Philippines, India, the Pacific, Latin America and Southeast Asia. The Naresh Bishnoi Foundation leads the Group’s community work.',
              'The Group has participated in the UN Global Compact since November 2024. Its commercial and philanthropic work is kept clearly separate, so each is accountable in its own right.',
            ]}
          />
        </DiagramSplit>
      </PatternSection>

      {/* 2 · Our Role · P1, photo right */}
      <PatternSection tone="paper">
        <Split
          side="right"
          media={
            <div className="relative">
              <img
                src={suppliesImg.src}
                alt="Sterile drainage bags and tubing laid out on a stainless steel hospital trolley"
                loading="lazy"
                className="ap-split-img"
                style={{ aspectRatio: '4 / 3', objectPosition: 'center 60%' }}
              />
              <div className="absolute bottom-4 left-4 rounded-xl bg-white px-4 py-3 shadow-lg">
                <span className="block font-poppins text-2xl font-semibold leading-none text-accent">300+</span>
                <span className="mt-1 block text-xs text-ink-soft">catalog products</span>
              </div>
            </div>
          }
        >
          <SectionHead eyebrow="Our Role" title="The Group’s Healthcare Supply Specialist" />
          <Prose
            paras={[
              'Within the Group, Bishnoi Omniverse is dedicated to supplying hospitals, clinics and healthcare projects. We cover hospital supplies across more than 300 catalog products, as well as specialty medicines for specific patients (named-patient access).',
              'For healthcare providers in the Philippines, we are the Group’s single point of contact for sourcing, quotations, documentation and supply coordination.',
            ]}
          />
        </Split>
      </PatternSection>

      {/* 3 · Business Relationships · plain two-column text for now.
          PENDING (P8 diagram, on hold until the legal wording is confirmed): Bishnoi Omniverse Corp
          linked by dotted lines to Getmeds Philippines Inc. and 2MG Inc. (Philippine operations);
          Bishnoi Omniverse LLP shown beside Getmeds Healthcare (India). When approved, swap this
          grid for <DiagramSplit> with a RelationshipDiagram in components/about/group-structure/. */}
      <PatternSection tone="dark">
        <div className="grid items-start gap-8 md:grid-cols-2 md:gap-16">
          <SectionHead
            eyebrow="Business Relationships"
            title="Connected Businesses, Clear Responsibilities"
            onDark
          />
          <FadeIn>
            <Prose
              paras={[
                'Our Philippine entity, Bishnoi Omniverse Corp, is connected to Getmeds Philippines Inc. and 2MG Inc. within the Group’s Philippine operations. In India, the Group’s pharmaceutical export work runs through Getmeds Healthcare, while Bishnoi Omniverse LLP supports sourcing for our supply business.',
                'These connections let the Group’s businesses share market knowledge and supplier relationships, while each remains responsible for its own customers and contracts.',
              ]}
            />
          </FadeIn>
        </div>
      </PatternSection>

      {/* 4 · Group Capabilities · P3 */}
      <PatternSection tone="paper">
        <SectionHead eyebrow="Group Capabilities" title="The Strength Behind Your Supply" center />
        <Prose
          className="mx-auto mb-10 max-w-[720px] text-center"
          paras={['Being part of a larger group gives us experience that a small, single supplier may not have.']}
        />
        <IconCards
          variant="white"
          items={[
            { icon: Globe2, text: 'We know how medical supply works in several countries.' },
            { icon: Handshake, text: 'We have supplier relationships in India.' },
            { icon: Ship, text: 'And we have experience with shipping and paperwork across borders.' },
          ]}
        />
        <Prose
          className="mx-auto mt-10 max-w-[720px] text-center"
          paras={[
            'For you, the benefit is practical. Complex requirements involving specialty medicines, several suppliers or more than one market are handled by people who have done this work before.',
          ]}
        />
      </PatternSection>

      {/* 5 · Corporate Structure · P1 twin cards */}
      <PatternSection tone="white">
        <SectionHead eyebrow="Corporate Structure" title="Who Does What" center />
        <div className="mt-10 grid gap-6 md:grid-cols-2">
          {ENTITIES.map((entity, i) => (
            <FadeIn key={entity.href} delay={i * 0.08} className="h-full">
              <EntityCard entity={entity} />
            </FadeIn>
          ))}
        </div>
        <p className="mx-auto mt-8 max-w-[720px] text-center text-ink-soft">
          Company registration details for supplier onboarding are available on request.
        </p>
      </PatternSection>

      {/* Closing · P9 light */}
      <CtaBand
        tone="light"
        eyebrow="Contact Us"
        title="The Right Contact for Every Inquiry"
        text="Our team will direct your inquiry to the right entity and the right person."
        primary={{ label: 'Contact Us', href: '/contact' }}
      />
    </div>
  );
}
