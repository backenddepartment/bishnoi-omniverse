import React from 'react';
import type { Metadata } from 'next';
import { Globe2, Handshake, Ship } from 'lucide-react';
import {
  PatternSection,
  SectionHead,
  Prose,
  AboutHero,
  Split,
  Stepper,
} from '@/components/about/Patterns';
import { FadeIn } from '@/components/FadeIn';
import { GroupShowcase } from '@/components/about/group-structure/GroupShowcase';
import heroImg from '@/app/assets/groupstructure.png';
import roleImg from '@/app/assets/omniverseabout.png';

export const metadata: Metadata = {
  title: 'Group Structure | Bishnoi Omniverse',
  description:
    'Who you are dealing with: the Bishnoi Group at a glance, where Bishnoi Omniverse fits, and how its India and Philippine entities divide responsibility.',
};

export default function GroupStructurePage() {
  return (
    <div className="w-full">
      {/* Hero · P5, the same band as Vision & Values: the group slide as the background, its left
          half kept clear, so the copy sits there in ink with no scrim. */}
      <AboutHero
        eyebrow="Group Structure"
        title="The Strength of a Group, Focused on Your Supply"
        lede="Bishnoi Omniverse is the healthcare supply business of the Bishnoi Group. Being part of a wider group gives our customers access to broader experience and relationships, with one clear, accountable business to deal with."
        image={heroImg.src}
        imageAlt="A stethoscope and pulse oximeter on a desk, beside photographs of the Bishnoi team gathered outside a venue, at a training session and greeting guests"
        imagePosition="center"
        overlay="none"
        banner
      />

      {/* 1 · The Bishnoi Group: headline and leadership avatars on the left, the three businesses
          as portrait cards on the right. */}
      <GroupShowcase />

      {/* 2 · Our Role · P1, photo left. The image is a collage of photos on its own white ground,
          so it is shown whole and without the usual frame and shadow, which would box it in. */}
      <PatternSection tone="white">
        <Split
          side="left"
          media={
            <img
              src={roleImg.src}
              alt="A collage of the Bishnoi team at work: leading training sessions, helping patients at community health events, and meeting partners at trade exhibitions"
              loading="lazy"
              className="block h-auto w-full"
            />
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
          grid for <DiagramSplit> with a RelationshipDiagram in components/about/group-structure/.
          The ground is the orange sweep of the About page's closing bar, with the copy in white. */}
      <PatternSection tone="dark" className="ap-sweep">
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

      {/* 4 · Group Capabilities, laid out like Quality · Our Approach: heading and intro on the
          left, the benefit on the right, then the three capabilities as plain columns with no
          cards, each an icon over large text in the orange sweep. */}
      <PatternSection tone="white">
        <div className="grid-2 items-start mb-12 max-[900px]:gap-5">
          <div>
            <SectionHead eyebrow="Group Capabilities" title="The Strength Behind Your Supply" />
            <Prose
              paras={['Being part of a larger group gives us experience that a small, single supplier may not have.']}
            />
          </div>
          <Prose
            paras={[
              'For you, the benefit is practical. Complex requirements involving specialty medicines, several suppliers or more than one market are handled by people who have done this work before.',
            ]}
          />
        </div>
        <Stepper
          className="is-plain"
          steps={[
            { icon: Globe2, title: 'We know how medical supply works in several countries.' },
            { icon: Handshake, title: 'We have supplier relationships in India.' },
            { icon: Ship, title: 'And we have experience with shipping and paperwork across borders.' },
          ]}
        />
      </PatternSection>
    </div>
  );
}
