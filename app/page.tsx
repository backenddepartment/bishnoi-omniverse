import React from 'react';
import Link from 'next/link';
import { ArrowRight, ShieldCheck, Globe2, Clock } from 'lucide-react';
import homepageData from '@/lib/data/homepageData.json';

// Images sourced from Wikimedia Commons (CC BY / CC BY-SA / public domain)
const IMG = {
  hero: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/ec/LMH_emergency_entrance_%282025%291.jpg/1920px-LMH_emergency_entrance_%282025%291.jpg',
  doctors:
    'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a0/Facial_plastic_surgeon_wearing_surgical_loupes_and_headlight_during_an_operating_room_procedure.jpg/1200px-Facial_plastic_surgeon_wearing_surgical_loupes_and_headlight_during_an_operating_room_procedure.jpg',
  hospitals: 'https://upload.wikimedia.org/wikipedia/commons/2/2e/Hospital_corridor_2.jpg',
  essentials:
    'https://upload.wikimedia.org/wikipedia/commons/c/c3/Ethylene_oxide_sterilisation_sticker_on_box_of_medical_supplies.jpg',
  patients:
    'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f9/A_waiting_room_at_a_medical_healthcare_clinic%2C_doctor%27s_office%2C_hospital.jpg/1200px-A_waiting_room_at_a_medical_healthcare_clinic%2C_doctor%27s_office%2C_hospital.jpg',
  logistics:
    'https://upload.wikimedia.org/wikipedia/commons/thumb/5/59/Shipping_cranes_by_Cartagena.jpg/1200px-Shipping_cranes_by_Cartagena.jpg',
};

const tileImages: Record<string, string> = {
  doctors: IMG.doctors,
  hospitals: IMG.hospitals,
  essentials: IMG.essentials,
  patients: IMG.patients,
};

export default function HomePage() {
  const { hero, realProblem, whoWeHelp, howItWorks, globalFootprint, whyTrustUs, faq } = homepageData;

  return (
    <div className="w-full">
      {/* Hero */}
      <section className="hero" id="home">
        <div className="hero-media">
          <img src={IMG.hero} alt="Modern hospital emergency entrance" loading="eager" />
        </div>
        <div className="hero-content">
          <h1 className="reveal d2">{hero.headline}</h1>
          <p className="lede reveal d3">{hero.subheadline}</p>
          <div className="hero-actions reveal d4">
            <Link className="btn btn-primary" href="/contact?type=find-medicine">
              {hero.ctaFindMedicine.replace(/[\[\]]/g, '')} <ArrowRight />
            </Link>
            <Link className="btn btn-outline" href="/contact?type=hospital-supply">
              {hero.ctaHospitalSupply.replace(/[\[\]]/g, '')}
            </Link>
          </div>
        </div>
      </section>

      {/* The Real Problem */}
      <section className="section section-tight">
        <div className="wrap grid-2">
          <div>
            <span className="eyebrow">{realProblem.sectionTag}</span>
            <h2>{realProblem.title}</h2>
          </div>
          <div className="lead-block">
            {realProblem.paragraphs.map((p, idx) => (
              <p key={idx} className="text-ink-soft leading-relaxed">
                {p}
              </p>
            ))}
          </div>
        </div>
      </section>

      {/* Who We Help — image tiles */}
      <section className="section section-line section-2col">
        <div className="wrap">
          <span className="eyebrow">{whoWeHelp.sectionTag}</span>
          <h2 className="mb-3">{whoWeHelp.title}</h2>
          <p className="lead-block text-ink-soft mb-10">
            Four groups rely on us to keep care moving — and one continuous line of supply, from the
            smallest needle to the largest cylinder, that serves them all.
          </p>

          <div className="biz-grid">
            {whoWeHelp.items.map((item) => (
              <Link key={item.id} href="/contact?type=hospital-supply" className="biz-tile">
                <img src={tileImages[item.id]} alt={item.title} />
                <div className="biz-tile-label">
                  <span className="tag">{item.title.replace(/^For /, '')}</span>
                  <h3>{item.title.replace(/^For /, '')}</h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works — timeline */}
      <section className="section">
        <div className="wrap grid-2">
          <div>
            <span className="eyebrow">{howItWorks.sectionTag}</span>
            <h2>{howItWorks.title}</h2>
            <p className="text-ink-soft max-w-md">
              A simple, transparent path from prescription to bedside — built for the moments when
              speed and accuracy both matter.
            </p>
          </div>
          <div className="timeline">
            {howItWorks.steps.map((step) => (
              <div key={step.step} className="tl-item">
                <span className="tl-year">Step {step.step}</span>
                <h3>{step.title.replace(/^\d+\.\s*/, '')}</h3>
                <p>{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Quote / trust statement */}
      <section className="section-dark section-tight">
        <div className="wrap quote-grid">
          <div className="quote-block">
            <span className="mark">&ldquo;</span>
            <blockquote>{whyTrustUs.points.find((p) => p.title === 'Fast Action')?.desc}</blockquote>
            <cite>Our response commitment, every quote and case</cite>
            <div className="mt-7">
              <Link className="btn btn-outline" href="/catalog">
                Explore The Catalog <ArrowRight />
              </Link>
            </div>
          </div>
          <figure className="quote-figure m-0">
            <img src={IMG.logistics} alt="Global shipping and logistics" loading="lazy" />
          </figure>
        </div>
      </section>

      {/* Global Footprint & Core Catalog */}
      <section className="section">
        <div className="wrap">
          <span className="eyebrow">{globalFootprint.sectionTag}</span>
          <h2 className="mb-3">{globalFootprint.title}</h2>
          <p className="font-serif text-xl md:text-2xl font-semibold text-ink max-w-3xl mb-4">
            {globalFootprint.lead}
          </p>
          <p className="lead-block text-ink-soft mb-2">{globalFootprint.description}</p>
          <p className="lead-block text-ink-soft italic mb-12">{globalFootprint.subtext}</p>

          <div className="mb-4">
            <h3 className="font-sans text-lg font-bold">{globalFootprint.essentialLineTitle}</h3>
            <p className="text-xs text-muted italic mt-1 mb-10">{globalFootprint.essentialLineTagline}</p>
          </div>

          <div className="grid-4 mb-14">
            {globalFootprint.categories.map((cat, idx) => (
              <div key={idx} className="pillar">
                <span className="num">0{idx + 1}</span>
                <h3>{cat.name}</h3>
                {cat.items.map((item, itemIdx) => (
                  <p key={itemIdx}>
                    <strong className="text-ink">{item.title}</strong> {item.desc}
                  </p>
                ))}
              </div>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
            <Link href="/catalog" className="btn btn-primary">
              Explore The Full Catalog <ArrowRight />
            </Link>
            <Link href="/contact?type=hospital-supplies" className="btn btn-outline on-light">
              Download Pricing &amp; Specs
            </Link>
          </div>
        </div>
      </section>

      {/* Why Trust Us */}
      <section className="section section-line section-2col">
        <div className="wrap">
          <span className="eyebrow">{whyTrustUs.sectionTag}</span>
          <h2 className="mb-10">{whyTrustUs.title}</h2>

          <div className="grid-3">
            {whyTrustUs.points.map((point, idx) => {
              const icons = [Globe2, ShieldCheck, Clock];
              const Icon = icons[idx] || ShieldCheck;
              return (
                <div key={point.title} className="pillar">
                  <Icon className="w-5 h-5 text-accent mb-4" strokeWidth={1.75} />
                  <h3>{point.title}</h3>
                  <p>{point.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="section">
        <div className="wrap">
          <span className="eyebrow">{faq.sectionTag}</span>
          <h2 className="mb-10">{faq.title}</h2>

          <div className="max-w-3xl">
            {faq.questions.map((item) => (
              <div key={item.q} className="faq-card">
                <h3>{item.q}</h3>
                <p>{item.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
