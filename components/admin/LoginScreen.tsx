'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { BarChart3, Eye, EyeOff, Loader2, Moon, MousePointerClick, Sun } from 'lucide-react';
import { ANALYTICS_ENDPOINT } from '@/lib/analytics';
import brandMark from '@/app/icon.png';
import type { AdminSession } from './AdminApp';

const SLIDES = [
  'Every visit, live as it happens',
  'See which links and buttons get clicked',
  'Know where your inquiries come from',
];

export type AdminTheme = 'dark' | 'light';

const THEME_KEY = 'bo-admin-theme';

/**
 * The sign-in screen's colour theme: dark unless this browser picked light before. The colours
 * themselves are CSS variables on .admin-theme in app/globals.css.
 */
export function useAdminTheme(): [AdminTheme, () => void] {
  const [theme, setTheme] = useState<AdminTheme>('dark');

  useEffect(() => {
    try {
      if (window.localStorage.getItem(THEME_KEY) === 'light') setTheme('light');
    } catch {
      /* Storage blocked: stay dark. */
    }
  }, []);

  const toggle = () =>
    setTheme((current) => {
      const next = current === 'dark' ? 'light' : 'dark';
      try {
        window.localStorage.setItem(THEME_KEY, next);
      } catch {
        /* ignore */
      }
      return next;
    });

  return [theme, toggle];
}

/** Sign-in screen: an illustrated panel on the left, the form on the right, in dark or light. */
export function LoginScreen({
  onSignedIn,
  theme,
  onToggleTheme,
}: {
  onSignedIn: (session: AdminSession) => void;
  theme: AdminTheme;
  onToggleTheme: () => void;
}) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
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
      if (!res.ok || !body.token || !body.user) {
        setError(body.message || 'Could not sign in. Please try again.');
        return;
      }
      onSignedIn({ token: body.token, expiresAt: body.expiresAt, user: body.user });
    } catch {
      setError('Could not reach the analytics service. Check your connection and try again.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <AdminBackdrop theme={theme}>
      <div className="relative grid w-full max-w-[960px] overflow-hidden rounded-[28px] border border-[color:var(--a-edge)] bg-[var(--a-card)] shadow-[var(--a-card-shadow)] transition-colors md:grid-cols-2">
        <Showcase />

        {/* Form */}
        <div className="relative flex flex-col px-7 py-10 sm:px-12 sm:py-12 h-md:py-8 h-sm:py-6">
          <button
            type="button"
            onClick={onToggleTheme}
            aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            title={theme === 'dark' ? 'Light mode' : 'Dark mode'}
            className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full border border-[color:var(--a-line)] text-[color:var(--a-soft)] transition hover:bg-[var(--a-hover)] hover:text-[color:var(--a-text)] sm:right-5 sm:top-5"
          >
            {theme === 'dark' ? <Sun className="h-4 w-4" aria-hidden="true" /> : <Moon className="h-4 w-4" aria-hidden="true" />}
          </button>
          <div className="flex flex-col items-center text-center">
            <Image
              src={brandMark}
              alt=""
              className="h-14 w-14 drop-shadow-[0_6px_18px_rgba(243,107,33,0.45)] h-md:h-11 h-md:w-11 h-sm:h-9 h-sm:w-9"
              priority
            />
            <span className="mt-2.5 font-poppins text-[15px] h-sm:mt-1.5 font-semibold tracking-tight text-[color:var(--a-text)]">Bishnoi Omniverse</span>
          </div>

          <p className="mt-9 text-center text-[13px] text-[color:var(--a-muted)] h-md:mt-6 h-sm:mt-4">Welcome</p>
          <h1 className="mt-1 text-center font-poppins text-[30px] font-semibold tracking-tight text-[color:var(--a-text)] h-sm:text-[26px]">Sign in now</h1>

          <form onSubmit={submit} className="mt-9 flex flex-1 flex-col h-md:mt-6 h-sm:mt-4">
            <label className="block">
              <span className="block pl-1 text-[11px] font-semibold uppercase tracking-[0.08em] text-[color:var(--a-label)]">Username or email</span>
              <input
                type="text"
                autoComplete="username"
                required
                placeholder="Enter username or email"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="admin-input mt-2.5 block w-full rounded-full border border-[color:var(--a-line)] bg-transparent px-6 py-3.5 h-sm:mt-2 h-sm:py-3 text-[14px] text-[color:var(--a-text)] outline-none transition placeholder:text-[color:var(--a-faint)] focus:border-accent focus:shadow-[0_0_0_4px_rgba(243,107,33,0.15)]"
              />
            </label>

            <label className="mt-6 block h-md:mt-4 h-sm:mt-3">
              <span className="block pl-1 text-[11px] font-semibold uppercase tracking-[0.08em] text-[color:var(--a-label)]">Password</span>
              <span className="relative mt-2.5 block h-sm:mt-2">
                <input
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  required
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="admin-input block w-full rounded-full border border-[color:var(--a-line)] bg-transparent py-3.5 pl-6 pr-14 h-sm:py-3 text-[14px] text-[color:var(--a-text)] outline-none transition placeholder:text-[color:var(--a-faint)] focus:border-accent focus:shadow-[0_0_0_4px_rgba(243,107,33,0.15)]"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  className="absolute right-2 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full text-[color:var(--a-faint)] transition hover:bg-[var(--a-hover)] hover:text-[color:var(--a-text)]"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" aria-hidden="true" /> : <Eye className="h-4 w-4" aria-hidden="true" />}
                </button>
              </span>
            </label>

            {error && (
              <p role="alert" className="mt-5 rounded-2xl border border-red-400/25 bg-red-500/10 px-4 py-3 text-[13px] text-[color:var(--a-error)]">
                {error}
              </p>
            )}

            <p className="mt-6 text-center text-[13px] text-[color:var(--a-muted)] h-md:mt-4 h-sm:mt-3">
              Forgot the password? <span className="text-[color:var(--a-soft)]">Ask the site administrator.</span>
            </p>

            <div className="mt-8 flex items-center rounded-full border border-[color:var(--a-line)] p-1.5 h-md:mt-5 h-sm:mt-4 md:mt-auto">
              <button
                type="submit"
                disabled={busy}
                className="flex flex-1 items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#ff8a3d] to-accent whitespace-nowrap px-4 py-3.5 text-[14px] font-semibold sm:px-6 h-sm:py-3 text-white shadow-[0_10px_30px_-10px_rgba(243,107,33,0.9)] transition hover:brightness-110 disabled:opacity-60"
              >
                {busy && <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />}
                {busy ? 'Signing in…' : 'Sign in'}
              </button>
              <a
                href="/"
                className="flex flex-1 items-center justify-center rounded-full whitespace-nowrap px-4 py-3.5 text-[14px] font-medium sm:px-6 h-sm:py-3 text-[color:var(--a-soft)] transition hover:text-[color:var(--a-text)]"
              >
                Back to website
              </a>
            </div>
          </form>
        </div>
      </div>
    </AdminBackdrop>
  );
}

/** The page behind the card, with soft brand-coloured glows like out-of-focus lights. */
export function AdminBackdrop({ theme, children }: { theme: AdminTheme; children: React.ReactNode }) {
  return (
    <div
      data-theme={theme}
      className="admin-theme relative flex min-h-[100dvh] items-center justify-center overflow-hidden bg-[var(--a-bg)] px-4 py-6 font-poppins transition-colors h-md:py-4"
    >
      <span aria-hidden="true" className="admin-float pointer-events-none absolute left-[12%] top-[10%] h-24 w-24 rounded-full bg-accent/70 opacity-[var(--a-glow)] blur-[38px]" />
      <span aria-hidden="true" className="admin-float-slow pointer-events-none absolute bottom-[8%] right-[10%] h-20 w-20 rounded-full bg-[#ff3d7f]/60 opacity-[var(--a-glow)] blur-[34px]" />
      <span aria-hidden="true" className="admin-float pointer-events-none absolute bottom-[30%] left-[6%] h-14 w-14 rounded-full bg-[#0b8457]/70 opacity-[var(--a-glow)] blur-[26px]" />
      {children}
    </div>
  );
}

/** Left half: an analytics illustration and rotating captions. Hidden on phones. */
function Showcase() {
  const [slide, setSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setSlide((s) => (s + 1) % SLIDES.length), 4500);
    return () => clearInterval(timer);
  }, [slide]);

  return (
    <div className="relative m-0 hidden flex-col overflow-hidden rounded-[28px] bg-[var(--a-panel)] px-8 transition-colors pb-10 pt-8 md:flex h-md:pb-7 h-md:pt-6 h-sm:pb-5 h-sm:pt-4">
      {/* Glows behind the art */}
      <span aria-hidden="true" className="absolute left-[18%] top-[30%] h-56 w-56 rounded-full bg-accent/35 opacity-[var(--a-panel-glow)] blur-[70px]" />
      <span aria-hidden="true" className="absolute right-[6%] top-[12%] h-28 w-28 rounded-full bg-[#ff3d7f]/30 opacity-[var(--a-panel-glow)] blur-[50px]" />

      {/* The art is drawn at 380x360 and scaled down as a whole on short screens; the outer box
          shrinks with it so the layout gets the space back. */}
      <div aria-hidden="true" className="relative mx-auto h-[360px] w-full max-w-[380px] shrink-0 h-sm:h-[288px]">
      <div className="absolute left-1/2 top-0 h-[360px] w-full origin-top -translate-x-1/2 h-sm:scale-[0.8]">
          {/* Main 3D tile: a bar chart on a glossy orange block */}
          {/* The bob sits on its own wrapper: its transform would replace the centring translate. */}
          <div className="absolute left-1/2 top-[54%] -translate-x-1/2 -translate-y-1/2">
            <div className="admin-float">
              <div className="-rotate-[14deg]">
                <div
                  className="relative h-[230px] w-[230px] rounded-[56px] bg-gradient-to-br from-[#ffc36b] via-[#f36b21] to-[#d63c5e]"
                  style={{
                    boxShadow:
                      '10px 12px 0 #b4471a, 18px 22px 0 #8f3514, 30px 44px 60px rgba(0,0,0,0.55), inset 0 2px 0 rgba(255,255,255,0.45)',
                  }}
                >
                  <div className="absolute inset-[30px] rounded-[38px] bg-gradient-to-br from-white to-[#ffe6da] shadow-[inset_0_-6px_14px_rgba(194,86,26,0.25),0_6px_0_rgba(143,53,20,0.35)]">
                    <div className="absolute inset-x-[26px] bottom-[28px] top-[34px] flex items-end gap-[12px]">
                      {[38, 62, 48, 86].map((h, i) => (
                        <span
                          key={i}
                          className="flex-1 rounded-t-[8px] rounded-b-[3px] bg-gradient-to-t from-[#d63c5e] to-[#ff8a3d] shadow-[0_3px_0_rgba(143,53,20,0.35)]"
                          style={{ height: `${h}%` }}
                        />
                      ))}
                    </div>
                    <svg viewBox="0 0 100 60" className="absolute inset-x-[22px] top-[22px] h-[60px] w-[calc(100%-44px)]">
                      <path d="M2 50 L30 30 L55 38 L96 6" fill="none" stroke="#25252c" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
                      <circle cx="96" cy="6" r="6" fill="#25252c" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Visits bubble */}
          <div className="admin-float-slow absolute left-0 top-[6%]">
            <div className="relative -rotate-[10deg] rounded-[20px] bg-gradient-to-br from-[#ff7a45] to-[#e5484d] px-4 py-3 shadow-[6px_8px_0_#a8322f,14px_22px_40px_rgba(0,0,0,0.45)]">
              <span className="flex items-center gap-2 text-[26px] font-semibold leading-none text-white">
                <Eye className="h-6 w-6" strokeWidth={2.6} />
                1.2k
              </span>
              <span className="absolute -bottom-2 left-6 h-4 w-4 rotate-45 rounded-[3px] bg-[#e85a49]" />
            </div>
          </div>

          {/* Click tile */}
          <div className="admin-float absolute right-[2%] top-0">
            <div className="flex h-[92px] w-[92px] rotate-[12deg] items-center justify-center rounded-[26px] bg-gradient-to-br from-white to-[#ffd9c6] shadow-[8px_10px_0_#d9a58c,18px_26px_44px_rgba(0,0,0,0.45)]">
              <MousePointerClick className="h-11 w-11 text-accent" strokeWidth={2.4} />
            </div>
          </div>

          {/* Live chip */}
          <div className="admin-float-slow absolute bottom-[4%] right-[4%]">
            <div className="flex rotate-[6deg] items-center gap-2 rounded-full bg-[#0b8457] px-4 py-2 text-[13px] font-semibold text-white shadow-[4px_6px_0_#075c3c,10px_18px_30px_rgba(0,0,0,0.45)]">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white opacity-70" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-white" />
              </span>
              24 online
            </div>
          </div>

          {/* Small chart badge */}
          <div className="admin-float absolute bottom-[14%] left-[2%]">
            <div className="flex h-12 w-12 -rotate-[8deg] items-center justify-center rounded-2xl bg-[#3a3a44] text-white/90 shadow-[4px_6px_0_#26262e,10px_16px_26px_rgba(0,0,0,0.4)]">
              <BarChart3 className="h-6 w-6" />
            </div>
          </div>
        </div>
      </div>

      <div className="relative mt-auto text-center">
        <p className="mx-auto min-h-[76px] max-w-[300px] text-[26px] h-md:min-h-[56px] h-md:text-[22px] h-sm:min-h-[48px] h-sm:text-[19px] font-medium leading-[1.25] tracking-tight text-[color:var(--a-text)]" aria-live="polite">
          {SLIDES[slide]}
        </p>
        <div className="mt-6 flex justify-center gap-1 h-sm:mt-3">
          {SLIDES.map((text, i) => (
            <button
              key={text}
              type="button"
              onClick={() => setSlide(i)}
              aria-label={`Show slide ${i + 1}`}
              aria-current={i === slide}
              className="flex h-6 w-6 items-center justify-center"
            >
              <span className={`h-1.5 rounded-full transition-all ${i === slide ? 'w-5 bg-[var(--a-text)]' : 'w-1.5 bg-[var(--a-dot)]'}`} />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
