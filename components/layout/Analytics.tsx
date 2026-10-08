'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import {
  classifyClick,
  clickLabel,
  externalReferrer,
  flush,
  heartbeat,
  HEARTBEAT_MS,
  leave,
  track,
  trackingEnabled,
  utmParams,
} from '@/lib/analytics';

/** The dashboard itself is not part of the site's traffic. */
const UNTRACKED_ROUTES = ['/admin'];

const CLICKABLE = 'a[href], button, [role="button"], [data-track], summary';

/**
 * Records page views, clicks, time on page and scroll depth for the /admin/ dashboard (see
 * lib/analytics.ts). Renders nothing. Mounted once in the root layout, so it sees every route and
 * every client-side navigation.
 */
export function Analytics() {
  const pathname = usePathname() ?? '/';
  const page = useRef<{ path: string; visibleMs: number; since: number | null; scroll: number; sent: boolean } | null>(
    null
  );
  const firstView = useRef(true);

  const untracked = UNTRACKED_ROUTES.some((route) => pathname.startsWith(route));

  // Time on the current page counts only while the tab is visible. Sent once per page view: when
  // the visitor moves to another page, or the tab is hidden (the last moment a phone reliably
  // lets a page send anything).
  const sendEngagement = () => {
    const current = page.current;
    if (!current || current.sent) return;
    const visibleMs = current.visibleMs + (current.since != null ? Date.now() - current.since : 0);
    current.sent = true;
    track({ type: 'engagement', path: current.path, value: Math.round(visibleMs / 1000), scroll: current.scroll });
  };

  // One page view per path. The ref guard stops React's development double-run from counting twice.
  useEffect(() => {
    if (untracked || !trackingEnabled()) return;
    if (page.current?.path === pathname && !page.current.sent) return;
    sendEngagement();

    page.current = {
      path: pathname,
      visibleMs: 0,
      since: document.visibilityState === 'visible' ? Date.now() : null,
      scroll: 0,
      sent: false,
    };
    // document.referrer and the UTM tags describe how the visit started, so only the first page
    // view of a page load carries them.
    const arrival = firstView.current ? { referrer: externalReferrer(), ...utmParams() } : {};
    firstView.current = false;
    // The new page's <title> is set just after navigation; wait a frame for it. Not cancelled on
    // cleanup: the guard above already skips the re-run, so cancelling would lose the view.
    requestAnimationFrame(() => {
      track({ type: 'pageview', path: pathname, title: document.title, ...arrival });
      // Sent at once rather than batched, so the dashboard shows the visitor straight away.
      flush();
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname, untracked]);

  useEffect(() => {
    if (untracked || !trackingEnabled()) return;

    const onScroll = () => {
      const current = page.current;
      if (!current) return;
      const doc = document.documentElement;
      const scrollable = doc.scrollHeight - window.innerHeight;
      const depth = scrollable <= 0 ? 100 : Math.round(((window.scrollY || doc.scrollTop) / scrollable) * 100);
      if (depth > current.scroll) current.scroll = Math.min(depth, 100);
    };

    const onVisibility = () => {
      const current = page.current;
      if (document.visibilityState === 'hidden') {
        if (current && current.since != null) {
          current.visibleMs += Date.now() - current.since;
          current.since = null;
        }
        sendEngagement();
        flush();
      } else {
        if (current && current.since == null) current.since = Date.now();
        // Back on the tab: on the online list again straight away.
        heartbeat(window.location.pathname, document.title);
      }
    };

    // "Still here" every 30 seconds while the tab is visible; a hidden tab goes quiet and drops off
    // the online list within about a minute.
    const beat = setInterval(() => {
      if (document.visibilityState === 'visible') heartbeat(window.location.pathname, document.title);
    }, HEARTBEAT_MS);
    // Closing the tab or leaving the site: off the online list at once.
    const onPageHide = () => leave();

    const onClick = (e: MouseEvent) => {
      const el = (e.target as Element | null)?.closest?.(CLICKABLE);
      if (!el || el.closest('[data-track-ignore]')) return;
      const { category, target } = classifyClick(el);
      track({ type: 'click', path: window.location.pathname, label: clickLabel(el), target, category });
      // Leaving the site, or handing off to the mail/phone/WhatsApp app: send before the page goes.
      if (category !== 'internal' && category !== 'button') flush();
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    document.addEventListener('visibilitychange', onVisibility);
    window.addEventListener('pagehide', onPageHide);
    document.addEventListener('click', onClick, true);
    return () => {
      window.removeEventListener('scroll', onScroll);
      document.removeEventListener('visibilitychange', onVisibility);
      window.removeEventListener('pagehide', onPageHide);
      clearInterval(beat);
      document.removeEventListener('click', onClick, true);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [untracked]);

  return null;
}
