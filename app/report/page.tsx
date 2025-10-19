"use client";

import Image from 'next/image'


export default function Report() {
    return(
        <>
            {/* PC */}
            <div className="hidden lg:block ml-64 min-h-screen bg-[#F4F7FD]">
                <div className="space-y-4">
                    {/*Header*/}
                    <div className="flex flex-row justify-between items-center ml-16 mt-8 mr-6">
                        <h1 className="text-4xl font-bold text-gray-800">Report</h1>
                        <div className="flex flex-row space-x-4">
                            <button className="w-16 h-16 bg-[#07B681] text-4xl text-white font-bold rounded-2xl ">+</button>
                            <div className="w-14 h-14 rounded-full bg-[#cdfaec] border border-gray-400"></div>
                        </div>
                    </div>
                    {/*Body*/}
                    <div className="flex flex-row justify-between items-top mt-8 mr-6 ml-6">

                        {/*Message*/}
                        <div className="space-y-8 ml-10">
                            <div className="bg-white rounded-2xl shadow-md/20 p-4 h-156 w-300"></div>
                            <div className="bg-white rounded-2xl shadow-md/20 p-4 h-16 w-300">
                                <div className="flex flex-row justify-between items-center">
                                    <p className="text-gray-400 text-lg fond-inter">Ask anything about budgeting</p>
                                    <Image src="/send.png" alt="Send Icon" width={25} height={8}/>
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
                    <div className="flex flex-row justify-between items-top">
                        <h1 className="text-3xl font-bold text-gray-800">Report</h1> 
                        <button className="w-12 h-12 bg-[#07B681] text-2xl text-white font-bold rounded-3xl ">+</button>
                    </div>

                    {/*Message*/}
                    <div className="space-y-8 mt-12">
                        <div className="bg-white rounded-2xl shadow-md/20 p-4 h-100 w-full"></div>
                        <div className="bg-white rounded-2xl shadow-md/20 p-4 h-16 w-full">
                            <div className="flex flex-row justify-between items-center">
                                <p className="text-gray-400 text-sm fond-inter">Ask anything about budgeting</p>
                                <Image src="/send.png" alt="Send Icon" width={25} height={8}/>
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