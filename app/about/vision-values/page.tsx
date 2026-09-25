import React from 'react';
import type { Metadata } from 'next';
import { Quote } from 'lucide-react';
import { AboutHero, PatternSection, SectionHead } from '@/components/about/Patterns';
import { ValueStack, type StackValue } from '@/components/about/vision-values/ValueStack';
import { FadeIn } from '@/components/FadeIn';
import heroImg from '@/app/assets/qualityandcompliance.png';
import doctorsImg from '@/app/assets/doctors.jpg';
import suppliesImg from '@/app/assets/supplies.jpg';
import teamImg from '@/app/assets/team.jpg';
import familiesImg from '@/app/assets/families.jpg';

export const metadata: Metadata = {
  title: 'Vision & Values | Bishnoi Omniverse',
  description:
    'Making healthcare supply simpler, clearer and more dependable. Our vision, and the values that show up in how we quote, work with suppliers and handle problems.',
};

// Each value is one stacking row: the giant word, a bold lead-in, the copy and the photo behind it.
const VALUES: StackValue[] = [
  {
    word: 'Customer Focus',
    title: 'Your Requirement Comes First',
    body: [
      'Customer focus starts with listening. Before we contact a single supplier, we make sure we understand your product, specification, quantity, timeline and documentation needs. When something is unclear, we ask rather than guess.',
      'We suggest alternatives only when they genuinely suit your needs, and we respect your budget and procurement rules. When we are not the right partner for a request, we tell you honestly.',
    ],
    img: doctorsImg.src,
    imgAlt: 'A doctor with a stethoscope holding a pen over a clipboard, ready to note down details',
    imgPosition: 'center 35%',
  },
  {
    word: 'Reliability & Transparency',
    title: 'Honest Answers and Clear Documents',
    body: [
      'Reliability means keeping our word. We give realistic timelines based on what suppliers have confirmed, and we follow through on every commitment.',
      'Transparency means you always know where things stand. Our quotations show exactly what is included, and we share the documents for each item. If there is a delay, we tell you early, with the reason and the next step.',
    ],
    img: suppliesImg.src,
    imgAlt: 'Sealed, clearly labelled drainage bags and tubing laid out on a stainless steel hospital trolley',
    imgPosition: 'center 60%',
  },
  {
    word: 'Responsiveness & Collaboration',
    title: 'Quick Answers, Real Teamwork',
    body: [
      'Procurement runs on deadlines, so we treat every inquiry seriously. We keep you updated, even when the only news is that we are still waiting on a supplier. You always deal with people who know your order.',
      'We work with your team, not around it. Our India and Philippine teams operate as one, and we share information openly with suppliers and logistics partners so problems get solved together.',
    ],
    img: teamImg.src,
    imgAlt: 'Colleagues smiling and talking together around a meeting-room table',
    imgPosition: 'center',
  },
  {
    word: 'Long-Term Relationships',
    title: 'Trust Earned One Order at a Time',
    body: [
      'We think beyond the current order. Fair prices, honest advice and consistent service are how long-term relationships are built, and they are what we aim to deliver every time.',
      'We would rather lose a sale than lose a customer’s trust. Every order is a chance to prove we can be relied on for the next one.',
    ],
    img: familiesImg.src,
    imgAlt: 'A grandfather laughing as he lifts his young granddaughter in a sunlit room',
    imgPosition: 'center 45%',
  },
];

export default function VisionValuesPage() {
  return (
    <div className="w-full about-page">
      {/* P5 hero, sized to the About Us slide band. The background is a designed 1920×820 slide
          with its left half kept clear, so the copy sits there in ink with no scrim. */}
      <AboutHero
        eyebrow="Vision & Values"
        title="Simpler, Clearer, More Dependable Healthcare Supply"
        lede="Our values are not slogans. They show up in how we answer your questions, prepare your quotations, work with suppliers and handle problems when they arise."
        image={heroImg.src}
        imageAlt="A stethoscope and pulse oximeter on a desk, beside photographs of the Bishnoi team at work in meetings"
        imagePosition="center"
        overlay="none"
        banner
      />

      {/* Our Vision, P7 large: one centered statement under an orange quote mark, no photo, on white. */}
      <PatternSection tone="white">
        <FadeIn className="mx-auto max-w-[860px] text-center">
          <Quote
            className="mx-auto mb-8 h-16 w-16 text-accent"
            strokeWidth={1.5}
            fill="currentColor"
            aria-hidden="true"
          />
          <SectionHead eyebrow="Our Vision" title="Simpler, Clearer, More Dependable Healthcare Supply" center />
          <p className="mx-auto mt-10 mb-0 text-[22px] md:text-[28px] leading-snug font-medium text-ink">
            We want every hospital and clinic in the Philippines to get the medical products it needs
            quickly and with confidence. Then their teams can spend less time chasing suppliers and more
            time caring for patients.
          </p>
          <p className="mx-auto mt-8 mb-0 max-w-[680px] text-[17px] leading-relaxed text-ink-soft">
            We measure progress simply: do our customers come back for their next requirement, and do our
            suppliers want to keep working with us?
          </p>
        </FadeIn>
      </PatternSection>

      {/* The four values as stacking photo rows: a centred heading on white, then a dark band of
          rows, each sliding over the one before it as the page scrolls. */}
      <PatternSection tone="white" tight>
        <SectionHead eyebrow="Our Values" title="How We Work With You" center className="value-stack-head" />
      </PatternSection>
      <section className="section-dark value-stack-section">
        <ValueStack values={VALUES} />
      </section>

      {/* Work With Us: plain text on white, heading left and copy right, the same treatment as the
          About page's Our Business & Network section. */}
      <section className="section section-white">
        <div className="wrap grid-2 items-start">
          <div className="heading-lg">
            <span className="eyebrow">Work With Us</span>
            <h2 className="work-with-us-title">A Partner That Shares Your Standards</h2>
          </div>
          <div className="text-ink-soft leading-relaxed space-y-5">
            <p className="m-0">
              Reliable healthcare supply starts with the right partner. We work with hospitals, clinics,
              healthcare organizations, procurement teams, and other partners who value clear
              communication, dependable service, and properly documented products.
            </p>
            <p className="m-0">
              From your first inquiry to quotation, sourcing, documentation, and delivery, we focus on
              understanding exactly what you need and keeping you informed at every step. We believe
              good partnerships are built through honest answers, responsive support, and consistent
              service, not just a single successful order.
            </p>
            <p className="m-0">
              If you have a specific product requirement, an upcoming procurement need, or would like to
              explore how we can support your organization, our team is ready to help.
            </p>
            <p className="m-0 font-semibold text-ink">
              Work with us to make healthcare supply simpler, clearer, and more dependable.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
