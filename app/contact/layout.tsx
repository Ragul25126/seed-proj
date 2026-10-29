import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact Us',
  description:
    'Get in touch with SEED Engineering headquarters in Dubai or regional offices across Singapore and India. Request a technical consultation or MEP fee proposal.',
  alternates: {
    canonical: '/contact',
  },
  openGraph: {
    title: 'Contact Us — SEED Engineering',
    description:
      'Get in touch with SEED Engineering headquarters in Dubai or regional offices across Singapore and India. Request a technical consultation or MEP fee proposal.',
    images: ['/seedlogo.png'],
  },
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return children;
}

