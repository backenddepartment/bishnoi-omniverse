'use client';

import { useEffect, useRef } from 'react';
import { Loader2 } from 'lucide-react';

/**
 * Asks before something important happens (signing out, downloading every event), after the
 * CRM component sheet's dialog: a 22px card with a soft shadow over a dimmed page, plain words,
 * Cancel on the left of the action.
 *
 * Built on the native <dialog> element, so the browser keeps keyboard focus inside it, closes it
 * with Esc and makes the page behind it inert. Focus starts on Cancel, the safe choice, and goes
 * back to whatever opened the dialog when it closes.
 */
export function ConfirmDialog({
  open,
  title,
  icon,
  children,
  confirmLabel,
  cancelLabel = 'Cancel',
  tone = 'primary',
  busy = false,
  dismissible = true,
  onConfirm,
  onCancel,
}: {
  open: boolean;
  title: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
  confirmLabel: string;
  /** null hides the Cancel button (for a notice with only one way on). */
  cancelLabel?: string | null;
  tone?: 'primary' | 'danger';
  busy?: boolean;
  /** false: Esc and clicks outside do nothing, so the only way on is the button. */
  dismissible?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  const cancelRef = useRef<HTMLButtonElement>(null);
  const confirmRef = useRef<HTMLButtonElement>(null);
  const opener = useRef<Element | null>(null);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) {
      opener.current = document.activeElement;
      dialog.showModal();
      (cancelRef.current ?? confirmRef.current)?.focus();
    } else if (!open && dialog.open) {
      dialog.close();
      if (opener.current instanceof HTMLElement) opener.current.focus();
    }
  }, [open]);

  // Unmounting while open (e.g. after signing out) must not leave the page inert.
  useEffect(() => () => ref.current?.close(), []);

  const titleId = `dialog-${title.replace(/\W+/g, '-').toLowerCase()}`;

  return (
    <dialog
      ref={ref}
      aria-labelledby={titleId}
      onCancel={(e) => {
        // Esc: let React decide, so state and the element never disagree.
        e.preventDefault();
        if (dismissible && !busy) onCancel();
      }}
      onClick={(e) => {
        // A click on the dimmed area (the dialog element itself, outside the card) cancels.
        if (e.target === e.currentTarget && dismissible && !busy) onCancel();
      }}
      className="admin-dialog m-auto w-[calc(100%-32px)] max-w-[440px] rounded-[22px] border-0 bg-white p-0 text-crm-ink shadow-[0_24px_60px_rgba(20,20,20,0.18)]"
    >
      <div className="p-6">
        <div className="flex items-start gap-3.5">
          {icon && (
            <span
              className={`grid h-[38px] w-[38px] shrink-0 place-items-center rounded-full ${
                tone === 'danger' ? 'bg-crm-bad-bg text-crm-bad' : 'bg-crm-p-50 text-crm-p'
              }`}
              aria-hidden="true"
            >
              {icon}
            </span>
          )}
          <div className="min-w-0 pt-1">
            <h2 id={titleId} className="text-[19px] font-semibold leading-tight">
              {title}
            </h2>
            <div className="mt-2 text-[14px] leading-relaxed text-crm-ink-2">{children}</div>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap justify-end gap-2.5">
          {cancelLabel !== null && (
            <button
              ref={cancelRef}
              type="button"
              onClick={onCancel}
              disabled={busy}
              className="inline-flex h-11 items-center rounded-full px-5 text-[14px] font-medium text-crm-ink-2 transition hover:bg-crm-hover hover:text-crm-ink disabled:opacity-45"
            >
              {cancelLabel}
            </button>
          )}
          <button
            ref={confirmRef}
            type="button"
            onClick={onConfirm}
            disabled={busy}
            className={`inline-flex h-11 items-center gap-2 rounded-full px-[22px] text-[14px] font-medium text-white transition disabled:opacity-60 ${
              tone === 'danger' ? 'bg-crm-bad hover:bg-[#941c13]' : 'bg-crm-p hover:bg-crm-p-600'
            }`}
          >
            {busy && <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />}
            {confirmLabel}
          </button>
        </div>
      </div>
    </dialog>
  );
}
