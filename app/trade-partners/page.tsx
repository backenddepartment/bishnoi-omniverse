import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { Check, Upload } from 'lucide-react';
import {
  AboutHero,
  Callout,
  DiagramSplit,
  PatternSection,
  Prose,
  SectionHead,
  Split,
} from '@/components/about/Patterns';
import { FadeIn } from '@/components/FadeIn';
import { PartnerChain } from '@/components/about/trade-partners/PartnerChain';
import heroImg from '@/app/assets/tradeandpartners.png';
import relationshipImg from '@/app/assets/omniverserelationship-cutout.webp';
import routeMapImg from '@/app/assets/mapconnection.png';

export const metadata: Metadata = {
  title: 'Trade & Partners | Bishnoi Omniverse',
  description:
    'For manufacturers, suppliers, distributors and logistics providers: reach Philippine healthcare with a partner that handles the coordination, documentation and communication of cross-border healthcare trade.',
};

const PARTNER_CTA = { label: 'Become a Partner', href: '/contact?type=partner' };

// "Once we work together, you can expect ..." split into its three promises, words unchanged.
const PROMISES = [
  'clear and complete requirements,',
  'documents requested upfront,',
  'and honest feedback on quotations and performance.',
];

export default function TradePartnersPage() {
  return (
    <div className="w-full">
      {/* HERO · P5, the same band as Vision & Values: a designed 1920×820 slide with its left half
          kept clear, so the copy sits there in ink with no scrim and the headline in the orange
          sweep. */}
      <AboutHero
        banner
        eyebrow="Trade & Partners"
        title="A Trusted Route Into Philippine Healthcare"
        lede="Healthcare providers in the Philippines need reliable products, and suppliers need a trusted route to reach them. We bring the two together, handling the coordination, documentation and communication that make cross-border healthcare trade work."
        image={heroImg.src}
        imageAlt="A stethoscope and pulse oximeter on a desk, beside photographs of the Bishnoi team with partners at trade exhibitions and the founder at a UN Global Compact event"
        imagePosition="center"
        overlay="none"
      />

      {/* 1 · PARTNER COMMUNICATION: heading on the left, copy on the right, and the chain of arrows
          across the full width beneath them. */}
      <PatternSection tone="white">
        <div className="grid-2 items-start max-[900px]:gap-5">
          <SectionHead eyebrow="Partner Communication" title="One Clear Line of Communication" />
          <Prose
            paras={[
              'Supply chains break down when information gets lost between parties. We act as the single point of communication between buyer, supplier and logistics partner, so everyone works from the same information at the same time.',
              'You will always know who to contact on our team. When plans change, such as a new quantity or delivery date, everyone affected hears about it quickly.',
            ]}
          />
        </div>
        <PartnerChain />
      </PatternSection>

      {/* 2 · SUPPLIER RELATIONSHIPS · P1, photo left. The image is itself a collage, cut out from
          its backdrop so the photos sit straight on the section: shown whole, with no frame or
          shadow, and given the wider of the two columns. No padding on top: it follows on from
          Partner Communication, white as well, with that section's own padding as the space
          between them. */}
      <PatternSection
        tone="white"
        className="!pt-0 min-[901px]:[&_.ap-split]:!grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)] min-[901px]:[&_.ap-split]:!gap-12"
      >
        <Split
          side="left"
          media={
            <img
              src={relationshipImg.src}
              alt="A collage of the Bishnoi team at trade exhibitions in Japan: meeting suppliers at their stands, looking over products, and gathered outside the CPHI and Medtec venue"
              loading="lazy"
              className="block h-auto w-full"
            />
          }
        >
          <SectionHead eyebrow="Supplier Relationships" title="Partnerships Built on Quality and Openness" />
          <Prose
            paras={[
              'We work with manufacturers, suppliers and distributors who meet healthcare requirements and share their information openly. Before discussing commercial terms, we review product documents, certifications where applicable, and registration status for the markets involved.',
            ]}
          />
          <div className="ap-prose mt-4">
            <p className="!mb-3">Once we work together, you can expect</p>
            <ul className="m-0 mb-4 list-none space-y-2 p-0">
              {PROMISES.map((item) => (
                <li key={item} className="flex items-start gap-3" style={{ color: 'var(--ink-soft)' }}>
                  <Check
                    className="mt-[3px] h-5 w-5 flex-none"
                    color="var(--accent)"
                    strokeWidth={1.5}
                    aria-hidden="true"
                  />
                  <span className="leading-[1.6]">{item}</span>
                </li>
              ))}
            </ul>
            <p>Partners who deliver consistently become part of our regular sourcing network.</p>
          </div>
        </Split>
      </PatternSection>

      {/* 3 · ORDER COORDINATION: the same band as Group Structure's Business Relationships — the
          orange sweep as the ground, heading on the left and copy on the right, all in white. */}
      <PatternSection tone="dark" className="ap-sweep">
        <div className="grid items-start gap-8 md:grid-cols-2 md:gap-16">
          <SectionHead eyebrow="Order Coordination" title="Clear Terms, Smooth Orders" onDark />
          <FadeIn>
            <Prose
              paras={[
                'When a buyer approves a quotation, we confirm the order with you in writing, including price, quantity, lead time, packaging and required documents. We then track dispatch, check trade documents before shipment, and coordinate shipping and delivery.',
                'Written terms protect everyone. They reduce disputes, speed up hospital approvals and give suppliers confidence that orders will proceed as agreed.',
              ]}
            />
          </FadeIn>
        </div>
      </PatternSection>

      {/* 4 · TRADE COORDINATION · P8. The map is a cut-out with its own glow — India and the
          Philippines, joined from New Delhi to Metro Manila — so it is shown whole, with no frame
          or shadow. */}
      <PatternSection tone="white">
        <DiagramSplit
          diagram={
            <img
              src={routeMapImg.src}
              alt="Maps of India and the Philippines, with New Delhi and Metro Manila marked and joined by a dotted line, and lines running from each to locations across its country"
              loading="lazy"
              className="block h-auto w-full"
            />
          }
        >
          <SectionHead eyebrow="Trade Coordination" title="A Practical Route Into the Philippine Market" />
          <Prose
            paras={[
              'Our India team works directly with manufacturers to review products and gather documents. Our Philippine team connects that supply to hospitals, clinics and healthcare projects that need it.',
              'For our partners, this means access to Philippine healthcare demand without having to manage every buyer relationship alone. Documentation requirements vary by product and transaction, and we work through them with you case by case.',
            ]}
          />
        </DiagramSplit>
      </PatternSection>

      {/* 5 · LONG-TERM PARTNERSHIPS · P7 callout, with the button inside it under the words, and
          the "What to send us" panel. No padding on top: it follows on from Trade Coordination,
          white as well, with that section's own padding as the space between them. */}
      <PatternSection tone="white" className="!pt-0">
        <SectionHead eyebrow="Long-Term Partnerships" title="Growing Together, Order After Order" />
        <FadeIn>
          <Callout size="lg" className="is-sweep has-action">
            <p>
              We are looking for partners, not one-off transactions. Every successful order builds trust and understanding
              on both sides, and makes the next one easier.
            </p>
            <Link href={PARTNER_CTA.href} className="btn ap-callout-btn">
              <span>{PARTNER_CTA.label}</span>
            </Link>
          </Callout>
        </FadeIn>
        <FadeIn delay={0.1}>
          <div className="mt-10 rounded-2xl border bg-white p-7 sm:p-8" style={{ borderColor: 'var(--line)' }}>
            <div className="mb-4 flex items-center gap-3">
              <Upload className="h-6 w-6 flex-none" color="var(--accent)" strokeWidth={1.5} aria-hidden="true" />
              <h3 className="m-0 text-[18px] font-semibold" style={{ color: 'var(--ink)' }}>
                What to send us
              </h3>
            </div>
            <Prose
              paras={[
                'If you manufacture, supply, distribute or move healthcare products and want to reach the Philippine market, we would like to hear from you. Share your company profile, products or services, available documents and the markets you serve, and we will be in touch when there is a fit.',
              ]}
            />
          </div>
        </FadeIn>
      </PatternSection>
    </div>
  );
}
