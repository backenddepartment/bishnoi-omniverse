'use client';

import { useEffect } from 'react';
import Script from 'next/script';
import { GA_MEASUREMENT_ID, gtagEvent } from '@/lib/gtag';

/**
 * The Google tag (GA4), loaded after the page is interactive so it never delays first paint.
 * Renders nothing unless NEXT_PUBLIC_GA_MEASUREMENT_ID is set (see lib/gtag.ts). Page views,
 * including client-side navigations, are recorded by GA4's enhanced measurement; WhatsApp clicks
 * are sent from here as a key event.
 */
export function GoogleAnalytics() {
  useEffect(() => {
    if (!GA_MEASUREMENT_ID) return;
    const onClick = (e: MouseEvent) => {
      const link = (e.target as Element | null)?.closest?.('a[href]') as HTMLAnchorElement | null;
      if (!link) return;
      if (/(^|\/\/)(wa\.me|api\.whatsapp\.com|chat\.whatsapp\.com)\b|^whatsapp:/.test(link.href)) {
        gtagEvent('whatsapp_click', { link_url: link.href, page_path: window.location.pathname });
      }
    };
    document.addEventListener('click', onClick, true);
    return () => document.removeEventListener('click', onClick, true);
  }, []);

  if (!GA_MEASUREMENT_ID) return null;
  return (
    <>
      <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`} strategy="afterInteractive" />
      <Script id="ga4-init" strategy="afterInteractive">
        {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${GA_MEASUREMENT_ID}');`}
      </Script>
    </>
  );
}
