"use client"

import Link from "next/link"
import { Sprout, ShoppingCart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "../theme-toggle"
import { UserButton, SignInButton, SignUpButton, useUser } from "@clerk/nextjs"

export default function Header() {
  const { isSignedIn } = useUser()

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <Sprout className="h-6 w-6 text-green-600" />
          <span className="text-xl font-bold">AgriConnect</span>
        </div>

        <nav className="hidden md:flex gap-6">
          <Link href="#how-it-works" className="text-sm font-medium hover:text-primary">How It Works</Link>
          <Link href="#features" className="text-sm font-medium hover:text-primary">Features</Link>
          <Link href="#testimonials" className="text-sm font-medium hover:text-primary">Testimonials</Link>
          <Link href="/products" className="text-sm font-medium hover:text-primary">Products</Link>
        </nav>

        <div className="flex items-center gap-4">
          <ThemeToggle />
          
          {isSignedIn ? (
            <>
              <UserButton afterSignOutUrl="/" />
              <Link href="/cart">
                <ShoppingCart className="h-6 w-6 text-green-600" />
              </Link>
            </>
          ) : (
            <>
              <SignInButton>
                <Button variant="ghost" className="text-sm font-medium hover:underline underline-offset-4">
                  Log in
                </Button>
              </SignInButton>
              <SignUpButton>
                <Button className="dark:bg-green-400 dark:text-white">
                  Sign up
                </Button>
              </SignUpButton>
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
