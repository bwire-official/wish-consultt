import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";
import GlobalProgressBar from "@/components/ui/GlobalProgressBar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Wish Consult - Healthcare Education & Consultancy",
  description: "Empowering healthcare professionals with comprehensive education, expert consultancy, and cutting-edge courses. Transform your healthcare career with Wish Consult.",
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/favicon.svg', type: 'image/svg+xml' }
    ],
    apple: '/apple-touch-icon.png',
  },
  manifest: '/manifest.json',
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://wishconsult.app',
    title: 'Wish Consult - Healthcare Education & Consultancy',
    description: 'Empowering healthcare professionals with comprehensive education, expert consultancy, and cutting-edge courses.',
    siteName: 'Wish Consult',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Wish Consult - Healthcare Education & Consultancy',
    description: 'Empowering healthcare professionals with comprehensive education, expert consultancy, and cutting-edge courses.',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#6366f1',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#6366f1" />
        <script defer data-domain="wishconsult.app" src="https://plausible.io/js/script.file-downloads.hash.outbound-links.pageview-props.tagged-events.js"></script>
        <script>window.plausible = window.plausible || function() { (window.plausible.q = window.plausible.q || []).push(arguments) }</script>
      </head>
      <body className={inter.className} suppressHydrationWarning>
        <Providers>
          <GlobalProgressBar />
          {children}
        </Providers>
      </body>
    </html>
  );
}
