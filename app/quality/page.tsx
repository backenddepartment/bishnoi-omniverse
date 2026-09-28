import React from 'react';
import type { Metadata } from 'next';
import { ClipboardCheck, Search, MessageSquare, FileCheck2 } from 'lucide-react';
import heroImg from '@/app/assets/quality.png';
import lifelineImg from '@/app/assets/lifeline.png';
import ctaBannerImg from '@/app/assets/ctabanner.jpg';
import {
  AboutHero,
  PatternSection,
  SectionHead,
  Prose,
  Stepper,
  CtaBand,
} from '@/components/about/Patterns';

export const metadata: Metadata = {
  title: 'Quality & Compliance | Bishnoi Omniverse',
  description:
    'How Bishnoi Omniverse checks products, suppliers and documents before you commit — CE marking and CMDR registration for devices, WHO-GMP and Certificates of Analysis for medicines, ISO 9809-1 and DOT/TPED for gas cylinders.',
};

export default function QualityCompliancePage() {
  return (
    <div className="w-full">
      {/* Hero, the same band as Vision & Values: the quality slide as the background, its left half
          kept clear, with the copy set there as real text and a gradient headline. */}
      <AboutHero
        eyebrow="Quality & Compliance"
        title="Documented at the product level"
        lede="Certification and regulatory documentation vary by product category and destination market. Rather than one blanket claim, we document quality where it can be checked."
        image={heroImg.src}
        imageAlt="A stethoscope and pulse oximeter on a desk, beside photographs of a pharmacist reviewing a product specification and medicine packs with their certificate"
        imagePosition="center 60%"
        overlay="none"
        banner
      />

      {/* 1 · Our Approach (P4): the three steps as plain columns, no numbers or connecting line. */}
      <PatternSection tone="white">
        {/* Heading on the left, the intro and the lead-in to the steps on the right. */}
        <div className="grid-2 items-start mb-12">
          <SectionHead eyebrow="Our Approach" title="Quality You Can Check, Line by Line" />
          <div>
            <Prose
              paras={[
                'Product quality begins with the manufacturer. Our role is to check what we can before you commit, share everything we find, and raise concerns early rather than after delivery.',
              ]}
            />
            <p className="mb-0 mt-5 font-semibold" style={{ color: 'var(--ink)' }}>
              We do this in three steps.
            </p>
          </div>
        </div>
        <Stepper
          className="is-plain"
          steps={[
            {
              title: 'Confirm',
              icon: ClipboardCheck,
              text: 'First, we confirm the offered product matches your specification.',
            },
            {
              title: 'Review',
              icon: Search,
              text: 'Next, we review the product and supplier information available.',
            },
            {
              title: 'Tell you plainly',
              icon: MessageSquare,
              text: 'Finally, we tell you plainly what we found, including any gaps, so you decide with the full picture.',
            },
          ]}
        />
      </PatternSection>

      {/* 2 · Regulatory Support and Communication & Traceability: a short landscape photo running
          edge to edge (so it sits outside the section's wrap), then the two columns of copy. The
          4:1 crop is the shortest that still holds the whole heartbeat line. */}
      <img
        src={lifelineImg.src}
        alt="A clinician in a white coat writing on a clipboard at a desk, with a stethoscope and glasses beside it and a heartbeat line across the photo"
        loading="lazy"
        className="block w-full aspect-[5/2] md:aspect-[4/1] object-cover"
      />
      <PatternSection tone="white">
        <div className="grid-2 items-start">
          <div>
            <SectionHead eyebrow="Regulatory Support" title="Support for Your Compliance Review" />
            <Prose
              paras={[
                'Some medical products in the Philippines need regulatory review, depending on what they are and how they will be used. Where a requirement applies, we request the relevant documents from the supplier, share what is available, and flag any product that may need further review.',
                'For specialty medicines requested for a specific patient, we confirm the regulatory route before committing to a timeline. Our role is to support your compliance team with organized, accurate information, not to replace its judgement.',
              ]}
            />
          </div>
          <div>
            <SectionHead eyebrow="Communication & Traceability" title="Clear Updates Before and After Delivery" />
            <Prose
              paras={[
                'If a product cannot be sourced to your specification, we will tell you. If we propose an alternative, we explain the difference clearly, and we never substitute a product without your approval.',
                'Each order is linked to its supplier, product details and documents, including batch or lot information where available. If a question arises after delivery, we can answer it quickly and accurately.',
              ]}
            />
          </div>
        </div>
      </PatternSection>

      {/* Closing · Documents First (P9 over a photo). */}
      <CtaBand
        image={ctaBannerImg.src}
        imageOpacity={0.35}
        icon={FileCheck2}
        eyebrow="Documents First"
        title="Product Documents Before You Buy"
        text="Tell us what you need, and we will show you what is available for each item before you commit."
        primary={{ label: 'Discuss Your Requirement', href: '/contact?type=quote' }}
        secondary={{ label: 'Request a Quote', href: '/contact?type=quote' }}
      />
    </div>
  );
}
