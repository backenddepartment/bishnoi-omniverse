import React from 'react';
import Link from 'next/link';
import type { LucideIcon } from 'lucide-react';
import { CountUp } from '@/components/CountUp';
import { FadeIn } from '@/components/FadeIn';

/**
 * Layout patterns for the About Us pages, named after the design guide's codes (P1–P9) so a page
 * reads the same as its design note: <Split> is P1, <StatStrip> P2, <IconCards> P3, <Stepper> P4,
 * <AboutHero> P5, <Callout> P7, <DiagramSplit> P8 and <CtaBand> P9. P6 (the leadership profile) is
 * used once, so it lives with that page.
 *
 * Styling is in globals.css under the `ap-` prefix.
 */

export type Cta = { label: string; href: string };
export type Stat = { value: string; label: string; note?: string };
type Tone = 'white' | 'paper' | 'dark';

/* ---------- Section shell ---------- */

/** A page section on one of the three grounds the guide rotates through. */
export function PatternSection({
  tone = 'white',
  tight = false,
  className = '',
  id,
  children,
}: {
  tone?: Tone;
  tight?: boolean;
  className?: string;
  id?: string;
  children: React.ReactNode;
}) {
  const toneClass = tone === 'dark' ? 'section-dark' : tone === 'paper' ? 'ap-paper' : 'section-white';
  return (
    <section id={id} className={`${tight ? 'section-tight' : 'section'} ${toneClass} ${className}`}>
      <div className="wrap">{children}</div>
    </section>
  );
}

/** Eyebrow + headline, with an optional small icon above (e.g. FileSearch, Handshake). */
export function SectionHead({
  eyebrow,
  title,
  icon: Icon,
  center = false,
  onDark = false,
  className = '',
  children,
}: {
  eyebrow?: string;
  title: string;
  icon?: LucideIcon;
  center?: boolean;
  onDark?: boolean;
  className?: string;
  /** Anything drawn under the headline, such as the growth arrow on Our Story. */
  children?: React.ReactNode;
}) {
  return (
    <div className={`heading-lg ap-head${center ? ' is-center' : ''} ${className}`}>
      {Icon && <Icon className="ap-head-icon" strokeWidth={1.5} aria-hidden="true" />}
      {eyebrow && <span className={`eyebrow${onDark ? ' on-dark' : ''}`}>{eyebrow}</span>}
      <h2>{title}</h2>
      {children}
    </div>
  );
}

/** Body paragraphs in the site's soft ink. */
export function Prose({ paras, className = '' }: { paras: React.ReactNode[]; className?: string }) {
  return (
    <div className={`ap-prose ${className}`}>
      {paras.map((p, i) => (
        <p key={i}>{p}</p>
      ))}
    </div>
  );
}

/* ---------- P5 hero (+ P2 stat cards) ---------- */

/**
 * Full-width photo hero, white text on a dark overlay. `stats` adds the P2 proof points as white
 * cards overlapping the hero's bottom edge; `statsInHero` instead sets them as large figures inside
 * the hero (Governance). `short` caps the hero at about 60% of the screen; `banner` sizes it like the
 * About Us slide band (42.7vw, the height of a 1920×820 image at any width), so the two line up.
 */
export function AboutHero({
  eyebrow,
  title,
  lede,
  image,
  imageAlt,
  imagePosition = 'center',
  short = false,
  banner = false,
  overlay = 'dark',
  stats,
  statsInHero = false,
  actions,
}: {
  eyebrow: string;
  title: string;
  lede: string;
  image: string;
  imageAlt: string;
  imagePosition?: string;
  short?: boolean;
  banner?: boolean;
  /** 'light' keeps the photo warmer; 'left' fades from the left edge only; 'none' drops the scrim
      and sets the copy in ink, for a designed light background with a clear area for text. */
  overlay?: 'dark' | 'light' | 'left' | 'none';
  stats?: Stat[];
  statsInHero?: boolean;
  actions?: React.ReactNode;
}) {
  const overlapping = stats && !statsInHero;
  return (
    <>
      <section
        className={`ap-hero is-overlay-${overlay}${short ? ' is-short' : ''}${banner ? ' is-banner' : ''}${overlapping ? ' has-overlap' : ''}`}
      >
        <img src={image} alt={imageAlt} className="ap-hero-media" style={{ objectPosition: imagePosition }} loading="eager" />
        <div className="wrap ap-hero-content">
          <span className={`eyebrow${overlay === 'none' ? '' : ' on-dark'}`}>{eyebrow}</span>
          <h1>{title}</h1>
          <p className="ap-hero-lede">{lede}</p>
          {actions && <div className="flex flex-wrap gap-4 mt-8">{actions}</div>}
          {stats && statsInHero && (
            <div className="ap-hero-stats">
              {stats.map((s) => (
                <div key={s.label}>
                  <CountUp value={s.value} className="ap-hero-stat-num" />
                  <div className="ap-hero-stat-label">{s.label}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
      {overlapping && (
        <div className="wrap ap-overlap">
          <StatStrip stats={stats} cards />
        </div>
      )}
    </>
  );
}

/* ---------- P2 stat strip ---------- */

/** Two to four big numbers that count up on scroll: orange figures, soft-ink labels. */
export function StatStrip({ stats, cards = false }: { stats: Stat[]; cards?: boolean }) {
  return (
    <div className={`ap-stats${cards ? ' is-cards' : ''}`} style={{ '--ap-cols': stats.length } as React.CSSProperties}>
      {stats.map((s) => (
        <div key={s.label} className="ap-stat">
          <CountUp value={s.value} className="ap-stat-num" />
          <div className="ap-stat-label">{s.label}</div>
          {s.note && <div className="ap-stat-note">{s.note}</div>}
        </div>
      ))}
    </div>
  );
}

/* ---------- P1 split ---------- */

/** Photo on one side, content on the other. Stacks photo-first on phones. */
export function Split({
  image,
  imageAlt,
  side = 'left',
  imagePosition = 'center',
  ratio = '4 / 3',
  children,
  media,
}: {
  image?: string;
  imageAlt?: string;
  side?: 'left' | 'right';
  imagePosition?: string;
  ratio?: string;
  children: React.ReactNode;
  /** A custom right/left column (diagram, card) in place of a photo. */
  media?: React.ReactNode;
}) {
  return (
    <div className={`ap-split is-media-${side}`}>
      <FadeIn from={side} className="ap-split-media">
        {media ?? (
          <img
            src={image}
            alt={imageAlt}
            loading="lazy"
            className="ap-split-img"
            style={{ aspectRatio: ratio, objectPosition: imagePosition }}
          />
        )}
      </FadeIn>
      <div className="ap-split-copy">{children}</div>
    </div>
  );
}

/** P8: text beside a custom SVG diagram. Same frame as <Split>, diagram on the right by default. */
export function DiagramSplit({
  diagram,
  side = 'right',
  children,
}: {
  diagram: React.ReactNode;
  side?: 'left' | 'right';
  children: React.ReactNode;
}) {
  return (
    <Split side={side} media={<div className="ap-diagram">{diagram}</div>}>
      {children}
    </Split>
  );
}

/* ---------- P3 icon cards ---------- */

export type IconCard = {
  icon?: LucideIcon;
  /** Small label above the title, e.g. a city name beside a MapPin. */
  eyebrow?: string;
  title?: string;
  text: React.ReactNode;
  href?: string;
};

/**
 * Two to four cards in a row: 40px orange icon, bold title, one short text. `variant` picks the
 * card ground: `border` (thin border on white) or `paper` (paper tile).
 */
export function IconCards({
  items,
  variant = 'border',
  cols,
  className = '',
}: {
  items: IconCard[];
  variant?: 'border' | 'paper' | 'white';
  cols?: number;
  className?: string;
}) {
  return (
    <div
      className={`ap-cards is-${variant} ${className}`}
      style={{ '--ap-cols': cols ?? items.length } as React.CSSProperties}
    >
      {items.map((item, i) => {
        const Icon = item.icon;
        const inner = (
          <>
            {Icon && !item.eyebrow && <Icon className="ap-card-icon" strokeWidth={1.5} aria-hidden="true" />}
            {item.eyebrow && (
              <span className="ap-card-eyebrow">
                {Icon && <Icon strokeWidth={1.5} aria-hidden="true" />}
                {item.eyebrow}
              </span>
            )}
            {item.title && <h3>{item.title}</h3>}
            <p>{item.text}</p>
          </>
        );
        return (
          <FadeIn key={i} delay={i * 0.08}>
            {item.href ? (
              <Link href={item.href} className="ap-card is-link">
                {inner}
              </Link>
            ) : (
              <div className="ap-card">{inner}</div>
            )}
          </FadeIn>
        );
      })}
    </div>
  );
}

/* ---------- P4 stepper ---------- */

export type Step = { title: string; text?: React.ReactNode; icon?: LucideIcon };

/**
 * Numbered steps joined by a thin orange line: horizontal on desktop, vertical on phones.
 * `check` swaps the numbers for green check marks (the "checked" order-controls line).
 * `vertical` keeps the steps stacked at every width.
 */
export function Stepper({
  steps,
  check = false,
  vertical = false,
  className = '',
}: {
  steps: Step[];
  check?: boolean;
  vertical?: boolean;
  className?: string;
}) {
  return (
    <ol
      className={`ap-stepper${check ? ' is-check' : ''}${vertical ? ' is-vertical' : ''} ${className}`}
      style={{ '--ap-cols': steps.length } as React.CSSProperties}
    >
      {steps.map((step, i) => {
        const Icon = step.icon;
        return (
          <li key={step.title} className="ap-step">
            <span className="ap-step-marker" aria-hidden="true">
              {check ? '✓' : String(i + 1).padStart(2, '0')}
            </span>
            {Icon && <Icon className="ap-step-icon" strokeWidth={1.5} aria-hidden="true" />}
            <h3>{step.title}</h3>
            {step.text && <p>{step.text}</p>}
          </li>
        );
      })}
    </ol>
  );
}

/* ---------- P7 callout ---------- */

/** One key statement on a soft orange panel with a thick orange line on the left. */
export function Callout({
  children,
  size = 'md',
  className = '',
}: {
  children: React.ReactNode;
  size?: 'md' | 'lg';
  className?: string;
}) {
  return <div className={`ap-callout is-${size} ${className}`}>{children}</div>;
}

/* ---------- P9 CTA band ---------- */

/**
 * Rounded closing panel with a centered headline, text and buttons. `tone="light"` uses the orange
 * tint (documents-themed pages); `image` fades a photo behind a dark panel; `icon` sits above the
 * headline.
 */
export function CtaBand({
  eyebrow,
  title,
  text,
  primary,
  secondary,
  tone = 'dark',
  image,
  imageOpacity = 0.15,
  icon: Icon,
  aside,
}: {
  eyebrow?: string;
  title: string;
  text: string;
  primary: Cta;
  secondary?: Cta;
  tone?: 'dark' | 'light';
  image?: string;
  imageOpacity?: number;
  icon?: LucideIcon;
  /** Something beside the copy (e.g. a portrait); the copy then aligns left. */
  aside?: React.ReactNode;
}) {
  return (
    <section className="section section-white pt-0 pb-24">
      <div className="wrap">
        <div className={`ap-cta is-${tone}${aside ? ' has-aside' : ''}`}>
          {image && <img src={image} alt="" className="ap-cta-media" style={{ opacity: imageOpacity }} loading="lazy" />}
          {aside && <div className="ap-cta-aside">{aside}</div>}
          <div className="ap-cta-copy">
            {Icon && <Icon className="ap-cta-icon" strokeWidth={1.5} aria-hidden="true" />}
            {eyebrow && <span className={`eyebrow${tone === 'dark' ? ' on-dark' : ''}`}>{eyebrow}</span>}
            <h2>{title}</h2>
            <p>{text}</p>
            <div className="ap-cta-actions">
              <Link href={primary.href} className="btn btn-primary">
                {primary.label}
              </Link>
              {secondary && (
                <Link
                  href={secondary.href}
                  className={`btn btn-outline${tone === 'light' ? ' on-light' : ''}`}
                >
                  {secondary.label}
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
