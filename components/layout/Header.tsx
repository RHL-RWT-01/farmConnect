"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import {
  LayoutDashboard,
  ShoppingCart,
  Sprout,
  LogOut,
  Package,
  Menu,
  X,
  Bell,
  BarChart3,
  Heart,
  ShoppingBag,
  Boxes,
  ClipboardList,
  Calendar,
  MessageCircle,
} from "lucide-react";
import Image from "next/image";
import { useState, useEffect } from "react";

import { Button } from "@/components/ui/button";
import { ThemeToggle } from "../theme-toggle";
import { scrollToSection } from "@/lib/navigation";
import { useAuth } from "@/hooks/useAuth";
import { Badge } from "@/components/ui/badge";

export default function Header() {
  const { user, isAuthenticated, loading, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [unreadNotifs, setUnreadNotifs] = useState(0);

  // Fetch unread notification count
  useEffect(() => {
    if (!isAuthenticated || !user) return;
    const fetchNotifs = async () => {
      try {
        const res = await fetch("/api/notifications", { credentials: "include" });
        const data = await res.json();
        setUnreadNotifs(data.unreadCount || 0);
      } catch {}
    };
    fetchNotifs();
    const interval = setInterval(fetchNotifs, 30000);
    return () => clearInterval(interval);
  }, [isAuthenticated, user]);

  const isActive = (path: string) =>
    pathname === path ? "bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400" : "";

  // Farmer nav items
  const farmerNavItems = [
    { href: "/farmer/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/farmer/orders", label: "Orders", icon: ClipboardList },
    { href: "/farmer/inventory", label: "Inventory", icon: Boxes },
    { href: "/farmer/analytics", label: "Analytics", icon: BarChart3 },
    { href: "/farmer/crop-calendar", label: "Crop Calendar", icon: Calendar },
    { href: "/messages", label: "Messages", icon: MessageCircle },
    { href: "/products", label: "Marketplace", icon: ShoppingBag },
  ];

  // Buyer nav items
  const buyerNavItems = [
    { href: "/buyer/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/products", label: "Products", icon: ShoppingBag },
    { href: "/orders", label: "My Orders", icon: Package },
    { href: "/buyer/wishlist", label: "Wishlist", icon: Heart },
    { href: "/market-rates", label: "Market Rates", icon: BarChart3 },
    { href: "/messages", label: "Messages", icon: MessageCircle },
  ];

  const navItems = isAuthenticated && user
    ? user.role === "FARMER" ? farmerNavItems : buyerNavItems
    : [];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2.5 group"
          onClick={(e) => {
            if (window.location.pathname === "/") {
              e.preventDefault();
              scrollToSection(e as any, "#home");
            }
          }}
        >
          <div className="w-9 h-9 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg shadow-green-500/20 group-hover:shadow-green-500/40 transition-shadow">
            <Sprout className="h-5 w-5 text-white" />
          </div>
          <span className="text-xl font-bold gradient-text">FarmConnect</span>
          {isAuthenticated && user && (
            <Badge
              variant="outline"
              className={`text-[10px] uppercase tracking-wider font-semibold px-2 py-0.5 ${
                user.role === "FARMER"
                  ? "border-emerald-500/50 text-emerald-600 dark:text-emerald-400"
                  : "border-blue-500/50 text-blue-600 dark:text-blue-400"
              }`}
            >
              {user.role}
            </Badge>
          )}
        </Link>

        {/* Desktop Nav — Role-specific */}
        <nav className="hidden md:flex items-center gap-1">
          {!isAuthenticated && (
            <>
              {["how-it-works", "features", "testimonials"].map((id) => (
                <Link
                  key={id}
                  href={`/#${id}`}
                  onClick={(e) => {
                    if (window.location.pathname === "/") {
                      e.preventDefault();
                      scrollToSection(e as any, `#${id}`);
                    }
                  }}
                  className="px-3 py-2 text-sm font-medium rounded-lg hover:bg-muted transition-colors"
                >
                  {id
                    .replace(/-/g, " ")
                    .replace(/\b\w/g, (c) => c.toUpperCase())}
                </Link>
              ))}
              <Link
                href="/products"
                className="px-3 py-2 text-sm font-medium rounded-lg hover:bg-muted transition-colors"
              >
                Products
              </Link>
            </>
          )}
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`px-3 py-2 text-sm font-medium rounded-lg hover:bg-muted transition-colors ${isActive(item.href)}`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-1.5">
          <ThemeToggle />

          {isAuthenticated && user ? (
            <>
              {/* Buyer: cart icon */}
              {user.role === "BUYER" && (
                <Link href="/cart" title="Cart">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="relative hover:bg-green-50 dark:hover:bg-green-900/20"
                  >
                    <ShoppingCart className="h-5 w-5 text-green-600" />
                  </Button>
                </Link>
              )}

              {/* Farmer: add crop shortcut */}
              {user.role === "FARMER" && (
                <Link href="/farmer/add-crop" title="Add Crop">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="hover:bg-green-50 dark:hover:bg-green-900/20"
                  >
                    <Sprout className="h-5 w-5 text-green-600" />
                  </Button>
                </Link>
              )}

              {/* Notifications */}
              <Link href="/notifications" title="Notifications">
                <Button
                  variant="ghost"
                  size="icon"
                  className="relative hover:bg-green-50 dark:hover:bg-green-900/20"
                >
                  <Bell className="h-5 w-5 text-green-600" />
                  {unreadNotifs > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                      {unreadNotifs > 9 ? "9+" : unreadNotifs}
                    </span>
                  )}
                </Button>
              </Link>

              {/* Profile */}
              <Link href="/profile" title="Profile">
                <div className="w-9 h-9 rounded-full overflow-hidden border-2 border-green-500/30 hover:border-green-500 transition-all shadow-sm hover:shadow-md">
                  <Image
                    src={user.image || "/default-avatar.png"}
                    alt="Profile"
                    width={36}
                    height={36}
                    className="object-cover w-full h-full"
                    priority
                  />
                </div>
              </Link>

              {/* Logout */}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => logout()}
                title="Logout"
                className="hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600"
              >
                <LogOut className="h-5 w-5" />
              </Button>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <Link href="/login">
                <Button variant="ghost" className="text-sm font-medium">
                  Log in
                </Button>
              </Link>
              <Link href="/signup">
                <Button className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white shadow-lg shadow-green-500/20 text-sm">
                  Sign up
                </Button>
              </Link>
            </div>
          )}

          {/* Mobile menu toggle */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile Menu — Role-separated */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t bg-background/95 backdrop-blur-xl animate-fade-in-down">
          <nav className="container py-4 flex flex-col gap-1">
            {!isAuthenticated && (
              <>
                {["how-it-works", "features", "testimonials"].map((id) => (
                  <Link
                    key={id}
                    href={`/#${id}`}
                    onClick={() => setMobileMenuOpen(false)}
                    className="px-4 py-2.5 text-sm font-medium rounded-lg hover:bg-muted"
                  >
                    {id.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}
                  </Link>
                ))}
                <Link
                  href="/products"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-4 py-2.5 text-sm font-medium rounded-lg hover:bg-muted"
                >
                  Products
                </Link>
              </>
            )}
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-4 py-2.5 text-sm font-medium rounded-lg hover:bg-muted ${isActive(item.href)}`}
                >
                  <Icon className="h-4 w-4 text-green-600" />
                  {item.label}
                </Link>
              );
            })}
            <Link
              href="/notifications"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium rounded-lg hover:bg-muted"
            >
              <Bell className="h-4 w-4 text-green-600" />
              Notifications
              {unreadNotifs > 0 && (
                <Badge className="bg-red-500 text-white text-xs ml-auto">{unreadNotifs}</Badge>
              )}
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
