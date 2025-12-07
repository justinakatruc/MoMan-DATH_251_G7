"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { authAPI } from "@/lib/api";
import Image from "next/image";

type VerifyError = {
  message?: string;
};

export default function VerifyPage() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const email = searchParams.get("email");

  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading"
  );
  const [message, setMessage] = useState("");

  const [resendStatus, setResendStatus] = useState<
    "idle" | "sending" | "success" | "error"
  >("idle");
  const [resendMessage, setResendMessage] = useState("");

  useEffect(() => {
    if (!token) {
      setStatus("error");
      setMessage("Token not found");
      return;
    }

    const verify = async () => {
      try {
        const res = await authAPI.verifyEmail(token);
        setStatus("success");
        setMessage(res.message);
      } catch (err: unknown) {
        const error = err as VerifyError;
        setStatus("error");
        setMessage(error.message || "Verification failed");
      }
    };

    verify();
  }, [token]);

  const handleResend = async () => {
    if (!email) {
      setResendStatus("error");
      setResendMessage("Missing email, cannot resend.");
      return;
    }

    try {
      setResendStatus("sending");
      const res = await authAPI.resendVerify(email);

      setResendStatus("success");
      setResendMessage(res.message || "Verification email sent.");
    } catch (err: unknown) {
      const error = err as VerifyError;
      setResendStatus("error");
      setResendMessage(error.message || "Cannot resend verification email.");
    }
  };

  return (
    <div className="w-full h-screen flex justify-center items-center bg-black">
      {/* MOBILE FRAME */}
      <div
        className="w-[430px] h-[932px] bg-[#F5FFFA] mx-auto flex items-center justify-center 
                    rounded-4xl shadow-xl overflow-hidden"
      >
        <div className="w-full max-w-sm flex flex-col items-center text-center space-y-6 px-6">
          <Image
            src="/Vector.png"
            alt="MoMan Logo"
            width={128}
            height={128}
            className="mx-auto"
          />

          <div className="mt-8 px-6">
            {status === "loading" && (
              <p className="text-gray-600 text-lg">Verifying your email...</p>
            )}

            {status === "success" && (
              <p className="text-green-600 text-lg font-semibold">{message}</p>
            )}

            {status === "error" && (
              <p className="text-red-600 text-lg font-semibold">{message}</p>
            )}
          </div>

          {status === "error" && (
            <div className="mt-8 flex flex-col items-center gap-3">
              <button
                onClick={handleResend}
                disabled={resendStatus === "sending"}
                className="px-8 py-3 bg-[#00C896] rounded-full text-white font-semibold shadow-md disabled:bg-gray-300"
              >
                {resendStatus === "sending" ? "Sending..." : "Resend Email"}
              </button>

              {/* Messages */}
              {resendStatus === "success" && (
                <p className="text-green-500 text-sm">{resendMessage}</p>
              )}
              {resendStatus === "error" && (
                <p className="text-red-500 text-sm">{resendMessage}</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
