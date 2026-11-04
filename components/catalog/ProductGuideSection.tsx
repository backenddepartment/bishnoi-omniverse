import React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import type { ProductGuide } from '@/lib/productGuides';

/** Highlights "[CONFIRM: …]" notes, so an unchecked claim is easy to spot in review. */
function Copy({ text }: { text: string }) {
  const parts = text.split(/(\[CONFIRM[^\]]*\])/g);
  return (
    <>
      {parts.map((part, i) =>
        part.startsWith('[CONFIRM') ? (
          <mark key={i} className="pdp-confirm">
            {part}
          </mark>
        ) : (
          <React.Fragment key={i}>{part}</React.Fragment>
        )
      )}
    </>
  );
}

export type GuideLink = { label: string; href: string };

/**
 * A product page's buying guide (lib/productGuides.ts): the copy, a Request a Quote button that
 * opens the page's inquiry form, a FAQ and links to related categories and products. The FAQ uses
 * <details>, so every answer is in the HTML (and matches the FAQPage data) while staying folded.
 * Headings start at H2: the page's only H1 is the product header.
 */
export function ProductGuideSection({
  guide,
  categories,
  products,
  onRequestQuote,
}: {
  guide: ProductGuide;
  categories: GuideLink[];
  products: GuideLink[];
  onRequestQuote: () => void;
}) {
  const quoteButton = (
    <a
      href="#request-quote"
      className="btn btn-primary"
      onClick={(e) => {
        e.preventDefault();
        onRequestQuote();
      }}
    >
      Request a Quote <ArrowRight className="w-4 h-4" />
    </a>
  );

  return (
    <section className="pdp-guide" aria-label="Buying guide">
      <div className="wrap pdp-guide-wrap">
        <div className="pdp-guide-copy">
          {guide.intro.map((p, i) => (
            <p key={i} className="pdp-guide-lede">
              <Copy text={p} />
            </p>
          ))}

          {guide.sections.map((section) => (
            <div key={section.heading} className="pdp-guide-block">
              <h2>{section.heading}</h2>
              {section.bullets && (
                <ul>
                  {section.bullets.map((b, i) => (
                    <li key={i}>
                      <Copy text={b} />
                    </li>
                  ))}
                </ul>
              )}
              {section.paragraphs?.map((p, i) => (
                <p key={i}>
                  <Copy text={p} />
                </p>
              ))}
              {section.steps && (
                <ol>
                  {section.steps.map((s, i) => (
                    <li key={i}>
                      <Copy text={s} />
                    </li>
                  ))}
                </ol>
              )}
            </div>
          ))}

          <div className="pdp-guide-cta">
            <p>Tell us how many units and which configuration you need, and we will send a quotation.</p>
            {quoteButton}
          </div>

          <div className="pdp-guide-block">
            <h2>Frequently asked questions</h2>
            <div className="pdp-guide-faq">
              {guide.faq.map((item, i) => (
                <details key={item.q} open={i === 0}>
                  <summary>{item.q}</summary>
                  <p>
                    <Copy text={item.a} />
                  </p>
                </details>
              ))}
            </div>
          </div>
        </div>

        <aside className="pdp-guide-side" aria-label="Related pages">
          <h2>Related categories</h2>
          <ul>
            {categories.map((c) => (
              <li key={c.href}>
                <Link href={c.href}>
                  {c.label} <ArrowRight className="w-4 h-4" aria-hidden="true" />
                </Link>
              </li>
            ))}
          </ul>
          {products.length > 0 && (
            <>
              <h2>Related products</h2>
              <ul>
                {products.map((p) => (
                  <li key={p.href}>
                    <Link href={p.href}>
                      {p.label} <ArrowRight className="w-4 h-4" aria-hidden="true" />
                    </Link>
                  </li>
                ))}
              </ul>
            </>
          )}
          {quoteButton}
        </aside>
      </div>
    </section>
  );
}
