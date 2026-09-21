import React from 'react';
import Link from 'next/link';
import { ArrowUpRight, ChevronRight, ImageIcon } from 'lucide-react';
import homepageData from '@/lib/data/homepageData.json';
import { HeroSlider } from '@/components/HeroSlider';
import { FaqAccordion } from '@/components/FaqAccordion';
import { CountUp } from '@/components/CountUp';
import heroBg from '@/app/assets/background.png';
import heroSlideTwo from '@/app/assets/slidertwo.png';
import heroSlideThree from '@/app/assets/sliderthree.png';
import doctorsImg from '@/app/assets/doctors.jpg';
import hospitalCardImg from '@/app/assets/hospitalcard.png';
import clinicsCardImg from '@/app/assets/clinicscard.png';
import distributorsCardImg from '@/app/assets/distributorscard.png';
import familiesCardImg from '@/app/assets/familiescard.png';
import suppliesImg from '@/app/assets/supplies.jpg';
import medicinesImg from '@/app/assets/medicines.jpg';
import sourcingImg from '@/app/assets/sourcing.jpg';
import familiesImg from '@/app/assets/families.jpg';
import featuredGlovesImg from '@/app/assets/gloves.png';
import featuredPpeImg from '@/app/assets/ppesuit.jpg';
import featuredDialysisImg from '@/app/assets/dialysis.jpg';

// Images sourced from Wikimedia Commons (CC BY / CC BY-SA / public domain)
const IMG = {
  hero: heroBg.src,
  doctors: doctorsImg.src,
  hospitals: 'https://upload.wikimedia.org/wikipedia/commons/2/2e/Hospital_corridor_2.jpg',
  essentials:
    'https://upload.wikimedia.org/wikipedia/commons/c/c3/Ethylene_oxide_sterilisation_sticker_on_box_of_medical_supplies.jpg',
  patients: familiesImg.src,
  logistics:
    'https://upload.wikimedia.org/wikipedia/commons/5/59/Shipping_cranes_by_Cartagena.jpg',
  // Behind the response-commitment band: a medical supply requisition being handled.
  // Wikimedia Commons, public domain, verified to resolve. 1920px thumbnail, not the original.
  responseBand:
    'https://upload.wikimedia.org/wikipedia/commons/thumb/0/09/Reserve_Soldiers_support_medical_supply_mission_during_pandemic_%286154094%29.jpg/1920px-Reserve_Soldiers_support_medical_supply_mission_during_pandemic_%286154094%29.jpg',
};

// What We Supply card photos, keyed by the featured line's id in homepageData.json. A line with no
// entry shows the grey placeholder instead.
const FEATURED_LINE_IMAGES: Record<string, { src: string; alt: string } | undefined> = {
  gloves: {
    src: featuredGlovesImg.src,
    alt: 'A clinician in a white coat pulling on a blue nitrile examination glove at the bedside',
  },
  ppe: {
    src: featuredPpeImg.src,
    alt: 'A healthcare worker in a white hooded coverall adjusting protective goggles, wearing an N95 respirator and blue gloves',
  },
  dialysis: {
    src: featuredDialysisImg.src,
    alt: 'A haemodialysis machine running a treatment, with the drip chamber and bloodline tubing in focus and a patient resting behind it',
  },
};

// Slide 1 (heroBg, "Clinicians supporting a patient in recovery") is out of the rotation for now;
// add it back as the first entry to restore it.
const HERO_SLIDES = [
  { src: heroSlideTwo.src, alt: 'Bishnoi Omniverse medical supply operations' },
  { src: heroSlideThree.src, alt: 'Bishnoi Omniverse sourcing and logistics network' },
];

const tileImages: Record<string, string> = {
  hospitals: hospitalCardImg.src,
  doctors: clinicsCardImg.src,
  essentials: distributorsCardImg.src,
  patients: familiesCardImg.src,
};

// What We Provide is a three-card bento: each card pairs a photo with a solid colour panel.
// `tone` picks the panel colour — green for the hospital line, brand orange for the other two.
const provideCards: Record<string, { src: string; alt: string; tone: 'green' | 'orange' }> = {
  'hospital-supplies': {
    src: suppliesImg.src,
    alt: 'Hospital-grade consumables prepared for institutional supply',
    tone: 'green',
  },
  'specialty-medicines': {
    src: medicinesImg.src,
    alt: 'Specialty medicines handled under cold-chain conditions',
    tone: 'orange',
  },
  'sourcing-trade': {
    src: sourcingImg.src,
    alt: 'Sourcing and logistics across our India and Philippines hubs',
    tone: 'orange',
  },
};

export default function HomePage() {
  const {
    hero, whatWeProvide, whoWeHelp, responseCommitment,
    whatWeSupply, faq, statsStrip,
  } = homepageData;

  return (
    <div className="w-full home-page">
      {/* Hero */}
      <section className="hero" id="home">
        <HeroSlider slides={HERO_SLIDES} />
        <div className="hero-content">
          <h1 className="reveal d2">{hero.headline}</h1>
          <p className="lede reveal d3">{hero.subheadline}</p>
          <div className="hero-actions reveal d4">
            <Link className="btn btn-primary" href="/contact?type=quote">
              {hero.ctaQuote}
            </Link>
            <Link className="btn btn-outline" href="/contact?type=hospital-supply">
              {hero.ctaHospitalSupply}
            </Link>
            <Link className="btn btn-outline" href="/contact?type=find-medicine">
              {hero.ctaFindMedicine}
            </Link>
          </div>
        </div>
      </section>

      {/* Capability bar — the five things we are actually accountable for, scrolling right to left.
          The list is rendered twice so the track can loop seamlessly at -50%; the second copy is
          hidden from assistive tech. */}
      <section className="capability-bar" aria-label="What we are accountable for">
        <ul className="capability-track">
          {[...hero.capabilityBar, ...hero.capabilityBar].map((item, idx) => (
            <li key={`${item}-${idx}`} aria-hidden={idx >= hero.capabilityBar.length}>
              {item}
            </li>
          ))}
        </ul>
      </section>

      {/* Stats / proof strip. Every figure here is already substantiated elsewhere on the site:
          the two hubs and "50+ countries" come from the Global Network page, the 11 categories are the
          catalogData category count, and the UNGC date is on the Global Network page. */}
      <section className="section-tight section-white !py-14">
        <div className="wrap">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {statsStrip.items.map((item) => (
              <div key={item.label} className="border-l-2 border-accent pl-5">
                <div className="font-poppins text-4xl font-semibold text-ink leading-none mb-2 tabular-nums">
                  <CountUp value={item.stat} />
                </div>
                <div className="text-sm text-ink-soft leading-snug">
                  {item.label}
                  {item.line2 && (
                    <>
                      <br />
                      {item.line2}
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What We Provide — two supply lines plus the network that carries them */}
      <section className="section section-tight">
        <div className="wrap">
          <div className="grid-2 items-start">
            <div className="heading-lg">
              <span className="eyebrow">{whatWeProvide.sectionTag}</span>
              <h2 className="mb-0">{whatWeProvide.title}</h2>
            </div>
            <div className="lead-block">
              <p className="text-ink-soft leading-relaxed m-0">{whatWeProvide.lead}</p>
            </div>
          </div>

          {/* Bento: card 1 is photo-beside-panel, card 2 stacks photo over panel, card 3 runs
              full width. Card order is fixed by the layout, so each is placed by id rather than
              by array position. */}
          <div className="provide-bento mt-14">
            {whatWeProvide.items.map((item) => {
              const card = provideCards[item.id];
              if (!card) return null;
              return (
                <article key={item.id} className={`provide-card is-${item.id}`}>
                  <div className="provide-media">
                    <img src={card.src} alt={card.alt} loading="lazy" />
                  </div>
                  <div className={`provide-panel is-${card.tone}`}>
                    <div>
                      <h3>{item.title}</h3>
                      <p>{item.desc}</p>
                    </div>
                    <Link href={item.ctaHref} className="provide-cta">
                      {item.ctaText}
                      <ArrowUpRight aria-hidden="true" />
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* What We Supply — three featured lines: the catalog's first two categories plus Dialysis
          Equipment. Each card links through to its category, or to a quote request for dialysis. */}
      <section className="section section-line section-white">
        <div className="wrap">
          <div className="grid-2 items-start">
            <div className="heading-lg">
              <span className="eyebrow">{whatWeSupply.sectionTag}</span>
              <h2 className="mb-0" style={{ fontSize: 'clamp(32px, 3.6vw, 46px)', fontWeight: 500 }}>
                {whatWeSupply.title}
              </h2>
            </div>
            <div className="lead-block">
              <p className="text-ink-soft leading-relaxed m-0">{whatWeSupply.lead}</p>
              <Link href={whatWeSupply.ctaHref} className="btn btn-primary mt-7">
                {whatWeSupply.ctaText}
              </Link>
            </div>
          </div>

          <div className="grid-3 mt-14">
            {whatWeSupply.featured.map((line) => {
              const image = FEATURED_LINE_IMAGES[line.id];
              return (
                <Link
                  key={line.id}
                  href={line.href}
                  aria-label={line.linkText}
                  className="featured-line"
                >
                  {image ? (
                    <img className="featured-line-img" src={image.src} alt={image.alt} loading="lazy" />
                  ) : (
                    <span className="featured-line-empty">
                      <ImageIcon strokeWidth={1.5} aria-hidden="true" />
                      <span>Image coming soon</span>
                    </span>
                  )}
                  {/* Name and arrow sit on an orange shade that fades up out of the photo. */}
                  <div className="featured-line-foot">
                    <h3 className="featured-line-title">{line.name}</h3>
                    <span className="featured-line-arrow" aria-hidden="true">
                      <ChevronRight strokeWidth={2.5} />
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>        </div>
      </section>

      {/* Who We Serve — teaser only. The full four-audience detail lives on /global. */}
      <section className="section section-line section-2col">
        <div className="wrap">
          {/* items-end drops the lead to sit level with the foot of the heading, rather than
              starting at its top edge. */}
          <div className="grid-2 items-end">
            <div className="heading-lg">
              <span className="eyebrow">{whoWeHelp.sectionTag}</span>
              <h2 className="mb-0">{whoWeHelp.title}</h2>
            </div>
            <div className="lead-block">
              <p className="text-ink-soft leading-relaxed m-0">{whoWeHelp.lead}</p>
              <Link href={whoWeHelp.ctaHref} className="btn btn-primary mt-7">
                {whoWeHelp.ctaText}
              </Link>
            </div>
          </div>

          <div className="biz-grid mt-14">
            {whoWeHelp.items.map((item) => (
              <Link key={item.id} href="/contact?type=quote" className="biz-tile">
                <img src={tileImages[item.id]} alt={item.title} />
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Response commitment — backed by the contact photography, since this band is the
          request-a-quote promise. The image is dimmed rather than scrimmed with an overlay, so
          the white text keeps its contrast against the dark ground underneath. */}
      <section className="section-dark section-tight response-band">
        <img src={IMG.responseBand} alt="" className="response-band-media" loading="lazy" />
        <div className="wrap">
          <div className="quote-block max-w-2xl mx-auto text-center">
            <span className="mark">&ldquo;</span>
            <blockquote>{responseCommitment}</blockquote>
            <cite>Our response commitment, every quote and every case</cite>
            <div className="mt-7">
              <Link className="btn btn-outline" href="/contact?type=quote">
                Request a Quote
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ — heading and CTA on the left, accordion on the right. */}
      <section className="section section-white">
        <div className="wrap grid grid-cols-1 md:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] gap-12 md:gap-20 items-start">
          <div className="heading-lg">
            <span className="eyebrow">{faq.sectionTag}</span>
            <h2 className="mb-8">{faq.title}</h2>
            <div className="flex flex-wrap gap-4">
              <Link href="/faq" className="btn btn-primary">
                View all FAQs
              </Link>
              {/* on-light: .btn-outline is built for dark sections, this variant is its light twin. */}
              <Link href="/contact?type=quote" className="btn btn-outline on-light">
                Talk to a case manager
              </Link>
            </div>
          </div>

          <FaqAccordion questions={faq.questions} />
        </div>
      </section>
    </div>
  );
}
