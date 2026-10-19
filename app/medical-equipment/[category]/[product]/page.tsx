import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import catalogData from '@/lib/data/catalogData.json';
import { ProductDetail, type PdpProduct, type PdpRelated } from '@/components/ProductDetail';
import { PRODUCT_GALLERIES } from '@/lib/productImageOverrides';
import { productPath } from '@/lib/catalogRoutes';
import { productDescription, productTitle } from '@/lib/categorySeo';
import { imageUrl } from '@/lib/sitemapPages';
import { JsonLd, pageMetadata } from '@/lib/seo';
import { absoluteUrl } from '@/lib/siteUrl';

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
  return pageMetadata({
    title: productTitle(product),
    description: productDescription(product),
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

  // schema.org Product data, so search engines know what the page sells. No brand or offer: the
  // catalog has no manufacturer column and prices are quoted per order. Add them here once they are
  // published (an offer with a price is what Google needs for product rich results).
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description,
    sku: product.id,
    category: [category?.name, subcategory?.name].filter(Boolean).join(' > '),
    url: absoluteUrl(`${productPath(product)}/`),
    ...(image ? { image: imageUrl(image.src) } : {}),
  };

  return (
    <>
      <JsonLd data={structuredData} />
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
      />
    </>
  );
}
