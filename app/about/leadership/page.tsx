import React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import contactData from '@/lib/data/contactData.json';

const IMG = {
  hero: 'https://upload.wikimedia.org/wikipedia/commons/a/a0/Facial_plastic_surgeon_wearing_surgical_loupes_and_headlight_during_an_operating_room_procedure.jpg',
};

export default function LeadershipPage() {
  const { locations } = contactData.globalOffices;

  return (
    <div className="w-full">
      <section className="page-hero">
        <div className="hero-media">
          <img src={IMG.hero} alt="Leadership guiding hospital procurement worldwide" loading="eager" />
        </div>
        <div className="hero-content">
          <span className="eyebrow on-dark">About Us</span>
          <h1>Leadership</h1>
          <p className="lede">The people and regional teams steering Bishnoi Omniverse&apos;s global supply mission.</p>
        </div>
      </section>

      <section className="section-tight">
        <div className="wrap grid-2">
          <div>
            <span className="eyebrow">Founder</span>
            <h2 className="mb-0">Naresh Bishnoi</h2>
          </div>
          <div className="lead-block">
            <p className="font-serif text-xl font-semibold text-ink leading-snug mb-4">
              Founder &amp; Chairman, Bishnoi Group
            </p>
            <p className="text-ink-soft leading-relaxed">
              A proud member of the Bishnoi Group, Naresh Bishnoi founded the Omniverse ecosystem to close the
              gap between the world&apos;s medical resources and the hospitals and patients who need them most —
              spanning healthcare infrastructure, pharmaceutical access, global logistics, and social
              philanthropy across borders.
            </p>
          </div>
        </div>
      </section>

      <section className="section section-line section-2col">
        <div className="wrap">
          <span className="eyebrow">Regional Leadership</span>
          <h2 className="mb-10">Two Hubs, Led Locally</h2>

          <div className="grid-2">
            {locations.map((office) => (
              <div key={office.region} className="info-card">
                <h3 className="font-sans text-lg font-bold text-ink mb-1">{office.region}</h3>
                <div className="text-sm font-semibold text-ink-soft mb-3">{office.entity}</div>
                <p className="text-sm text-ink-soft leading-relaxed">
                  Overseen by a dedicated regional leadership team responsible for sourcing, regulatory
                  compliance, and hospital partnerships across the territory.
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-dark section-tight">
        <div className="wrap text-center max-w-2xl mx-auto">
          <span className="eyebrow on-dark">Partner With Us</span>
          <h2>Building the world&apos;s most trusted supply line for medicine that can&apos;t wait.</h2>
          <div className="flex flex-wrap justify-center gap-4 mt-8">
            <Link href="/contact" className="btn btn-primary">
              Get In Touch <ArrowRight />
            </Link>
            <Link href="/about" className="btn btn-outline">
              Read Our Story
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
