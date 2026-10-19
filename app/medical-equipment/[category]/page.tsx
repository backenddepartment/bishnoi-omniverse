import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import catalogData from '@/lib/data/catalogData.json';
import { CatalogBrowser } from '@/components/catalog/CatalogBrowser';
import { categoryPath } from '@/lib/catalogRoutes';
import { categorySeo } from '@/lib/categorySeo';
import { pageMetadata } from '@/lib/seo';

interface Params {
  category: string;
}

export function generateStaticParams(): Params[] {
  return catalogData.categories.map((category) => ({ category: category.id }));
}

export function generateMetadata({ params }: { params: Params }): Metadata {
  const category = catalogData.categories.find((c) => c.id === params.category);
  if (!category) return {};
  const { title, description } = categorySeo(category);
  return pageMetadata({ title, description, path: categoryPath(category.id) });
}

export default function CategoryPage({ params }: { params: Params }) {
  if (!catalogData.categories.some((c) => c.id === params.category)) notFound();
  return <CatalogBrowser categoryId={params.category} />;
}
