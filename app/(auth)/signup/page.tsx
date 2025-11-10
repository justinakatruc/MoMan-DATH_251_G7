"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import Image from "next/image";
import { accountsList, usersList } from "@/app/(main)/store/UserStore";
import { toast } from "sonner";
import { redirect } from "next/navigation";

type FormErrors = {
  [key: string]: string;
};

export default function SignupPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState("");
  const baseData: { email: string; password: string } = { email: "", password: "" };
  const [formData, setFormData] = useState(baseData);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState<boolean>(false);

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
    if (formData.password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  const handleSignUp = async () => {
    setErrors({});
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      const existingAccount = accountsList.find(
        (acc) => acc.email === formData.email
      );
      if (existingAccount) {
        setIsLoading(false);
        toast.error("An account with this email already exists.");
      } else {
        // Simulate account creation
        accountsList.push({
          id: accountsList.length + 1,
          email: formData.email, 
          password: formData.password
        });
        usersList.push({
          id: usersList.length + 1,
          firstName: "New",
          lastName: "User",
          email: formData.email,
          memberSince: new Date().toISOString().split('T')[0],
          accountType: "Student",
        });
        setIsLoading(false);
        toast.success("Account created successfully! Please log in.");
        redirect("/login");
      }
    }, 1000);
  }

  return (
    <div className="flex-1 flex justify-center items-center min-h-screen bg-[#F4F7FD] px-4">
      <div className="bg-white shadow-md rounded-2xl p-6 sm:p-8 md:p-10 w-full max-w-lg">
        <h1 className="text-2xl sm:text-3xl font-bold text-center text-black">
          Sign Up
        </h1>
        <p className="text-gray-500 text-center mt-2 text-sm sm:text-base">
          Create an account to unlock exclusive features.
        </p>

        <div className="mt-8 space-y-5">
          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-[#000000]">
              Email
            </label>
            <input
              type="email"
              placeholder="Enter your Email"
              className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-emerald-500 focus:outline-none text-gray-900"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
            {errors.email && (
              <p className="text-sm text-red-500 mt-1">{errors.email}</p>
            )}
          </div>

          {/* Password */}
          <div className="relative">
            <label className="block text-sm font-medium text-[#000000]">
              Password
            </label>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Enter your Password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              title="Password must contain at least one uppercase letter, one lowercase letter, and one number."
              className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-emerald-500 focus:outline-none pr-10 text-gray-900"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-9 text-gray-500 cursor-pointer"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
            {errors.password && (
              <p className="text-sm text-red-500 mt-1">{errors.password}</p>
            )}
          </div>

          {/* Confirm Password */}
          <div className="relative">
            <label className="block text-sm font-medium text-[#000000]">
              Confirm Password
            </label>
            <input
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirm your Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-emerald-500 focus:outline-none pr-10 text-gray-900"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-9 text-gray-500 cursor-pointer"
            >
              {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
            {errors.confirmPassword && (
              <p className="text-sm text-red-500 mt-1">{errors.confirmPassword}</p>
            )}
          </div>

          {/* Sign Up Button */}
          <button
            className="cursor-pointer w-full bg-emerald-500 text-[#FBFDFF] py-2.5 sm:py-3 rounded-lg font-semibold hover:bg-[#07B681] transition duration-200"
            onClick={handleSignUp}
            disabled={isLoading}
          >
            Sign Up
          </button>

          {/* Divider */}
          <div className="flex items-center justify-center gap-2">
            <hr className="w-1/3 border-gray-300" />
            <span className="text-gray-400 text-sm">OR</span>
            <hr className="w-1/3 border-gray-300" />
          </div>

          {/* Google Sign Up */}
          <button
            type="button"
            className="cursor-pointer w-full border border-gray-300 py-2.5 sm:py-3 rounded-lg flex items-center justify-center gap-2 hover:bg-gray-100 transition duration-200"
          >
            <Image
              src="https://www.svgrepo.com/show/475656/google-color.svg"
              alt="Google"
              className="w-5 h-5"
              width={20}
              height={20}
            />
            <span className="text-gray-700 font-medium text-sm sm:text-base">
              Sign Up with Google
            </span>
          </button>
        </div>

        {/* Login link */}
        <p className="text-center text-gray-600 text-sm mt-6">
          Already have an account?{" "}
          <a href="/login" className="text-black font-medium hover:underline">
            Login
          </a>
        </p>
      </div>
    </div>
  );
}
