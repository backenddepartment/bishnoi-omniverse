import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, FileCheck2, FlaskConical, Gauge, Thermometer } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Quality & Compliance | Bishnoi Omniverse',
  description:
    'How Bishnoi Omniverse documents quality at the product level — CE marking and CMDR approvals for devices, WHO-GMP and Certificates of Analysis for pharmaceuticals, ISO 9809-1 and DOT/TPED for medical gas cylinders.',
};

const IMG = {
  hero: 'https://upload.wikimedia.org/wikipedia/commons/c/c3/Ethylene_oxide_sterilisation_sticker_on_box_of_medical_supplies.jpg',
};

const EVIDENCE = [
  {
    icon: FileCheck2,
    category: 'Medical Devices',
    standard: 'CE Marking · CMDR Approval',
    desc: 'Device lines carry CE marking and, where the destination market requires it, CMDR registration — for example CMDR-2023-01556 on the GetMeds™ sterile blood transfusion set. Specification sheets and registration references are supplied with the quote.',
  },
  {
    icon: FlaskConical,
    category: 'Pharmaceuticals',
    standard: 'WHO-GMP · Certificate of Analysis',
    desc: 'Specialty and named-patient medicines are sourced from WHO-GMP certified manufacturing, with a Certificate of Analysis for the supplied batch. Our Carboget™ / GetMeds™ carboplatin injection is supplied on this basis.',
  },
  {
    icon: Gauge,
    category: 'Medical Gas Cylinders',
    standard: 'ISO 9809-1 · DOT/TPED',
    desc: 'High-pressure seamless steel cylinders — including the 40L oxygen cylinder supplied under Bishnoi PureFlow™ — are manufactured to ISO 9809-1 and certified to DOT/TPED, documented per batch.',
  },
  {
    icon: Thermometer,
    category: 'Cold-Chain Products',
    standard: 'Monitored Packaging · Chain of Custody',
    desc: 'Temperature-sensitive shipments travel in monitored packaging. The temperature record and chain of custody are documented from dispatch through to handover at the treating facility.',
  },
];

export default function QualityCompliancePage() {
  return (
    <div className="w-full">
      <section className="page-hero">
        <div className="hero-media">
          <img src={IMG.hero} alt="A certified medical supply carton prepared for sterile shipment" loading="eager" />
        </div>
        <div className="hero-content">
          <span className="eyebrow on-dark">Quality &amp; Compliance</span>
          <h1>Documented at the product level</h1>
          <p className="lede">
            Certification and regulatory documentation vary by product category and destination
            market. Rather than one blanket claim, we document quality where it can be checked.
          </p>
        </div>
      </section>

      <section className="section section-tight">
        <div className="wrap grid-2">
          <div>
            <span className="eyebrow">Our Position</span>
            <h2 className="mb-0">No single guarantee covers every product</h2>
          </div>
          <div className="lead-block">
            <p className="text-ink-soft leading-relaxed">
              A blanket safety claim tells a procurement officer nothing they can verify. A device
              registration number, a Certificate of Analysis for the supplied batch, and a cylinder
              certification reference do. So we quote line by line, and we state the documentation
              that applies to each line.
            </p>
            <p className="text-ink-soft leading-relaxed">
              Where a product cannot be documented to the standard your market requires, we say so
              and propose an alternative rather than shipping against an assumption.
            </p>
          </div>
        </div>
      </section>

      <section className="section section-line section-2col">
        <div className="wrap">
          <span className="eyebrow">Evidence by Category</span>
          <h2 className="mb-10">What we document, and where it comes from</h2>

          <div className="grid-2">
            {EVIDENCE.map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.category} className="info-card">
                  <Icon className="w-6 h-6 text-accent mb-4" strokeWidth={1.5} />
                  <h3 className="font-sans text-lg font-bold text-ink mb-1">{item.category}</h3>
                  <span className="text-xs font-semibold uppercase tracking-wide text-accent-dark block mb-3">
                    {item.standard}
                  </span>
                  <p className="text-sm text-ink-soft leading-relaxed m-0">{item.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="wrap grid-2 items-start">
          <div>
            <span className="eyebrow">On Request</span>
            <h2 className="mb-3">Documentation available for review</h2>
            <p className="text-ink-soft max-w-md">
              Procurement, pharmacy, and regulatory reviewers can request the underlying documents
              before an order is placed — not after delivery.
            </p>
          </div>
          <ul className="space-y-3">
            {[
              'Product specification sheets, per catalog line',
              'Device registration and CE / CMDR references',
              'WHO-GMP manufacturing credentials for pharmaceutical lines',
              'Certificate of Analysis for the supplied batch',
              'ISO 9809-1 and DOT/TPED certification for gas cylinders',
              'Cold-chain temperature records and chain-of-custody documentation',
            ].map((line) => (
              <li key={line} className="text-sm text-ink-soft leading-relaxed flex items-start gap-2.5">
                <span className="text-accent shrink-0 mt-0.5">—</span>
                <span>{line}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="section-dark section-tight">
        <div className="wrap text-center max-w-2xl mx-auto">
          <span className="eyebrow on-dark">Request Documentation</span>
          <h2>Ask for the paperwork before you commit to the order.</h2>
          <p className="mt-2 mb-8">
            Send your line list and we will return the quote and the supporting documentation
            together, within 24 hours.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/contact?type=quote" className="btn btn-primary">
              Request a Quote <ArrowRight />
            </Link>
            <Link href="/catalog" className="btn btn-outline">
              Browse The Catalog
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
