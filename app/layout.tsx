import type { Metadata } from 'next';
import { Inter, DM_Mono } from 'next/font/google';
import localFont from 'next/font/local';
import './globals.css';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

// Inter is self-hosted via next/font/google as the primary sans-serif typeface,
// ensuring consistent rendering across all platforms (macOS, iOS, Windows, Android).
const inter = Inter({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-inter',
  display: 'swap',
});

const playfair = localFont({
  src: [
    {
      path: '../public/fonts/playfair/PlayfairDisplay-Bold.woff2',
      weight: '700',
      style: 'normal',
    },
    {
      path: '../public/fonts/playfair/PlayfairDisplay-Regular.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../public/fonts/playfair/PlayfairDisplay-Italic.woff2',
      weight: '400',
      style: 'italic',
    },
    {
      path: '../public/fonts/playfair/PlayfairDisplay-Medium.woff2',
      weight: '500',
      style: 'normal',
    },
    {
      path: '../public/fonts/playfair/PlayfairDisplay-MediumItalic.woff2',
      weight: '500',
      style: 'italic',
    },
    {
      path: '../public/fonts/playfair/PlayfairDisplay-SemiBold.woff2',
      weight: '600',
      style: 'normal',
    },
    {
      path: '../public/fonts/playfair/PlayfairDisplay-SemiBoldItalic.woff2',
      weight: '600',
      style: 'italic',
    },
    {
      path: '../public/fonts/playfair/PlayfairDisplay-BoldItalic.woff2',
      weight: '700',
      style: 'italic',
    },
  ],
  variable: '--font-playfair',
  display: 'swap',
});

const dmMono = DM_Mono({
  subsets: ['latin'],
  weight: ['300', '400', '500'],
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
