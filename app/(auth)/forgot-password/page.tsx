"use client";

import { authAPI } from "@/lib/api";
import { useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Link from "next/link";

type FormErrors = {
  [key: string]: string;
};

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);

  const validateForm = () => {
    const newErrors: FormErrors = {};
    if (!email) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = "Email is invalid";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleForgotPassword = async () => {
    if (!validateForm()) return;

    try {
      setIsLoading(true);
      const result = await authAPI.forgotPassword(email);
      if (result.success) {
        toast.success("Reset link sent to your email");
      } else {
        toast.error(result.message || "Failed to send link");
      }
    } catch {
      toast.error("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black">
      {/* MOBILE FRAME */}
      <div className="w-[430px] h-[932px] bg-[#00D09E] rounded-[30px] overflow-hidden relative">

        {/* HEADER */}
        <div className="h-[240px] flex items-center justify-center">
          <h1 className="text-[28px] font-semibold text-black">
            Forgot Password
          </h1>
        </div>

        {/* CARD */}
        <div className="absolute bottom-0 w-full h-[745px] bg-[#F1FFF3] rounded-t-[60px] px-6 pt-10">

          <h2 className="text-lg font-semibold text-black mb-2 mt-10">
            Reset Password?
          </h2>

          <p className="text-sm text-gray-500 mb-6 leading-relaxed">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit,
            sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
          </p>

          {/* Email */}
          <div className="mb-8 mt-15">
            <label className="text-sm font-semibold text-gray-700 ml-5">
              Enter Email Address
            </label>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="example@example.com"
              className="
                mt-2
                w-full
                h-[54px]
                rounded-full
                bg-[#DFF7E2]
                px-5
                text-sm
                placeholder-gray-500
                focus:outline-none
                font-semibold
              "
            />
            {errors.email && (
              <p className="text-xs text-red-500 mt-1">{errors.email}</p>
            )}
          </div>

          {/* NEXT STEP */}
          <div className="flex justify-center mt-5">
            <button
              onClick={handleForgotPassword}
              disabled={isLoading}
              className="w-[207px]
                h-[45px]
                rounded-full
                bg-[#00D09E]
                text-black
                text-base
                text-xl
                font-bold"
            >
              Next Step
            </button>
          </div>

          {/* FOOTER */}
          <p className="absolute bottom-8 left-0 right-0 text-center text-xs text-gray-600">
            Don’t have an account?{" "}
            <Link href="/signup" className="text-blue-500">
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
