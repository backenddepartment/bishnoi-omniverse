'use client';

import { useEffect, useRef } from 'react';
import { X } from 'lucide-react';

/**
 * A window over the dashboard for a short form (add a user, manage a user). The same native
 * <dialog> base as ConfirmDialog: focus stays inside, Esc and a click on the dimmed page close it
 * (unless `busy`), and focus returns to whatever opened it.
 */
export function Modal({
  open,
  title,
  subtitle,
  onClose,
  busy = false,
  width = 520,
  children,
  footer,
}: {
  open: boolean;
  title: string;
  subtitle?: string;
  onClose: () => void;
  busy?: boolean;
  width?: number;
  children: React.ReactNode;
  footer?: React.ReactNode;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  const opener = useRef<Element | null>(null);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) {
      opener.current = document.activeElement;
      dialog.showModal();
      // First field, or the close button when there is none.
      (dialog.querySelector<HTMLElement>('input, select, textarea') ?? dialog.querySelector<HTMLElement>('button'))?.focus();
    } else if (!open && dialog.open) {
      dialog.close();
      if (opener.current instanceof HTMLElement) opener.current.focus();
    }
  }, [open]);

  useEffect(() => () => ref.current?.close(), []);

  const titleId = `modal-${title.replace(/\W+/g, '-').toLowerCase()}`;

  return (
    <dialog
      ref={ref}
      aria-labelledby={titleId}
      onCancel={(e) => {
        e.preventDefault();
        if (!busy) onClose();
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget && !busy) onClose();
      }}
      style={{ maxWidth: width }}
      className="admin-dialog m-auto max-h-[calc(100dvh-32px)] w-[calc(100%-32px)] overflow-hidden rounded-[22px] border-0 bg-white p-0 text-crm-ink shadow-[0_24px_60px_rgba(20,20,20,0.18)]"
    >
      <div className="flex max-h-[calc(100dvh-32px)] flex-col">
        <div className="flex items-start justify-between gap-4 px-6 pb-2 pt-6">
          <div className="min-w-0">
            <h2 id={titleId} className="text-[19px] font-semibold leading-tight">
              {title}
            </h2>
            {subtitle && <p className="mt-1 text-[13.5px] text-crm-ink-3">{subtitle}</p>}
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={busy}
            aria-label="Close"
            className="-mr-2 -mt-1 grid h-9 w-9 shrink-0 place-items-center rounded-full text-crm-ink-3 transition hover:bg-crm-hover hover:text-crm-ink disabled:opacity-45"
          >
            <X className="h-[18px] w-[18px]" aria-hidden="true" />
          </button>
        </div>
        <div className="admin-scroll min-h-0 flex-1 overflow-y-auto px-6 pb-2 pt-3">{children}</div>
        {footer && <div className="flex flex-wrap justify-end gap-2.5 px-6 pb-6 pt-4">{footer}</div>}
      </div>
    </dialog>
  );
}
