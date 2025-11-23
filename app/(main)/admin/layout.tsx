"use client";

import { useUserStore } from "@/app/store/useUserStore";
import { useRouter } from "next/navigation";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = useUserStore();
  const router = useRouter();

  if (user && user.accountType !== "Admin") {
    router.push("/home");
  }

  return <div>{children}</div>;
}
