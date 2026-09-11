import { notFound } from 'next/navigation';
import catalogData from '@/lib/data/catalogData.json';
import { ProductDetail, type PdpProduct, type PdpRelated } from '@/components/ProductDetail';
import { PRODUCT_GALLERIES } from '@/lib/productImageOverrides';

export function generateStaticParams() {
  return catalogData.products.map((product) => ({ productId: product.id }));
}

export default function ProductDetailPage({ params }: { params: { productId: string } }) {
  const product = catalogData.products.find((p) => p.id === params.productId);
  if (!product) notFound();

  const category = catalogData.categories.find((c) => c.id === product.categoryId);
  const subcategory = catalogData.subcategories.find((s) => s.id === product.subcategoryId);
  const subcategoryName = (id: string) =>
    catalogData.subcategories.find((s) => s.id === id)?.name;

  // Nearest neighbours first: same subcategory, then the rest of the category, then anything.
  const others = catalogData.products.filter((p) => p.id !== product.id);
  const related: PdpRelated[] = [
    ...others.filter((p) => p.subcategoryId === product.subcategoryId),
    ...others.filter(
      (p) => p.categoryId === product.categoryId && p.subcategoryId !== product.subcategoryId
    ),
    ...others.filter((p) => p.categoryId !== product.categoryId),
  ]
    .slice(0, 4)
    .map((p) => ({
      id: p.id,
      name: p.name,
      categoryId: p.categoryId,
      subcategoryName: subcategoryName(p.subcategoryId),
      sterility: p.sterility,
      image: PRODUCT_GALLERIES[p.id]?.[0],
    }));

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
