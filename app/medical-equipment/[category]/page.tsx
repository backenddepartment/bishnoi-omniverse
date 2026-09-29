import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import catalogData from '@/lib/data/catalogData.json';
import { CatalogBrowser } from '@/components/catalog/CatalogBrowser';
import { getCategoryOverview } from '@/lib/categoryOverviews';

interface Params {
  category: string;
}

export function generateStaticParams(): Params[] {
  return catalogData.categories.map((category) => ({ category: category.id }));
}

export function generateMetadata({ params }: { params: Params }): Metadata {
  const category = catalogData.categories.find((c) => c.id === params.category);
  if (!category) return {};
  return {
    title: `${category.name} | Medical Equipment | Bishnoi Omniverse`,
    description: getCategoryOverview(category),
  };
}

export default function CategoryPage({ params }: { params: Params }) {
  if (!catalogData.categories.some((c) => c.id === params.category)) notFound();
  return <CatalogBrowser categoryId={params.category} />;
}
