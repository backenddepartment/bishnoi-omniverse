import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Mail, MapPin, Phone } from 'lucide-react';
import homepageData from '@/lib/data/homepageData.json';
import { telHref } from '@/lib/contactChannels';
import logo from '@/app/assets/logo.webp';

export const Footer: React.FC = () => {
  const { brand } = homepageData;

  return (
    <footer className="site-footer mt-auto">
      <div className="wrap">
        <div className="footer-grid">
          <div>
            <Link href="/" className="inline-flex items-center mb-5 no-underline">
              {/* brightness-0 invert flattens the colour logo to a white silhouette for the orange footer. */}
              <Image src={logo} alt={brand.name} className="h-14 w-auto brightness-0 invert" />
            </Link>
            <p>
              Hospital-grade medical supplies and hard-to-source specialty medicines, sourced
              through our India and Philippines hubs and delivered to healthcare providers
              worldwide.
            </p>
            <p className="text-xs italic !text-white">{brand.affiliation}</p>
          </div>

          <div>
            <h4>Company</h4>
            <ul>
              <li><Link href="/about">Our Story</Link></li>
              <li><Link href="/about/leadership">Leadership</Link></li>
              <li><Link href="/global-network">Global Network</Link></li>
              <li><Link href="/global">Group Structure</Link></li>
              <li><Link href="/about/vision-values">Vision &amp; Values</Link></li>
              <li><Link href="/about/governance">Governance &amp; Standards</Link></li>
              <li><Link href="/faq">FAQ</Link></li>
            </ul>
          </div>

          <div>
            <h4>What We Supply</h4>
            <ul>
              <li><Link href="/medical-equipment">Hospital Supplies</Link></li>
              <li><Link href="/contact?type=find-medicine">Specialty &amp; Named-Patient Medicines</Link></li>
              <li><Link href="/trade-partners">Trade &amp; Partners</Link></li>
              <li><Link href="/quality">Quality &amp; Compliance</Link></li>
              <li><Link href="/contact?type=quote">Request a Quote</Link></li>
            </ul>
          </div>

          <div>
            <h4>Contact</h4>
            {/* Each detail beside its icon in a soft white disc. */}
            <ul className="footer-contact">
              {brand.phones.map((phone) => (
                <li key={phone}>
                  <span className="footer-contact-icon" aria-hidden="true">
                    <Phone strokeWidth={1.75} />
                  </span>
                  <a href={telHref(phone)}>{phone}</a>
                </li>
              ))}
              {brand.emails.map((email) => (
                <li key={email}>
                  <span className="footer-contact-icon" aria-hidden="true">
                    <Mail strokeWidth={1.75} />
                  </span>
                  <a href={`mailto:${email}`}>{email}</a>
                </li>
              ))}
              <li>
                <span className="footer-contact-icon" aria-hidden="true">
                  <MapPin strokeWidth={1.75} />
                </span>
                <address className="not-italic">{brand.address}</address>
              </li>
              <li className="is-link">
                <Link href="/contact">Get in touch</Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} Bishnoi Omniverse LLP. All rights reserved.</span>
          <span>
            A proud member of the Bishnoi Group · <Link href="/site-map">Sitemap</Link>
          </span>
        </div>
      </div>
    </footer>
  );
};
