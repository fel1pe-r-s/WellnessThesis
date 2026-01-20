import type { Metadata } from 'next'
import { Inter, Playfair_Display } from 'next/font/google'
import './globals.css'
import ReactQueryProvider from '@/lib/providers/ReactQueryProvider'

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
      <body className={`${inter.variable} ${playfair.variable} font-sans`}>
      
          <ReactQueryProvider>
            {children}
          </ReactQueryProvider>
      
      </body>
    </html>
  );
}

