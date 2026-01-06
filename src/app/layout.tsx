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
    default: 'HealthThesis | Science-Based Wellness, Beauty & Metabolism',
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
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <body className="font-sans antialiased text-gray-900 bg-[#F8FAFC]">
        <ReactQueryProvider>
          {children}
        </ReactQueryProvider>
        <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID || ''} />
      </body>
    </html>
  )
}
