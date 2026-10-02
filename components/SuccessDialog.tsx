'use client';

import React, { useEffect, useRef } from 'react';

interface Props {
  title: string;
  children: React.ReactNode;
  onClose: () => void;
  closeLabel?: string;
}

/**
 * The confirmation shown once a form has been sent: a small card in the middle of the screen with
 * a green badge, whose tick pops in and draws itself. Used by every inquiry form.
 */
export function SuccessDialog({ title, children, onClose, closeLabel = 'Close' }: Props) {
  const closeRef = useRef<HTMLButtonElement>(null);
  // Read through a ref, so a parent re-render does not re-run the effect and move focus again.
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  // Freeze the page behind it, start keyboard focus on Close, and let Escape close it.
  useEffect(() => {
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    closeRef.current?.focus();
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onCloseRef.current();
    };
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.body.style.overflow = previous;
      document.removeEventListener('keydown', onKeyDown);
    };
  }, []);

  return (
    <div className="success-overlay">
      <div
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="success-title"
        aria-describedby="success-text"
        className="success-dialog"
      >
        <span className="success-badge" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none">
            <path className="success-tick" d="M6 12.5l4 4 8-9" />
          </svg>
        </span>
        <h3 id="success-title" className="success-title">
          {title}
        </h3>
        <div id="success-text" className="success-text">
          {children}
        </div>
        <button ref={closeRef} type="button" onClick={onClose} className="success-close">
          <span>{closeLabel}</span>
        </button>
      </div>
    </div>
  );
}
