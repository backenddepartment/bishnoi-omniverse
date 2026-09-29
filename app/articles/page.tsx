import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { NoArticlesArt } from '@/components/articles/NoArticlesArt';
import articlesData from '@/lib/data/articlesData.json';
import newsData from '@/lib/data/newsData.json';
import { NewsFeed, type NewsItem } from '@/components/articles/NewsFeed';
import { AboutHero } from '@/components/about/Patterns';
import heroImg from '@/app/assets/article.png';
import familiesImg from '@/app/assets/families.jpg';
import medicinesImg from '@/app/assets/medicines.jpg';
import documentsImg from '@/app/assets/documents.png';
import doctorsImg from '@/app/assets/doctors.jpg';
import suppliesImg from '@/app/assets/supplies.jpg';
import hospitalImg from '@/app/assets/hospital.jpg';

export const metadata: Metadata = {
  title: 'Articles | Bishnoi Omniverse',
  description:
    'Practical writing on medical supply sourcing, product documentation, and cross-border access to specialty medicines.',
};

/**
 * The cards come from two files:
 *   lib/data/newsData.json       written by scripts/sync-news.mjs from a news API at build time
 *                                (see docs/news-feed.md). Never edited by hand.
 *   lib/data/articlesData.json   articles added by hand, in `items`.
 * Both hold entries of the shape below. An entry marked "sample": true is a stand-in that shows
 * only until the first real news arrives.
 *
 *   {
 *     "slug": "what-ships-with-a-tender-line",
 *     "title": "What ships with a tender line",
 *     "category": "Documentation",
 *     "date": "2026-02-14",          // ISO, used for both display and ordering
 *     "excerpt": "One or two sentences that stand on their own in the card.",
 *     "image": "documents",          // a name from PHOTOS below, or a full https:// address
 *     "imageAlt": "",
 *     "source": "TIME",              // where it was published
 *     "sourceIcon": "https://…",     // optional; otherwise the source's initial on sourceColor
 *     "sourceColor": "#e90606",
 *     "href": "https://…"            // the original article, or a page on this site
 *   }
 */
type Article = {
  slug: string;
  title: string;
  category?: string;
  date?: string;
  excerpt?: string;
  image?: string;
  imageAlt?: string;
  sample?: boolean;
  photoChecked?: boolean;
  source?: string;
  sourceIcon?: string;
  sourceColor?: string;
  href: string;
};

/** The site's own photos, by the name an article's `image` refers to them with. */
const PHOTOS: Record<string, { src: string }> = {
  families: familiesImg,
  medicines: medicinesImg,
  documents: documentsImg,
  doctors: doctorsImg,
  supplies: suppliesImg,
  hospital: hospitalImg,
};

const DATE_FORMAT: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short', day: 'numeric', timeZone: 'UTC' };

function formatDate(date?: string) {
  if (!date) return undefined;
  const parsed = new Date(date);
  return Number.isNaN(parsed.getTime()) ? undefined : parsed.toLocaleDateString('en-US', DATE_FORMAT);
}

/** An article's photo: one of the site's own by name, or a full web address as it stands. */
function resolveImage(image?: string) {
  if (!image) return undefined;
  if (PHOTOS[image]) return PHOTOS[image].src;
  return image.startsWith('https://') || image.startsWith('http://') ? image : undefined;
}

function toNewsItem(article: Article): NewsItem {
  // `sample` and `photoChecked` are notes for this page and for the sync script, not for the card.
  const { image, date, sample, photoChecked, ...rest } = article;
  return { ...rest, date: formatDate(date), dateTime: date, image: resolveImage(image) };
}

export default function ArticlesPage() {
  const { header, feed, emptyState } = articlesData;
  const news = newsData.items as Article[];
  const own = articlesData.items as Article[];
  // The stand-ins give way as soon as there is real news.
  const articles = [...news, ...own.filter((article) => news.length === 0 || !article.sample)];

  // Newest first, with undated entries falling to the end rather than the front.
  const ordered = [...articles].sort((a, b) => (b.date || '').localeCompare(a.date || ''));

  return (
    <div className="w-full">
      {/* Hero · P5, the same band as Vision & Values: a designed 1920×820 slide with its left
          half kept clear, so the copy sits there in ink with no scrim and the headline in the
          orange sweep. */}
      <AboutHero
        banner
        overlay="none"
        eyebrow={header.eyebrow}
        title={header.title}
        lede={header.lede}
        image={heroImg.src}
        imageAlt="A stethoscope and pulse oximeter on a desk, beside photographs of the Bishnoi team at a medical conference, at an exhibition stand and in a meeting"
        imagePosition="center"
      />

      <section className="section section-white">
        <div className="wrap">
          {ordered.length > 0 ? (
            <NewsFeed
              title={feed.title}
              lede={feed.lede}
              searchPlaceholder={feed.searchPlaceholder}
              items={ordered.map(toNewsItem)}
            />
          ) : (
            /* Shown until the first entry lands in articlesData.json, so the page is never blank. */
            <div className="border border-line rounded-2xl px-8 py-12 text-center max-w-2xl mx-auto">
              <NoArticlesArt className="mx-auto mb-3 block h-auto w-full max-w-[320px]" />
              <h2 className="font-sans text-2xl font-bold text-ink mb-3">{emptyState.title}</h2>
              <p className="text-ink-soft leading-relaxed max-w-lg mx-auto mb-8">{emptyState.body}</p>
              <Link href={emptyState.ctaHref} className="btn btn-primary">
                {emptyState.ctaText}
              </Link>
            </div>
          )}
        </div>
      </section>

    </div>
  );
}
