"use client";

import { authAPI } from "@/lib/api";
import { useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

type FormErrors = {
  [key: string]: string;
};

export default function ForgotPasswordPage() {
  const router = useRouter();
  const baseData: { email: string; password: string } = {
    email: "",
    password: "",
  };
  const [formData, setFormData] = useState(baseData);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleForgotPassword = async () => {
    setIsLoading(true);

    const isValid = validateForm();
    if (!isValid) {
      setIsLoading(false);
      return;
    }

    try {
      const result = await authAPI.forgotPassword(formData.email);
      if (result.success) {
        toast.success("Password reset link sent to your email");
      } else {
        toast.error(result.message || "Failed to send reset link");
      }
    } catch (error) {
      console.error("Error sending reset link:", error);
      toast.error(
        "An error occurred while sending the link. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-6 text-[#000000]">
      <div className="w-full max-w-md bg-[#FBFDFF] shadow rounded-xl p-6 space-y-6">
        <div className="relative w-full">
          <button
            className="absolute left-0 flex items-center text-gray-600 hover:text-gray-900 transition cursor-pointer"
            onClick={() => router.push("/login")}
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-2xl font-semibold text-center">Reset Password</h1>
        </div>
        <p className="text-sm text-gray-500">
          Enter your email address below, and we&apos;ll send you a link to
          reset your password.
        </p>

        <div className="space-y-4">
          <div className="space-y-2">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-[#000000]"
            >
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              placeholder="Enter your email"
              className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-emerald-500 focus:outline-none text-gray-900"
            />
            {errors.email && (
              <p className="text-sm text-red-500 mt-1">{errors.email}</p>
            )}
          </div>
          <button
            type="submit"
            className="cursor-pointer w-full bg-emerald-500 text-[#FBFDFF] py-2.5 sm:py-3 rounded-lg font-semibold hover:bg-[#07B681] transition duration-200"
            onClick={handleForgotPassword}
            disabled={isLoading}
          >
            Send Reset Link
          </button>
        </div>
      </div>
    </div>
  );
}
