"use client";

import "@/app/globals.css";
import { CategoryProvider } from "@/app/context/CategoryContext";
import AuthGate from "../components/AuthGate";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { authAPI } from "@/lib/api";
import { useUserStore } from "../store/useUserStore";
import BottomBar from "../components/BottomBar";
import Sidebar from "../components/Sidebar";

export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { user, setUser } = useUserStore();
  const [checking, setChecking] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  const isAdminRoute = pathname.startsWith("/admin");

  useEffect(() => {
    const checkUser = async () => {
      const result = await authAPI.authorize();

      if (!result.success) {
        router.replace("/login");
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
  }, [user, setUser, router]);

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
        {isAdminRoute ? (
          <div className="w-full flex flex-col lg:flex-row bg-[#F1FFF3] min-h-screen relative z-0">
            <Sidebar />
            <div className="flex-1 w-full px-10 lg:px-0 xl:px-15 2xl:px-20 pb-8">
              {children}
            </div>
          </div>
        ) : (
          <div className="w-full flex flex-col items-center min-h-screen relative z-0">
            <div className="flex-1 grow bg-linear-to-b from-[#00D09E] to-[#F1FFF3] flex flex-col w-[428px]">
              {children}
            </div>
            <BottomBar />
          </div>
        )}
      </AuthGate>
    </CategoryProvider>
  );
}
