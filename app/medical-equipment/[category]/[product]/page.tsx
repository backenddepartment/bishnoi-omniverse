import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import catalogData from '@/lib/data/catalogData.json';
import { ProductDetail, type PdpProduct, type PdpRelated } from '@/components/ProductDetail';
import { PRODUCT_GALLERIES } from '@/lib/productImageOverrides';
import { categoryPath, productPath } from '@/lib/catalogRoutes';
import { productDescription, productTitle } from '@/lib/categorySeo';
import { productGuide } from '@/lib/productGuides';
import { JsonLd, pageMetadata } from '@/lib/seo';

interface Params {
  category: string;
  product: string;
}

// A product is only served under its own category, so each one has exactly one address.
function findProduct(params: Params) {
  return catalogData.products.find(
    (p) => p.id === params.product && p.categoryId === params.category
  );
}

export function generateStaticParams(): Params[] {
  return catalogData.products.map((product) => ({
    category: product.categoryId,
    product: product.id,
  }));
}

export function generateMetadata({ params }: { params: Params }): Metadata {
  const product = findProduct(params);
  if (!product) return {};
  const guide = productGuide(product.id);
  return pageMetadata({
    title: guide?.title ?? productTitle(product),
    description: guide?.description ?? productDescription(product),
    path: productPath(product),
  });
}

export default function ProductDetailPage({ params }: { params: Params }) {
  const product = findProduct(params);
  if (!product) notFound();

  const category = catalogData.categories.find((c) => c.id === product.categoryId);
  const subcategory = catalogData.subcategories.find((s) => s.id === product.subcategoryId);

  // The category's other subcategories, so the foot of the page leads sideways through the range.
  const related: PdpRelated[] = catalogData.subcategories.filter(
    (s) => s.categoryId === product.categoryId && s.id !== product.subcategoryId
  );

  const image = PRODUCT_GALLERIES[product.id]?.[0] ?? (product as PdpProduct).image;

  // No schema.org Product data on purpose. Google only accepts Product markup that has an offer
  // (a price), a review or a rating, and prices here are quoted per order, so the markup could
  // never qualify for product results and only showed as an error in Search Console ("Either
  // offers, review, or aggregateRating should be specified"). Add it back, with an `offers` price,
  // once prices are published. Breadcrumb data comes from the Breadcrumbs component.

  // A hand-written buying guide, where the product has one (lib/productGuides.ts). Its FAQ is
  // also published as FAQPage data, with the same questions and answers as the page shows.
  const guide = productGuide(product.id);
  const guideCategories = (guide?.relatedCategoryIds ?? []).flatMap((id) => {
    const c = catalogData.categories.find((x) => x.id === id);
    return c ? [{ label: c.name, href: categoryPath(c.id) }] : [];
  });
  const guideProducts = (guide?.relatedProductIds ?? []).flatMap((id) => {
    const p = catalogData.products.find((x) => x.id === id);
    return p ? [{ label: p.name, href: productPath(p) }] : [];
  });
  const faqData = guide && {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: guide.faq.map((item) => ({
      '@type': 'Question',
      name: item.q,
      acceptedAnswer: { '@type': 'Answer', text: item.a },
    })),
  };

  return (
    <>
      {faqData && <JsonLd data={faqData} />}
      <ProductDetail
        product={{
          ...(product as PdpProduct),
          image,
          gallery: PRODUCT_GALLERIES[product.id],
        }}
        categoryName={category?.name}
        categoryId={category?.id}
        subcategoryName={subcategory?.name}
        related={related}
        guide={guide}
        guideCategories={guideCategories}
        guideProducts={guideProducts}
      />
    </>
  );
}
