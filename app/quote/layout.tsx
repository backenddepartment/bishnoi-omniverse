import type { Metadata } from 'next';

// The quote page is a client component, so its metadata lives here. It shows the visitor's own
// list, so there is nothing on it for a search engine.
export const metadata: Metadata = {
  title: 'Your Quote | Bishnoi Omniverse',
  description: 'Review the equipment on your quote list and send it for a formal, line-by-line quotation.',
  robots: { index: false, follow: true },
};

export default function QuoteLayout({ children }: { children: React.ReactNode }) {
  return children;
}
