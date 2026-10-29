import type { Metadata } from 'next';
import { Inter, DM_Mono, Playfair_Display } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

// Inter is self-hosted via next/font/google as the primary sans-serif typeface,
// ensuring consistent rendering across all platforms (macOS, iOS, Windows, Android).
const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
});

const dmMono = DM_Mono({
  subsets: ['latin'],
  weight: ['500'],
  variable: '--font-dm-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://seedengineering.ae'),
  title: {
    default: 'SEED Engineering — Engineering high-performance buildings',
    template: '%s — SEED Engineering',
  },
  description:
    'SEED delivers integrated MEP design, supervision, sustainability, BIM coordination, and performance-focused engineering services across the Middle East, Africa, and Asia.',

  openGraph: {
    title: 'SEED Engineering — Engineering high-performance buildings',
    description:
      'SEED delivers integrated MEP design, supervision, sustainability, BIM coordination, and performance-focused engineering services across the Middle East, Africa, and Asia.',
    url: 'https://seedengineering.ae',
    siteName: 'SEED Engineering',
    locale: 'en_AE',
    type: 'website',
    images: [
      {
        url: '/seedlogo.png',
        width: 1200,
        height: 630,
        alt: 'SEED Engineering Consultants',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SEED Engineering — Engineering high-performance buildings',
    description:
      'SEED delivers integrated MEP design, supervision, sustainability, BIM coordination, and performance-focused engineering services across the Middle East, Africa, and Asia.',
    images: ['/seedlogo.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable} ${dmMono.variable}`}>
      <body className="font-sans bg-bone text-body antialiased">
        <Navbar />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
