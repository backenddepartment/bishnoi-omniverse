'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { ANALYTICS_ENDPOINT } from '@/lib/analytics';
import { FirstPasswordScreen, type AdminUser, type Api } from './accounts';
import { Dashboard } from './Dashboard';
import { AdminBackdrop, LoginScreen, useAdminTheme } from './LoginScreen';

const TOKEN_KEY = 'bo-admin-session';

export interface AdminSession {
  token: string;
  expiresAt: number;
  user: AdminUser;
}

function loadSession(): AdminSession | null {
  try {
    const saved = JSON.parse(window.sessionStorage.getItem(TOKEN_KEY) ?? 'null') as AdminSession | null;
    // A session saved before accounts existed has no user: sign in again.
    return saved && saved.expiresAt > Date.now() && saved.user?.id ? saved : null;
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

/** Thrown by the api helper when the Worker answers 401: the sign-in has ended. */
export class SessionEnded extends Error {}

/**
 * Calls the analytics Worker as the signed-in account, with JSON in and out. Errors carry the
 * Worker's own message, ready to show.
 */
export function makeApi(token: string): Api {
  return async (path, init = {}) => {
    const res = await fetch(`${ANALYTICS_ENDPOINT}${path}`, {
      method: init.method ?? 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        ...(init.body !== undefined ? { 'Content-Type': 'application/json' } : {}),
      },
      body: init.body !== undefined ? JSON.stringify(init.body) : undefined,
      cache: 'no-store',
    });
    const body = await res.json().catch(() => ({}));
    if (res.status === 401) throw new SessionEnded('Your session has ended. Please sign in again.');
    if (!res.ok) throw new Error(body.message || `The analytics service answered ${res.status}.`);
    return body;
  };
}

/**
 * Sign-in gate for the dashboard. The token lives in sessionStorage, so closing the tab signs out;
 * the Worker also expires it after 12 hours. An account still on a temporary password chooses
 * its own before it sees the dashboard.
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

  /** A new token (after a password change) or updated account details (a new name). */
  const updateSession = useCallback((next: Partial<AdminSession>) => {
    setSession((current) => {
      if (!current) return current;
      const merged = { ...current, ...next, user: { ...current.user, ...next.user } };
      saveSession(merged);
      return merged;
    });
  }, []);

  const api = useMemo(() => (session ? makeApi(session.token) : null), [session]);

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

  if (!session || !api) {
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

  if (session.user.mustChange) {
    return <FirstPasswordScreen api={api} me={session.user} onSession={updateSession} onSignOut={signOut} />;
  }

  return (
    <Dashboard
      session={session}
      api={api}
      onSignOut={signOut}
      onSessionChange={updateSession}
      productNames={productNames}
    />
  );
}
