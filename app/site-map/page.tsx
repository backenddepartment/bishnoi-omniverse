import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { SITEMAP_PAGES, type SitemapPage } from '@/lib/sitemapPages';

export const metadata: Metadata = {
  title: 'Sitemap | Bishnoi Omniverse',
  description: 'Every page on the Bishnoi Omniverse website in one place: company pages, About Us and the full medical equipment catalog.',
};

const GROUPS: { key: SitemapPage['group']; title: string }[] = [
  { key: 'Main', title: 'Main Pages' },
  { key: 'Company', title: 'Company' },
  { key: 'About Us', title: 'About Us' },
  { key: 'Products', title: 'Medical Equipment' },
];

/** HTML sitemap: the same page list as sitemap.xml, grouped for people rather than crawlers. */
export default function SiteMapPage() {
  return (
    <div className="w-full">
      <section className="section section-white">
        <div className="wrap">
          <div className="heading-lg">
            <span className="eyebrow">Sitemap</span>
            <h1 className="font-poppins text-[clamp(32px,3.6vw,48px)] font-semibold leading-tight text-ink m-0">
              Every Page in One Place
            </h1>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-3">
            {GROUPS.map((group) => {
              const pages = SITEMAP_PAGES.filter((p) => p.group === group.key);
              if (pages.length === 0) return null;
              return (
                <nav
                  key={group.key}
                  aria-label={group.title}
                  className={group.key === 'Products' ? 'md:col-span-2 lg:col-span-3' : ''}
                >
                  <h2 className="font-poppins text-xl font-semibold text-ink mb-4">{group.title}</h2>
                  <ul
                    className={`m-0 p-0 list-none grid gap-x-8 gap-y-2.5 ${
                      group.key === 'Products' ? 'sm:grid-cols-2 lg:grid-cols-3' : ''
                    }`}
                  >
                    {pages.map((page) => (
                      <li key={page.path}>
                        <Link href={page.path} className="text-ink-soft hover:text-accent no-underline">
                          {page.title}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </nav>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
