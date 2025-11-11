"use client";

import { redirect } from "next/navigation";
import React from "react";
import { useUserStore } from "../(main)/store/useUserStore";

export default function AuthGate({ children }: { children: React.ReactNode }) {
  const { user, hasHydrated } = useUserStore();
  if (!hasHydrated) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-[#F4F7FD]">
        <p className="text-xl">Loading session...</p>
      </div>
    );
  }
  if (!user) {
    redirect("/login");
  }
  
  return <>{children}</>;
}