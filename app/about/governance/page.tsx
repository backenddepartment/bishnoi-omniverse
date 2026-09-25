import React from 'react';
import type { Metadata } from 'next';
import {
  Users,
  HardHat,
  Leaf,
  Scale,
  MapPin,
  UserCheck,
  Receipt,
  Lock,
  ShieldCheck,
  type LucideIcon,
} from 'lucide-react';
import {
  PatternSection,
  SectionHead,
  Prose,
  AboutHero,
  IconCards,
  Stepper,
  Callout,
  DiagramSplit,
  CtaBand,
  type Stat,
} from '@/components/about/Patterns';
import { FadeIn } from '@/components/FadeIn';
import { ImprovementLoop } from '@/components/about/governance/ImprovementLoop';
import hospitals from '@/app/assets/hospitals.png';

export const metadata: Metadata = {
  title: 'Governance & Standards | Bishnoi Omniverse',
  description:
    'Responsible standards that make supply predictable: UN Global Compact participation since November 2024, clear accountability, and the same proven process for every order.',
};

/**
 * The written code of conduct does not exist yet. When the file is published, set this to its URL
 * and a "Download" button appears under the Responsible Business tiles.
 */
const CODE_OF_CONDUCT_URL: string | null = null;

/*
 * Rendered statically rather than through <CountUp>: "2025, 2026" would count to 2025 and then
 * append ", 2026", and counting up a year reads oddly anyway.
 */
const PROOF_POINTS: Stat[] = [
  { value: 'Nov 2024', label: 'UN Global Compact participant' },
  { value: '2025, 2026', label: 'yearly UN progress reports filed' },
];

const UNGC_AREAS: { icon: LucideIcon; label: string }[] = [
  { icon: Users, label: 'Human rights' },
  { icon: HardHat, label: 'Labour' },
  { icon: Leaf, label: 'The environment' },
  { icon: Scale, label: 'Anti-corruption' },
];

const PROCESS_STEPS = [
  { title: 'Confirm' },
  { title: 'Source and review' },
  { title: 'Quote' },
  { title: 'Written approval' },
  { title: 'Place and track' },
  { title: 'Ship and deliver' },
];

export default function GovernancePage() {
  return (
    <div className="w-full">
      <AboutHero
        eyebrow="Governance & Standards"
        title="Responsible Standards That Make Supply Predictable"
        lede="Customers trust suppliers who behave the same way every time. Our standards make sure every order is handled with the same care, and every decision can be traced to a responsible person."
        image={hospitals.src}
        imageAlt="Modern white hospital building with tall blue glass windows"
        imagePosition="center 35%"
        overlay="dark"
        actions={
          <div className="ap-hero-stats" style={{ marginTop: 8 }}>
            {PROOF_POINTS.map((s) => (
              <div key={s.label}>
                <span className="ap-hero-stat-num">{s.value}</span>
                <div className="ap-hero-stat-label">{s.label}</div>
              </div>
            ))}
          </div>
        }
      />

      {/* 1 · Business Governance (P3: four area tiles) */}
      <PatternSection tone="white">
        <div className="max-w-3xl">
          <SectionHead eyebrow="Business Governance" title="Commitments Beyond a Single Business" />
          <Prose
            paras={[
              'Bishnoi Omniverse follows the standards set by the Bishnoi Group. The Group has taken part in the United Nations Global Compact since November 2024. It filed its yearly public progress reports for 2025 and 2026. This commits the Group to fair practice on human rights, labour, the environment and anti-corruption.',
            ]}
          />
        </div>
        <ul className="my-10 grid list-none grid-cols-1 gap-4 p-0 sm:grid-cols-2 lg:grid-cols-4">
          {UNGC_AREAS.map(({ icon: Icon, label }, i) => (
            <li key={label}>
              <FadeIn delay={i * 0.08} className="h-full">
                <div className="flex h-full flex-col items-start gap-4 rounded-2xl bg-[var(--paper)] px-6 py-7">
                  <Icon className="h-10 w-10 text-[var(--accent)]" strokeWidth={1.5} aria-hidden="true" />
                  <span className="text-[17px] font-semibold text-[var(--ink)]">{label}</span>
                </div>
              </FadeIn>
            </li>
          ))}
        </ul>
        <div className="max-w-3xl">
          <Prose
            paras={[
              'For our customers, governance means something practical: clear decision-making, written records, and the same process for every order, large or small.',
            ]}
          />
        </div>
      </PatternSection>

      {/* 2 · Accountability (P3: two hub cards) */}
      <PatternSection tone="paper">
        <div className="max-w-3xl">
          <SectionHead eyebrow="Accountability" title="Clear Responsibility at Every Stage" />
          <Prose
            paras={[
              'Customers and suppliers always know which of our entities they are dealing with and what each one handles.',
            ]}
          />
        </div>
        <IconCards
          className="my-10"
          variant="border"
          items={[
            {
              icon: MapPin,
              eyebrow: 'New Delhi',
              text: 'Sourcing and supplier documentation sit with our India hub.',
            },
            {
              icon: MapPin,
              eyebrow: 'Metro Manila',
              text: 'Customer relationships, logistics and delivery sit with our Philippine hub.',
            },
          ]}
        />
        <div className="flex max-w-3xl items-start gap-4">
          <UserCheck
            className="mt-0.5 h-6 w-6 shrink-0 text-[var(--accent)]"
            strokeWidth={1.5}
            aria-hidden="true"
          />
          <Prose
            paras={[
              'Within our team, every request has a named owner who follows it through to completion. When something needs fixing, there is never any doubt about who will fix it.',
            ]}
          />
        </div>
      </PatternSection>

      {/* 3 · Process Discipline (P4 stepper + P7 callout) */}
      <PatternSection tone="white">
        <div className="max-w-3xl">
          <SectionHead eyebrow="Process Discipline" title="The Same Proven Steps, Every Time" />
          <Prose
            paras={[
              'Most supply problems start when steps are skipped. Our process is simple. We confirm the requirement, source and review, and send a quote. After your written approval, we place and track the order, then arrange shipment and delivery.',
            ]}
          />
        </div>
        <FadeIn className="my-12">
          <Stepper steps={PROCESS_STEPS} />
        </FadeIn>
        <Callout className="max-w-4xl">
          <p>
            Every order is recorded, from the agreed requirement to approvals and supplier
            communication. If a question comes up months later, we can show exactly what was agreed.
          </p>
        </Callout>
      </PatternSection>

      {/* 4 · Responsible Business (P3: four practice tiles) */}
      <PatternSection tone="dark">
        <div className="max-w-3xl">
          <SectionHead
            eyebrow="Responsible Business"
            title="Honest and Fair Business Practices"
            onDark
          />
        </div>
        <IconCards
          className="mt-10 [&_h3]:text-[color:var(--ink)]"
          variant="white"
          cols={4}
          items={[
            {
              icon: Receipt,
              title: 'Honest pricing',
              text: 'Our quotations show what you will pay, with no hidden charges added later.',
            },
            {
              icon: Scale,
              title: 'Fair dealing',
              text: 'We treat customers and suppliers fairly, and we do not offer or accept improper payments or favours to win business.',
            },
            {
              icon: Lock,
              title: 'Confidentiality',
              text: 'We protect the pricing, requirements and business information you share with us.',
            },
            {
              icon: ShieldCheck,
              title: 'Genuine products',
              text: 'And by sourcing from manufacturers and established suppliers, we work to keep unofficial or unsafe products out of your supply chain.',
            },
          ]}
        />
        {CODE_OF_CONDUCT_URL && (
          <div className="mt-10">
            <a href={CODE_OF_CONDUCT_URL} className="btn btn-primary" download>
              Download Code of Conduct
            </a>
          </div>
        )}
      </PatternSection>

      {/* 5 · Continuous Improvement (P8: loop diagram) */}
      <PatternSection tone="paper">
        <DiagramSplit diagram={<ImprovementLoop />}>
          <SectionHead eyebrow="Continuous Improvement" title="Better With Every Order" />
          <Prose
            paras={[
              'We review completed orders to learn what worked and what did not. When a delay or error happens, we find the cause and adjust our process so it is less likely to happen again.',
              'Customer and supplier feedback is a core part of that review, and our standards will keep evolving as we grow.',
            ]}
          />
        </DiagramSplit>
      </PatternSection>

      {/* Closing (P9 dark panel) */}
      <CtaBand
        eyebrow="Our Standards"
        title="A Supply Partner You Can Count On"
        text="Strong standards are not paperwork for its own sake. They are how we make sure your order gets the same care every time."
        primary={{ label: 'Learn More About Our Approach', href: '/quality' }}
        secondary={{ label: 'Talk to Our Team', href: '/contact' }}
      />
    </div>
  );
}
