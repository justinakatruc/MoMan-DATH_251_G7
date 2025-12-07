"use client";

import { useUserStore } from "@/app/store/useUserStore";
import { authAPI } from "@/lib/api";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import Link from "next/link";
import Image from "next/image";


export default function LoginPage() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { setUser } = useUserStore();
  const router = useRouter();

  const handleLogin = async () => {
    try {
      setIsLoading(true);

      const result = await authAPI.login(formData);

      if (result.success && result.user) {
        localStorage.setItem("token", result.token);
        setUser(result.user);
        router.push("/home");
        return;
      }

      if (result.needVerify) {
        toast.error("Your email is not verified. Please check your inbox.");
        return;
      }

      toast.error(result.message || "Invalid email or password");
    } catch (err: any) {
      toast.error(err.message || "Login failed");
    } finally {
      setIsLoading(false);
    }
  };


  return (
    /* DESKTOP BACKGROUND */
    <div className="min-h-screen flex items-center justify-center bg-black">
      {/* MOBILE FRAME */}
      <div className="w-[430px] h-[932px] bg-[#00D09E] rounded-[30px] overflow-hidden relative">

        {/* WELCOME */}
        <div className="h-[240px] flex items-center justify-center">
          <h1 className="text-[28px] font-semibold text-black">
            Welcome
          </h1>
        </div>

        {/* CARD */}
        <div className="absolute bottom-0 w-full h-[745px] bg-[#F1FFF3] rounded-t-[60px] px-6 pt-10">

          {/* EMAIL */}
          <div className="mb-5 mt-15">
            <label className="text-sm font-semibold text-gray-700 ml-5">
              Username Or Email
            </label>
            <input
              type="email"
              placeholder="example@example.com"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
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
          </div>

          {/* PASSWORD */}
          <div className="mb-6">
            <label className="text-sm text-gray-700 font-semibold ml-5">
              Password
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
          </div>
          {/* LOGIN */}
          <div className="flex justify-center mt-20">
            <button
              disabled={isLoading}
              onClick={handleLogin}
              className="
                w-[207px]
                h-[45px]
                rounded-full
                bg-[#00D09E]
                text-black
                text-base
                text-xl
                font-bold
              "
            >
              Log in
            </button>
          </div>
          
          {/* FORGOT */}
          <div className="mt-4 text-center">
            <Link
              href="/forgot-password"
              className="text-sm text-gray-600 font-bold"
            >
              Forgot Password?
            </Link>
          </div>

          {/* FOOTER */}
          <p className="absolute bottom-8 left-0 right-0 text-center text-sm text-gray-600">
            Don’t have an account?{" "}
            <Link href="/signup" className="font-medium text-[#6DB6FE]">
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
