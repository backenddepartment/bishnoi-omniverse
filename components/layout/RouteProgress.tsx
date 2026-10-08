'use client';

import { useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';

/**
 * YouTube-style loading line across the very top of the window, in the hero headline's orange
 * sweep. It starts when an internal link is clicked (or on back/forward), creeps towards 90% while
 * the next page loads, then fills and fades once the pathname changes.
 */
export function RouteProgress() {
  const pathname = usePathname();
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(false);
  const active = useRef(false);
  const trickle = useRef<ReturnType<typeof setInterval>>();
  const hide = useRef<ReturnType<typeof setTimeout>>();
  // The path last shown, so back/forward between #hash links on one page (the /admin/ sections)
  // does not start a bar that no page load will ever finish.
  const shownPath = useRef(pathname);
  shownPath.current = pathname;

  useEffect(() => {
    const start = () => {
      if (active.current) return;
      active.current = true;
      clearTimeout(hide.current);
      setVisible(true);
      setProgress(8);
      trickle.current = setInterval(() => {
        // Each tick closes part of the remaining gap, so it slows as it nears 90% and never stalls
        // at 100% before the page has actually arrived.
        setProgress((p) => (p < 90 ? p + (90 - p) * 0.12 : p));
      }, 200);
    };

    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = (e.target as Element | null)?.closest?.('a');
      if (!a || !a.href || a.target === '_blank' || a.hasAttribute('download')) return;
      const url = new URL(a.href, window.location.href);
      if (url.origin !== window.location.origin) return;
      // Same page (or only the #hash differs): nothing loads, so no bar.
      if (url.pathname === window.location.pathname && url.search === window.location.search) return;
      start();
    };

    const onPopState = () => {
      // usePathname drops the trailing slash that the exported URLs keep, so compare without it.
      const strip = (path: string) => path.replace(/\/+$/, '') || '/';
      if (strip(window.location.pathname) !== strip(shownPath.current ?? '')) start();
    };

    document.addEventListener('click', onClick, true);
    window.addEventListener('popstate', onPopState);
    return () => {
      document.removeEventListener('click', onClick, true);
      window.removeEventListener('popstate', onPopState);
    };
  }, []);

  // The new page is in: fill the line, then fade it out and reset.
  useEffect(() => {
    if (!active.current) return;
    active.current = false;
    clearInterval(trickle.current);
    setProgress(100);
    hide.current = setTimeout(() => {
      setVisible(false);
      hide.current = setTimeout(() => setProgress(0), 300);
    }, 250);
  }, [pathname]);

  useEffect(
    () => () => {
      clearInterval(trickle.current);
      clearTimeout(hide.current);
    },
    [],
  );

  return (
    <div
      className="route-progress"
      style={{ transform: `scaleX(${progress / 100})`, opacity: visible ? 1 : 0 }}
      aria-hidden="true"
    />
  );
}
