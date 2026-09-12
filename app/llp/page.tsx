import React from 'react';
import Link from 'next/link';
import { MapPin, Mail } from 'lucide-react';
import contactData from '@/lib/data/contactData.json';
import sectionDetail from '@/lib/data/sectionDetailData.json';

const IMG = {
  hero: 'https://upload.wikimedia.org/wikipedia/commons/d/da/Skyline_of_Cannaught_Place%2C_New_Delhi.jpg',
};

export default function LlpPage() {
  const office = contactData.globalOffices.locations.find((l) => l.region.startsWith('India'))!;
  const hub = sectionDetail.hubs.india;

  return (
    <div className="w-full">
      <section className="page-hero">
        <div className="hero-media">
          <img src={IMG.hero} alt="New Delhi, India" loading="eager" />
        </div>
        <div className="hero-content">
          <span className="eyebrow on-dark">Legal Entity</span>
          <h1>Bishnoi Omniverse LLP</h1>
          <p className="lede">Our global sourcing hub — registered and operating out of New Delhi, India.</p>
        </div>
      </section>

      <section className="section section-tight">
        <div className="wrap grid-2">
          <div>
            {/* Hub role and operational description, relocated from the homepage footprint. */}
            <span className="eyebrow">{hub.region}</span>
            <h2 className="mb-4">{hub.entity}</h2>
            <p className="text-ink-soft leading-relaxed m-0">{hub.desc}</p>
          </div>
          <div className="lead-block">
            <p className="text-ink-soft leading-relaxed mb-6">{office.desc}</p>

            <div className="info-card !p-6 space-y-4">
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                <div>
                  <span className="text-xs font-semibold uppercase tracking-wide text-muted block mb-1">Registered Address</span>
                  <span className="text-sm text-ink">{office.address}</span>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Mail className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                <div>
                  <span className="text-xs font-semibold uppercase tracking-wide text-muted block mb-1">Email</span>
                  <a href={`mailto:${office.email}`} className="text-sm text-ink hover:text-accent-dark">
                    {office.email}
                  </a>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-4 mt-8">
              <Link href="/contact" className="btn btn-primary">
                Contact This Office
              </Link>
              <Link href="/corp" className="btn btn-outline on-light">
                View Bishnoi Omniverse Corp (Philippines)
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
