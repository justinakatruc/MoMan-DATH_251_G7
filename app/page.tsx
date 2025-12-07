"use client";

import { useRouter } from "next/navigation";

export default function LaunchPage() {
  const router = useRouter();

  return (
    <div className="w-[430px] h-[932px] bg-[#F5FFFA] mx-auto flex items-center justify-center 
                    rounded-4xl shadow-xl overflow-hidden">

      <div className="w-full max-w-sm flex flex-col items-center text-center space-y-6 px-6">

        {/* Logo + title */}
        <div className="space-y-2 mt-10">
          <img
            src="/Vector.png"
            alt="MoMan Logo"
            className="w-32 h-32 mx-auto"
          />
          <h1 className="text-6xl font-extrabold text-[#0DBF8B]">MoMan</h1>
          <p className="text-xs text-gray-500 px-6">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor.
          </p>
        </div>

        {/* Login button */}
        <button
          className="w-55 bg-[#0DBF8B] text-black py-3 rounded-4xl font-semibold hover:bg-[#07B681] transition mt-4 text-2xl"
          onClick={() => router.push("/login")}
        >
          Log In
        </button>

        {/* Sign Up button */}
        <button
          className="w-55 bg-[#DCFFDB] text-black py-3 rounded-4xl font-semibold hover:bg-[#D7FDEA] transition text-2xl"
          onClick={() => router.push("/signup")}
        >
          Sign Up
        </button>

        {/* Forgot password */}
        <button
          onClick={() => router.push("/forgot-password")}
          className="text-xs font-semibold text-gray-400 hover:text-gray-600 mt-2"
        >
          Forgot Password?
        </button>
      </div>
    </div>
  );
}
