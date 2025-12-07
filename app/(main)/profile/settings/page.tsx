"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import BottomBar from "@/app/components/BottomBar";

export default function SettingsPage() {
  const router = useRouter();

  return (
    <div className="w-full min-h-screen flex justify-center items-center bg-neutral-900">
      {/* iPhone Frame */}
      <div className="w-[430px] h-[932px] bg-[#00D09E] rounded-[30px] overflow-hidden relative">

        {/* Header */}
        <div className="w-full h-[170px] flex flex-col px-6 pt-10">
          {/* Back Button */}
          <button
            className="w-10 h-10 flex items-center justify-center active:scale-95"
            onClick={() => router.back()}
          >
            <Image src="/back.png" alt="Back" width={19} height={16} />
          </button>

          <h2 className="text-center text-[26px] font-semibold text-black mt-2">
            Settings
          </h2>
        </div>

        {/* White Body */}
        <div className="absolute bottom-0 w-full h-[760px] bg-[#F1FFF3] rounded-t-[60px] px-6 pt-12">
          
          <div className="space-y-8">

            {/* Password settings */}
            <div
              className="flex items-center justify-between px-2 cursor-pointer active:scale-95"
              onClick={() => router.push("/profile/settings/password")}
            >
              <div className="flex items-center gap-4">
                <Image src="/key.png" alt="Password" width={31} height={31} />
                <span className="text-[17px] font-medium text-gray-700">
                  Password Settings
                </span>
              </div>

              <Image src="/arrow-right.png" alt=">" width={7} height={13} />
            </div>

            {/* Delete Account */}
            <div
              className="flex items-center justify-between px-2 cursor-pointer active:scale-95"
              onClick={() => router.push("/profile/settings/delete")}
            >
              <div className="flex items-center gap-4">
                <Image src="/user-green.png" alt="Delete" width={31} height={31} />
                <span className="text-[17px] font-medium text-gray-700">
                  Delete Account
                </span>
              </div>

              <Image src="/arrow-right.png" alt=">" width={7} height={13} />
            </div>

          </div>

          {/* Bottom Bar */}
          <div className="absolute bottom-0 left-0 w-full">
            <BottomBar />
          </div>

        </div>
      </div>
    </div>
  );
}
