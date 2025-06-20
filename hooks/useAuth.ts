"use client";
import { useContext } from "react";
import { AuthContext } from "@/components/providers/AuthProvider";
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}