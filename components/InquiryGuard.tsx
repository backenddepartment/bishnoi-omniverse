'use client';

import React, { forwardRef, useEffect, useImperativeHandle, useRef } from 'react';
import { CAPTCHA_ENABLED, TURNSTILE_SITE_KEY } from '@/lib/inquiry';

interface TurnstileApi {
  render(el: HTMLElement, options: Record<string, unknown>): string;
  reset(widgetId: string): void;
  remove(widgetId: string): void;
}

declare global {
  interface Window {
    turnstile?: TurnstileApi;
  }
}

const SCRIPT_SRC = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
let scriptPromise: Promise<TurnstileApi> | null = null;

/** Loads Cloudflare's widget script once per page, however many forms use it. */
function loadTurnstile(): Promise<TurnstileApi> {
  if (window.turnstile) return Promise.resolve(window.turnstile);
  if (!scriptPromise) {
    scriptPromise = new Promise<TurnstileApi>((resolve, reject) => {
      const script = document.createElement('script');
      script.src = SCRIPT_SRC;
      script.async = true;
      script.defer = true;
      script.onload = () => (window.turnstile ? resolve(window.turnstile) : reject(new Error('Turnstile unavailable')));
      script.onerror = () => {
        scriptPromise = null;
        reject(new Error('Turnstile unavailable'));
      };
      document.head.appendChild(script);
    });
  }
  return scriptPromise;
}

export interface InquiryGuardHandle {
  /** Whatever a bot typed into the hidden field ('' for people). */
  honeypot(): string;
  /** Spends the current token and asks Turnstile for a fresh one — call after every send. */
  reset(): void;
}

/**
 * The two protections every inquiry form carries, from Getmeds' gcb_inquiry_form_fields():
 *   1. a honeypot input hidden from people and screen readers, which the Worker silently drops
 *      a submission for filling in;
 *   2. the Cloudflare Turnstile "Verify you are human" widget, whose token is reported through
 *      onToken ('' whenever it is missing, expired or failed) so the form can keep its submit
 *      button disabled until the challenge has passed.
 * Renders no widget when no site key is configured, so forms still work before the keys exist.
 */
export const InquiryGuard = forwardRef<InquiryGuardHandle, { onToken: (token: string) => void }>(
  function InquiryGuard({ onToken }, ref) {
    const potRef = useRef<HTMLInputElement>(null);
    const boxRef = useRef<HTMLDivElement>(null);
    const widgetId = useRef<string | null>(null);
    const onTokenRef = useRef(onToken);
    onTokenRef.current = onToken;

    useImperativeHandle(
      ref,
      () => ({
        honeypot: () => potRef.current?.value ?? '',
        reset: () => {
          onTokenRef.current('');
          if (widgetId.current && window.turnstile) {
            try {
              window.turnstile.reset(widgetId.current);
            } catch {
              /* Widget not rendered yet — nothing to reset. */
            }
          }
        },
      }),
      []
    );

    useEffect(() => {
      if (!CAPTCHA_ENABLED || !boxRef.current) return;
      let cancelled = false;

      loadTurnstile()
        .then((turnstile) => {
          if (cancelled || !boxRef.current) return;
          widgetId.current = turnstile.render(boxRef.current, {
            sitekey: TURNSTILE_SITE_KEY,
            theme: 'light',
            size: 'flexible',
            callback: (token: string) => onTokenRef.current(token),
            'expired-callback': () => onTokenRef.current(''),
            'timeout-callback': () => onTokenRef.current(''),
            'error-callback': () => onTokenRef.current(''),
          });
        })
        .catch(() => onTokenRef.current(''));

      return () => {
        cancelled = true;
        if (widgetId.current && window.turnstile) {
          try {
            window.turnstile.remove(widgetId.current);
          } catch {
            /* Already gone. */
          }
        }
        widgetId.current = null;
      };
    }, []);

    return (
      <>
        <div aria-hidden="true" className="inquiry-honeypot">
          <label>
            Website
            <input ref={potRef} type="text" name="website" tabIndex={-1} autoComplete="off" defaultValue="" />
          </label>
        </div>
        {CAPTCHA_ENABLED && <div ref={boxRef} className="inquiry-turnstile" />}
      </>
    );
  }
);
