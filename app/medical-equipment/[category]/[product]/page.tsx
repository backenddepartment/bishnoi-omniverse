import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import catalogData from '@/lib/data/catalogData.json';
import { ProductDetail, type PdpProduct, type PdpRelated } from '@/components/ProductDetail';
import { PRODUCT_GALLERIES } from '@/lib/productImageOverrides';

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
  return {
    title: `${product.name} | Bishnoi Omniverse`,
    description: product.description,
  };
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

  return (
    <ProductDetail
      product={{
        ...(product as PdpProduct),
        image: PRODUCT_GALLERIES[product.id]?.[0] ?? (product as PdpProduct).image,
        gallery: PRODUCT_GALLERIES[product.id],
      }}
      categoryName={category?.name}
      categoryId={category?.id}
      subcategoryName={subcategory?.name}
      related={related}
    />
  );
}
