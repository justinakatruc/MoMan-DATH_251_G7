"use client";

import { Suspense } from "react";
import ResetPassword from "@/app/components/ResetPassword";

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={null}>
      <ResetPassword />
    </Suspense>
  );
}
