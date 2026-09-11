import React from 'react';
import Link from 'next/link';
import { ArrowRight, ArrowUpRight, ShieldCheck, Globe2, FlaskConical, ImageIcon } from 'lucide-react';
import homepageData from '@/lib/data/homepageData.json';
import sectionDetail from '@/lib/data/sectionDetailData.json';
import { HeroSlider } from '@/components/HeroSlider';
import { FaqAccordion } from '@/components/FaqAccordion';
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
import llpImg from '@/app/assets/LLPIMAGE.png';
import corpImg from '@/app/assets/CORPIMAGE.png';
import featuredGlovesImg from '@/app/productimages/featuredone.png';
import featuredPpeImg from '@/app/productimages/featuredtwo.png';
import featuredDialysisImg from '@/app/productimages/featuredthree.png';

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
  // Operating-footprint hub panels: the two entities' own images, held locally in app/assets.
  india: llpImg.src,
  philippines: corpImg.src,
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
    alt: 'A pair of blue nitrile examination gloves in front of a white glove box',
  },
  ppe: {
    src: featuredPpeImg.src,
    alt: 'Personal protective equipment: a white hooded coverall, a blue isolation gown, gloves, a face mask, a face shield and a bouffant cap',
  },
  dialysis: {
    src: featuredDialysisImg.src,
    alt: 'A haemodialysis machine with IV pole, alongside dialysers, dialysate concentrates and bloodline tubing',
  },
};

const HERO_SLIDES = [
  { src: heroBg.src, alt: 'Clinicians supporting a patient in recovery' },
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

const hubImages: Record<string, string> = {
  india: IMG.india,
  philippines: IMG.philippines,
};

export default function HomePage() {
  const {
    hero, whatWeProvide, whoWeHelp, responseCommitment, globalFootprint,
    whatWeSupply, standardsCompliance, faq, statsStrip,
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
              {hero.ctaQuote} <ArrowRight />
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
          the two hubs and "50+ countries" come from globalFootprint, the 11 categories are the
          catalogData category count, and the UNGC date is on the Global Network page. */}
      <section className="section-tight section-white !py-14">
        <div className="wrap">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {statsStrip.items.map((item) => (
              <div key={item.label} className="border-l-2 border-accent pl-5">
                <div className="font-poppins text-4xl font-semibold text-ink leading-none mb-2">
                  {item.stat}
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
              <h2 className="mb-0">{whatWeSupply.title}</h2>
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
                  className="pillar featured-line"
                >
                  <div className={`featured-line-media${image ? ' has-photo' : ''}`}>
                    {image ? (
                      <img src={image.src} alt={image.alt} loading="lazy" />
                    ) : (
                      <span className="featured-line-empty">
                        <ImageIcon strokeWidth={1.5} aria-hidden="true" />
                        <span>Image coming soon</span>
                      </span>
                    )}
                  </div>
                  {/* The arrow sits inline, bound to the last word by a no-break space, so it
                      follows the name even when the name wraps onto a second line. */}
                  <h3 className="featured-line-title">
                    {line.name}
                    {'\u00a0'}
                    <span className="featured-line-arrow" aria-hidden="true">
                      <ArrowUpRight strokeWidth={2} />
                    </span>
                  </h3>
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
                Request a Quote <ArrowRight />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Operating Footprint — the two hubs named only. Narrative moved to /global-network,
          entity detail and addresses to /llp and /corp. */}
      <section className="section">
        <div className="wrap">
          <div className="grid-2 items-start">
            <div className="heading-lg">
              <span className="eyebrow">{globalFootprint.sectionTag}</span>
              <h2 className="mb-0">{globalFootprint.title}</h2>
            </div>
            <div className="lead-block">
              <p className="text-ink-soft leading-relaxed">{globalFootprint.lead}</p>
              <Link href={globalFootprint.ctaHref} className="btn btn-primary mt-2">
                {globalFootprint.ctaText} <ArrowRight />
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-14">
            {globalFootprint.hubs.map((hub) => (
              <Link key={hub.id} href={hub.href} className="hub-card">
                <div className="hub-card-media">
                  <img src={hubImages[hub.id]} alt={hub.region} loading="lazy" />
                </div>
                <div className="hub-card-row">
                  <div>
                    <h3>{hub.region}</h3>
                    <p className="hub-card-sub">{hub.entity}</p>
                  </div>
                  <span className="hub-card-cta">
                    <ArrowUpRight className="w-4 h-4" strokeWidth={2} />
                    {hub.hrefLabel}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Standards & Compliance — two tiers: the green group-level banner, then the
          product-level pillars. Detail is shared with /about/governance and /quality, which
          carry the same content in full. */}
      <section className="section section-line section-white">
        <div className="wrap">
          <div className="grid-2 items-start">
            <div className="heading-lg">
              <span className="eyebrow">{standardsCompliance.sectionTag}</span>
              <h2 className="mb-0">{standardsCompliance.title}</h2>
            </div>
            <div className="lead-block">
              <p className="text-ink-soft leading-relaxed m-0">{standardsCompliance.lead}</p>
            </div>
          </div>

          {/* Tier 1 — group level */}
          <div className="standards-tier rounded-3xl px-10 py-14 mt-14">
            <div className="grid-2 items-center">
              <div>
                <span className="eyebrow">{standardsCompliance.levels[0].tier}</span>
                <h3>{sectionDetail.governance.title}</h3>
              </div>
              <div>
                <p>{sectionDetail.governance.body}</p>
                <Link
                  href={standardsCompliance.levels[0].ctaHref}
                  className="standards-tier-cta"
                >
                  {standardsCompliance.levels[0].ctaText} <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>

          {/* Tier 2 — product level */}
          <div className="mt-16">
            <span className="eyebrow">{standardsCompliance.levels[1].tier}</span>
            <h3 className="font-sans text-2xl font-bold mb-3">{sectionDetail.productStandard.title}</h3>
            <p className="lead-block text-ink-soft leading-relaxed mb-4">
              {sectionDetail.productStandard.lead}
            </p>

            <div className="grid-3 mt-10">
              {sectionDetail.productStandard.points.map((point, idx) => {
                const icons = [ShieldCheck, FlaskConical, Globe2];
                const Icon = icons[idx] || ShieldCheck;
                return (
                  <div key={point.title} className="pillar">
                    <Icon className="w-10 h-10 text-accent mb-5" strokeWidth={1.5} />
                    <h3>{point.title}</h3>
                    <p>{point.desc}</p>
                  </div>
                );
              })}
            </div>

            <div className="mt-12">
              <Link href={standardsCompliance.levels[1].ctaHref} className="btn btn-primary">
                {standardsCompliance.levels[1].ctaText} <ArrowRight />
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
                View all FAQs <ArrowRight />
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
