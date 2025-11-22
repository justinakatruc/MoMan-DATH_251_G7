"use client";

import "@/app/globals.css";
import Sidebar from "@/app/components/Sidebar";
import { CategoryProvider } from "@/app/context/CategoryContext";
import AuthGate from "../components/AuthGate";
import { useCategoryStore } from "../store/useCategoryStore";
import { useEffect } from "react";

export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const fetchCategories = useCategoryStore((state) => state.fetchCategories);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  return (
    <CategoryProvider>
      <AuthGate>
        <div className="w-full flex flex-col lg:flex-row bg-[#F4F7FD]">
          <Sidebar />
          <div className="flex-1 w-full px-10 lg:px-0 xl:px-15 2xl:px-20">
            {children}
          </div>
        </div>
      </AuthGate>
    </CategoryProvider>
  );
}
