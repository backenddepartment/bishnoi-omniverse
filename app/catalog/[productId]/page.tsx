import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowRight, CheckCircle, Mail, Phone } from 'lucide-react';
import catalogData from '@/lib/data/catalogData.json';
import contactData from '@/lib/data/contactData.json';
import { getCategoryIcon } from '@/lib/catalogIcons';
import { productImages } from '@/lib/catalogImages';

export function generateStaticParams() {
  return catalogData.products.map((product) => ({ productId: product.id }));
}

export default function ProductDetailPage({ params }: { params: { productId: string } }) {
  const product = catalogData.products.find((p) => p.id === params.productId);
  if (!product) notFound();

  const category = catalogData.categories.find((c) => c.id === product.categoryId);
  const Icon = getCategoryIcon(product.categoryId);
  const photo = productImages[product.id];
  const { email, hotline } = contactData.directContact;

  return (
    <div className="w-full catalog-page">
      {/* Breadcrumb */}
      <div className="border-b border-line">
        <div className="wrap py-4 flex flex-wrap items-center gap-1.5 text-xs text-muted">
          <Link href="/" className="no-underline text-muted hover:text-ink">
            Home
          </Link>
          <span>/</span>
          <Link href="/catalog" className="no-underline text-muted hover:text-ink">
            Catalog
          </Link>
          {category && (
            <>
              <span>/</span>
              <Link href={`/catalog?category=${category.id}`} className="no-underline text-muted hover:text-ink">
                {category.name}
              </Link>
            </>
          )}
          <span>/</span>
          <span className="text-ink font-medium">{product.name}</span>
        </div>
      </div>

      <section className="section-tight">
        <div className="wrap grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-12 items-start">
          {/* Center — product visual with the compliance detail stacked underneath */}
          <div>
            <div>
              {photo ? (
                <figure className="m-0 w-full max-w-[380px]">
                  <img
                    src={photo.src}
                    alt={photo.alt}
                    className="w-full aspect-square object-cover rounded-2xl bg-paper-2"
                    loading="eager"
                  />
                  <figcaption className="text-[11px] text-muted mt-2">
                    Photo:{' '}
                    <a
                      href={photo.source}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-muted hover:text-accent-dark"
                    >
                      {photo.credit}
                    </a>
                  </figcaption>
                </figure>
              ) : (
                <div className="w-full max-w-[380px] aspect-square rounded-2xl bg-accent-tint flex items-center justify-center">
                  <Icon className="w-24 h-24 text-accent-dark" strokeWidth={1.25} />
                </div>
              )}
              <div className="flex flex-wrap gap-1.5 mt-3">
                {product.visualTags.map((tag, idx) => (
                  <span key={idx} className="text-[11px] font-semibold text-muted">
                    {idx > 0 && <span className="mr-1.5 text-line">|</span>}
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            <div className="mt-8 space-y-6">
              <div>
                <h3 className="font-sans text-sm font-bold text-ink mb-2.5">
                  Why It&apos;s Safe &amp; Compliant
                </h3>
                <ul className="space-y-1.5 text-sm text-ink-soft m-0 p-0 list-none">
                  {product.whyItsSafe.map((bullet, idx) => (
                    <li key={idx} className="flex items-start gap-2 leading-snug">
                      <CheckCircle className="w-3.5 h-3.5 text-accent shrink-0 mt-1" />
                      <span>{bullet}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="font-sans text-sm font-bold text-ink mb-2">Specifications</h3>
                <p className="text-[13px] text-ink-soft font-mono leading-relaxed m-0">{product.specs}</p>
                <p className="text-xs text-muted mt-2 m-0">
                  Compliance certificate available on request — contact our sourcing team for the
                  full documentation dossier.
                </p>
              </div>
            </div>
          </div>

          {/* Right — details & how to order */}
          <div>
            {category && (
              <span className="inline-block rounded-full bg-accent-tint px-3 py-1 text-xs font-bold uppercase tracking-wide text-accent-dark mb-4">
                {category.name}
              </span>
            )}
            <h1 className="text-2xl md:text-3xl font-bold text-ink leading-snug mb-3">{product.name}</h1>
            <div className="text-xs font-semibold text-muted mb-4">
              Brand: <span className="text-ink font-semibold">{product.brand}</span> | Origin:{' '}
              <span className="text-ink font-semibold">{product.origin}</span>
            </div>
            <p className="text-ink-soft leading-relaxed mb-6">{product.whatItDoes}</p>

            <div className="info-card">
              <span className="text-xs font-semibold uppercase tracking-wide text-accent block mb-1">How to Order</span>
              <h3 className="font-sans text-base font-bold text-ink mb-1">Reach out to our team for pricing</h3>
              <p className="text-sm text-ink-soft mb-4">
                Every quote is reviewed by a dedicated case manager and returned within 24 hours.
              </p>
              <Link
                href={`/contact?type=hospital-supply&product=${encodeURIComponent(product.name)}`}
                className="btn btn-primary w-full justify-center mb-5"
              >
                Request This Product <ArrowRight />
              </Link>

              <div className="border-t border-line pt-4 space-y-2">
                <span className="text-xs font-semibold uppercase tracking-wide text-muted block">Customer Service</span>
                <a href={`mailto:${email}`} className="flex items-center gap-2 text-sm text-ink hover:text-accent-dark no-underline">
                  <Mail className="w-3.5 h-3.5 text-accent shrink-0" /> {email}
                </a>
                <div className="flex items-center gap-2 text-sm text-ink">
                  <Phone className="w-3.5 h-3.5 text-accent shrink-0" /> {hotline}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
