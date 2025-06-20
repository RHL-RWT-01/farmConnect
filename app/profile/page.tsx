"use client";

import { Loader2, LogOut } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";

export default function ProfilePage() {
  const { user, logout, hasFetched, loading } = useAuth();

  if (!hasFetched || loading) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <Loader2 className="h-6 w-6 animate-spin text-green-600" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="text-center mt-10 text-muted-foreground text-lg">
        Unauthorized. Please <Link href="/login" className="text-green-600 underline">log in</Link>.
      </div>
    );
  }

  const { name, email, role } = user;

  return (
    <section className="w-full py-20 md:py-28">
      <div className="container max-w-2xl bg-background p-8 border border-border rounded-xl shadow-md space-y-6">
        <div className="space-y-1 text-center">
          <h2 className="text-3xl font-bold text-foreground">Welcome, {name}!</h2>
          <p className="text-muted-foreground">{email}</p>
          <span className="text-sm px-3 py-1 rounded-full bg-green-100 text-green-700 dark:bg-green-800 dark:text-white">
            Role: {role || "User"}
          </span>
        </div>

        {role === "FARMER" ? (
          <div className="space-y-4">
            <h3 className="text-xl font-semibold">Your Crop Dashboard</h3>
            <ul className="list-disc list-inside text-sm text-muted-foreground">
              <li>View all your listed crops</li>
              <li>Track pricing and availability</li>
              <li>Manage crop listings and sales</li>
            </ul>
            <Link href="/farmer/add-crop">
              <Button className="mt-2 bg-green-600 hover:bg-green-700">Add New Crop</Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            <h3 className="text-xl font-semibold">Your Buyer Dashboard</h3>
            <ul className="list-disc list-inside text-sm text-muted-foreground">
              <li>View past orders</li>
              <li>Manage saved crops</li>
              <li>Contact farmers</li>
            </ul>
            <Link href="/products">
              <Button className="mt-2 bg-green-600 hover:bg-green-700">Browse Crops</Button>
            </Link>
          </div>

        )}

        <Button
          onClick={logout}
          variant="ghost"
          className="text-sm font-medium flex items-center gap-1"
          title="Logout"
        >
          <LogOut className="h-5 w-5" />
        </Button>
      </div>
    </section>
  );
}
