'use client';

import { useCallback, useEffect, useState } from 'react';
import { ANALYTICS_ENDPOINT } from '@/lib/analytics';
import { Dashboard } from './Dashboard';
import { AdminBackdrop, LoginScreen, useAdminTheme } from './LoginScreen';

const TOKEN_KEY = 'bo-admin-session';

export interface AdminSession {
  token: string;
  username: string;
  expiresAt: number;
}

function loadSession(): AdminSession | null {
  try {
    const saved = JSON.parse(window.sessionStorage.getItem(TOKEN_KEY) ?? 'null') as AdminSession | null;
    return saved && saved.expiresAt > Date.now() ? saved : null;
  } catch {
    return null;
  }
}

function saveSession(session: AdminSession | null) {
  try {
    if (session) window.sessionStorage.setItem(TOKEN_KEY, JSON.stringify(session));
    else window.sessionStorage.removeItem(TOKEN_KEY);
  } catch {
    /* Storage blocked: the session then lasts as long as the page. */
  }
}

/**
 * Sign-in gate for the dashboard. The token lives in sessionStorage, so closing the tab signs out;
 * the Worker also expires it after 12 hours.
 */
export function AdminApp({ productNames }: { productNames: Record<string, string> }) {
  const [session, setSession] = useState<AdminSession | null>(null);
  const [ready, setReady] = useState(false);
  const [theme, toggleTheme] = useAdminTheme();

  useEffect(() => {
    setSession(loadSession());
    setReady(true);
  }, []);

  const signOut = useCallback(() => {
    saveSession(null);
    setSession(null);
  }, []);

  if (!ready) return <div className="min-h-screen bg-[#121216]" />;

  if (!ANALYTICS_ENDPOINT) {
    return (
      <AdminBackdrop theme={theme}>
        <div className="relative w-full max-w-md rounded-[28px] border border-[color:var(--a-edge)] bg-[var(--a-card)] p-9 text-center">
          <h1 className="text-[22px] font-semibold text-[color:var(--a-text)]">Analytics is not connected</h1>
          <p className="mt-3 text-[14px] leading-relaxed text-[color:var(--a-muted)]">
            Set <code className="rounded bg-[var(--a-hover)] px-1.5 py-0.5 text-[13px] text-[color:var(--a-text)]">NEXT_PUBLIC_ANALYTICS_ENDPOINT</code> to
            the analytics Worker&apos;s address and rebuild the site. The steps are in{' '}
            <strong className="text-[color:var(--a-text)]">docs/analytics.md</strong>.
          </p>
        </div>
      </AdminBackdrop>
    );
  }

  if (!session) {
    return (
      <LoginScreen
        theme={theme}
        onToggleTheme={toggleTheme}
        onSignedIn={(next) => {
          saveSession(next);
          setSession(next);
        }}
      />
    );
  }

  return <Dashboard session={session} onSignOut={signOut} productNames={productNames} />;
}
