import type { Metadata, Viewport } from "next"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import Header from "@/components/layout/Header"
import Footer from "@/components/layout/Footer"
import { AuthProvider } from "@/components/providers/AuthProvider"
import { ProductProvider } from "@/contexts/ProductContext"
import { CartProvider } from "@/contexts/CartContext"
import AIChatWidget from "@/components/AIChatWidget"

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0a" },
  ],
}

export const metadata: Metadata = {
  title: "FarmConnect — Premium B2B Agricultural Marketplace",
  description: "Connect directly with farmers and businesses. Eliminate middlemen, ensure fair pricing, and trade fresh produce with verified sellers across India.",
  generator: "Next.js",
  referrer: "origin-when-cross-origin",
  keywords: [
    "FarmConnect",
    "Agriculture",
    "B2B Marketplace",
    "Farm to Business",
    "Organic Produce",
    "Indian Farmers",
    "Fresh Produce",
    "Wholesale Agriculture",
  ],
  authors: [{ name: "FarmConnect Team" }],
  creator: "FarmConnect Team",
  publisher: "FarmConnect",
  icons: {
    icon: "agri.png",
    shortcut: "agri.png",
    apple: "agri.png",
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased">
        <AuthProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <ProductProvider>
              <CartProvider>
                <div className="flex min-h-screen flex-col">
                  <Header />
                  <main className="flex-1">{children}</main>
                  <Footer />
                </div>
                <AIChatWidget />
              </CartProvider>
            </ProductProvider>
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
