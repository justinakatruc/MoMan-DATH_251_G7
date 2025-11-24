"use client";

import "@/app/globals.css";
import Sidebar from "@/app/components/Sidebar";
import { CategoryProvider } from "@/app/context/CategoryContext";
import AuthGate from "../components/AuthGate";
import { useEffect, useState } from "react";
import { redirect } from "next/navigation";
import { authAPI } from "@/lib/api";
import { useUserStore } from "../store/useUserStore";

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
      <div className="flex items-center justify-center min-h-screen w-full bg-[#F4F7FD]">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-green-500"></div>
      </div>
    );
  }

  return (
    <CategoryProvider>
      <AuthGate>
        <div className="w-full flex flex-col lg:flex-row bg-[#F4F7FD] min-h-screen relative z-0">
          <Sidebar />
          <div className="flex-1 w-full px-10 lg:px-0 xl:px-15 2xl:px-20 pb-8">
            {children}
          </div>
        </div>
      </AuthGate>
    </CategoryProvider>
  );
}
