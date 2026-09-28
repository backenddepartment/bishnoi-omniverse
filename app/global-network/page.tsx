import React from 'react';
import type { Metadata } from 'next';
import { ClipboardList, FileText, Handshake, Receipt, Search, Ship, Truck, Users } from 'lucide-react';
import heroImg from '@/app/assets/globalnetworkbg.png';
import mapImg from '@/app/assets/metromanila.png';
import teamImg from '@/app/assets/team.jpg';
import ctaImg from '@/app/assets/ctabannertwo.jpg';
import { FadeIn } from '@/components/FadeIn';
import { FlowDiagram } from '@/components/about/global-network/FlowDiagram';
import {
  AboutHero,
  CtaBand,
  DiagramSplit,
  PatternSection,
  Prose,
  SectionHead,
  Stepper,
  type Step,
} from '@/components/about/Patterns';

export const metadata: Metadata = {
  title: 'Global Network | Bishnoi Omniverse',
  description:
    'How our India and Philippines hubs turn a requirement into a delivery: more choice for Philippine healthcare, with one partner managing the journey.',
};

const STEPS: Step[] = [
  { title: 'Requirement', icon: FileText },
  { title: 'Sourcing', icon: Search },
  { title: 'Supplier Coordination', icon: Users },
  { title: 'Quotation', icon: Receipt },
  { title: 'Order Coordination', icon: ClipboardList },
  { title: 'Shipment', icon: Ship },
  { title: 'Delivery', icon: Truck },
];

export default function GlobalNetworkPage() {
  return (
    <div className="w-full">
      {/* The lighter scrim, so the map keeps its orange rather than going brown under the default. */}
      <AboutHero
        eyebrow="Global Network"
        title="More Choice, With One Partner Managing the Journey"
        lede="A product that is hard to find locally may be easy to find in another country, at the right specification and a fair price. Our network connects your requirement to that supply, and our team manages every step in between."
        image={heroImg.src}
        imageAlt="A world map in glowing yellow on an orange ground, with pins marking locations across every continent"
        overlay="light"
        banner
      />

      {/* 1 · Where We Serve (P8). The map is a tall cut-out with its own glow, so it is shown whole,
          capped in width, with no frame or shadow. Less padding on top, and the copy set from the
          top of the row rather than centred on the map, so the heading sits close under the hero
          whatever the map's height. The copy column is a little wider than the map's, since the
          map is narrow and leaves room to spare. Little padding underneath either: the next
          section follows straight on. */}
      <PatternSection
        tone="white"
        className="!pt-10 !pb-6 [&_.ap-split]:!items-start min-[901px]:[&_.ap-split-copy]:pt-8 min-[901px]:[&_.ap-split]:!grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)]"
      >
        <DiagramSplit
          diagram={
            <img
              src={mapImg.src}
              alt="A map of the Philippines with Metro Manila marked and lines running from it to locations across the islands"
              loading="lazy"
              className="mx-auto block h-auto w-full max-w-[340px]"
            />
          }
        >
          <SectionHead eyebrow="Where We Serve" title="Focused on the Philippines, Connected Beyond" />
          <Prose
            paras={[
              'Our customers are hospitals, clinics and healthcare projects across the Philippines, served by our operations team in Metro Manila. We coordinate delivery to wherever your facility is located.',
              'On the supply side, our reach extends well beyond one market. We source from India and other countries, depending on the product. The Bishnoi Group’s Getmeds network also supplies medicines in the Pacific, Latin America and Southeast Asia.',
            ]}
          />
        </DiagramSplit>
      </PatternSection>

      {/* 2 · Supplier Relationships: the meeting photo as the background of the whole section, edge
          to edge, with the copy on the left in white over the orange sweep, which fades out to
          the right. */}
      <section
        className="section ap-photo-band"
        style={
          {
            '--ap-band-bg': `url(${teamImg.src})`,
            '--ap-band-ratio': teamImg.height / teamImg.width,
          } as React.CSSProperties
        }
      >
        <div className="wrap">
          <div className="ap-photo-band-copy">
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
          </div>
        </div>
      </section>

      {/* 3 · Sourcing Coordination: the orange arrow behind the section, a pin and a label on each
          of its five parts, with the copy set in the clear area the arrow curves around. */}
      <section className="section ap-flow-band">
        <div className="wrap">
          <div className="ap-flow-band-copy">
            <SectionHead eyebrow="Sourcing Coordination" title="One Partner Instead of Many Suppliers" />
            <Prose
              paras={[
                'A single hospital project can involve dozens of products from several suppliers. Managing them one by one takes time most procurement teams do not have, so we do it for you.',
                'We send one clear specification to all suppliers, so their quotes can be compared fairly. Then we collect prices, lead times, packaging details and documents, and follow up on anything missing. You receive one organized quotation instead of many scattered replies.',
              ]}
            />
          </div>
          <FlowDiagram />
        </div>
      </section>

      {/* 4 · How It Works (P4): 7-column row from 1100px, vertical below. The numbered circles are
          filled with the hero headline's orange sweep. It sits close under the arrow: no padding
          on top where the arrow's drawing already ends in a clear strip, a little on narrower
          screens where that strip is only a few pixels deep. */}
      <PatternSection tone="white" className="!pt-0 max-[1100px]:!pt-8">
        <SectionHead eyebrow="How It Works" title="From Requirement to Delivery" center />
        <FadeIn className="mt-12 hidden min-[1100px]:block">
          <Stepper steps={STEPS} className="is-sweep !gap-5 [&_h3]:!text-[15px]" />
        </FadeIn>
        <FadeIn className="mx-auto mt-10 max-w-[560px] min-[1100px]:hidden">
          <Stepper steps={STEPS} vertical className="is-sweep" />
        </FadeIn>
        <FadeIn className="mx-auto mt-12 max-w-[760px] text-center">
          <Prose
            paras={[
              'You send your product list, specifications and quantities. We find suitable products and suppliers, confirm the details and documents, and send you a clear quotation. Once you approve, we place and manage the order, coordinate shipping and paperwork, and arrange delivery to your door. You receive updates at every stage, so you always know where your order stands.',
            ]}
          />
        </FadeIn>
      </PatternSection>

      {/* Closing (P9 over a photo) */}
      <CtaBand
        image={ctaImg.src}
        imageOpacity={0.35}
        eyebrow="Your Requirement"
        title="Options for Your Next Requirement"
        text="Send us your requirement, and we will show you the options our network can offer."
        primary={{ label: 'Send Your Requirement', href: '/contact?type=hospital-supply' }}
        secondary={{ label: 'Request a Quote', href: '/contact?type=quote' }}
      />
    </div>
  );
}
