"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

export default function SignupPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);


  return (
    <div className="flex-1 flex justify-center items-center h-screen bg-[#F4F7FD]">
      <div className="bg-white shadow-md rounded-2xl p-10 w-full max-w-lg">
        <h1 className="text-3xl font-bold text-center text-black">Sign Up</h1>
        <p className="text-gray-500 text-center mt-2">
          Create an account to unlock exclusive features.
        </p>

        <form className="mt-8 space-y-5">
          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-[#000000]">
              Email
            </label>
            <input
              type="email"
              placeholder="Enter your Email"
              className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-emerald-500 focus:outline-none text-gray-900"
            />
          </div>

          {/* Password */}
          <div className="relative">
            <label className="block text-sm font-medium text-[#000000]">
              Password
            </label>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Enter your Password"
              required
              pattern="^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$"
              title="Password must contain at least one uppercase letter, one lowercase letter, and one number."
              className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-emerald-500 focus:outline-none pr-10 text-gray-900"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-9 text-gray-500"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          {/* Confirm Password */}
          <div className="relative">
            <label className="block text-sm font-medium text-[#000000]">
              Confirm Password
            </label>
            <input
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirm your Password"
              className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-emerald-500 focus:outline-none pr-10 text-gray-900"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-9 text-gray-500"
            >
              {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          {/* Sign Up Button */}
          <button
            type="submit"
            className="w-full bg-emerald-500 text-[#FBFDFF] py-3 rounded-lg font-semibold hover:bg-[#07B681] transition duration-200"
          >
            Sign Up
          </button>

          {/* Divider */}
          <div className="flex items-center justify-center gap-2 my-6">
            <hr className="w-1/3 border-gray-300" />
            <span className="text-gray-400 text-sm">OR</span>
            <hr className="w-1/3 border-gray-300" />
          </div>

          {/* Google Sign Up */}
          <button
            type="button"
            className="w-full border border-gray-300 py-3 rounded-lg flex items-center justify-center gap-2 hover:bg-gray-100 transition duration-200"
          >
            <img
              src="https://www.svgrepo.com/show/475656/google-color.svg"
              alt="Google"
              className="w-5 h-5"
            />
            <span className="text-gray-700 font-medium">Sign Up with Google</span>
          </button>
        </form>

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
