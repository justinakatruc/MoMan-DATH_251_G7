import VerifyPage from "@/app/components/VerifyPage";
import { Suspense } from "react";

export default function Page() {
  return (
    <Suspense fallback={null}>
      <VerifyPage />
    </Suspense>
  );
}
