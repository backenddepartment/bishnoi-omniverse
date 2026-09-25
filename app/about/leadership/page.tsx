import React from 'react';
import type { Metadata } from 'next';
import founderImg from '@/app/assets/CEO.png';
import heroImg from '@/app/assets/leadershipbghero.png';
import experienceBg from '@/app/assets/experience.png';
import { ArrowRight } from 'lucide-react';
import { FadeIn } from '@/components/FadeIn';
import {
  PatternSection,
  Prose,
  SectionHead,
} from '@/components/about/Patterns';
import { LeaderGrid, type Leader } from '@/components/about/leadership/LeaderCard';

export const metadata: Metadata = {
  title: 'Leadership | Bishnoi Omniverse',
  description:
    'The people behind Bishnoi Omniverse and what they are accountable for, from choosing suppliers to making sure every commitment to a customer is kept.',
};

/**
 * Further leadership profiles (round photo, name, title, LinkedIn). The design guide calls for 2–4
 * more, to be supplied — the grid under the founder profile only renders once this has entries.
 */
const LEADERS: Leader[] = [];

/** Our Commitment: one promise per audience, listed beside the heading. */
const COMMITMENTS = [
  {
    title: 'Customers',
    text: 'To customers, we promise honest answers, including when a product cannot be sourced to your specification.',
  },
  { title: 'Suppliers', text: 'To suppliers, we promise clear requirements and fair communication.' },
  { title: 'Partners', text: 'To every partner, we promise to follow through on what we agree.' },
];

export default function LeadershipPage() {
  return (
    <div className="w-full">
      {/* Slide hero, the same band as About Us: a designed 1920×1080 slide that carries its own
          headline, shown whole at every width. The page heading is kept for screen readers. */}
      <section className="page-hero page-hero-slide">
        <div className="hero-media">
          <img
            src={heroImg.src}
            alt="Leadership: the people and regional teams steering Bishnoi Omniverse's global supply mission. Founder Naresh Bishnoi, and leaders walking past stacked medical supply cartons"
            loading="eager"
          />
        </div>
        <h1 className="sr-only">Leadership — Experienced Leadership, Accountable for Every Order</h1>
      </section>

      {/* 1 · Our Leadership — P6 founder profile, on white. No bottom padding: the Our Experience
          slide below butts straight up against it. */}
      <PatternSection tone="white" className="!pb-0">
        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] lg:gap-16">
          <FadeIn from="left">
            <img
              src={founderImg.src}
              alt="Naresh Bishnoi, Founder and Chairman of the Bishnoi Group"
              // The portrait is a cut-out with a transparent background; the soft fill gives the
              // rounded frame an edge against the paper section.
              className="mx-auto block w-full aspect-[4/5] object-cover object-top rounded-2xl bg-paper-2"
              style={{ maxWidth: 460 }}
              loading="lazy"
            />
          </FadeIn>
          <div>
            <span className="eyebrow">Our Leadership</span>
            <h2 className="font-poppins text-[clamp(32px,3.6vw,48px)] font-semibold leading-tight text-ink mt-3 mb-2">
              Naresh Bishnoi
            </h2>
            <p className="font-poppins text-xl font-semibold text-accent leading-snug mb-6">
              Founder and Chairman
            </p>
            <Prose
              paras={[
                'Naresh Bishnoi founded the Bishnoi Group and the Omniverse business with one aim. He wanted to connect medical products with the hospitals and patients who need them. His work covers healthcare supply, access to medicines, logistics and community work.',
                'Under his leadership, Bishnoi Omniverse built its two-hub model, pairing sourcing strength in India with local service in the Philippines. He has led the Group’s part in the UN Global Compact since November 2024. He also represents the Group at regional events, such as the UN Global Compact Asia-Pacific conference in Colombo, Sri Lanka, in 2026.',
              ]}
            />
          </div>
        </div>
        <LeaderGrid leaders={LEADERS} />
      </PatternSection>

      {/* 2 · Our Experience — the designed 1920×1080 slide is the whole section background: photo
          tiles and an orange sweep on its right half, so the copy keeps to the white left half.
          On phones the copy sits above and the slide shows whole beneath it. */}
      <section className="section experience-section" style={{ backgroundImage: `url(${experienceBg.src})` }}>
        <div className="wrap">
          <div className="experience-copy">
            <SectionHead eyebrow="Our Experience" title="Experience Across Medicines, Supplies and Borders" />
            <Prose
              paras={[
                'Our leaders bring experience from across the Bishnoi Group. This includes the Getmeds network’s work supplying medicines in several countries, and experience in sourcing, trade and shipping across borders.',
                'That experience means we understand both sides of every order. We know what manufacturers need in order to quote accurately, and we know what hospital procurement teams need in order to approve a purchase. That is how we save you time and avoid problems with your order.',
              ]}
            />
          </div>
        </div>
      </section>

      {/* 3 · Our Commitment — heading left, the three promises as an arrowed list on the right.
          The section fades into orange at its foot so it runs straight into the footer. */}
      <section className="section section-white commitment-section">
        <div className="wrap commitment-grid">
          <SectionHead eyebrow="Our Commitment" title="Our Promise to Customers and Partners" />
          <div>
            {/* The promises stack one at a time as the section scrolls into view: Customers
                first, then Suppliers, then Partners, each rising and fading in on its own beat. */}
            <ul className="commitment-list">
              {COMMITMENTS.map((item, i) => (
                <li key={item.title}>
                  <FadeIn delay={i * 0.55} className="commitment-item">
                    <ArrowRight className="commitment-arrow" strokeWidth={2} aria-hidden="true" />
                    <div>
                      <h3>{item.title}</h3>
                      <p>{item.text}</p>
                    </div>
                  </FadeIn>
                </li>
              ))}
            </ul>
            <Prose
              className="mt-10 max-w-3xl"
              paras={[
                'These commitments come from the top and apply to everyone on our team. If we ever fall short, we want to hear about it directly.',
              ]}
            />
          </div>
        </div>
      </section>
    </div>
  );
}
