"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import BottomBar from "@/app/components/BottomBar";
import { userAPI } from "@/lib/api";

export default function PasswordSettingsPage() {
  const router = useRouter();

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const handlePassword = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
        alert("Please fill in all fields.");
        return;
    }

    if (newPassword !== confirmPassword) {
        alert("New password and confirmation do not match!");
        return;
    }

    try {
        const response = await userAPI.updatePassword({
        token: localStorage.getItem("token"),
        currentPassword,
        newPassword,
        });

        if (!response.success) {
        alert(response.message || "Password update failed!");
        return;
        }

        alert("Password updated successfully!");
        router.push("/profile/settings");
    } catch (error) {
        console.error(error);
        alert("Something went wrong!");
    }
    };


  return (
    <div className="w-full min-h-screen flex justify-center items-center bg-neutral-900">
      {/* iPhone Frame */}
      <div className="w-[430px] h-[932px] bg-[#00D09E] rounded-[30px] overflow-hidden relative">

        {/* Header */}
        <div className="w-full h-[170px] flex flex-col px-6 pt-10">
          <button
            className="w-10 h-10 flex items-center justify-center active:scale-95"
            onClick={() => router.back()}
          >
            <Image src="/back.png" alt="Back" width={24} height={24} />
          </button>

          <h2 className="text-center text-[26px] font-semibold text-black mt-2">
            Password Settings
          </h2>
        </div>

        {/* Body */}
        <div className="absolute bottom-0 w-full h-[760px] bg-[#F1FFF3] rounded-t-[60px] px-6 pt-10">
          <div className="space-y-7">

            {/* Current Password */}

            <div className="mb-6">
            <label className="text-[15px] font-semibold text-gray-700 ml-2">
                Current Password
            </label>

            <div className="relative mt-2">
                <input
                type={showCurrent ? "text" : "password"}
                placeholder="••••••••"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="
                    w-full
                    h-[54px]
                    rounded-full
                    bg-[#DFF7E2]
                    px-5
                    pr-12
                    text-[15px]
                    font-bold
                    text-gray-700
                    focus:outline-none
                "
                />

                <button
                type="button"
                onClick={() => setShowCurrent(!showCurrent)}
                className="absolute right-5 top-1/2 -translate-y-1/2"
                >
                <Image
                    src={showCurrent ? "/eye-open.png" : "/eye-close.png"}
                    alt="Toggle"
                    width={22}
                    height={22}
                />
                </button>
            </div>
            </div>

            {/* New Password */}
            <div className="mb-6">
            <label className="text-[15px] font-semibold text-gray-700 ml-2">
                New Password
            </label>

            <div className="relative mt-2">
                <input
                type={showNew ? "text" : "password"}
                placeholder="••••••••"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="
                    w-full
                    h-[54px]
                    rounded-full
                    bg-[#DFF7E2]
                    px-5
                    pr-12
                    text-[15px]
                    font-bold
                    text-gray-700
                    focus:outline-none
                "
                />

                <button
                type="button"
                onClick={() => setShowNew(!showNew)}
                className="absolute right-5 top-1/2 -translate-y-1/2"
                >
                <Image
                    src={showNew ? "/eye-open.png" : "/eye-close.png"}
                    alt="Toggle"
                    width={22}
                    height={22}
                />
                </button>
            </div>
            </div>


            {/* Confirm Password */}
            <div className="mb-6">
            <label className="text-[15px] font-semibold text-gray-700 ml-2">
                Confirm New Password
            </label>

            <div className="relative mt-2">
                <input
                type={showConfirm ? "text" : "password"}
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="
                    w-full
                    h-[54px]
                    rounded-full
                    bg-[#DFF7E2]
                    px-5
                    pr-12
                    text-[15px]
                    font-bold
                    text-gray-700
                    focus:outline-none
                "
                />

                <button
                type="button"
                onClick={() => setShowConfirm(!showConfirm)}
                className="absolute right-5 top-1/2 -translate-y-1/2"
                >
                <Image
                    src={showConfirm ? "/eye-open.png" : "/eye-close.png"}
                    alt="Toggle"
                    width={22}
                    height={22}
                />
                </button>
            </div>
            </div>


          </div>

          {/* Submit Button */}
          <button
            className="w-full h-12 bg-[#00D09E] text-white font-semibold rounded-full mt-10 active:scale-95"
            onClick={(handlePassword)}
          >
            Change Password
          </button>

          {/* Bottom Bar */}
          <div className="absolute bottom-0 left-0 w-full">
            <BottomBar />
          </div>
        </div>
      </div>
    </div>
  );
}
