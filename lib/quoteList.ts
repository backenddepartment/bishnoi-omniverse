'use client';

import { useSyncExternalStore } from 'react';

/**
 * The visitor's quote list: products picked with Add to Quote across the catalog, reviewed and sent
 * from the Quote page. Kept in local storage so it survives moving between pages and coming back
 * later, and shared between open tabs. Storage can be unavailable (private mode, blocked site
 * data); the list then lasts only as long as the page.
 */
export interface QuoteLine {
  /** Catalog product id. */
  id: string;
  qty: number;
  /** One of the product's sizes, when it has them. */
  size?: string;
}

const STORAGE_KEY = 'bo-quote-list';
const EMPTY: QuoteLine[] = [];
export const MAX_QTY = 100000;

let lines: QuoteLine[] | null = null;
const listeners = new Set<() => void>();

function parse(raw: string | null): QuoteLine[] {
  try {
    const saved: unknown = JSON.parse(raw ?? '[]');
    if (!Array.isArray(saved)) return [];
    return saved
      .filter((line): line is QuoteLine => typeof line?.id === 'string')
      .map((line) => ({
        id: line.id,
        qty: clampQty(Number(line.qty)),
        ...(typeof line.size === 'string' && line.size ? { size: line.size } : {}),
      }));
  } catch {
    return [];
  }
}

function load(): QuoteLine[] {
  if (lines) return lines;
  try {
    lines = parse(window.localStorage.getItem(STORAGE_KEY));
  } catch {
    lines = [];
  }
  return lines;
}

function save(next: QuoteLine[]) {
  lines = next;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {}
  listeners.forEach((listener) => listener());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  // Another tab changed the list: pick up its copy.
  const onStorage = (e: StorageEvent) => {
    if (e.key !== STORAGE_KEY) return;
    lines = parse(e.newValue);
    listener();
  };
  window.addEventListener('storage', onStorage);
  return () => {
    listeners.delete(listener);
    window.removeEventListener('storage', onStorage);
  };
}

export function clampQty(qty: number): number {
  if (!Number.isFinite(qty)) return 1;
  return Math.min(Math.max(Math.round(qty), 1), MAX_QTY);
}

/** The current list; empty while rendering on the server and on the first client render. */
export function useQuoteList(): QuoteLine[] {
  return useSyncExternalStore(subscribe, load, () => EMPTY);
}

export function addToQuote(id: string, size?: string) {
  const current = load();
  if (current.some((line) => line.id === id)) return;
  save([...current, { id, qty: 1, ...(size ? { size } : {}) }]);
}

export function updateQuoteLine(id: string, patch: Partial<Omit<QuoteLine, 'id'>>) {
  save(
    load().map((line) =>
      line.id === id ? { ...line, ...patch, qty: clampQty(patch.qty ?? line.qty) } : line
    )
  );
}

export function removeFromQuote(id: string) {
  save(load().filter((line) => line.id !== id));
}

export function clearQuote() {
  save([]);
}

export const QUOTE_PATH = '/quote';
