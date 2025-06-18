import type { Metadata, Viewport } from 'next'
import './globals.css'
import { ClerkProvider } from '@clerk/nextjs'
import { dark } from '@clerk/themes'
import AuthProvider from '@/components/providers/sessionProvider'

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#000000' },
  ]
}


export const metadata: Metadata = {
  title: 'AgriConnect',
  description: 'Connecting Farmers and Consumers',
  generator: 'Next.js',
  referrer: 'origin-when-cross-origin',
  keywords: ['AgriConnect', 'Farmers', 'Consumers', 'Agriculture'],
  authors: [{ name: 'AgriConnect Team'}],
  creator: 'AgriConnect Team',
  publisher: 'AgriConnect Team'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <ClerkProvider appearance={{
      baseTheme: dark
    }}>
      <html lang="en">
        <body>
          <AuthProvider>
            {children}
          </AuthProvider>
        </body>
      </html>
    </ClerkProvider>
  )
}
