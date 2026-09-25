import React from 'react';
import type { Metadata } from 'next';
import { ClipboardList, FileText, Handshake, Receipt, Search, Ship, Truck, Users } from 'lucide-react';
import heroImg from '@/app/assets/countries.png';
import manilaImg from '@/app/assets/CORPIMAGE.png';
import delhiImg from '@/app/assets/LLPIMAGE.png';
import teamImg from '@/app/assets/team.jpg';
import deliveryImg from '@/app/assets/sourcing.jpg';
import { FadeIn } from '@/components/FadeIn';
import {
  AboutHero,
  CtaBand,
  DiagramSplit,
  PatternSection,
  Prose,
  SectionHead,
  Split,
  Stepper,
  type Stat,
  type Step,
} from '@/components/about/Patterns';
import { HubPair, ManyToOne, PhilippinesMap, type Hub } from '@/components/about/global-network/Diagrams';

export const metadata: Metadata = {
  title: 'Global Network | Bishnoi Omniverse',
  description:
    'How our India and Philippines hubs turn a requirement into a delivery: more choice for Philippine healthcare, with one partner managing the journey.',
};

const PROOF_POINTS: Stat[] = [
  { value: '2', label: 'operating hubs' },
  // PENDING CONFIRMATION: the design guide says "50+ countries served" must not go live until the
  // figure is confirmed. Uncomment once confirmed.
  // { value: '50+', label: 'countries served' },
  { value: '300+', label: 'catalog products' },
  { value: '1', label: 'point of contact per order' },
];

const HUBS: [Hub, Hub] = [
  {
    city: 'New Delhi',
    text: 'Our New Delhi hub works directly with manufacturers and suppliers to review products, gather documents and manage export steps.',
    href: '/llp',
    image: delhiImg.src,
    imageAlt: 'The Bishnoi Omniverse LLP office building in New Delhi, India',
  },
  {
    city: 'Metro Manila',
    text: 'Our Metro Manila hub turns that information into quotations, updates and deliveries that fit the way Philippine hospitals buy.',
    href: '/corp',
    image: manilaImg.src,
    imageAlt: 'The Bishnoi Omniverse Corp office building in Metro Manila, Philippines',
  },
];

function DeliveryPhoto({ className = '' }: { className?: string }) {
  return (
    <img
      src={deliveryImg.src}
      alt="A delivery van with its rear door open, loaded with boxed supplies"
      loading="lazy"
      className={`mt-3 block w-full rounded-xl object-cover ${className}`}
      style={{ objectPosition: '30% 60%' }}
    />
  );
}

const STEP_BASE: Step[] = [
  { title: 'Requirement', icon: FileText },
  { title: 'Sourcing', icon: Search },
  { title: 'Supplier Coordination', icon: Users },
  { title: 'Quotation', icon: Receipt },
  { title: 'Order Coordination', icon: ClipboardList },
  { title: 'Shipment', icon: Ship },
];

// The delivery photo sits with the last step: square in the 7-column row, wider when stacked.
const STEPS_ROW: Step[] = [
  ...STEP_BASE,
  { title: 'Delivery', icon: Truck, text: <DeliveryPhoto className="aspect-square" /> },
];
const STEPS_STACKED: Step[] = [
  ...STEP_BASE,
  { title: 'Delivery', icon: Truck, text: <DeliveryPhoto className="aspect-[16/10] max-w-[260px]" /> },
];

export default function GlobalNetworkPage() {
  return (
    <div className="w-full">
      <AboutHero
        eyebrow="Global Network"
        title="More Choice, With One Partner Managing the Journey"
        lede="A product that is hard to find locally may be easy to find in another country, at the right specification and a fair price. Our network connects your requirement to that supply, and our team manages every step in between."
        image={heroImg.src}
        imageAlt="A world map in orange on black, marking the regions our network reaches"
        stats={PROOF_POINTS}
      />

      {/* 1 · Where We Serve (P8) */}
      <PatternSection tone="white">
        <DiagramSplit diagram={<PhilippinesMap />}>
          <SectionHead eyebrow="Where We Serve" title="Focused on the Philippines, Connected Beyond" />
          <Prose
            paras={[
              'Our customers are hospitals, clinics and healthcare projects across the Philippines, served by our operations team in Metro Manila. We coordinate delivery to wherever your facility is located.',
              'On the supply side, our reach extends well beyond one market. We source from India and other countries, depending on the product. The Bishnoi Group’s Getmeds network also supplies medicines in the Pacific, Latin America and Southeast Asia.',
            ]}
          />
        </DiagramSplit>
      </PatternSection>

      {/* 2 · India–Philippines Connection (P1 twin cards) */}
      <PatternSection tone="paper">
        <SectionHead eyebrow="India–Philippines Connection" title="Two Hubs, One Team" center />
        <div className="mt-10">
          <HubPair hubs={HUBS} connectorLabel="Two hubs, one team" />
        </div>
        <FadeIn className="mx-auto mt-10 max-w-[720px] text-center">
          <Prose
            paras={[
              'For you, this means more products to choose from, while you still deal with one local team. That team handles the communication, coordination and delivery.',
            ]}
          />
        </FadeIn>
      </PatternSection>

      {/* 3 · Supplier Relationships (P1) */}
      <PatternSection tone="white">
        <Split
          image={teamImg.src}
          imageAlt="A Bishnoi Omniverse team member smiling during a meeting at a conference table"
          side="right"
          imagePosition="60% center"
        >
          <SectionHead
            eyebrow="Supplier Relationships"
            title="Relationships That Improve With Every Order"
            icon={Handshake}
          />
          <Prose
            paras={[
              'We work with suppliers who meet healthcare requirements consistently. Each completed order teaches us more about a supplier’s quality, reliability and responsiveness, and that experience guides where we source next.',
              'We invest just as much in understanding our customers. Knowing both sides well lets us match your requirement to the right supplier faster, and with fewer surprises.',
            ]}
          />
        </Split>
      </PatternSection>

      {/* 4 · Sourcing Coordination (P8) */}
      <PatternSection tone="paper">
        <DiagramSplit diagram={<ManyToOne />}>
          <SectionHead eyebrow="Sourcing Coordination" title="One Partner Instead of Many Suppliers" />
          <Prose
            paras={[
              'A single hospital project can involve dozens of products from several suppliers. Managing them one by one takes time most procurement teams do not have, so we do it for you.',
              'We send one clear specification to all suppliers, so their quotes can be compared fairly. Then we collect prices, lead times, packaging details and documents, and follow up on anything missing. You receive one organized quotation instead of many scattered replies.',
            ]}
          />
        </DiagramSplit>
      </PatternSection>

      {/* 5 · How It Works (P4): 7-column row from 1100px, vertical below. */}
      <PatternSection tone="white">
        <SectionHead eyebrow="How It Works" title="From Requirement to Delivery" center />
        <FadeIn className="mt-12 hidden min-[1100px]:block">
          <Stepper steps={STEPS_ROW} className="!gap-5 [&_h3]:!text-[15px]" />
        </FadeIn>
        <FadeIn className="mx-auto mt-10 max-w-[560px] min-[1100px]:hidden">
          <Stepper steps={STEPS_STACKED} vertical />
        </FadeIn>
        <FadeIn className="mx-auto mt-12 max-w-[760px] text-center">
          <Prose
            paras={[
              'You send your product list, specifications and quantities. We find suitable products and suppliers, confirm the details and documents, and send you a clear quotation. Once you approve, we place and manage the order, coordinate shipping and paperwork, and arrange delivery to your door. You receive updates at every stage, so you always know where your order stands.',
            ]}
          />
        </FadeIn>
      </PatternSection>

      {/* Closing (P9) */}
      <CtaBand
        eyebrow="Your Requirement"
        title="Options for Your Next Requirement"
        text="Send us your requirement, and we will show you the options our network can offer."
        primary={{ label: 'Send Your Requirement', href: '/contact?type=hospital-supply' }}
        secondary={{ label: 'Request a Quote', href: '/contact?type=quote' }}
      />
    </div>
  );
}
