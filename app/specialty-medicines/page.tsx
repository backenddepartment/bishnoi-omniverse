import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { FileCheck2, HeartPulse, Hospital, Pill, Snowflake, Stethoscope, Users } from 'lucide-react';
import homepageData from '@/lib/data/homepageData.json';
import { FaqAccordion, type FaqItem } from '@/components/FaqAccordion';
import { WHATSAPP_HREF } from '@/lib/contactChannels';
import { pageMetadata } from '@/lib/seo';
import medicinesImg from '@/app/assets/medicines.webp';

export const metadata: Metadata = pageMetadata({
  title: 'Specialty & Hard-to-Find Medicine Sourcing | Bishnoi Omniverse',
  description:
    'Named-patient sourcing of specialty and hard-to-find medicines not registered in your market, for hospitals and doctors in the Philippines. Send a request.',
  path: '/specialty-medicines/',
});

/*
 * COMPLIANCE REVIEW: every claim on this page restates what the site already says elsewhere (the
 * homepage What We Provide and FAQ, and the contact page's specialty medicine form), except the
 * Compassionate Special Permit section, which names the Philippine FDA route. Have regulatory staff
 * confirm that section, and the page as a whole, before it goes live.
 */

const WHAT_WE_SOURCE = [
  {
    icon: Pill,
    title: 'Oncology therapies',
    desc: 'Cancer medicines that a treating oncologist has prescribed but that are not registered, or not in stock, in your market.',
  },
  {
    icon: HeartPulse,
    title: 'Critical-care medicines',
    desc: 'Medicines an ICU or emergency team needs for a specific patient, when the local supply cannot provide them in time.',
  },
  {
    icon: FileCheck2,
    title: 'Rare biosimilars',
    desc: 'Biosimilars and other specialty products that are hard to source locally, from verified manufacturers.',
  },
];

const WHO_WE_HELP = [
  {
    icon: Hospital,
    title: 'Hospitals and hospital pharmacies',
    desc: 'Procurement teams and pharmacists sourcing a medicine for a patient under their care.',
  },
  {
    icon: Stethoscope,
    title: 'Doctors and oncology teams',
    desc: 'Treating physicians who need a therapy that is not yet registered in their market for a named patient.',
  },
  {
    icon: Users,
    title: 'Patients and families',
    desc: 'We guide you through the named-patient process, always working through your treating doctor.',
  },
];

const STEPS = [
  {
    title: 'The doctor or hospital sends the request',
    desc: 'The medicine name or active ingredient, the country, how urgent it is, and any prescription notes. No account or login is needed.',
  },
  {
    title: 'We source from a verified manufacturer',
    desc: 'We find the product, check the manufacturer and collect the product documents before anything is quoted.',
  },
  {
    title: 'Permit and documents',
    desc: 'We support the import permit and the documentation the destination regulator requires for named-patient supply.',
  },
  {
    title: 'Monitored delivery to the facility',
    desc: 'Temperature-sensitive medicines ship in monitored packaging, with the temperature record and chain of custody documented up to handover at the treating facility.',
  },
];

const DOCUMENTS = [
  'WHO-GMP credentials of the manufacturer',
  'Certificate of Analysis for the batch supplied',
  'Commercial invoice and the import papers for the shipment',
  'Temperature record for cold-chain products',
];

// The named-patient, documentation and cold-chain answers are the homepage FAQ's own, so the two
// pages never disagree.
const SHARED_FAQ_QUESTIONS = [
  'What does named-patient supply actually mean?',
  'How do you handle cold-chain products?',
  'Do we need an account or login to request a quote?',
];

const PAGE_FAQ: FaqItem[] = [
  ...homepageData.faq.questions.filter((item) => SHARED_FAQ_QUESTIONS.includes(item.q)),
  {
    q: 'Can a patient request a medicine directly?',
    a: 'Named-patient supply is requested by the treating doctor or hospital, because the medicine is supplied for one identified patient under their care. If you are a patient or a family member, contact us and we will explain the process and what your doctor needs to send.',
  },
  {
    q: 'How long does it take?',
    a: 'It depends on the medicine, where it is sourced from and the permit route in your country, so we confirm the timeline on the quote. Tell us how urgent the request is when you send it, and a case manager replies within 24 hours.',
  },
];

export default function SpecialtyMedicinesPage() {
  return (
    <div className="w-full">
      <section className="page-hero">
        <div className="hero-media">
          <img src={medicinesImg.src} alt="Specialty medicines prepared for cold-chain delivery" loading="eager" />
        </div>
        <div className="hero-content">
          <span className="eyebrow on-dark">Specialty Medicines</span>
          <h1>Specialty Medicine Sourcing for Hospitals and Patients</h1>
          <p className="lede">
            Named-patient and cross-border access to specialty and hard-to-find medicines that are not yet registered
            or available in the Philippines or your market, with monitored cold-chain delivery to the treating
            facility.
          </p>
          <div className="hero-actions">
            <Link className="btn btn-primary" href="/contact?type=find-medicine">
              Send Your Requirement
            </Link>
            <a className="btn btn-outline" href={WHATSAPP_HREF} target="_blank" rel="noopener noreferrer">
              Ask on WhatsApp
            </a>
          </div>
        </div>
      </section>

      <section className="section section-white">
        <div className="wrap">
          <div className="heading-lg max-w-3xl">
            <span className="eyebrow">What We Source</span>
            <h2 className="mb-4">Medicines that are hard to find locally</h2>
            <p className="text-ink-soft leading-relaxed">
              Some medicines a doctor prescribes are not registered in the Philippines, or not available when a patient
              needs them. Bishnoi Omniverse sources these hard-to-find medicines through our India hub in New Delhi and
              delivers them through our Philippines hub in Metro Manila, for hospitals in the Philippines and in the
              other markets we serve.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10">
            {WHAT_WE_SOURCE.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="info-card">
                <Icon className="w-6 h-6 text-accent mb-4" aria-hidden="true" />
                <h3 className="text-lg mb-2">{title}</h3>
                <p className="text-ink-soft leading-relaxed m-0">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section section-line section-white">
        <div className="wrap">
          <div className="heading-lg max-w-3xl">
            <span className="eyebrow">Who We Help</span>
            <h2 className="mb-4">For hospitals, clinics and patients through their doctors</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            {WHO_WE_HELP.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="info-card">
                <Icon className="w-6 h-6 text-accent mb-4" aria-hidden="true" />
                <h3 className="text-lg mb-2">{title}</h3>
                <p className="text-ink-soft leading-relaxed m-0">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section section-line section-white">
        <div className="wrap grid grid-cols-1 md:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] gap-12 md:gap-20 items-start">
          <div className="heading-lg">
            <span className="eyebrow">How It Works</span>
            <h2 className="mb-4">Step by step, from request to delivery</h2>
            <p className="text-ink-soft leading-relaxed">
              One case manager follows the request from the first message to handover, and keeps the doctor or
              hospital updated at every stage.
            </p>
          </div>
          <ol className="space-y-6 m-0 p-0 list-none">
            {STEPS.map((step, idx) => (
              <li key={step.title} className="flex gap-5">
                <span className="font-poppins text-accent font-semibold text-lg shrink-0">
                  {String(idx + 1).padStart(2, '0')}
                </span>
                <div>
                  <h3 className="text-lg mb-1">{step.title}</h3>
                  <p className="text-ink-soft leading-relaxed m-0">{step.desc}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="section section-line section-white">
        <div className="wrap grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20 items-start">
          <div>
            <span className="eyebrow">Documents We Provide</span>
            <h2 className="mb-4">Paperwork that stands up to review</h2>
            <p className="text-ink-soft leading-relaxed">
              Documentation varies by product and destination market, so we state it for each medicine on the quote
              rather than as a blanket claim. It typically includes:
            </p>
            <ul className="space-y-2 text-ink-soft leading-relaxed">
              {DOCUMENTS.map((doc) => (
                <li key={doc} className="flex gap-3">
                  <FileCheck2 className="w-4 h-4 text-accent shrink-0 mt-1" aria-hidden="true" />
                  <span>{doc}</span>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <span className="eyebrow">Philippines</span>
            <h2 className="mb-4">Philippine FDA Compassionate Special Permit support</h2>
            <p className="text-ink-soft leading-relaxed">
              In the Philippines, a medicine that is not registered with the Food and Drug Administration can be brought
              in for a named patient under a Compassionate Special Permit (CSP), applied for by the hospital or treating
              physician. We support that application with the product and manufacturer documents it needs, and
              coordinate the shipment once the permit is granted.
            </p>
            <div className="info-card !p-6 mt-6 flex gap-4 items-start">
              <Snowflake className="w-5 h-5 text-accent shrink-0 mt-0.5" aria-hidden="true" />
              <p className="text-ink-soft leading-relaxed m-0">
                <strong className="text-ink">Turnaround times.</strong> A case manager replies within 24 hours. Delivery
                time depends on the medicine, its source and the permit route, and is confirmed on the quote. Mark the
                request as routine, urgent (48 to 72 hours) or emergency when you send it.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="section section-line section-white">
        <div className="wrap grid grid-cols-1 md:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] gap-12 md:gap-20 items-start">
          <div className="heading-lg">
            <span className="eyebrow">FAQ</span>
            <h2 className="mb-4">Specialty medicine questions</h2>
            <p className="text-ink-soft leading-relaxed">
              More answers on supply and documentation are on the{' '}
              <Link href="/faq" className="text-accent-dark font-semibold hover:underline">
                FAQ page
              </Link>
              , and on how we check products on{' '}
              <Link href="/quality" className="text-accent-dark font-semibold hover:underline">
                Quality &amp; Compliance
              </Link>
              .
            </p>
            <div className="flex flex-wrap gap-4 mt-8">
              <Link href="/contact?type=find-medicine" className="btn btn-primary">
                Send Your Requirement
              </Link>
            </div>
          </div>
          <FaqAccordion questions={PAGE_FAQ} />
        </div>
      </section>
    </div>
  );
}
