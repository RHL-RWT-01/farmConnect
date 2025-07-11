"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  LayoutDashboard,
  ShoppingCart,
  Sprout,
  LogOut,
  Loader,
} from "lucide-react";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import { ThemeToggle } from "../theme-toggle";
import { scrollToSection } from "@/lib/navigation";
import { useAuth } from "@/hooks/useAuth";
import { useEffect } from "react";

export default function Header() {
  const { user, isAuthenticated, loading, hasFetched } = useAuth();
  const router = useRouter();

  // useEffect(() => {
  //   if (isAuthenticated) {
  //     router.refresh(); 
  //   }
  // }, [isAuthenticated, router]);

  if (loading || !hasFetched) return <div className="flex items-center justify-center h-screen w-full">
    <Loader className="h-20 w-20 animate-spin text-green-600" />
  </div>


  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        {/* ─── Logo ─────────────────────────────────────────────── */}
        <div
          className="flex items-center gap-2 cursor-pointer"
          onClick={(e) => {
            e.preventDefault();
            scrollToSection(e, "#home");
          }}
        >
          <Sprout className="h-6 w-6 text-green-600" />
          <span className="text-xl font-bold">AgriConnect</span>
        </div>

        {/* ─── Center Navigation ──────────────────────────────── */}
        <nav className="hidden md:flex gap-6">
          {["how-it-works", "features", "testimonials"].map((id) => (
            <Link
              key={id}
              href={`#${id}`}
              onClick={(e) => scrollToSection(e, `#${id}`)}
              className="text-sm font-medium hover:text-primary"
            >
              {id.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}
            </Link>
          ))}
          <Link
            href="/products"
            className="text-sm font-medium hover:text-primary"
          >
            Products
          </Link>
        </nav>

        {/* ─── Right Side ─────────────────────────────────────── */}
        <div className="flex items-center gap-4">
          <ThemeToggle />

          {isAuthenticated && user ? (
            <>
              {/* Role-based icon */}
              {user.role === "BUYER" ? (
                <Link href="/cart" title="Cart">
                  <ShoppingCart className="h-6 w-6 text-green-600 hover:text-green-800 transition" />
                </Link>
              ) : (
                <Link href="/farmer/dashboard" title="Dashboard">
                  <LayoutDashboard className="h-6 w-6 text-green-600 hover:text-green-800 transition" />
                </Link>
              )}

              {/* Profile */}
              <Link href="/profile" title="Profile">
                <Image
                  src={user.image || "/default-avatar.png"}
                  alt="Profile"
                  width={32}
                  height={32}
                  className="rounded-full cursor-pointer hover:ring-2 ring-green-500"
                  priority
                />
              </Link>

              {/* Logout */}

            </>
          ) : (
            <>
              {/* Guest actions */}
              <Link href="/login">
                <Button
                  variant="ghost"
                  className="text-sm font-medium hover:underline underline-offset-4"
                >
                  Log in
                </Button>
              </Link>
              <Link href="/signup">
                <Button className="bg-green-600 hover:bg-green-700 text-white dark:bg-green-400 dark:text-white">
                  Sign up
                </Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
