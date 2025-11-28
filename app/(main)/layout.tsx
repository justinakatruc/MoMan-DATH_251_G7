"use client";

import "@/app/globals.css";
import { CategoryProvider } from "@/app/context/CategoryContext";
import AuthGate from "../components/AuthGate";
import { useEffect, useState } from "react";
import { redirect } from "next/navigation";
import { authAPI } from "@/lib/api";
import { useUserStore } from "../store/useUserStore";
import BotBar from "../components/BotBar";

export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { user, setUser } = useUserStore();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const checkUser = async () => {
      const result = await authAPI.authorize();

      if (!result.success) {
        redirect("/login");
      } else {
        setUser(result.user);
      }
      setChecking(false);
    };

    if (user === null) {
      checkUser();
    } else {
      setChecking(false);
    }
  }, [user, setUser]);

  if (checking) {
    return (
      <div className="flex items-center justify-center min-h-screen w-full bg-[#00D09E]">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4"></div>
      </div>
    );
  }

  return (
    <CategoryProvider>
      <AuthGate>
        <div className="w-full flex flex-col min-h-screen relative z-0 max-w-[430px] mx-auto">
          <div className="flex-1 bg-[#00D09E] flex flex-col">{children}</div>
          <BotBar />
        </div>
      </AuthGate>
    </CategoryProvider>
  );
}
