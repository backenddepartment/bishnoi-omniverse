/**
 * Google Analytics 4, alongside the site's own analytics (lib/analytics.ts). The Measurement ID
 * (G-XXXXXXXXXX) is public and baked in at build time: the GitHub repository variable
 * GA_MEASUREMENT_ID in CI, .env.local when developing. With none set, the Google tag is not loaded
 * at all and gtagEvent does nothing.
 *
 * Key events sent from the site (mark both as Key events in GA4 > Admin > Events):
 *   generate_lead    an inquiry or quote request was sent successfully (lib/inquiry.ts)
 *   whatsapp_click   a WhatsApp link was clicked (components/layout/GoogleAnalytics.tsx)
 */
export const GA_MEASUREMENT_ID = (process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID ?? '').trim();

type Gtag = (command: 'event', name: string, params?: Record<string, string | number>) => void;

export function gtagEvent(name: string, params?: Record<string, string | number>) {
  if (!GA_MEASUREMENT_ID || typeof window === 'undefined') return;
  const gtag = (window as unknown as { gtag?: Gtag }).gtag;
  gtag?.('event', name, params);
}
