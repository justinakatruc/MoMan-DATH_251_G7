"use client";

import "@/app/globals.css";
import Sidebar from "@/app/components/Sidebar";
import { CategoryProvider } from "@/app/context/CategoryContext";
import AuthGate from "../components/AuthGate";
import { useEffect } from "react";
import { redirect } from "next/navigation";
import { authAPI } from "@/lib/api";
import { useUserStore } from "../store/useUserStore";

export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { user, setUser } = useUserStore();

  useEffect(() => {
    const checkUser = async () => {
      const result = await authAPI.authorize();

      if (!result.success) {
        redirect("/login");
      } else {
        setUser(result.user);
      }
    };

    if (user === null) {
      checkUser();
    }
  }, [user, setUser]);

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
