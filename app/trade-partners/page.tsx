import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { Check, FileCheck, Handshake, MessagesSquare, Route, Upload } from 'lucide-react';
import {
  AboutHero,
  Callout,
  CtaBand,
  DiagramSplit,
  PatternSection,
  Prose,
  SectionHead,
  Split,
} from '@/components/about/Patterns';
import { FadeIn } from '@/components/FadeIn';
import { OrderTermsCard, PartnerHub, RouteMap } from '@/components/about/trade-partners/TradeDiagrams';
import heroImg from '@/app/assets/sourcing.jpg';
import meetingImg from '@/app/assets/companyone.png';
import countriesImg from '@/app/assets/countries.png';

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
      {/* HERO · P5 short. Interim photo until the warehouse/shipping photo is supplied. */}
      <AboutHero
        short
        eyebrow="Trade & Partners"
        title="A Trusted Route Into Philippine Healthcare"
        lede="Healthcare providers in the Philippines need reliable products, and suppliers need a trusted route to reach them. We bring the two together, handling the coordination, documentation and communication that make cross-border healthcare trade work."
        image={heroImg.src}
        imageAlt="Delivery van with its rear doors open, loaded with cardboard shipping boxes"
        imagePosition="center 58%"
      />

      {/* 1 · SUPPLIER RELATIONSHIPS · P1 photo left */}
      <PatternSection tone="white">
        <Split
          image={meetingImg.src}
          imageAlt="Bishnoi Omniverse team in a meeting around a conference table with laptops"
          side="left"
          imagePosition="center"
        >
          <SectionHead eyebrow="Supplier Relationships" title="Partnerships Built on Quality and Openness" icon={Handshake} />
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

      {/* 2 · TRADE COORDINATION · P8 route diagram */}
      <PatternSection tone="paper">
        <DiagramSplit diagram={<RouteMap />}>
          <SectionHead eyebrow="Trade Coordination" title="A Practical Route Into the Philippine Market" icon={Route} />
          <Prose
            paras={[
              'Our India team works directly with manufacturers to review products and gather documents. Our Philippine team connects that supply to hospitals, clinics and healthcare projects that need it.',
              'For our partners, this means access to Philippine healthcare demand without having to manage every buyer relationship alone. Documentation requirements vary by product and transaction, and we work through them with you case by case.',
            ]}
          />
        </DiagramSplit>
      </PatternSection>

      {/* 3 · PARTNER COMMUNICATION · P8 hub and spoke */}
      <PatternSection tone="white">
        <DiagramSplit diagram={<PartnerHub />}>
          <SectionHead eyebrow="Partner Communication" title="One Clear Line of Communication" icon={MessagesSquare} />
          <Prose
            paras={[
              'Supply chains break down when information gets lost between parties. We act as the single point of communication between buyer, supplier and logistics partner, so everyone works from the same information at the same time.',
              'You will always know who to contact on our team. When plans change, such as a new quantity or delivery date, everyone affected hears about it quickly.',
            ]}
          />
        </DiagramSplit>
      </PatternSection>

      {/* 4 · ORDER COORDINATION · P1 with a document card */}
      <PatternSection tone="dark">
        <Split side="right" media={<OrderTermsCard />}>
          <SectionHead eyebrow="Order Coordination" title="Clear Terms, Smooth Orders" icon={FileCheck} onDark />
          <Prose
            paras={[
              'When a buyer approves a quotation, we confirm the order with you in writing, including price, quantity, lead time, packaging and required documents. We then track dispatch, check trade documents before shipment, and coordinate shipping and delivery.',
              'Written terms protect everyone. They reduce disputes, speed up hospital approvals and give suppliers confidence that orders will proceed as agreed.',
            ]}
          />
        </Split>
      </PatternSection>

      {/* 5 · LONG-TERM PARTNERSHIPS · P7 callout + "What to send us" panel */}
      <PatternSection tone="paper">
        <SectionHead eyebrow="Long-Term Partnerships" title="Growing Together, Order After Order" />
        <FadeIn>
          <Callout size="lg">
            <p>
              We are looking for partners, not one-off transactions. Every successful order builds trust and understanding
              on both sides, and makes the next one easier.
            </p>
          </Callout>
        </FadeIn>
        <FadeIn delay={0.1}>
          <div className="mt-10 grid grid-cols-1 items-center gap-8 md:grid-cols-[minmax(0,1fr)_auto]">
            <div className="rounded-2xl border bg-white p-7 sm:p-8" style={{ borderColor: 'var(--line)' }}>
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
            <div>
              <Link href={PARTNER_CTA.href} className="btn btn-primary">
                {PARTNER_CTA.label}
              </Link>
            </div>
          </div>
        </FadeIn>
      </PatternSection>

      {/* CLOSING · P9 dark panel with the countries map faded behind */}
      <CtaBand
        eyebrow="Partner With Us"
        title="Partnership Opportunities"
        text="We value partners who keep their promises, and we work hard to keep ours."
        primary={PARTNER_CTA}
        secondary={{ label: 'Talk to Our Team', href: '/contact' }}
        image={countriesImg.src}
        imageOpacity={0.12}
      />
    </div>
  );
}
