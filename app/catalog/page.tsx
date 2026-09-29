import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, PlusCircle } from 'lucide-react';
import catalogData from '@/lib/data/catalogData.json';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { LegacyCatalogQueryRedirect } from '@/components/catalog/LegacyRedirect';
import {
  CATALOG_LABEL,
  EQUIPMENT_LABEL,
  EQUIPMENT_PATH,
  categoryPath,
  subcategoryPath,
  subcategorySlug,
} from '@/lib/catalogRoutes';
import bannerImg from '@/app/assets/bannermedical.png';

export const metadata: Metadata = {
  title: 'Catalog | All Categories | Bishnoi Omniverse',
  description:
    'Every medical equipment category supplied by Bishnoi Omniverse in one place, from gloves and PPE to dialysis, surgical and imaging equipment.',
};

// A long subcategory list is cut here, with a "More" link through to the category's own page, so
// one category cannot stretch its whole row of the grid.
const MAX_SUBCATEGORIES = 5;

/**
 * All Categories: the header's Medical Equipment mega-menu as a page of its own. Each category
 * heads a list of its subcategories and links to its page, which is where the products are.
 */
export default function CatalogPage() {
  const { categories, subcategories, products } = catalogData;

  const productCount = new Map<string, number>();
  for (const product of products) {
    productCount.set(product.categoryId, (productCount.get(product.categoryId) ?? 0) + 1);
  }

  return (
    <div className="w-full catalog-page">
      <LegacyCatalogQueryRedirect
        categoryIds={categories.map((c) => c.id)}
        subcategories={subcategories.map((s) => ({
          id: s.id,
          categoryId: s.categoryId,
          slug: subcategorySlug(s.id),
        }))}
      />

      <div className="wrap catalog-browser-wrap">
        <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: CATALOG_LABEL }]} />
      </div>

      <section className="catalog-index">
        <div className="wrap catalog-browser-wrap">
          <h1>All Categories</h1>
          {/* The same banner strip the category pages carry, under the page's title. */}
          <img
            className="catalog-page-banner"
            src={bannerImg.src}
            alt="Medical supplies laid out in a row on a pale blue surface: a stethoscope, pulse oximeter, forceps, thermometer, blood pressure monitor, gloves, gauze and face masks"
            loading="eager"
          />

          <div className="catalog-index-group">
            <h2>
              <Link href={EQUIPMENT_PATH} className="menu-link">
                {EQUIPMENT_LABEL}
              </Link>
            </h2>
            <Link href={EQUIPMENT_PATH} className="menu-link catalog-index-all">
              View all {products.length} products <ArrowRight aria-hidden="true" />
            </Link>
          </div>

          <div className="catalog-index-grid">
            {categories.map((category) => {
              const subs = subcategories.filter((s) => s.categoryId === category.id);
              return (
                <section key={category.id} className="catalog-index-cat">
                  <h3>
                    <Link href={categoryPath(category.id)} className="menu-link">
                      <span>{category.name}</span>
                      <span className="catalog-index-count">
                        {productCount.get(category.id) ?? 0}
                        <span className="sr-only"> products</span>
                      </span>
                    </Link>
                  </h3>
                  <ul>
                    {subs.slice(0, MAX_SUBCATEGORIES).map((subcategory) => (
                      <li key={subcategory.id}>
                        <Link href={subcategoryPath(subcategory)} className="menu-link">
                          {subcategory.name}
                        </Link>
                      </li>
                    ))}
                    {subs.length > MAX_SUBCATEGORIES && (
                      <li>
                        <Link href={categoryPath(category.id)} className="menu-link catalog-index-more">
                          More <PlusCircle aria-hidden="true" />
                          <span className="sr-only"> in {category.name}</span>
                        </Link>
                      </li>
                    )}
                  </ul>
                </section>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
