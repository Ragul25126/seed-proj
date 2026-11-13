import type { Metadata } from 'next';
import localFont from 'next/font/local';
import { DM_Mono } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

const arimo = localFont({
  src: '../public/fonts/arimo/Arimo-Variable.woff2',
  variable: '--font-arimo',
  display: 'swap',
  weight: '400 700',
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
    <html lang="en" className={`${arimo.variable} ${dmMono.variable}`}>
      <body className="font-sans bg-bone text-body antialiased">
        <Navbar />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
