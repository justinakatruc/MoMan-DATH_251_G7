"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import BottomBar from "@/app/components/BottomBar";
import { userAPI } from "@/lib/api";
import { ArrowLeft } from "lucide-react";

export default function DeleteAccountPage() {
  const router = useRouter();

  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [showConfirm, setShowConfirm] = useState(false);

  // -------------------------------
  // DELETE ACCOUNT
  // -------------------------------
  const handleDeleteAccount = async () => {
    if (!password.trim()) {
      alert("Please enter your password.");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      alert("You are not logged in.");
      return;
    }

    const response = await userAPI.deleteAccount({
      token,
      password,
    });

    if (!response.success) {
      alert(response.message || "Failed to delete account.");
      return;
    }

    alert("Account deleted successfully.");
    localStorage.removeItem("token");
    router.push("/login");
  };

  return (
    <div className="w-full min-h-screen flex justify-center items-center">
      {/* iPhone frame */}
      <div className="w-[430px] h-[932px] bg-[#00D09E] rounded-[30px] overflow-hidden relative">
        {/* Header */}
        <div className="w-full h-[115px] px-6 py-6 flex items-center relative">
          <button
            className="text-white cursor-pointer"
            onClick={() => router.back()}
          >
            <ArrowLeft />
          </button>
          <h2 className="absolute left-1/2 -translate-x-1/2 text-[22px] font-semibold text-black">
            Delete Account
          </h2>
        </div>

        {/* Body */}
        <div className="absolute bottom-0 w-full h-[817px] bg-[#F1FFF3] rounded-t-[60px] px-7 pt-10">
          {/* Title */}
          <h3 className="text-center text-lg font-bold text-black leading-6 mt-3">
            Are You Sure You Want To Delete <br />
            Your Account?
          </h3>

          <div className="w-full bg-[#DFF7E2] rounded-2xl p-5 mt-7 text-gray-800 text-sm leading-5">
            <p className="mb-2">
              This action will permanently delete all of your data, and you will
              not be able to recover it. Please keep the following in mind
              before proceeding:
            </p>
            <ul className="list-disc ml-5 space-y-1">
              <li>
                All your expenses, income and transactions will be deleted.
              </li>
              <li>You will not be able to access your account again.</li>
              <li>This action cannot be undone.</li>
            </ul>
          </div>

          <p className="mt-8 text-center text-sm font-semibold text-gray-700">
            Please Enter Your Password To Confirm <br /> Deletion Of Your
            Account.
          </p>

          <div className="relative mt-6">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="
                w-full h-[54px] rounded-full bg-[#DFF7E2]
                px-5 pr-12 text-sm focus:outline-none font-bold
              "
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-5 top-1/2 -translate-y-1/2"
            >
              <Image
                src={showPassword ? "/eye-open.png" : "/eye-close.png"}
                alt="Toggle"
                width={22}
                height={22}
              />
            </button>
          </div>

          <button
            onClick={() => setShowConfirm(true)}
            className="w-full h-[50px] bg-[#00D09E] text-black font-semibold mt-10 rounded-full active:scale-95"
          >
            Yes, Delete Account
          </button>

          <button
            onClick={() => router.back()}
            className="w-full h-[50px] bg-[#DFF7E2] text-black font-semibold mt-4 rounded-full active:scale-95"
          >
            Cancel
          </button>

          <div className="absolute bottom-0 left-0 w-full">
            <BottomBar />
          </div>
        </div>
      </div>

      {/* -------------------------------- */}
      {/*        CONFIRM POPUP            */}
      {/* -------------------------------- */}
      {showConfirm && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white w-[85%] rounded-3xl p-6 text-center">
            <h2 className="text-xl font-bold text-gray-800">Delete Account</h2>

            <p className="mt-3 text-sm font-semibold text-gray-700">
              Are You Sure You Want To Delete Your Account?
            </p>

            <p className="mt-2 text-sm text-gray-600">
              By deleting your account, you understand that all your data will
              be permanently removed and cannot be recovered.
            </p>

            <button
              onClick={handleDeleteAccount}
              className="w-full h-12 bg-[#00D09E] text-black rounded-full font-semibold mt-5"
            >
              Yes, Delete Account
            </button>

            <button
              onClick={() => setShowConfirm(false)}
              className="w-full h-12 bg-[#DFF7E2] text-black rounded-full font-semibold mt-3"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
