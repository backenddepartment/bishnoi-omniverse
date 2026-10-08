'use client';

import { useCallback, useEffect, useState } from 'react';
import { BarChart3, Loader2, Lock } from 'lucide-react';
import { ANALYTICS_ENDPOINT } from '@/lib/analytics';
import { Dashboard } from './Dashboard';

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

  useEffect(() => {
    setSession(loadSession());
    setReady(true);
  }, []);

  const signOut = useCallback(() => {
    saveSession(null);
    setSession(null);
  }, []);

  if (!ready) return <div className="min-h-screen bg-paper" />;

  if (!ANALYTICS_ENDPOINT) {
    return (
      <Shell>
        <h1 className="font-serif text-2xl font-semibold text-ink">Analytics is not connected</h1>
        <p className="mt-3 text-sm leading-relaxed text-ink-soft">
          Set <code className="rounded bg-paper-2 px-1.5 py-0.5 text-[13px]">NEXT_PUBLIC_ANALYTICS_ENDPOINT</code> to the
          analytics Worker&apos;s address and rebuild the site. The steps are in <strong>docs/analytics.md</strong>.
        </p>
      </Shell>
    );
  }

  if (!session) {
    return (
      <LoginForm
        onSignedIn={(next) => {
          saveSession(next);
          setSession(next);
        }}
      />
    );
  }

  return <Dashboard session={session} onSignOut={signOut} productNames={productNames} />;
}

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-paper px-4 py-12">
      <div className="w-full max-w-sm rounded-2xl border border-line bg-surface p-8 shadow-[0_20px_60px_-30px_rgba(15,14,12,0.35)]">
        {children}
      </div>
    </div>
  );
}

function LoginForm({ onSignedIn }: { onSignedIn: (session: AdminSession) => void }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError('');
    try {
      const res = await fetch(`${ANALYTICS_ENDPOINT}/admin/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      const body = await res.json().catch(() => ({}));
      if (!res.ok || !body.token) {
        setError(body.message || 'Could not sign in. Please try again.');
        return;
      }
      onSignedIn({ token: body.token, username: body.username, expiresAt: body.expiresAt });
    } catch {
      setError('Could not reach the analytics service. Check your connection and try again.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <Shell>
      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-accent-tint text-accent-dark">
        <BarChart3 className="h-5 w-5" aria-hidden="true" />
      </div>
      <h1 className="mt-5 font-serif text-2xl font-semibold text-ink">Site analytics</h1>
      <p className="mt-1.5 text-sm text-muted">Sign in to see visits, clicks and inquiries.</p>

      <form onSubmit={submit} className="mt-7 space-y-4">
        <label className="block">
          <span className="text-[13px] font-medium text-ink-soft">Username</span>
          <input
            type="text"
            autoComplete="username"
            required
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="mt-1.5 block w-full rounded-lg border border-line bg-paper px-3.5 py-2.5 text-[15px] text-ink outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/20"
          />
        </label>
        <label className="block">
          <span className="text-[13px] font-medium text-ink-soft">Password</span>
          <input
            type="password"
            autoComplete="current-password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1.5 block w-full rounded-lg border border-line bg-paper px-3.5 py-2.5 text-[15px] text-ink outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/20"
          />
        </label>

        {error && (
          <p role="alert" className="rounded-lg bg-red-50 px-3.5 py-2.5 text-[13px] text-red-800">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={busy}
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-ink px-4 py-3 text-[15px] font-semibold text-white transition hover:bg-ink-2 disabled:opacity-60"
        >
          {busy ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : <Lock className="h-4 w-4" aria-hidden="true" />}
          {busy ? 'Signing in…' : 'Sign in'}
        </button>
      </form>
    </Shell>
  );
}
