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
  title: {
  default: 'Frame - Creative Network',
  template: '%s | Frame',
},
  description:
    'The creative network for photographers, artists and visual storytellers.',
  metadataBase: new URL('https://frameapp.uk'),

  icons: {
    icon: '/favicon.ico',
    apple: '/frame-icon.png',
  },

  openGraph: {
  title: 'Frame - Creative Network',
  description:
    'The creative network for photographers, artists and visual storytellers.',
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
  images: ['/og-image.png'],
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
</Script>{children}</body>
    </html>
  );
}