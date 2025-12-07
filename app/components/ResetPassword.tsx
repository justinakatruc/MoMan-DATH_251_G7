"use client";

import { authAPI } from "@/lib/api";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import Image from "next/image";

type FormErrors = {
  [key: string]: string;
};

export default function ResetPassword() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);

  const validateForm = () => {
    const newErrors: FormErrors = {};
    if (!formData.password || formData.password.length < 8) {
      newErrors.password = "Minimum 8 characters";
    }
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleResetPassword = async () => {
    if (!token) return toast.error("Invalid token");
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const result = await authAPI.resetPassword(token, formData.password);
      if (result.success) {
        toast.success("Password changed successfully");
        router.push("/login");
      } else {
        toast.error(result.message);
      }
    } catch {
      toast.error("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-[430px] h-[932px] bg-[#00D09E] overflow-hidden relative">
        {/* HEADER */}
        <div className="h-60 flex items-center justify-center">
          <h1 className="text-[26px] font-semibold text-black">New Password</h1>
        </div>

        {/* CARD */}
        <div className="absolute bottom-0 w-full h-[745px] bg-[#F1FFF3] rounded-t-[60px] px-6 pt-10">
          {/* NEW PASSWORD */}
          <div className="mb-6 mt-15">
            <label className="text-sm font-semibold text-gray-700 ml-5">
              New Password
            </label>
            <div className="relative mt-2">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                className="
                  w-full
                  h-[54px]
                  rounded-full
                  bg-[#DFF7E2]
                  px-5
                  pr-12
                  text-sm
                  focus:outline-none
                  font-bold
                "
              />
              <button
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-5 top-1/2 -translate-y-1/2"
              >
                <Image
                  src={showPassword ? "/eye-open.png" : "/eye-close.png"}
                  alt="Toggle password visibility"
                  width={20}
                  height={20}
                />
              </button>
            </div>
            {errors.password && (
              <p className="text-xs text-red-500 mt-1">{errors.password}</p>
            )}
          </div>

          {/* CONFIRM PASSWORD */}
          <div className="mb-10">
            <label className="text-sm font-semibold text-gray-700 ml-5">
              Confirm New Password
            </label>
            <div className="relative mt-2">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                className="
                  w-full
                  h-[54px]
                  rounded-full
                  bg-[#DFF7E2]
                  px-5
                  pr-12
                  text-sm
                  focus:outline-none
                  font-bold
                "
              />
              <button
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-5 top-1/2 -translate-y-1/2"
              >
                <Image
                  src={showPassword ? "/eye-open.png" : "/eye-close.png"}
                  alt="Toggle password visibility"
                  width={20}
                  height={20}
                />
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="text-xs text-red-500 mt-1">
                {errors.confirmPassword}
              </p>
            )}
          </div>

          {/* BUTTON */}
          <div className="flex justify-center mt-50">
            <button
              onClick={handleResetPassword}
              disabled={isLoading}
              className="w-[260px] h-12 rounded-full bg-[#00D09E] text-black font-semibold"
            >
              {isLoading ? "Changing..." : "Change Password"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
