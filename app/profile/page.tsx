"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Loader2, LogOut, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { uploadProfileImage } from "@/lib/upload-image";
import defaultAvatar from "@/public/default-avatar.png"; 
export default function ProfilePage() {
  const { toast } = useToast();
  const { user, logout, hasFetched, loading, refreshUser } = useAuth();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);

  useEffect(() => {
    if (user?.image) setPreview(user.image);
  }, [user]);

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const url = await uploadProfileImage(file);

      // Call your backend to update user profile image
      const res = await fetch("/api/auth/me", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: url })
      });

      if (!res.ok) throw new Error("Failed to update profile image");

      toast({ title: "Profile Updated", description: "Your profile picture was updated." });
      setPreview(url);
      refreshUser?.();
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    } finally {
      setUploading(false);
    }
  };

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
        <div className="flex flex-col items-center space-y-4">
          <div className="relative w-28 h-28 rounded-full overflow-hidden border-2 border-green-600">
            <Image
              src={preview || defaultAvatar}
              alt="Profile"
              fill
              className="object-cover"
            />
          </div>

          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-1"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
          >
            <Upload className="h-4 w-4" />
            {uploading ? "Uploading..." : "Change Picture"}
          </Button>
          <Input type="file" accept="image/*" className="hidden" ref={fileInputRef} onChange={handleImageChange} />
        </div>

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
          <LogOut className="h-5 w-5" /> Logout
        </Button>
      </div>
    </section>
  );
}
