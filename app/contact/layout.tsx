import type { Metadata } from 'next';
import { pageMetadata } from '@/lib/seo';

// The contact page is a client component, so its metadata lives here.
export const metadata: Metadata = pageMetadata({
  title: 'Contact Us | Request a Quote | Bishnoi Omniverse',
  description:
    'Send us a product list, an equipment requirement or a partnership inquiry. No login or account needed.',
  path: '/contact/',
});

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return children;
}
