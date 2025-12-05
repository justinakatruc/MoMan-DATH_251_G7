"use client";

import Image from "next/image";
import BottomBar from "@/app/components/BottomBar";
import { useUserStore } from "@/app/store/useUserStore";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { userAPI } from "@/lib/api";
import { authAPI } from "@/lib/api";

export default function EditProfilePage() {
  const { user, setUser } = useUserStore();
  const router = useRouter();

  const [fullName, setFullName] = useState(
    `${user?.firstName || ""} ${user?.lastName || ""}`.trim()
  );
  const [email, setEmail] = useState(user?.email || "");
  const [pushNoti, setPushNoti] = useState(true);

  const handleUpdate = async () => {
  try {
    // Tách fullname → first & last
    const parts = fullName.trim().split(" ");
    const firstName = parts[0] || "";
    const lastName = parts.slice(1).join(" ") || "";

    const response = await userAPI.updateProfile({
      id: user?.id,
      firstName,
      lastName,
      email,
    });

    if (!response.success) {
      alert(response.message || "Update failed!");
      return;
    }

    const updatedUser = response.user;

    setUser({
      id: updatedUser._id?.$oid || "",
      firstName: updatedUser.firstName,
      lastName: updatedUser.lastName,
      email: updatedUser.email,
      memberSince: updatedUser.memberSince ?? "",
      accountType: updatedUser.accountType ?? "",
    });

    router.push("/profile");
  } catch (err) {
    console.error(err);
    alert("Something went wrong!");
  }
};



  return (
    <div className="w-full min-h-screen flex justify-center items-center bg-neutral-900">
      {/* iPhone Frame */}
      <div className="w-[430px] h-[932px] bg-[#00D09E] rounded-[30px] overflow-hidden relative">

        {/* Header xanh */}
        <div className="w-full h-[210px] flex flex-col items-center py-16">
          <h2 className="text-[28px] font-semibold text-black">Edit My Profile</h2>
        </div>

        {/* BODY trắng */}
        <div className="absolute bottom-0 w-full h-[745px] bg-[#F1FFF3] rounded-t-[60px] px-6 pt-28">

          <div className="px-4 space-y-6">

            {/* NAME + EMAIL */}
            <div className="text-center">
              <p className="text-lg font-semibold text-black">{fullName}</p>
              <p className="text-xs text-gray-600">
                Email: {email || "Unknown"}
              </p>
            </div>

            <h3 className="font-semibold text-[18px] text-gray-800 mt-4">
              Account Settings
            </h3>

            {/* Username */}
            <div>
              <p className="text-gray-700 text-sm mb-1">Username</p>
              <input
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full h-[45px] bg-[#E3F8E7] rounded-xl px-4 text-sm outline-none"
              />
            </div>

            {/* Email */}
            <div>
              <p className="text-gray-700 text-sm mb-1">Email Address</p>
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="example@example.com"
                className="w-full h-[45px] bg-[#E3F8E7] rounded-xl px-4 text-sm outline-none"
              />
            </div>

            {/* Push Notification Toggle */}
            <div className="flex items-center justify-between mt-3">
              <p className="text-gray-700 text-sm">Push Notifications</p>

              <button
                onClick={() => setPushNoti(!pushNoti)}
                className={`w-12 h-6 rounded-full transition ${
                  pushNoti ? "bg-green-500" : "bg-gray-400"
                } relative`}
              >
                <span
                  className={`absolute w-5 h-5 bg-white rounded-full top-0.5 transition ${
                    pushNoti ? "left-6" : "left-1"
                  }`}
                />
              </button>
            </div>

            {/* Update Button */}
            <button
              onClick={handleUpdate}
              className="w-full h-[48px] bg-[#00D09E] text-white rounded-2xl mt-2 active:scale-95"
            >
              Update Profile
            </button>

          </div>

          {/* Bottom Bar */}
          <div className="absolute bottom-0 left-0 w-full">
            <BottomBar />
          </div>
        </div>

        {/* Avatar đè lên */}
        <div className="absolute top-[125px] left-1/2 -translate-x-1/2">
          <div className="relative">
            <Image
              src="/avatar.png"
              alt="avatar"
              width={120}
              height={120}
              className="rounded-full"
            />
            <div className="absolute bottom-2 right-2 bg-[#00D09E] w-8 h-8 rounded-full flex items-center justify-center">
              <Image src="/camera.png" width={20} height={20} alt="edit avatar" />
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
