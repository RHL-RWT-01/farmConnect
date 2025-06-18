"use client"

import Link from "next/link"
import { useSession, signOut } from "next-auth/react"
import { Sprout, ShoppingCart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "../theme-toggle"
import { scrollToSection } from "@/lib/navigation"

export default function Header() {
  const { data: session } = useSession()
  const isSignedIn = !!session?.user

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">

        {/* Left Logo */}
        <div className="flex items-center gap-2">
          <Sprout className="h-6 w-6 text-green-600" />
          <span className="text-xl font-bold">AgriConnect</span>
        </div>

        {/* Center Navigation */}
        <nav className="hidden md:flex gap-6">
          <Link
            href="#how-it-works"
            onClick={(e) => scrollToSection(e, "#how-it-works")}
            className="text-sm font-medium hover:text-primary"
          >
            How It Works
          </Link>

          <Link
            href="#features"
            onClick={(e) => scrollToSection(e, "#features")}
            className="text-sm font-medium hover:text-primary"
          >
            Features
          </Link>

          <Link
            href="#testimonials"
            onClick={(e) => scrollToSection(e, "#testimonials")}
            className="text-sm font-medium hover:text-primary"
          >
            Testimonials
          </Link>
          <Link href="/products" className="text-sm font-medium hover:text-primary">Products</Link>
        </nav>

        {/* Right Side */}
        <div className="flex items-center gap-4">
          <ThemeToggle />

          {isSignedIn ? (
            <>
              <Button onClick={() => signOut()} variant="ghost" className="text-sm font-medium">
                Logout
              </Button>
              <Link href="/cart">
                <ShoppingCart className="h-6 w-6 text-green-600" />
              </Link>
            </>
          ) : (
            <>
              <Link href="/login">
                <Button variant="ghost" className="text-sm font-medium hover:underline underline-offset-4">
                  Log in
                </Button>
              </Link>
              <Link href="/signup">
                <Button className="dark:bg-green-400 dark:text-white">
                  Sign up
                </Button>
              </Link>
              <Link href="/cart">
                <ShoppingCart className="h-6 w-6 text-green-600" />
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  )
}
