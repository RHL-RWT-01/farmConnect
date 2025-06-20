import type { Metadata, Viewport } from "next"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import Header from "@/components/layout/Header"
import Footer from "@/components/layout/Footer"

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#000000" },
  ],
}

export const metadata: Metadata = {
  title: "AgriConnect",
  description: "Connecting Farmers and Consumers",
  generator: "Next.js",
  referrer: "origin-when-cross-origin",
  keywords: ["AgriConnect", "Farmers", "Consumers", "Agriculture"],
  authors: [{ name: "AgriConnect Team" }],
  creator: "AgriConnect Team",
  publisher: "AgriConnect Team",
  icons:{
    icon:"agri.png",
    shortcut: "agri.png",
    apple: "agri.png",
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <div className="flex min-h-screen flex-col">
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}
