import React from 'react';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { CardSlider } from '@/components/CardSlider';
import omniverseLogo from '@/app/assets/logo.png';
import getmedsLogo from '@/app/assets/getmedslogo.png';
import foundationLogo from '@/app/assets/nblogo.png';
import founderImg from '@/app/assets/CEO.png';
import sameenImg from '@/app/assets/sirsameen.png';
import sumitImg from '@/app/assets/sirsumit.png';
import chiImg from '@/app/assets/maamchi.png';
import debbieImg from '@/app/assets/maamdebbie.png';

/**
 * The Bishnoi Group section on Group Structure: the headline and the leadership avatars on the
 * left, and the Group's three businesses as portrait cards on the right, running off the edge of
 * the page. The cards scroll sideways in a <CardSlider>.
 */

/* ---------- Avatars ---------- */

type Face = {
  name: string;
  src: string;
  /** Image height divided by its width. */
  ratio: number;
  /** Where the face sits in the image, as fractions of its width and height. */
  x: number;
  y: number;
  /** Image width as a multiple of the avatar's, so the face fills the frame. */
  zoom: number;
};

/** The leadership portraits are full-figure cut-outs, so each is zoomed in on the face. */
const FACES: Face[] = [
  { name: 'Naresh Bishnoi', src: founderImg.src, ratio: 1, x: 0.53, y: 0.2, zoom: 2.7 },
  { name: 'Sameen Bishnoi', src: sameenImg.src, ratio: 1, x: 0.49, y: 0.15, zoom: 2.7 },
  { name: 'Sumit Bishnoi', src: sumitImg.src, ratio: 1.5, x: 0.5, y: 0.15, zoom: 2 },
  { name: 'Esther Roselle Chong', src: chiImg.src, ratio: 1.5, x: 0.5, y: 0.17, zoom: 2 },
  { name: 'Dhebbie Valerie B. Rillera', src: debbieImg.src, ratio: 1.5, x: 0.5, y: 0.17, zoom: 2 },
];

function Avatar({ face }: { face: Face }) {
  return (
    <span className="ap-group-avatar">
      <img
        src={face.src}
        alt=""
        loading="lazy"
        draggable={false}
        style={{
          width: `${face.zoom * 100}%`,
          left: `${50 - face.x * face.zoom * 100}%`,
          top: `${50 - face.y * face.zoom * face.ratio * 100}%`,
        }}
      />
    </span>
  );
}

/* ---------- Cards ---------- */

type Business = {
  key: 'omniverse' | 'getmeds' | 'foundation';
  name: string;
  area: string;
  text: string;
  detail: string;
  href: string;
  logo: string;
  logoAlt: string;
};

const BUSINESSES: Business[] = [
  {
    key: 'omniverse',
    name: 'Bishnoi Omniverse',
    area: 'Healthcare supply',
    text: 'Supplies hospitals, clinics and healthcare projects.',
    detail: 'Hospital supplies & specialty medicines',
    href: '/about',
    logo: omniverseLogo.src,
    logoAlt: 'Bishnoi Omniverse logo',
  },
  {
    key: 'getmeds',
    name: 'Getmeds Network',
    area: 'Access to medicines',
    text: 'Supplies medicines across the Group’s markets.',
    detail: 'Philippines, India, Pacific, Latin America & Southeast Asia',
    href: '/global-network',
    logo: getmedsLogo.src,
    logoAlt: 'Getmeds logo',
  },
  {
    key: 'foundation',
    name: 'Naresh Bishnoi Foundation',
    area: 'Community work',
    text: 'Leads the Group’s community work.',
    detail: 'Kept separate from the Group’s commercial work',
    href: '/coming-soon/naresh-bishnoi-foundation',
    logo: foundationLogo.src,
    logoAlt: 'Naresh Bishnoi Foundation logo',
  },
];

function BusinessCard({ business }: { business: Business }) {
  return (
    <Link href={business.href} className={`ap-group-card is-${business.key}`} draggable={false}>
      <span className="ap-group-card-art">
        <img src={business.logo} alt={business.logoAlt} loading="lazy" draggable={false} />
      </span>
      <span className="ap-group-card-body">
        <span className="ap-group-card-top">
          <span>
            <span className="ap-group-card-name">{business.name}</span>
            <span className="ap-group-card-area">{business.area}</span>
          </span>
          <span className="ap-group-card-go" aria-hidden="true">
            <ArrowUpRight strokeWidth={2.25} />
          </span>
        </span>
        <span className="ap-group-card-text">{business.text}</span>
        <span className="ap-group-card-detail">{business.detail}</span>
      </span>
    </Link>
  );
}

/* ---------- Section ---------- */

export function GroupShowcase() {
  return (
    <section className="section section-white ap-group">
      <div className="ap-group-inner">
        <div className="ap-group-copy">
          <div className="heading-lg ap-head">
            <span className="eyebrow">The Bishnoi Group</span>
            <h2>One Group, Three Areas of Work</h2>
          </div>
          <div className="ap-group-people">
            <span className="ap-group-avatars" aria-hidden="true">
              {FACES.map((face) => (
                <Avatar key={face.name} face={face} />
              ))}
            </span>
            <p>Led by Naresh Bishnoi, Sameen Bishnoi, Sumit Bishnoi, and others.</p>
          </div>
        </div>

        <CardSlider label="The Bishnoi Group’s three businesses" className="ap-group-slider" arrows>
          {BUSINESSES.map((business) => (
            <BusinessCard key={business.key} business={business} />
          ))}
        </CardSlider>
      </div>
    </section>
  );
}
