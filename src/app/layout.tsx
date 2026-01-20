import type { Metadata } from 'next'
import { Inter, Playfair_Display } from 'next/font/google'
import './globals.css'

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
    template: '%s | WellnessThesis',
    default: 'WellnessThesis | Wellness, Beauty, Health and Fitness',
  },
  description: 'Sharing the latest discoveries in wellness, beauty, health, and fitness. Practical tips and insights for healthy living.',
  keywords: ['Wellness', 'Healthy Living', 'Beauty', 'Fitness', 'Recipes', 'Weight Loss'],
  authors: [{ name: 'WellnessThesis' }],
  openGraph: {
    siteName: 'WellnessThesis',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    site: '@wellnessthesis',
  },
  icons: {
    icon: '/assets/favicon.png',
  },
}


import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { query } from '@/lib/db'

async function getCategories() {
  const { rows } = await query('SELECT DISTINCT category FROM posts WHERE published = true');
  return rows.map((r: any) => r.category);
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const categories = await getCategories();

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" />
      </head>
      <body className={`${inter.variable} ${playfair.variable} font-sans`}>
        <Header categories={categories} />
        {children}
        <Footer />


        {process.env.NEXT_PUBLIC_GA_ID && (
          <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID} />
        )}
      </body>
    </html>
  );
}
