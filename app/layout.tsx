import type { Metadata } from 'next';
import { Inter, DM_Mono, Playfair_Display } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

// Inter is the closest free, geometric sans to Helvetica Now Display — used as fallback
// after the system Helvetica stack so designers on Mac get the brand face natively.
const inter = Inter({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-inter',
  display: 'swap',
});

const playfair = Playfair_Display({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-playfair',
  display: 'swap',
  style: ['normal', 'italic'],
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
    default: 'Seed Engineering — MEP & Pool Consultancy, Dubai',
    template: '%s — Seed Engineering',
  },
  description:
    'Seed Engineering is a Dubai-based MEP and swimming pool consultancy. We engineer the systems inside great buildings.',
  openGraph: {
    title: 'Seed Engineering',
    description:
      'A Dubai-based MEP and pool consultancy. Story-driven engineering for buildings that work.',
    type: 'website',
    siteName: 'Seed Engineering',
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
