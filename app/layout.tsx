import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import Script from 'next/script';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://frameapp.uk'),

  title: 'Frame - Creative Network',

  description:
    'Frame is a creative social network for photographers, artists, designers and visual creators.',

  verification: {
    google: 'KiLTgCkOd0eNC-ulD_qqpGr6kqpyLNcf2apx4UKM85U',
  },

  openGraph: {
    title: 'Frame - Creative Network',
    description:
      'Frame is a creative social network for photographers, artists, designers and visual creators.',
    url: 'https://frameapp.uk',
    siteName: 'Frame',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Frame Creative Network',
      },
    ],
    locale: 'en_GB',
    type: 'website',
  },

  twitter: {
    card: 'summary_large_image',
    title: 'Frame - Creative Network',
    description:
      'The creative network for photographers, artists and visual storytellers.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Frame Creative Network',
      },
    ],
  },


};
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col"><Script
  src="https://www.googletagmanager.com/gtag/js?id=AW-18275620443"
  strategy="afterInteractive"
/>

<Script id="google-ads" strategy="afterInteractive">
  {`
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());

    gtag('config', 'AW-18275620443');
  `}
</Script><meta name="google-site-verification" content="KiLTgCkOd0eNC-ulD_qqpGr6kqpyLNcf2apx4UKM85U" />{children}</body>
    </html>
  );
}