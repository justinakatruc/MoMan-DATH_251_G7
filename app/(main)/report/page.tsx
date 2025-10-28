"use client";

import Topbar from '@/app/components/Topbar';
import Image from 'next/image'
import { useState } from 'react';


export default function Report() {
    type Msg = { text: string; sender: 'user' | 'bot'; time: string};
    const [messages, setMessages] = useState("")
    const [chatHistory, setChatHistory] = useState<Msg[]>([]);

    const handleSend = () => {
        if (messages.trim() === '') return;
        const currentTime = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
        setChatHistory([...chatHistory, { text: messages, sender: 'user', time: currentTime}]);
        setMessages('');
    };

    return(
        <>
            {/* PC */}
            <div className="hidden lg:flex flex-col min-h-screen bg-[#F4F7FD]">
                <div className="space-y-4">
                    {/*Header*/}
                    <Topbar />
                    {/*Body*/}
                    <div className="flex flex-row gap-x-10 items-top mt-8 px-6">

                        {/*Message*/}
                        <div className="space-y-8">
                            <div className="bg-white rounded-2xl shadow-md/20 p-4 h-156 w-300"></div>
                            <div className="bg-white rounded-2xl shadow-md/20 p-4 h-16 w-300">
                                <div className="flex flex-row justify-between items-center gap-x-4">
                                    <input type="text"
                                        placeholder='Ask anything about budgeting' 
                                        value={messages}
                                        onChange={(e) => setMessages(e.target.value)}
                                        className="flex flex-1 text-gray-400 text-sm font-inter placeholder:italic focus:outline-none"
                                        onKeyDown={(e) => e.key === 'Enter' && handleSend()}/>
                                    <button onClick={handleSend} className="p-1 hover:opacity-80">
                                        <Image src="/send.png" alt="Send Icon" width={25} height={8} className='cursor-pointer' />
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/*Income/Expense*/}
                        <div className="space-y-8 ml-10">
                            <div className="bg-white rounded-2xl shadow-md/20 p-4 h-64 w-64">
                                <div className='flex flex-col space-y-12 items-center mt-4'>
                                    <h1 className="text-2xl font-inter font-semibold text-gray-800 ">Income</h1>
                                    <p className="font-inter text-2xl font-thin text-gray-900">$90000</p>
                                </div>
                            </div>
                            <div className="bg-white rounded-2xl shadow-md/20 p-4 h-64 w-64">
                                <div className='flex flex-col space-y-12 items-center mt-4'>
                                    <h1 className="text-2xl font-inter font-semibold text-gray-800 ">Expense</h1>
                                    <p className="font-inter text-2xl font-thin text-gray-900">$90000</p>
                                </div>                         
                            </div>
                        </div>

                    </div>

                </div>
            </div>

            {/* Mobile */}
            <div className="block lg:hidden min-h-screen bg-[#F4F7FD]">

                <div className="space-y-4 p-5">

                    {/*Header*/}
                    <Topbar />

                    {/*Message*/}
                    <div className="space-y-8 mt-12">
                        <div className="bg-white rounded-2xl shadow-md/20 p-4 h-100 w-full overflow-y-auto">
                            {chatHistory.length === 0 ? (
                                <p className="text-gray-400 text-sm text-center mt-8">No messages yet</p>
                                ) : (
                                chatHistory.map((msg, index) => (
                                    <div
                                    key={index}
                                    className={`flex ${
                                        msg.sender === "user" ? "justify-end" : "justify-start"
                                    } mb-3`}
                                    >
                                    <div
                                        className={`px-4 py-2 rounded-xl max-w-[75%] break-words whitespace-pre-wrap flex flex-col ${
                                        msg.sender === "user"
                                            ? "bg-[#cdfaec] text-gray-800"
                                            : "bg-gray-100 text-gray-700"
                                        }`}
                                    >
                                        <span className="text-sm">{msg.text}</span>
                                        <span
                                        className={`text-[10px] text-gray-500 mt-1 ${
                                            msg.sender === "user" ? "text-right" : "text-left"
                                        }`}
                                        >
                                        {msg.time}
                                        </span>
                                    </div>
                                    </div>
                                ))
                            )}
                        </div>
                        <div className="bg-white rounded-2xl shadow-md/20 p-4 h-16 w-full">
                            <div className="flex flex-row justify-between items-center">
                                <input type="text"
                                        placeholder='Ask anything about budgeting' 
                                        value={messages}
                                        onChange={(e) => setMessages(e.target.value)}
                                        className="text-gray-400 text-sm font-inter placeholder:italic focus:outline-none"
                                        onKeyDown={(e) => e.key === 'Enter' && handleSend()}/>
                                <button onClick={handleSend} className="p-1 hover:opacity-80">
                                    <Image src="/send.png" alt="Send Icon" width={25} height={8} className='cursor-pointer' />
                                </button>
                            </div>
                        </div>
                    </div>

                    {/*Income/Expense*/}
                    <div className="flex flex-row justify-between items-top mt-8 space-x-8">
                        <div className="bg-white rounded-2xl shadow-md/20 p-4 h-45 w-full">
                            <div className='flex flex-col space-y-8 items-center mt-4'>
                                <h1 className="text-xl font-inter font-semibold text-gray-800 ">Income</h1>
                                <p className="font-inter text-xl font-thin text-gray-900">$90000</p>
                            </div>
                        </div>
                        <div className="bg-white rounded-2xl shadow-md/20 p-4 h-45 w-full">
                            <div className='flex flex-col space-y-8 items-center mt-4'>
                                <h1 className="text-xl font-inter font-semibold text-gray-800 ">Expense</h1>
                                <p className="font-inter text-xl font-thin text-gray-900">$90000</p>
                            </div>                         
                        </div>
                    </div>

                </div>
            </div>

        </>
    )
}