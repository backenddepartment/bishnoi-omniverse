import React from 'react';
import Link from 'next/link';
import { ArrowRight, ShieldCheck, Globe2, FlaskConical, Boxes, Truck } from 'lucide-react';
import homepageData from '@/lib/data/homepageData.json';
import { HeroSlider } from '@/components/HeroSlider';
import { FaqAccordion } from '@/components/FaqAccordion';
import heroBg from '@/app/assets/background.png';
import heroSlideTwo from '@/app/assets/slidertwo.png';
import heroSlideThree from '@/app/assets/sliderthree.png';
import hospitalsImg from '@/app/assets/hospitals.png';
import clinicsImg from '@/app/assets/clinics.png';
import doctorsImg from '@/app/assets/doctors.jpg';
import familiesImg from '@/app/assets/families.jpg';

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
};

const HERO_SLIDES = [
  { src: heroBg.src, alt: 'Clinicians supporting a patient in recovery' },
  { src: heroSlideTwo.src, alt: 'Bishnoi Omniverse medical supply operations' },
  { src: heroSlideThree.src, alt: 'Bishnoi Omniverse sourcing and logistics network' },
];

const tileImages: Record<string, string> = {
  doctors: IMG.doctors,
  hospitals: IMG.hospitals,
  essentials: IMG.essentials,
  patients: IMG.patients,
};

const provideIcons: Record<string, React.ElementType> = {
  'hospital-supplies': Boxes,
  'specialty-medicines': FlaskConical,
  'sourcing-trade': Truck,
};

// Photos for the facility cards. Every URL here is already used elsewhere on the site, so all of
// them are known to load. The four marked STAND-IN are stylistically close, not literal: swap them
// as soon as real photography for those facility types is available.
// `corner: true` anchors the artwork to the bottom-right of the card instead of cropping it to
// fill the media column — for cut-out graphics rather than photographs.
const facilityImages: Record<string, { src: string; corner?: boolean; mediaClass?: string }> = {
  hospitals: { src: hospitalsImg.src, corner: true, mediaClass: 'is-corner-raised' },
  clinics: { src: clinicsImg.src, corner: true, mediaClass: 'is-corner-narrow' },
  labs: { src: IMG.essentials }, // STAND-IN — sterile supply, not a pathology lab
  surgical: {
    src: 'https://upload.wikimedia.org/wikipedia/commons/a/a0/Facial_plastic_surgeon_wearing_surgical_loupes_and_headlight_during_an_operating_room_procedure.jpg',
  },
  government: {
    src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/36/Manila_Skyline_March_2020.jpg/1920px-Manila_Skyline_March_2020.jpg',
  }, // STAND-IN
  trade: { src: IMG.logistics },
};

export default function HomePage() {
  const {
    hero, whatWeProvide, whoWeHelp, howItWorks, globalFootprint, qualityCompliance, faq,
    statsStrip, facilityTypes, ourBrands, globalCompact,
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
                <div className="text-sm text-ink-soft leading-snug">{item.label}</div>
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

          <div className="grid-3 mt-14">
            {whatWeProvide.items.map((item) => {
              const Icon = provideIcons[item.id] || Boxes;
              return (
                <div key={item.id} className="pillar">
                  <Icon className="w-10 h-10 text-accent mb-5" strokeWidth={1.5} />
                  <h3>{item.title}</h3>
                  <p className="mb-4">{item.desc}</p>
                  <Link
                    href={item.ctaHref}
                    className="inline-flex items-center gap-1.5 no-underline text-sm font-semibold text-accent-dark hover:underline"
                  >
                    {item.ctaText} <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Facility Types — what kind of buyer we supply, distinct from the persona tiles below. */}
      <section className="section section-line section-white">
        <div className="wrap">
          <div className="grid-2 items-start">
            <div className="heading-lg">
              <span className="eyebrow">{facilityTypes.sectionTag}</span>
              <h2 className="mb-0">{facilityTypes.title}</h2>
            </div>
            <div className="lead-block">
              <p className="text-ink-soft leading-relaxed m-0">{facilityTypes.lead}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-14">
            {facilityTypes.items.map((item) => {
              const media = facilityImages[item.id];
              return (
              <Link key={item.id} href={item.href} className="facility-card">
                <div className="facility-card-body">
                  <h3>{item.name}</h3>
                  <span className="facility-card-cta">
                    <span className="facility-card-arrow">
                      <ArrowRight className="w-4 h-4" strokeWidth={2.5} />
                    </span>
                    Learn More
                  </span>
                </div>
                <div
                  className={['facility-card-media', media.corner && 'is-corner', media.mediaClass]
                    .filter(Boolean)
                    .join(' ')}
                >
                  <img src={media.src} alt="" loading="lazy" />
                </div>
              </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Who We Serve — image tiles */}
      <section className="section section-line section-2col !pb-10">
        <div className="wrap">
          <div className="who-we-help-heading">
            <span className="eyebrow">{whoWeHelp.sectionTag}</span>
            <h2 className="mb-3">{whoWeHelp.title}</h2>
            <p className="lead-block text-ink-soft mb-10">{whoWeHelp.lead}</p>
          </div>

          <div className="biz-grid">
            {whoWeHelp.items.map((item) => (
              <Link key={item.id} href="/contact?type=quote" className="biz-tile">
                <img src={tileImages[item.id]} alt={item.title} />
                <div className="biz-tile-label">
                  <h3>{item.title}</h3>
                </div>
              </Link>
            ))}
          </div>

          <div className="grid-4 mt-12">
            {whoWeHelp.items.map((item) => (
              <div key={item.id} className="pillar">
                <h3>{item.title}</h3>
                <p>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works — procurement and named-patient access run as parallel tracks */}
      <section className="section !pt-10">
        <div className="wrap">
          <span className="eyebrow">{howItWorks.sectionTag}</span>
          <h2 className="mb-3">{howItWorks.title}</h2>
          <p className="lead-block text-ink-soft mb-12">{howItWorks.lead}</p>

          <div className="workflow-grid">
            {howItWorks.tracks.map((track) => (
              <div key={track.id} className="workflow-track">
                <span className="tag">{track.name}</span>
                <p className="text-sm text-ink-soft leading-relaxed mb-8 max-w-md">{track.summary}</p>
                <div className="timeline">
                  {track.steps.map((step) => (
                    <div key={step.step} className="tl-item">
                      <span className="tl-year">Step {step.step}</span>
                      <h3>{step.title}</h3>
                      <p>{step.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Response commitment */}
      <section className="section-dark section-tight">
        <div className="wrap">
          <div className="quote-block max-w-2xl mx-auto text-center">
            <span className="mark">&ldquo;</span>
            <blockquote>{qualityCompliance.responseCommitment}</blockquote>
            <cite>Our response commitment, every quote and every case</cite>
            <div className="mt-7">
              <Link className="btn btn-outline" href="/contact?type=quote">
                Request a Quote <ArrowRight />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Operating footprint & hospital line */}
      <section className="section">
        <div className="wrap">
          <span className="eyebrow">{globalFootprint.sectionTag}</span>
          <h2 className="mb-3">{globalFootprint.title}</h2>
          <p className="font-serif text-xl md:text-2xl font-semibold text-ink max-w-3xl mb-4">
            {globalFootprint.lead}
          </p>
          <p className="lead-block text-ink-soft mb-10">{globalFootprint.description}</p>

          <div className="grid-2 mb-14">
            {globalFootprint.hubs.map((hub) => (
              <div key={hub.id} className="info-card">
                <span className="text-xs font-semibold uppercase tracking-wide text-accent-dark block mb-2">
                  {hub.region}
                </span>
                <h3 className="font-sans text-lg font-bold text-ink mb-2">{hub.entity}</h3>
                <p className="text-sm text-ink-soft leading-relaxed mb-3">{hub.desc}</p>
                <p className="text-sm text-muted leading-relaxed m-0">{hub.address}</p>
              </div>
            ))}
          </div>

          <div className="mb-4">
            <h3 className="font-sans text-lg font-bold">{globalFootprint.essentialLineTitle}</h3>
            <p className="text-xs text-muted italic mt-1 mb-3">{globalFootprint.essentialLineTagline}</p>
            <p className="lead-block text-ink-soft mb-10">{globalFootprint.subtext}</p>
          </div>

          <div className="grid-3 mb-14">
            {globalFootprint.categories.map((cat, idx) => (
              <div key={cat.name} className="pillar">
                <span className="num">0{idx + 1}</span>
                <h3>{cat.name}</h3>
                {cat.items.map((item) => (
                  <p key={item.title}>
                    <strong className="text-ink">{item.title}</strong> {item.desc}
                  </p>
                ))}
              </div>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
            <Link href="/catalog" className="btn btn-primary">
              {globalFootprint.ctaExplore} <ArrowRight />
            </Link>
            <Link href="/contact?type=quote" className="btn btn-outline on-light">
              {globalFootprint.ctaQuote}
            </Link>
          </div>
        </div>
      </section>

      {/* Our Brands — every brand listed has at least one live product in catalogData.json. */}
      <section className="section section-line section-white">
        <div className="wrap">
          <div className="grid-2 items-start">
            <div className="heading-lg">
              <span className="eyebrow">{ourBrands.sectionTag}</span>
              <h2 className="mb-0">{ourBrands.title}</h2>
            </div>
            <div className="lead-block">
              <p className="text-ink-soft leading-relaxed m-0">{ourBrands.lead}</p>
            </div>
          </div>

          <div className="overflow-x-auto mt-14">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="border-b border-line">
                  <th className="py-3 pr-6 text-xs font-semibold uppercase tracking-wide text-muted">Brand</th>
                  <th className="py-3 text-xs font-semibold uppercase tracking-wide text-muted">Product Line</th>
                </tr>
              </thead>
              <tbody>
                {ourBrands.items.map((item) => (
                  <tr key={item.brand} className="border-b border-line">
                    <td className="py-4 pr-6 align-top whitespace-nowrap font-poppins text-[15px] font-semibold text-ink">
                      {item.brand}
                    </td>
                    <td className="py-4 align-top text-sm text-ink-soft leading-relaxed">{item.line}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-10">
            <Link
              href={ourBrands.ctaHref}
              className="inline-flex items-center gap-1.5 no-underline text-sm font-semibold text-accent-dark hover:underline"
            >
              {ourBrands.ctaText} <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* UN Global Compact teaser — the fuller content lives on the Global Network page. */}
      <section className="section section-tight section-white">
        <div className="wrap">
          <div className="section-dark rounded-3xl px-8 py-16">
            <div className="grid-2 items-center">
              <div className="heading-lg">
                <span className="eyebrow on-dark text-[#f8ae85]">{globalCompact.sectionTag}</span>
                <h2 className="mb-0">{globalCompact.title}</h2>
              </div>
              <div>
                <p>{globalCompact.body}</p>
                <Link
                  href={globalCompact.ctaHref}
                  className="inline-flex items-center gap-1.5 no-underline text-sm font-semibold text-accent hover:underline"
                >
                  {globalCompact.ctaText} <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quality & Compliance — product-level, no blanket guarantees */}
      <section className="section section-line section-white">
        <div className="wrap">
          <div className="grid-2 items-start">
            <div className="heading-lg">
              <span className="eyebrow">{qualityCompliance.sectionTag}</span>
              <h2 className="mb-0">{qualityCompliance.title}</h2>
            </div>
            <div className="lead-block">
              <p className="text-ink-soft leading-relaxed m-0">{qualityCompliance.lead}</p>
            </div>
          </div>

          <div className="grid-3 mt-14">
            {qualityCompliance.points.map((point, idx) => {
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
            <Link href="/quality" className="btn btn-primary">
              See how we document quality and compliance <ArrowRight />
            </Link>
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
              <Link href="/global-network" className="btn btn-outline on-light">
                See our operating footprint
              </Link>
            </div>
          </div>

          <FaqAccordion questions={faq.questions} />
        </div>
      </section>
    </div>
  );
}
