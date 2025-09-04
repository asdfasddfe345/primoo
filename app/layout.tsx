import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Navbar } from '@/components/layout/navbar'
import { Footer } from '@/components/layout/footer'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: {
    default: 'PrimoJobs - Premier Job Portal for Career Growth',
    template: '%s | PrimoJobs'
  },
  description: 'Find your dream job with PrimoJobs. Explore thousands of opportunities, join career webinars, read industry insights, and access professional services.',
  keywords: ['jobs', 'careers', 'employment', 'job search', 'hiring', 'webinars', 'career advice'],
  authors: [{ name: 'PrimoJobs' }],
  creator: 'PrimoJobs',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://primojobs.com',
    siteName: 'PrimoJobs',
    title: 'PrimoJobs - Premier Job Portal for Career Growth',
    description: 'Find your dream job with PrimoJobs. Explore opportunities, webinars, and career services.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'PrimoJobs',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@primojobs',
    creator: '@primojobs',
    title: 'PrimoJobs - Premier Job Portal for Career Growth',
    description: 'Find your dream job with PrimoJobs. Explore opportunities, webinars, and career services.',
    images: ['/twitter-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="relative flex min-h-screen flex-col">
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  )
}