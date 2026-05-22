/* eslint-disable @next/next/no-page-custom-font */
import type { Metadata, Viewport } from 'next'
import { NextIntlClientProvider } from 'next-intl'
import { getLocale, getMessages } from 'next-intl/server'
import { Toaster } from 'sonner'
import OnboardingTour from '@/components/shared/OnboardingTour'
import './globals.css'

export const viewport: Viewport = {
  themeColor: '#2563EB',
  width: 'device-width',
  initialScale: 1,
}

export const metadata: Metadata = {
  title: {
    default: 'WorkBridge UK — Construction Jobs & Workers',
    template: '%s | WorkBridge UK',
  },
  description:
    'Find construction jobs and skilled workers across the UK. Bricklayers, electricians, plumbers and more — connect directly with employers and agencies.',
  keywords: ['construction jobs uk', 'building jobs', 'bricklayer jobs', 'electrician jobs', 'skilled trades uk'],
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'),
  openGraph: {
    type: 'website',
    locale: 'en_GB',
    siteName: 'WorkBridge UK',
  },
  manifest: '/manifest.json',
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const locale = await getLocale()
  const messages = await getMessages()

  return (
    <html lang={locale} suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=Outfit:wght@300;400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <NextIntlClientProvider messages={messages} locale={locale}>
          {children}
          <Toaster
            position="top-right"
            richColors
            toastOptions={{
              duration: 4000,
              style: { fontFamily: "'Inter', sans-serif", borderRadius: '14px' },
            }}
          />
          <OnboardingTour />
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
