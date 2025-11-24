"use client";

import { useUserStore } from "@/app/store/useUserStore";
import { authAPI } from "@/lib/api";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import Link from "next/link";

type FormErrors = {
  [key: string]: string;
};

export default function LoginPage() {
  const baseData: { email: string; password: string } = {
    email: "",
    password: "",
  };
  const [formData, setFormData] = useState(baseData);
  const [errors, setErrors] = useState<FormErrors>({});
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { setUser } = useUserStore();
  const router = useRouter();

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }
    if (!formData.password) {
      newErrors.password = "Password is required";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async () => {
    setErrors({});

    if (!validateForm()) {
      return;
    }

    const newErrors: FormErrors = {};
    setIsLoading(true);

    try {
      const result = await authAPI.login({
        email: formData.email,
        password: formData.password,
      });

      if (result.success && result.user) {
        localStorage.setItem("token", result.token);
        setUser(result.user);
        toast.success("Login successful!");
        if (result.user.accountType === "Admin") {
          router.push("/admin/dashboard");
        } else {
          router.push("/home");
        }
      } else {
        newErrors.general = result.message || "Invalid email or password.";
        setErrors(newErrors);
        toast.error(result.message || "Invalid email or password.");
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error("An error occurred during login. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-6 text-[#000000]">
      <div className="w-full max-w-md bg-[#FBFDFF] shadow rounded-xl p-6 space-y-6">
        <div className="space-y-1 text-center">
          <h1 className="text-2xl font-semibold">Login</h1>
          <p className="text-sm text-gray-500">
            Wellcome back! Please login to access your account
          </p>
        </div>

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
          <div className="space-y-2">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-[#000000]"
            >
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                placeholder="Enter your password"
                className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-emerald-500 focus:outline-none text-gray-900"
              />
              <button
                type="button"
                aria-label={showPassword ? "Hide password" : "Show password"}
                onClick={() => setShowPassword((v) => !v)}
                className="cursor-pointer absolute inset-y-0 right-0 flex items-center pr-3 text-[#DEDEE0] hover:text-[#000000]"
              >
                {showPassword ? (
                  // Eye-off icon
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    className="h-5 w-5"
                  >
                    <path d="M3 3l18 18" />
                    <path d="M10.585 10.585A2 2 0 0012 14a2 2 0 001.414-.586" />
                    <path d="M9.88 5.11A9.956 9.956 0 0112 5c5.523 0 10 5 10 7- .344.547-1.117 1.66-2.342 2.79M6.11 6.11C3.787 7.71 2 10 2 12c0 .695.316 1.489.878 2.318.55.813 1.297 1.641 2.17 2.39 2.018 1.712 4.677 3.292 6.952 3.292 1.088 0 2.32-.398 3.514-1.034" />
                  </svg>
                ) : (
                  // Eye icon
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    className="h-5 w-5"
                  >
                    <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                )}
              </button>
            </div>
            {errors.password && (
              <p className="text-sm text-red-500 mt-1">{errors.password}</p>
            )}
            <div className="flex justify-end">
              <Link
                href="forgot-password"
                className="text-sm font-semibold text-[#000000] hover:underline"
              >
                Forgot Password?
              </Link>
            </div>
          </div>
          <button
            type="submit"
            className="cursor-pointer w-full bg-emerald-500 text-[#FBFDFF] py-2.5 sm:py-3 rounded-lg font-semibold hover:bg-[#07B681] transition duration-200"
            onClick={handleLogin}
            disabled={isLoading}
          >
            Log In
          </button>
        </div>

        <p className="text-center text-sm text-gray-600">
          Don&apos;t have an account?{" "}
          <Link
            href="/signup"
            className="text-[#000000] hover:underline font-semibold"
          >
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
