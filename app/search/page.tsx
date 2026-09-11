import type { Metadata } from 'next';
import { Suspense } from 'react';
import { SearchResultsView } from '@/components/SearchResultsView';

export const metadata: Metadata = {
  title: 'Search',
  // Result pages are generated per query; keep them out of search engines' indexes.
  robots: { index: false, follow: true },
};

// The query lives in ?q=, which a static export only knows in the browser, so the view reads it
// client-side inside a Suspense boundary.
export default function SearchPage() {
  return (
    <Suspense fallback={null}>
      <SearchResultsView />
    </Suspense>
  );
}
