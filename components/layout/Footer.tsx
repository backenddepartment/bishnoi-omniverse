import React from 'react';
import Link from 'next/link';
import { Cross } from 'lucide-react';
import homepageData from '@/lib/data/homepageData.json';

export const Footer: React.FC = () => {
  const { brand } = homepageData;

  return (
    <footer className="site-footer mt-auto">
      <div className="wrap">
        <div className="footer-grid">
          <div>
            <Link href="/" className="flex items-center gap-2.5 mb-4 text-white no-underline">
              <Cross className="w-5 h-5 text-accent" strokeWidth={2.5} />
              <span className="font-sans text-[15px] font-bold tracking-wide text-white">
                {brand.name}
              </span>
            </Link>
            <p>
              {brand.tagline} — reliable hospital essentials and specialty cancer treatments,
              sourced globally and delivered locally from our hubs in India and the Philippines.
            </p>
            <p className="text-xs italic !text-[#8f8877]">{brand.affiliation}</p>
          </div>

          <div>
            <h4>Company</h4>
            <ul>
              <li><Link href="/about">Our Story</Link></li>
              <li><Link href="/global">Global Presence</Link></li>
              <li><Link href="/about#values">Vision &amp; Values</Link></li>
              <li><Link href="/contact">Governance &amp; Standards</Link></li>
            </ul>
          </div>

          <div>
            <h4>Businesses</h4>
            <ul>
              <li><Link href="/catalog">Hospital Supplies</Link></li>
              <li><Link href="/contact?type=find-medicine">Specialty Pharmaceuticals</Link></li>
              <li><Link href="/global">The Getmeds Ecosystem</Link></li>
              <li><Link href="/global">Naresh Bishnoi Trust</Link></li>
            </ul>
          </div>

          <div>
            <h4>Contact</h4>
            <ul>
              <li><a href={`mailto:${brand.email}`}>{brand.email}</a></li>
              <li className="!text-[#d7d2c1]">{brand.phone}</li>
              <li><Link href="/contact">Get in touch</Link></li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} Bishnoi Omniverse LLP. All rights reserved.</span>
          <span>A proud member of the Bishnoi Group</span>
        </div>
      </div>
    </footer>
  );
};
