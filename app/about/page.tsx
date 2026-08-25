import React from 'react';
import Link from 'next/link';
import { ArrowRight, Globe2, ShieldCheck, Clock } from 'lucide-react';
import businessesData from '@/lib/data/businessesData.json';
import homepageData from '@/lib/data/homepageData.json';

const IMG = {
  hero: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f9/A_waiting_room_at_a_medical_healthcare_clinic%2C_doctor%27s_office%2C_hospital.jpg/1600px-A_waiting_room_at_a_medical_healthcare_clinic%2C_doctor%27s_office%2C_hospital.jpg',
  lab: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a0/Facial_plastic_surgeon_wearing_surgical_loupes_and_headlight_during_an_operating_room_procedure.jpg/1200px-Facial_plastic_surgeon_wearing_surgical_loupes_and_headlight_during_an_operating_room_procedure.jpg',
};

export default function AboutPage() {
  const { vision } = businessesData;
  const { whyTrustUs, realProblem } = homepageData;
  const icons = [Globe2, ShieldCheck, Clock];

  return (
    <div className="w-full">
      <section className="page-hero">
        <div className="hero-media">
          <img src={IMG.hero} alt="A calm, modern healthcare facility" loading="eager" />
        </div>
        <div className="hero-content">
          <span className="eyebrow on-dark">Our Story</span>
          <h1>{vision.title}</h1>
        </div>
      </section>

      <section className="section section-tight">
        <div className="wrap grid-2">
          <div>
            <span className="eyebrow">Where We Started</span>
            <h2 className="mb-0">{realProblem.title}</h2>
          </div>
          <div className="lead-block">
            <p className="font-serif text-xl font-semibold text-ink leading-snug mb-4">{vision.lead}</p>
            <p className="text-ink-soft leading-relaxed">{vision.paragraph}</p>
          </div>
        </div>
      </section>

      <section className="section section-line section-2col">
        <div className="wrap">
          <div className="grid-2">
            <div>
              <span className="eyebrow">How We Operate</span>
              <h2 className="mb-3">Principles We Don&apos;t Compromise On</h2>
              <p className="text-ink-soft max-w-md">
                Every division we build — from pharmaceuticals to hospital logistics — answers to the
                same three commitments.
              </p>
            </div>
            <img src={IMG.lab} alt="Specialist care in a modern operating room" className="w-full h-[320px] object-cover rounded" />
          </div>

          <div id="values" className="grid-3 mt-14">
            {whyTrustUs.points.map((point, idx) => {
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

      <section className="section-dark section-tight">
        <div className="wrap text-center max-w-2xl mx-auto">
          <span className="eyebrow on-dark">Partner With Us</span>
          <h2>Building the world&apos;s most trusted supply line for medicine that can&apos;t wait.</h2>
          <p className="mt-2 mb-8">
            Whether you run a hospital, treat patients, or manufacture the medicines the world needs —
            our team is ready to talk.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/contact" className="btn btn-primary">
              Get In Touch <ArrowRight />
            </Link>
            <Link href="/global" className="btn btn-outline">
              See Our Global Businesses
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
