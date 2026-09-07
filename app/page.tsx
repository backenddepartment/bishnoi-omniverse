import React from 'react';
import Link from 'next/link';
import { ArrowRight, ShieldCheck, Globe2, Clock, FlaskConical, Boxes, Truck } from 'lucide-react';
import homepageData from '@/lib/data/homepageData.json';
import { FadeIn } from '@/components/FadeIn';
import heroBg from '@/app/assets/background.png';
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

export default function HomePage() {
  const { hero, whatWeProvide, whoWeHelp, howItWorks, globalFootprint, qualityCompliance, faq } =
    homepageData;

  return (
    <div className="w-full home-page">
      {/* Hero */}
      <section className="hero" id="home">
        <div className="hero-media">
          <img src={IMG.hero} alt="Clinicians supporting a patient in recovery" loading="eager" />
        </div>
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

      {/* What We Provide — two supply lines plus the network that carries them */}
      <section className="section section-tight">
        <FadeIn className="wrap">
          <span className="eyebrow">{whatWeProvide.sectionTag}</span>
          <h2 className="mb-3">{whatWeProvide.title}</h2>
          <p className="lead-block text-ink-soft mb-12">{whatWeProvide.lead}</p>

          <div className="grid-3">
            {whatWeProvide.items.map((item) => {
              const Icon = provideIcons[item.id] || Boxes;
              return (
                <div key={item.id} className="pillar">
                  <Icon className="w-5 h-5 text-accent mb-4" strokeWidth={1.75} />
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
        </FadeIn>
      </section>

      {/* Who We Serve — image tiles */}
      <section className="section section-line section-2col !pb-10">
        <FadeIn className="wrap">
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
        </FadeIn>
      </section>

      {/* How It Works — procurement and named-patient access run as parallel tracks */}
      <section className="section !pt-10">
        <FadeIn className="wrap">
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
        </FadeIn>
      </section>

      {/* Response commitment */}
      <section className="section-dark section-tight">
        <FadeIn className="wrap">
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
        </FadeIn>
      </section>

      {/* Operating footprint & hospital line */}
      <section className="section">
        <FadeIn className="wrap">
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
        </FadeIn>
      </section>

      {/* Quality & Compliance — product-level, no blanket guarantees */}
      <section className="section section-line section-2col">
        <FadeIn className="wrap">
          <span className="eyebrow">{qualityCompliance.sectionTag}</span>
          <h2 className="mb-3">{qualityCompliance.title}</h2>
          <p className="lead-block text-ink-soft mb-12">{qualityCompliance.lead}</p>

          <div className="grid-3">
            {qualityCompliance.points.map((point, idx) => {
              const icons = [ShieldCheck, FlaskConical, Globe2];
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

          <div className="mt-10">
            <Link
              href="/quality"
              className="inline-flex items-center gap-1.5 no-underline text-sm font-semibold text-accent-dark hover:underline"
            >
              See how we document quality and compliance <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </FadeIn>
      </section>

      {/* FAQ */}
      <section className="section">
        <FadeIn className="wrap">
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

          <div className="flex flex-wrap gap-4 mt-12">
            <Link href="/contact?type=quote" className="btn btn-primary">
              Request a Quote <ArrowRight />
            </Link>
            <Link href="/global-network" className="btn btn-outline on-light">
              <Clock className="w-4 h-4" /> See our operating footprint
            </Link>
          </div>
        </FadeIn>
      </section>
    </div>
  );
}
