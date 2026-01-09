import type { Metadata } from 'next'
import { Inter, Playfair_Display } from 'next/font/google'
import './globals.css'
import ReactQueryProvider from '@/lib/providers/ReactQueryProvider'
import { GoogleAnalytics } from '@next/third-parties/google'
import Script from 'next/script'

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
})

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
})

export const metadata: Metadata = {
  title: {
    template: '%s | HealthThesis',
    default: 'HealthThesis | Well-Being, Beauty, Health and Fitness',
  },
  description: 'Sharing the latest discoveries in wellness, beauty, health, and fitness. Practical tips and insights for healthy living.',
  keywords: ['Wellness', 'Healthy Living', 'Beauty', 'Fitness', 'Recipes', 'Weight Loss'],
  authors: [{ name: 'HealthThesis' }],
  openGraph: {
    siteName: 'HealthThesis',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    site: '@healththesis',
  },
  icons: {
    icon: '/assets/favicon.png',
  },
}

import { ThemeProvider } from '@/components/ThemeProvider';
import NewsletterPopup from '@/components/NewsletterPopup';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const adsenseId = process.env.NEXT_PUBLIC_ADSENSE_ID || 'ca-pub-XXXX'; // User should set this in .env

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" />
        {/* Google AdSense Script */}
        <Script
          async
          src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adsenseId}`}
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
      </head>
      <body className={`${inter.variable} ${playfair.variable} font-sans`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
          forcedTheme="light"
          disableTransitionOnChange
        >
          <ReactQueryProvider>
            {children}
            <NewsletterPopup />
          </ReactQueryProvider>
        </ThemeProvider>
        {process.env.NEXT_PUBLIC_GA_ID && (
          <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID} />
        )}
      </body>
    </html>
  );
}
