"use client";

import { useState } from "react";
import Image from "next/image";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { authAPI } from "@/lib/api";
import Link from "next/link";

export default function SignupPage() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    // dob: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSignUp = async () => {
    setIsLoading(true);
    try {
      await authAPI.signup({
        fullName: formData.fullName,
        email: formData.email,
        password: formData.password,
      });

      toast.success("Account created successfully");
      router.push("/login");
    } catch (err: any) {

      if (err.status === 400 && err.missing) {
        toast.error(`Missing fields: ${err.missing.join(", ")}`);
        return;
      }

      if (err.status === 409) {
        toast.error("User already exists");
        return;
      }

      toast.error(err.message || "Signup failed");
    } finally {
      setIsLoading(false);
    }
  };



  return (
    /* DESKTOP BACKGROUND */
    <div className="min-h-screen flex items-center justify-center bg-black">
      {/* MOBILE FRAME */}
      <div className="w-[430px] h-[932px] bg-[#00D09E] rounded-[30px] overflow-hidden relative">

        {/* HEADER */}
        <div className="h-[220px] flex items-center justify-center">
          <h1 className="text-[26px] font-semibold text-black">
            Create Account
          </h1>
        </div>

        {/* CARD */}
        <div className="absolute bottom-0 w-full h-[745px] bg-[#F1FFF3] rounded-t-[60px] px-6 pt-6">

          {/* Full Name */}
          <div className="mb-4">
            <label className="text-sm font-semibold text-gray-700 ml-5">Full Name</label>
            <input
              placeholder="Nguyen Van A"
              value={formData.fullName}
              onChange={(e) =>
                setFormData({ ...formData, fullName: e.target.value })
              }
              className="mt-2 w-full h-[50px] rounded-full bg-[#DFF7E2] px-5 text-sm focus:outline-none"
            />
          </div>

          {/* Email */}
          <div className="mb-4">
            <label className="text-sm font-semibold text-gray-700 ml-5">Email</label>
            <input
              placeholder="example@example.com"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              className="mt-2 w-full h-[50px] rounded-full bg-[#DFF7E2] px-5 text-sm focus:outline-none"
            />
          </div>

          {/* Mobile */}
          <div className="mb-4">
            <label className="text-sm font-semibold text-gray-700 ml-5">Mobile Number</label>
            <input
              placeholder="+ 123 456 789"
              value={formData.phone}
              onChange={(e) =>
                setFormData({ ...formData, phone: e.target.value })
              }
              className="mt-2 w-full h-[50px] rounded-full bg-[#DFF7E2] px-5 text-sm focus:outline-none"
            />
          </div>

          {/* DOB
          <div className="mb-4">
            <label className="text-sm font-semibold text-gray-700 ml-5">Date Of Birth</label>
            <input
              placeholder="DD / MM / YYYY"
              value={formData.dob}
              onChange={(e) =>
                setFormData({ ...formData, dob: e.target.value })
              }
              className="mt-2 w-full h-[50px] rounded-full bg-[#DFF7E2] px-5 text-sm focus:outline-none"
            />
          </div> */}

          {/* Password */}
          <div className="mb-4">
            <label className="text-sm font-semibold text-gray-700 ml-5">Password</label>
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
          </div>

          {/* Confirm Password */}
          <div className="mb-8">
            <label className="text-sm font-semibold text-gray-700 ml-5">Confirm Password</label>
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
                type="button"
                onClick={() =>
                  setShowConfirmPassword(!showConfirmPassword)
                }
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
          </div>

          {/* SIGN UP */}
          <div className="flex justify-center">
            <button
              onClick={handleSignUp}
              disabled={isLoading}
              className="w-[207px] h-[45px] rounded-full bg-[#00D09E] text-black font-medium font-semibold"
            >
              Sign Up
            </button>
          </div>

          {/* FOOTER */}
          <p className="mt-6 text-center text-xs text-gray-600">
            Already have an account?{" "}
            <Link href="/login" className="text-blue-500">
              Log In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
