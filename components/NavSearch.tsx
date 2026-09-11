'use client';

import React, { useCallback, useEffect, useId, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Search, X } from 'lucide-react';
import { searchSite, trimToSentence, SEARCH_MIN_CHARS, type SearchResults } from '@/lib/siteSearch';

const DEBOUNCE_MS = 200;
const PER_GROUP = 4;
const SUMMARY_CHARS = 110;

/** Results for the query, recomputed 200ms after the last keystroke once it has 2+ characters. */
function useSuggestions(query: string): SearchResults | null {
  const [results, setResults] = useState<SearchResults | null>(null);

  useEffect(() => {
    const trimmed = query.trim();
    if (trimmed.length < SEARCH_MIN_CHARS) {
      setResults(null);
      return;
    }
    const timer = setTimeout(() => setResults(searchSite(trimmed, PER_GROUP)), DEBOUNCE_MS);
    return () => clearTimeout(timer);
  }, [query]);

  return results;
}

/** ↑/↓ walk the result rows; ↑ past the first row returns to the input. */
function moveFocus(e: React.KeyboardEvent, list: HTMLElement | null, input: HTMLInputElement | null) {
  if (e.key !== 'ArrowDown' && e.key !== 'ArrowUp') return;
  const rows = list ? Array.from(list.querySelectorAll<HTMLElement>('.nav-search-hit')) : [];
  if (rows.length === 0) return;
  e.preventDefault();

  const current = rows.indexOf(document.activeElement as HTMLElement);
  const next =
    e.key === 'ArrowDown'
      ? current < 0
        ? 0
        : Math.min(current + 1, rows.length - 1)
      : current <= 0
        ? -1
        : current - 1;

  rows.forEach((row) => row.setAttribute('aria-selected', 'false'));
  if (next < 0) {
    input?.focus();
  } else {
    rows[next].setAttribute('aria-selected', 'true');
    rows[next].focus();
  }
}

function ResultsList({ results, onNavigate }: { results: SearchResults; onNavigate: () => void }) {
  if (results.groups.length === 0) {
    return <p className="nav-search-empty">No results for &ldquo;{results.query}&rdquo;.</p>;
  }

  return (
    <>
      {results.groups.map((group) => (
        <div key={group.key} role="group" aria-label={group.label}>
          <p className="nav-search-group">{group.label}</p>
          {group.items.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              role="option"
              aria-selected="false"
              onClick={onNavigate}
              className="nav-search-hit"
            >
              <span className="nav-search-hit-title">{item.title}</span>
              {item.summary && (
                <span className="nav-search-hit-summary">{trimToSentence(item.summary, SUMMARY_CHARS)}</span>
              )}
            </Link>
          ))}
        </div>
      ))}
      <Link
        href={`/search?q=${encodeURIComponent(results.query)}`}
        role="option"
        aria-selected="false"
        onClick={onNavigate}
        className="nav-search-hit nav-search-all"
      >
        See all {results.total} result{results.total === 1 ? '' : 's'} →
      </Link>
    </>
  );
}

/**
 * Navbar site search. From 1024px up it is an inline field with a results dropdown; below that
 * the field is replaced by an icon that opens a full-width panel under the header. Both share one
 * query and one engine (lib/siteSearch). Enter goes to the full results page at /search?q=.
 */
export function NavSearch({ onPanelOpen }: { onPanelOpen?: () => void }) {
  const router = useRouter();
  const pathname = usePathname();
  const [query, setQuery] = useState('');
  const [inlineOpen, setInlineOpen] = useState(false);
  const [panelOpen, setPanelOpen] = useState(false);
  const results = useSuggestions(query);

  const inlineRef = useRef<HTMLDivElement>(null);
  const inlineInputRef = useRef<HTMLInputElement>(null);
  const inlineListRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const panelInputRef = useRef<HTMLInputElement>(null);
  const panelListRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  const uid = useId();
  const inlineListId = `${uid}-inline-results`;
  const panelId = `${uid}-panel`;
  const panelListId = `${uid}-panel-results`;

  const inlineVisible = inlineOpen && results !== null;
  const status = results ? `${results.total} result${results.total === 1 ? '' : 's'}.` : '';

  const closeAll = useCallback(() => {
    setInlineOpen(false);
    setPanelOpen(false);
  }, []);

  const openPanel = useCallback(() => {
    onPanelOpen?.();
    setPanelOpen(true);
  }, [onPanelOpen]);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = query.trim();
    if (!trimmed) return;
    closeAll();
    router.push(`/search?q=${encodeURIComponent(trimmed)}`);
  };

  // A new page closes the dropdown and panel; on the results page the field keeps its query.
  useEffect(() => {
    closeAll();
    if (pathname === '/search') {
      const existing = new URLSearchParams(window.location.search).get('q');
      if (existing) setQuery(existing);
    }
  }, [pathname, closeAll]);

  // Focus the panel's field once it is on screen (iOS needs the short delay).
  useEffect(() => {
    if (!panelOpen) return;
    const timer = setTimeout(() => panelInputRef.current?.focus(), 60);
    return () => clearTimeout(timer);
  }, [panelOpen]);

  // Scroll lock while the panel is open.
  useEffect(() => {
    document.documentElement.classList.toggle('nav-search-open', panelOpen);
    return () => document.documentElement.classList.remove('nav-search-open');
  }, [panelOpen]);

  // Clicking outside closes the dropdown, and the panel (the backdrop counts as outside).
  useEffect(() => {
    const onMouseDown = (e: MouseEvent) => {
      const target = e.target as Node;
      if (inlineRef.current && !inlineRef.current.contains(target)) setInlineOpen(false);
      if (
        panelOpen &&
        panelRef.current &&
        !panelRef.current.contains(target) &&
        !triggerRef.current?.contains(target)
      ) {
        setPanelOpen(false);
      }
    };
    document.addEventListener('mousedown', onMouseDown);
    return () => document.removeEventListener('mousedown', onMouseDown);
  }, [panelOpen]);

  // Esc closes; "/" focuses search from anywhere, unless the user is already typing somewhere.
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (panelOpen) {
          setPanelOpen(false);
          triggerRef.current?.focus();
        } else if (inlineOpen) {
          setInlineOpen(false);
          inlineInputRef.current?.focus();
        }
        return;
      }
      if (e.key === '/' && !panelOpen) {
        const el = document.activeElement as HTMLElement | null;
        const tag = el?.tagName ?? '';
        if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT' || el?.isContentEditable) return;
        e.preventDefault();
        const inline = inlineInputRef.current;
        if (inline && inline.offsetParent !== null) inline.focus();
        else openPanel();
      }
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [panelOpen, inlineOpen, openPanel]);

  return (
    <div className="flex items-center">
      {/* Inline field and dropdown (1024px and up) */}
      <div
        ref={inlineRef}
        className="relative hidden lg:flex items-center mr-2"
        onKeyDown={(e) => moveFocus(e, inlineListRef.current, inlineInputRef.current)}
      >
        <form onSubmit={submit} role="search" className="relative flex items-center">
          <label htmlFor={`${uid}-inline-input`} className="sr-only">
            Search products, categories and pages
          </label>
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-muted pointer-events-none" />
          <input
            ref={inlineInputRef}
            id={`${uid}-inline-input`}
            type="search"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setInlineOpen(true);
            }}
            onFocus={() => setInlineOpen(true)}
            placeholder="How can we help you?"
            autoComplete="off"
            role="combobox"
            aria-autocomplete="list"
            aria-controls={inlineListId}
            aria-expanded={inlineVisible}
            className="w-56 xl:w-72 pl-8 pr-3 py-2 text-xs rounded-full border border-line bg-[#fafafa] text-ink placeholder:text-muted focus:bg-surface focus:border-ink outline-none transition-colors"
          />
        </form>
        {inlineVisible && (
          <div
            ref={inlineListRef}
            id={inlineListId}
            role="listbox"
            aria-label="Search results"
            className="nav-search-dropdown"
          >
            <ResultsList results={results} onNavigate={closeAll} />
          </div>
        )}
      </div>

      {/* Icon below 1024px: opens the full-width panel */}
      <button
        ref={triggerRef}
        type="button"
        onClick={() => (panelOpen ? setPanelOpen(false) : openPanel())}
        aria-haspopup="dialog"
        aria-expanded={panelOpen}
        aria-controls={panelId}
        aria-label="Search"
        className="lg:hidden inline-flex items-center justify-center w-10 h-10 rounded-full text-ink hover:bg-paper-2 transition-colors"
      >
        <Search className="w-[19px] h-[19px]" />
      </button>

      {/* Full-width panel and backdrop. No positioned ancestor between here and .site-header,
          so top-full lands them directly under the header. */}
      {panelOpen && (
        <>
          <div className="nav-search-backdrop" aria-hidden="true" />
          <div
            ref={panelRef}
            id={panelId}
            role="dialog"
            aria-modal="true"
            aria-label="Search this site"
            className="nav-search-panel"
            onKeyDown={(e) => moveFocus(e, panelListRef.current, panelInputRef.current)}
          >
            <div className="wrap max-w-[1400px] px-5 py-5">
              <form onSubmit={submit} role="search" className="relative">
                <label htmlFor={`${uid}-panel-input`} className="sr-only">
                  Search products, categories and pages
                </label>
                <Search className="w-[18px] h-[18px] absolute left-4 top-1/2 -translate-y-1/2 text-muted pointer-events-none" />
                <input
                  ref={panelInputRef}
                  id={`${uid}-panel-input`}
                  type="search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search products, categories and pages…"
                  autoComplete="off"
                  role="combobox"
                  aria-autocomplete="list"
                  aria-controls={panelListId}
                  aria-expanded={results !== null}
                  className="nav-search-panel-input"
                />
                <button
                  type="button"
                  onClick={() => {
                    setPanelOpen(false);
                    triggerRef.current?.focus();
                  }}
                  aria-label="Close search"
                  className="absolute right-2 top-1/2 -translate-y-1/2 inline-flex items-center justify-center w-10 h-10 rounded-full text-muted hover:text-ink transition-colors"
                >
                  <X className="w-[18px] h-[18px]" />
                </button>
              </form>
              <div
                ref={panelListRef}
                id={panelListId}
                role="listbox"
                aria-label="Search results"
                className="nav-search-panel-results"
              >
                {results && <ResultsList results={results} onNavigate={closeAll} />}
              </div>
            </div>
          </div>
        </>
      )}

      <p className="sr-only" role="status" aria-live="polite">
        {inlineVisible || panelOpen ? status : ''}
      </p>
    </div>
  );
}
