"use client"

import { accountsList, usersList } from "@/app/(main)/store/UserStore";
import { useUserStore } from "@/app/(main)/store/useUserStore";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

type FormErrors = {
  [key: string]: string;
};

export default function LoginPage() {
  const baseData: { email: string; password: string } = { email: "", password: "" };
  const [formData, setFormData] = useState(baseData);
  const [errors, setErrors] = useState<FormErrors>({});
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { setUser } = useUserStore();
  const router = useRouter();

  const validateForm = () : boolean => {
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
  }

  const handleLogin = async () => {
    setErrors({});

    if (!validateForm()) {
      return;
    }

    const newErrors: FormErrors = {};
    setIsLoading(true);

    setTimeout(() => {
      const account = accountsList.find(
        (acc) => acc.email === formData.email && acc.password === formData.password
      )

      if (account) {
        const foundUser = usersList.find(
          (user) => user.email === account.email
        )
        if (foundUser) {
          console.log("Found user, setting to store:", foundUser);
          setUser(foundUser);
          
          // Debug: Check if store is updated
          setTimeout(() => {
            const storeValue = localStorage.getItem('user-storage');
            console.log("LocalStorage after setUser:", storeValue);
          }, 100);
          
          setIsLoading(false);
          toast.success("Login successful!");
          if (foundUser.accountType === "Admin") {
            router.push("/admin/dashboard");
          }
          else {
            router.push("/home");
          }
        }
        else {
          toast.error("User not found.");
        }
      } else {
        newErrors.general = "Invalid email or password.";
        setErrors(newErrors);
        toast.error("Invalid email or password.");
      }
      setIsLoading(false);
    }, 1000);
  }


  return (
    <div className="min-h-screen w-full flex items-center justify-center p-6 text-[#000000]">
      <div className="w-full max-w-md bg-[#FBFDFF] shadow rounded-xl p-6 space-y-6">
        <div className="space-y-1 text-center">
          <h1 className="text-2xl font-semibold">Login</h1>
          <p className="text-sm text-gray-500">Wellcome back! Please login to access your account</p>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="email" className="block text-sm font-medium text-[#000000]">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="Enter your email"
              className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-emerald-500 focus:outline-none text-gray-900"
            />
            {errors.email && (
              <p className="text-sm text-red-500 mt-1">{errors.email}</p>
            )}
          </div>
          <div className="space-y-2">
            <label htmlFor="password" className="block text-sm font-medium text-[#000000]">
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
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
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5">
                    <path d="M3 3l18 18" />
                    <path d="M10.585 10.585A2 2 0 0012 14a2 2 0 001.414-.586" />
                    <path d="M9.88 5.11A9.956 9.956 0 0112 5c5.523 0 10 5 10 7- .344.547-1.117 1.66-2.342 2.79M6.11 6.11C3.787 7.71 2 10 2 12c0 .695.316 1.489.878 2.318.55.813 1.297 1.641 2.17 2.39 2.018 1.712 4.677 3.292 6.952 3.292 1.088 0 2.32-.398 3.514-1.034" />
                  </svg>
                ) : (
                  // Eye icon
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5">
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
              <a href="#" className="text-sm font-semibold text-[#000000] hover:underline">Forgot Password?</a>
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

        <div className="relative py-2">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-[#DEDEE0]" />
          </div>
          <div className="relative flex justify-center">
            <span className="bg-[#FBFDFF] px-2 text-gray-400 text-sm">OR</span>
          </div>
        </div>

        <button
          type="button"
          className="cursor-pointer w-full inline-flex items-center justify-center gap-2 rounded-md border border-[#DEDEE0] bg-[#FBFDFF] px-4 py-2 text-sm font-medium text-[#000000] shadow-sm hover:bg-white"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 48 48"
            className="h-5 w-5"
          >
            <path
              fill="#FFC107"
              d="M43.611 20.083H42V20H24v8h11.303C33.659 31.657 29.24 35 24 35 17.373 35 12 29.627 12 23S17.373 11 24 11c3.066 0 5.86 1.154 7.988 3.046l5.657-5.657C34.689 5.053 29.627 3 24 3 12.955 3 4 11.955 4 23s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.651-.389-3.917z"
            />
            <path fill="#FF3D00" d="M6.306 14.691l6.571 4.817C14.61 15.379 18.91 12 24 12c3.066 0 5.86 1.154 7.988 3.046l5.657-5.657C34.689 5.053 29.627 3 24 3 16.319 3 9.656 7.337 6.306 14.691z" />
            <path fill="#4CAF50" d="M24 43c5.159 0 9.86-1.977 13.409-5.192l-6.191-5.238C29.162 34.323 26.715 35 24 35c-5.22 0-9.625-3.32-11.289-7.946l-6.58 5.068C9.454 39.556 16.197 43 24 43z" />
            <path fill="#1976D2" d="M43.611 20.083H42V20H24v8h11.303c-1.356 3.675-4.63 6.437-8.894 7.487l6.191 5.238C35.329 41.208 40 37 40 23c0-1.341-.138-2.651-.389-3.917z" />
          </svg>
          Continue with Google
        </button>

        <p className="text-center text-sm text-gray-600">
          Don&apos;t have an account? <a href="/signup" className="text-[#000000] hover:underline font-semibold">Sign up</a>
        </p>
      </div>
    </div>
  );
}
