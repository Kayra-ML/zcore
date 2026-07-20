"use client";
import { useEffect } from "react";
import { signOut } from "next-auth/react";
export default function DesktopSignoutPage() {
  useEffect(() => {
    signOut({ callbackUrl: "/login?callbackUrl=/desktop-auth" });
  }, []);
  return (
    <div className="min-h-screen bg-[#080808] flex items-center justify-center p-4">
      <div className="text-center">
        <div className="w-8 h-8 border-2 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin mx-auto mb-4" />
        <p className="text-zinc-400 text-sm">Oturum kapatılıyor...</p>
      </div>
    </div>
  );
}
