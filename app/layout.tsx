import { GoogleAnalytics } from '@next/third-parties/google'
import type { Metadata, Viewport } from 'next'
import { Inter, Plus_Jakarta_Sans } from 'next/font/google'
import { AccessibilityProvider } from '@/components/accessibility-provider'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-jakarta',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Sora — Inclusive Jobs & Adaptive Skills for PWDs in Nigeria',
  description:
    'Sora is an inclusive job-matching and adaptive skills platform for Persons with Disabilities in Nigeria. From disability-aware profiling to matched job placement—build a career that fits you.',
  generator: 'sora',
  keywords: [
    'Sora',
    'disability jobs Nigeria',
    'inclusive employment',
    'adaptive learning',
    'accessible skills platform',
    'PWD Nigeria',
    'NCC Hackathon',
  ],
}

export const viewport: Viewport = {
  themeColor: '#0F172A',
  userScalable: true,
  initialScale: 1,
  width: 'device-width',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${jakarta.variable} bg-background`}
    >
      <body className="font-sans antialiased">
        <AccessibilityProvider>{children}</AccessibilityProvider>
        <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID!} />
      </body>
    </html>
  )
}
