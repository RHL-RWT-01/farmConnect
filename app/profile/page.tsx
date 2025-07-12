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

// ✅ Modal Component
function SuccessModal({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white dark:bg-zinc-900 p-6 rounded-xl shadow-lg w-[90%] max-w-md text-center">
        <h2 className="text-xl font-bold text-green-600">Profile Updated!</h2>
        <p className="text-sm text-muted-foreground mt-2">
          Your profile details have been successfully saved.
        </p>
        <button
          className="mt-4 px-4 py-2 text-sm bg-green-600 hover:bg-green-700 text-white rounded-md"
          onClick={onClose}
        >
          Close
        </button>
      </div>
    </div>
  );
}

export default function ProfilePage() {
  const { toast } = useToast();
  const { user, logout, hasFetched, loading, refreshUser } = useAuth();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [updating, setUpdating] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  useEffect(() => {
    if (user) {
      setPreview(user.image || null);
      setName(user.name || "");
      setLocation(user.location || "");
    }
  }, [user]);

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const url = await uploadProfileImage(file);

      const res = await fetch("/api/auth/me", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: url }),
      });

      if (!res.ok) throw new Error("Failed to update profile image");

      toast({
        title: "Profile Updated",
        description: "Your profile picture was updated.",
      });
      setPreview(url);
      refreshUser?.();
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message,
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const handleProfileUpdate = async () => {
    setUpdating(true);
    try {
      const res = await fetch("/api/auth/me", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, location }),
      });

      if (!res.ok) throw new Error("Failed to update profile");

      toast({
        title: "Profile Updated",
        description: "Your details were updated.",
      });
      setShowSuccessModal(true);
      refreshUser?.();
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message,
        variant: "destructive",
      });
    } finally {
      setUpdating(false);
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
        Unauthorized. Please{" "}
        <Link href="/login" className="text-green-600 underline">
          log in
        </Link>
        .
      </div>
    );
  }

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
          <Input
            type="file"
            accept="image/*"
            className="hidden"
            ref={fileInputRef}
            onChange={handleImageChange}
          />
        </div>

        <div className="space-y-4">
          <div className="grid gap-2">
            <label className="text-sm font-medium text-foreground">Name</label>
            <Input value={name} onChange={(e) => setName(e.target.value)} />
          </div>

          <div className="grid gap-2">
            <label className="text-sm font-medium text-foreground">Location</label>
            <Input value={location} onChange={(e) => setLocation(e.target.value)} />
          </div>

          <div className="grid gap-2">
            <label className="text-sm font-medium text-muted-foreground">Email</label>
            <Input value={user.email} disabled />
          </div>

          <div className="grid gap-2">
            <label className="text-sm font-medium text-muted-foreground">User Since</label>
            <Input
              value={new Date(user.createdAt).toLocaleDateString("en-IN", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
              disabled
            />
          </div>

          <Button
            onClick={handleProfileUpdate}
            disabled={updating}
            className="w-full bg-green-600 hover:bg-green-700"
          >
            {updating ? "Updating..." : "Update Profile"}
          </Button>
        </div>

        <div className="text-center">
          <Button
            onClick={logout}
            variant="ghost"
            className="text-sm font-medium flex items-center gap-1"
            title="Logout"
          >
            <LogOut className="h-5 w-5" /> Logout
          </Button>
        </div>
      </div>

      {/* Modal Shown Only on Update */}
      {showSuccessModal && <SuccessModal onClose={() => setShowSuccessModal(false)} />}
    </section>
  );
}
