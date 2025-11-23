"use client";

import { useRouter } from "next/navigation";
import { useUserStore } from "../store/useUserStore";
import { authAPI } from "@/lib/api";
import React, { useEffect, useCallback } from "react";

export default function AuthGate({ children }: { children: React.ReactNode }) {
  const { user, setUser, hasHydrated } = useUserStore();
  const router = useRouter();

  const authorizeUser = useCallback(async () => {
    if (!user) {
      const res = await authAPI.authorize();

      if (res.success && res.user) {
        setUser(res.user);
      } else {
        router.push("/login");
      }
    }
  }, [user, setUser, router]);

  useEffect(() => {
    if (hasHydrated) {
      authorizeUser();
    }
  }, [hasHydrated, authorizeUser]);

  if (!hasHydrated || !user) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-[#F4F7FD]"></div>
    );
  }

  return <>{children}</>;
}
