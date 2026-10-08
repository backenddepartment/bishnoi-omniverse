'use client';

import React from 'react';
import { LazyMotion } from 'framer-motion';
import { usePathname } from 'next/navigation';
import { Header } from './Header';
import { Footer } from './Footer';
import { MessagingButtons } from '@/components/MessagingButtons';
import { QuoteFab } from '@/components/quote/QuoteFab';

/**
 * Routes that render standalone, with no navbar and no footer. Matched by prefix.
 * The coming-soon pages are dead ends by design: the only way onward is their own button,
 * so site chrome would just offer the visitor a menu they already came from. The analytics
 * dashboard (/admin) is a back-office tool with its own header.
 */
const BARE_ROUTES = ['/coming-soon', '/admin'];

// The animation features behind every `m.*` component (header menus, FAQ answers), fetched as a
// separate chunk once the page is up instead of in the first-load bundle.
const loadMotionFeatures = () => import('@/lib/motionFeatures').then((mod) => mod.default);

/**
 * Wraps the app so the header and footer can be dropped per route. `children` stays a server
 * component — it is passed through as a prop, so this client boundary does not pull the page
 * tree onto the client.
 */
export function SiteChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() ?? '';

  if (BARE_ROUTES.some((route) => pathname.startsWith(route))) {
    return <LazyMotion features={loadMotionFeatures}>{children}</LazyMotion>;
  }

  return (
    <LazyMotion features={loadMotionFeatures}>
      {/* First thing a keyboard reaches: jumps past the navigation. Hidden until focused. */}
      <a href="#main" className="skip-link">
        Skip to content
      </a>
      <Header />
      {/* Content that slides in from the right (<FadeIn from="right">) waits 64px past the edge of
          the page until it scrolls into view. Clipping sideways here stops that from widening the
          page; `clip` rather than `hidden`, so sticky elements inside keep working. */}
      <main id="main" tabIndex={-1} className="flex-grow overflow-x-clip outline-none">{children}</main>
      <Footer />
      <QuoteFab />
      <MessagingButtons />
    </LazyMotion>
  );
}
