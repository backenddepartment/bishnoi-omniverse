import React from 'react';
import Link from 'next/link';
import { ShieldCheck, FlaskConical, Globe2 } from 'lucide-react';
import homepageData from '@/lib/data/homepageData.json';
import sectionDetail from '@/lib/data/sectionDetailData.json';

const IMG = {
  hero: 'https://upload.wikimedia.org/wikipedia/commons/2/2e/Hospital_corridor_2.jpg',
};

export default function VisionValuesPage() {
  const { responseCommitment } = homepageData;
  const { productStandard } = sectionDetail;
  const icons = [ShieldCheck, FlaskConical, Globe2];

  return (
    <div className="w-full">
      <section className="page-hero">
        <div className="hero-media">
          <img src={IMG.hero} alt="A modern hospital corridor" loading="eager" />
        </div>
        <div className="hero-content">
          <span className="eyebrow on-dark">About Us</span>
          <h1>Vision &amp; Values</h1>
          <p className="lede">
            What we hold ourselves to, wherever in the world an order is being fulfilled — stated in
            terms a customer can check.
          </p>
        </div>
      </section>

      <section className="section-tight">
        <div className="wrap grid-2">
          <div>
            <span className="eyebrow">Our Standard</span>
            <h2 className="mb-0">{productStandard.title}</h2>
          </div>
          <div className="lead-block">
            <p className="text-ink-soft leading-relaxed">{productStandard.lead}</p>
            <p className="text-ink-soft leading-relaxed">
              Every division — pharmaceutical access or hospital logistics — answers to the same
              standard: document what you supply, and say plainly what you cannot.
            </p>
          </div>
        </div>
      </section>

      <section className="section section-line section-2col">
        <div className="wrap">
          <div className="grid-3">
            {productStandard.points.map((point, idx) => {
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

          <p className="lead-block text-ink-soft mt-12 mb-0">{responseCommitment}</p>
        </div>
      </section>

      <section className="section-dark section-tight">
        <div className="wrap text-center max-w-2xl mx-auto">
          <span className="eyebrow on-dark">Work With Us</span>
          <h2>Documented supply for the requirements that are hardest to source.</h2>
          <div className="flex flex-wrap justify-center gap-4 mt-8">
            <Link href="/contact?type=quote" className="btn btn-primary">
              Request a Quote
            </Link>
            <Link href="/quality" className="btn btn-outline">
              Quality &amp; Compliance
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
