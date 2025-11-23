"use client";

import { useUserStore } from "@/app/store/useUserStore";
import { redirect } from "next/navigation";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = useUserStore();

  if (user && user.accountType !== "Admin") {
    redirect("/home");
  }

  return <div>{children}</div>;
}
