import type { Metadata } from 'next'
import { Inter, Playfair_Display } from 'next/font/google'
import './globals.css'
import ReactQueryProvider from '@/lib/providers/ReactQueryProvider'
import { GoogleAnalytics } from '@next/third-parties/google'

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
  description: 'Uncover the science behind metabolic health, natural beauty, and longevity. Expert insights for a healthier, more vibrant you over 35.',
  keywords: ['Metabolic Health', 'Mitochondria', 'Natural Beauty', 'Anti-aging', 'Wellness', 'Science-based health'],
  authors: [{ name: 'HealthThesis Editorial Team' }],
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
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" />
      </head>
      <body className={inter.className}>
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
        <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID || ''} />
      </body>
    </html>
  );
}
