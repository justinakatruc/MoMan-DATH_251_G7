"use client";

import Image from "next/image";
import { useUserStore } from "@/app/store/useUserStore";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { RefreshCcw } from "lucide-react";

export default function ProfilePage() {
  const { user } = useUserStore();
  const router = useRouter();
  const [showLogoutPopup, setShowLogoutPopup] = useState(false);

  const handleLogoutConfirm = () => {
    localStorage.removeItem("token");
    router.push("/login");
  };

  return (
    <div className="w-full min-h-screen flex justify-center items-center">
      <div className="w-[430px] h-[932px] bg-[#00D09E] rounded-[30px] overflow-hidden relative">
        {/* Header xanh */}
        <div className="w-full h-[210px] flex flex-col items-center py-20">
          <h2 className="text-[28px] font-semibold text-black">Profile</h2>
        </div>

        {/* BODY trắng */}
        <div className="absolute bottom-0 w-full h-[745px] bg-[#F1FFF3] rounded-t-[60px] px-6 pt-24">
          <div className="px-6 space-y-7">
            {/* Tên + Email */}
            <div className="text-center">
              <p className="text-black font-semibold text-lg">
                {`${user?.firstName || ""} ${user?.lastName || ""}`.trim() ||
                  "User"}
              </p>
              <p className="text-xs text-gray-700">
                Email: {user?.email || "Unknown"}
              </p>
            </div>

            {/* Edit Profile */}
            <div
              className="flex items-center gap-4 active:scale-95 cursor-pointer"
              onClick={() => router.push("/profile/edit")}
            >
              <Image src={"/edit.png"} alt="Edit" width={57} height={53} />
              <span className="text-base font-medium text-gray-700">
                Edit Profile
              </span>
            </div>

            {/* Settings */}
            <div
              className="flex items-center gap-4 active:scale-95 cursor-pointer"
              onClick={() => router.push("/profile/settings")}
            >
              <Image
                src={"/setting.png"}
                alt="Settings"
                width={57}
                height={53}
              />
              <span className="text-base font-medium text-gray-700">
                Setting
              </span>
            </div>

            {/* Help */}
            <div
              className="flex items-center gap-4 active:scale-95 cursor-pointer"
              onClick={() => router.push("/profile/help")}
            >
              <Image src={"/help.png"} alt="Help" width={57} height={53} />
              <span className="text-base font-medium text-gray-700">Help</span>
            </div>

            {/* Change View */}
            {user?.accountType === "Admin" && (
              <div className="flex items-center gap-x-4">
                <div
                  className="w-[57px] h-[53px] bg-[#0068FF] rounded-[20px] flex justify-center items-center text-white cursor-pointer active:scale-95"
                  onClick={() => router.push("/admin/dashboard")}
                >
                  <RefreshCcw />
                </div>
                <span
                  className="text-base font-medium text-gray-700 cursor-pointer active:scale-95"
                  onClick={() => router.push("/admin/dashboard")}
                >
                  Change to User View
                </span>
              </div>
            )}

            {/* Logout */}
            <div
              className="flex items-center gap-4 active:scale-95 cursor-pointer"
              onClick={() => setShowLogoutPopup(true)}
            >
              <Image
                src={"/logout (3).png"}
                alt="Logout"
                width={57}
                height={53}
              />
              <span className="text-base font-medium text-gray-700">
                Logout
              </span>
            </div>
          </div>
        </div>

        {/* Avatar */}
        <div className="absolute top-[130px] left-1/2 -translate-x-1/2">
          <Image src="/avatar.png" alt="avatar" width={120} height={120} />
        </div>
      </div>

      {/* Popup Logout — NHÚNG TRONG FILE */}
      {showLogoutPopup && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
          <div className="w-[330px] bg-white rounded-3xl p-7 text-center shadow-xl">
            <h2 className="text-xl font-bold text-gray-800">End Session</h2>

            <p className="text-gray-600 mt-2 mb-6 text-sm">
              Are you sure you want to log out?
            </p>

            <button
              onClick={handleLogoutConfirm}
              className="w-full h-[50px] bg-[#00D09E] text-black font-semibold rounded-full active:scale-95 cursor-pointer"
            >
              Yes, End Session
            </button>

            <button
              onClick={() => setShowLogoutPopup(false)}
              className="w-full h-[50px] bg-[#DFF7E2] text-black font-semibold rounded-full mt-3 active:scale-95 cursor-pointer"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
