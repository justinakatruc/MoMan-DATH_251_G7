"use client";

import Content from "@/app/components/Content";
import { ArrowLeft } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Report() {
  const router = useRouter();
  type Msg = { text: string; sender: "user" | "bot"; time: string };
  const [messages, setMessages] = useState("");
  const [chatHistory, setChatHistory] = useState<Msg[]>([]);

  const handleSend = () => {
    if (messages.trim() === "") return;
    const currentTime = new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
    setChatHistory([
      ...chatHistory,
      { text: messages, sender: "user", time: currentTime },
    ]);

    const token = localStorage.getItem("token");
    fetch("/api/chatbot", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        message: messages,
        // TRUYỀN TOKEN XÁC THỰC TỪ CLIENT VÀO ĐÂY
        authToken: token, 
      }),
    })
    .then((res) => res.json())
    .then((data) => {
      setChatHistory((prevHistory) => [
        ...prevHistory,
        { text: data.reply, sender: "bot", time: currentTime },
      ]);
    })
    .catch((error) => {
      console.error("Error:", error);
    });

    setMessages("");
  };

  return (
    <div className="flex flex-col gap-y-10 flex-1 relative">
      {/*Header*/}
      <div className="flex items-center h-[85px] justify-center">
        <div className="font-semibold text-xl mt-8 px-5 text-[#052224]">
          WALL-E
        </div>
        <div
          onClick={() => {
            router.back();
          }}
          className="absolute left-3 top-12 cursor-pointer"
        >
          <ArrowLeft className="text-white" />
        </div>
      </div>

      <Content>
        <div className="flex flex-col items-center w-[358px]">
          {/*Message*/}
          <div className="flex flex-col relative w-full">
            <div className="flex flex-col p-4 w-full overflow-y-auto h-[580px]">
              {chatHistory.length === 0 ? (
                <p className="text-gray-400 text-sm text-center mt-8">
                  No messages yet
                </p>
              ) : (
                chatHistory.map((msg, index) => (
                  <div
                    key={index}
                    className={`flex ${
                      msg.sender === "user" ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`p-2 rounded-xl max-w-[75%] wrap-break-word whitespace-pre-wrap flex flex-col`}
                    >
                      <div
                        className={`text-sm font-light w-full px-4 py-2 rounded-[10px] ${
                          msg.sender === "user"
                            ? "bg-[#00D09E] text-[#093030]"
                            : "bg-[#DFF7E2] text-[#093030]"
                        }`}
                      >
                        {msg.text}
                      </div>
                      <div
                        className={`font-light text-[12px] text-[#093030] mt-1 ${
                          msg.sender === "user" ? "text-right" : "text-left"
                        }`}
                      >
                        {msg.time}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
            <div className="bg-[#00D09E] rounded-2xl shadow-md/20 p-4 w-[358px] absolute bottom-[-75px] left-0 right-0 mx-auto">
              <div className="flex flex-row justify-between items-center">
                <input
                  type="text"
                  placeholder="Ask me anything..."
                  value={messages}
                  onChange={(e) => setMessages(e.target.value)}
                  className="p-2 w-[278px] text-[#252525] text-sm font-inter placeholder:italic focus:outline-none bg-white rounded-[25px]"
                  onKeyDown={(e) => e.key === "Enter" && handleSend()}
                />
                <button
                  onClick={handleSend}
                  className="w-8 h-[30px] rounded-[10px] bg-[#DFF7E2] flex items-center justify-center"
                >
                  <Image
                    src="/send.png"
                    alt="Send Icon"
                    width={20}
                    height={20}
                    className="cursor-pointer"
                  />
                </button>
              </div>
            </div>
          </div>
        </div>
      </Content>
    </div>
  );
}
