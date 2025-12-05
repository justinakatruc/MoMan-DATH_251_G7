"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import BottomBar from "@/app/components/BottomBar";

export default function HelpPage() {
  const router = useRouter();
  const [message, setMessage] = useState("");

  const handleSubmit = () => {
    if (!message.trim()) {
      alert("Please enter your message.");
      return;
    }

    alert("Your support request has been submitted.");
    setMessage("");
  };

  return (
    <div className="w-full min-h-screen flex justify-center items-center bg-neutral-900">
      {/* iPhone Frame */}
      <div className="w-[430px] h-[932px] bg-[#00D09E] rounded-[30px] overflow-hidden relative">

        {/* Header */}
        <div className="w-full h-[115px] px-6 py-6 flex items-center relative">
          <button onClick={() => router.back()}>
            <Image src="/back.png" alt="Back" width={28} height={28} />
          </button>
          <h2 className="absolute left-1/2 -translate-x-1/2 text-[22px] font-semibold text-white">
            Contact Support
          </h2>
        </div>

        {/* Body */}
        <div className="absolute bottom-0 w-full h-[817px] bg-[#F1FFF3] rounded-t-[60px] px-7 pt-10 overflow-y-auto">

          {/* Contact Email */}
          <label className="text-sm font-semibold text-gray-700">Contact Email</label>
          <div className="w-full h-[50px] bg-[#DFF7E2] rounded-full px-5 flex items-center mt-2 mb-6 font-medium text-gray-700">
            abc@hcmut.edu.vn
          </div>

          {/* Contact Phone */}
          <label className="text-sm font-semibold text-gray-700">Contact Phone</label>
          <div className="w-full h-[50px] bg-[#DFF7E2] rounded-full px-5 flex items-center mt-2 mb-6 font-medium text-gray-700">
            0123123123
          </div>

          {/* Contact Address */}
          <label className="text-sm font-semibold text-gray-700">Contact Address</label>
          <div className="w-full h-[50px] bg-[#DFF7E2] rounded-full px-5 flex items-center mt-2 mb-6 font-medium text-gray-700">
            268 Ly Thuong Kiet
          </div>

          {/* Question Box */}
          <label className="text-sm font-semibold text-gray-700">
            Question For Further Support
          </label>

          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder={`Enter Message:\n• Repeated Event?\n• Cycle?\n• Time?\n• Recurring?\n• AI Generated`}
            className="
              w-full h-[150px] bg-[#DFF7E2] rounded-2xl px-5 py-4 mt-2 mb-6
              text-sm text-gray-700 focus:outline-none resize-none
            "
          />

          {/* Submit Button */}
          <button
            onClick={handleSubmit}
            className="w-full h-[50px] bg-[#00D09E] text-white font-semibold rounded-full active:scale-95"
          >
            Submit
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
