import React from 'react';
import type { Metadata } from 'next';
import { ClipboardCheck, Search, MessageSquare, FileSearch, FileCheck2 } from 'lucide-react';
import heroImg from '@/app/assets/quality.png';
import suppliesImg from '@/app/assets/supplies.jpg';
import medicinesImg from '@/app/assets/medicines.jpg';
import cylindersImg from '@/app/assets/respiratorycare.png';
import doctorsImg from '@/app/assets/doctors.jpg';
import { FadeIn } from '@/components/FadeIn';
import {
  AboutHero,
  PatternSection,
  SectionHead,
  Prose,
  Split,
  DiagramSplit,
  Stepper,
  CtaBand,
} from '@/components/about/Patterns';
import { DocCards } from '@/components/about/quality/DocCards';
import { TraceChain } from '@/components/about/quality/TraceChain';

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

      {/* 1 · Our Approach (P4): three-step mini stepper. */}
      <PatternSection tone="white">
        <SectionHead eyebrow="Our Approach" title="Quality You Can Check, Line by Line" />
        <Prose
          className="max-w-[760px]"
          paras={[
            'Product quality begins with the manufacturer. Our role is to check what we can before you commit, share everything we find, and raise concerns early rather than after delivery.',
          ]}
        />
        <p className="mb-8 mt-10 font-semibold" style={{ color: 'var(--ink)' }}>
          We do this in three steps.
        </p>
        <FadeIn>
          <Stepper
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
        </FadeIn>
      </PatternSection>

      {/* 2 · Product Documentation (P8): certificate-style document cards. */}
      <PatternSection tone="paper">
        <SectionHead eyebrow="Product Documentation" title="Real Documents for Real Products" />
        <Prose
          className="max-w-[760px]"
          paras={[
            'Before you get a quotation, we ask suppliers for what your team needs to judge the product. This can include specification sheets, manufacturer details, country of origin, labeling, shelf life, and any certificates or registrations.',
          ]}
        />
        <p className="mb-8 mt-10 font-semibold" style={{ color: 'var(--ink)' }}>
          Here is what that looks like in practice.
        </p>
        <DocCards
          items={[
            {
              label: 'Devices',
              image: suppliesImg.src,
              imageAlt: 'Sterile single-use tubing sets in sealed, labeled packs',
              imagePosition: 'center 55%',
              text: (
                <>
                  Our sterile blood transfusion set carries <strong>CE marking</strong> and{' '}
                  <strong>CMDR registration (CMDR-2023-01556)</strong>.
                </>
              ),
            },
            {
              label: 'Specialty medicines',
              image: medicinesImg.src,
              imageAlt: 'Blister packs and medicine bottles being sorted into a storage box',
              imagePosition: 'center 40%',
              text: (
                <>
                  Our specialty medicines are sourced from <strong>WHO-GMP</strong> manufacturing, with a{' '}
                  <strong>Certificate of Analysis</strong> for each supplied batch.
                </>
              ),
            },
            {
              label: 'Gas cylinders',
              image: cylindersImg.src,
              imageAlt: 'Green medical oxygen cylinders with regulators beside a hospital bed',
              imagePosition: '65% center',
              text: (
                <>
                  Our medical gas cylinders are manufactured to <strong>ISO 9809-1</strong> and certified to{' '}
                  <strong>DOT/TPED</strong>.
                </>
              ),
            },
          ]}
        />
        <p className="mb-0 mt-8 max-w-[760px] leading-[1.7]" style={{ color: 'var(--ink-soft)' }}>
          Documents differ by product, so we share exactly what applies to each item you order.
        </p>
      </PatternSection>

      {/* 3 · Order Controls (P4): green checklist line. */}
      <PatternSection tone="white">
        <SectionHead eyebrow="Order Controls" title="Fewer Delays, Cleaner Approvals" />
        <Prose
          className="max-w-[760px]"
          paras={[
            'Every order follows the same controlled steps. We confirm your requirement in writing before sourcing, quote with clear product details, prices and terms, and place an order only after your written approval.',
            'Before shipment, we check that product names, models and quantities match across your quotation, invoice and packing documents. Catching small mismatches early is what keeps approvals moving and customs clearance smooth.',
          ]}
        />
        <FadeIn className="mt-12">
          <Stepper
            check
            steps={[
              { title: 'Requirement confirmed' },
              { title: 'Quote' },
              { title: 'Written approval' },
              { title: 'Document match check before shipment' },
            ]}
          />
        </FadeIn>
      </PatternSection>

      {/* 4 · Regulatory Support (P1): photo left, text right. */}
      <PatternSection tone="paper">
        <Split
          image={doctorsImg.src}
          imageAlt="Clinician in a white coat with a stethoscope reviewing notes on a clipboard"
          side="left"
          ratio="4 / 5"
          imagePosition="center 30%"
        >
          <SectionHead eyebrow="Regulatory Support" title="Support for Your Compliance Review" icon={FileSearch} />
          <Prose
            paras={[
              'Some medical products in the Philippines need regulatory review, depending on what they are and how they will be used. Where a requirement applies, we request the relevant documents from the supplier, share what is available, and flag any product that may need further review.',
              'For specialty medicines requested for a specific patient, we confirm the regulatory route before committing to a timeline. Our role is to support your compliance team with organized, accurate information, not to replace its judgement.',
            ]}
          />
        </Split>
      </PatternSection>

      {/* 5 · Communication & Traceability (P8): text left, traceability chain right. */}
      <PatternSection tone="white">
        <DiagramSplit diagram={<TraceChain />}>
          <SectionHead eyebrow="Communication & Traceability" title="Clear Updates Before and After Delivery" />
          <Prose
            paras={[
              'If a product cannot be sourced to your specification, we will tell you. If we propose an alternative, we explain the difference clearly, and we never substitute a product without your approval.',
              'Each order is linked to its supplier, product details and documents, including batch or lot information where available. If a question arises after delivery, we can answer it quickly and accurately.',
            ]}
          />
        </DiagramSplit>
      </PatternSection>

      {/* Closing · Documents First (P9 light). */}
      <CtaBand
        tone="light"
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
