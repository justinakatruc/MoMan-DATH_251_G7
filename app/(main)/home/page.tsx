"use client";

import { useState } from "react";

export default function Home() {
  const [activeTab, setActiveTab] = useState("Expense");

  const [expenses, setExpenses] = useState([
    { name: "Banana", category: "Food & Drink", price: "$2", color: "#eb6a63" },
    { name: "Banana", category: "Food & Drink", price: "$2", color: "#eb6a63" },
    { name: "Banana", category: "Food & Drink", price: "$2", color: "#eb6a63" },
    { name: "Banana", category: "Food & Drink", price: "$2", color: "#eb6a63" },
    { name: "Banana", category: "Food & Drink", price: "$2", color: "#eb6a63" },
    { name: "Banana", category: "Food & Drink", price: "$2", color: "#eb6a63" },
  ]);

  const [incomes, setIncomes] = useState([
    { name: "Banana", category: "Food & Drink", price: "$2", color: "#37C39A" },
    { name: "Banana", category: "Food & Drink", price: "$2", color: "#37C39A" },
    { name: "Banana", category: "Food & Drink", price: "$2", color: "#37C39A" },
    { name: "Banana", category: "Food & Drink", price: "$2", color: "#37C39A" },
    { name: "Banana", category: "Food & Drink", price: "$2", color: "#37C39A" },
    { name: "Banana", category: "Food & Drink", price: "$2", color: "#37C39A" },
    { name: "Banana", category: "Food & Drink", price: "$2", color: "#37C39A" },
    { name: "Banana", category: "Food & Drink", price: "$2", color: "#37C39A" },
  ]);

  const currentItems = activeTab === "Income" ? incomes : expenses;
  const [items, setItems] = useState([
    { name: "Bitcoin", category: "Investment", price: "$30", color: "#37C39A" },
    { name: "Banana", category: "Food & Drink", price: "$2", color: "#eb6a63" },
    { name: "Pepsi", category: "Food & Drink", price: "$5", color: "#eb6a63" },
  ]);
  return (
    <>
      {/* PC */}
      <div className="hidden lg:block ml-64 min-h-screen bg-[#F4F7FD]">

        {/* Header */}
        <div className="ml-16 mr-10 h-16 mt-8 flex flex-row justify-between items-center">
          <h1 className="text-4xl font-bold text-gray-800">Home</h1> 
          <h1 className="text-3xl font-bold text-gray-800">username</h1>
          <div className="flex flex-row space-x-4">
            <button className="w-16 h-16 bg-[#07B681] text-4xl text-white font-bold rounded-2xl ">+</button>
            <div className="w-14 h-14 rounded-full bg-[#cdfaec] border border-gray-400"></div>
          </div>
        </div>

        <div className="flex flex-row justify-around items-center mt-8 mr-6 ml-6">

          {/* Overview */}
          <div className="bg-white rounded-2xl shadow-md/20 p-4 h-64 w-120">

            <div className="flex flex-row justify-between items-center">
              <h1 className="text-2xl font-inter font-semibold text-gray-800">Overview</h1>
              <button className="text-3xl text-gray-200">+</button>
            </div>

              <div className="space-y-4 mt-2">
                {items.map((item, index) => (
                  <div
                    key={index}
                    className="flex flex-row justify-between items-center"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-full bg-[#cdfaec] border border-gray-400"></div>
                      <div>
                        <p className="font-inter text-md text-gray-800">{item.name}</p>
                        <p className="text-gray-300 text-sm">{item.category}</p>
                      </div>
                    </div>
                    <p
                      className="font-light text-lg"
                      style={{ color: item.color }}
                    >
                      {item.price}
                    </p>
                  </div>
                ))}
              </div>
          </div>

          {/* Report */}
          <div className="bg-white rounded-2xl shadow-md/20 p-4 h-64 w-120">
            <div className="flex flex-row justify-between items-center">
              <h1 className="text-2xl font-inter font-semibold text-gray-800">Reports</h1>
              <button className="text-3xl text-gray-200">+</button>
            </div>
          </div>

          {/* Scheduler */}
          <div className="bg-white rounded-2xl shadow-md/20 p-4 h-64 w-120">
            <div className="flex flex-row justify-between items-center">
              <h1 className="text-2xl font-inter font-semibold text-gray-800">Scheduler</h1>
            </div>
          </div>

        </div>
        
        <div className="flex flex-row justify-start items-start space-x-4 mt-8 mr-10 ml-10">

          {/* Expense/Income List */}

            {/* Expense */}
            <div className="space-y-2">
              <h1 className="text-2xl font-inter font-semibold text-gray-800 ">Expense</h1>
              <ul className="flex flex-col gap-y-[10px] overflow-y-auto max-h-[400px]">
                {expenses.map((item, index) => (
                  <li
                    key={index}
                    className="bg-white rounded-2xl shadow-md/20 p-4 h-20 w-120"
                  >
                    <div className="flex flex-row justify-between items-center">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-full bg-[#cdfaec] border border-gray-400"></div>
                        <div>
                          <p className="font-inter text-md text-gray-800">{item.name}</p>
                          <p className="text-gray-300 text-sm">{item.category}</p>
                        </div>
                      </div>
                      <p className='font-light text-lg'
                        style={{ color: item.color }}
                      >
                        {item.price}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
            
            {/* Income */}
            <div className="space-y-2">
              <h1 className="text-2xl font-inter font-semibold text-gray-800">Income</h1>
              <ul className='flex flex-col gap-y-[10px] overflow-y-auto max-h-[400px]'>
                {incomes.map((item, index) => (
                  <li
                    key={index}
                    className='bg-white rounded-2xl shadow-md/20 p-4 h-20 w-120'
                  >
                    <div className='flex flex-row justify-between items-center'>
                      <div className='flex items-center space-x-3'>
                        <div className='w-10 h-10 rounded-full bg-[#cdfaec] border border-gray-400'></div>
                        <div>
                          <p className='font-inter text-md text-gray-800'>{item.name}</p>
                          <p className='text-gray-300 text-sm'>{item.category}</p>
                        </div>
                      </div>
                      <p className='font-light text-lg'
                        style={{ color: item.color }}
                      >
                        {item.price}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          
          {/* Budget */}
          <div className="bg-white rounded-2xl shadow-md/20 p-4 h-110 w-120">
            <div className="flex flex-col space-y-2">
              <h1 className="text-2xl font-inter font-semibold text-gray-800">Budget</h1>
              {/* Income */}
              <div className="flex flex-row space-x-76 border-b border-gray-500 pb-3">
                <div className="font-inter text-md text-gray-800">Income</div>
                <div className="flex flex-row space-x-4">
                  <div className="font-inter text-md text-gray-800">$9000</div>
                  <div className="font-inter text-md text-gray-800">&#x2193;</div>
                </div>
              </div>

              {/* Expense */}
              <div className="flex flex-row space-x-74">
                <div className="font-inter text-md text-gray-800">Expense</div>
                <div className="flex flex-row space-x-4">
                  <div className="font-inter text-md text-gray-800">$9000</div>
                  <div className="font-inter text-md text-gray-800">&#x2191;</div>
                </div>
              </div>
            
            
              <div className="flex flex-col gap-y-3 mt-2 w-full">
                {items.map((item, index) => (
                  <div
                    key={index}
                    className="flex flex-row justify-between items-center w-full"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-full bg-[#cdfaec] border border-gray-400"></div>
                      <div>
                        <p className="font-inter text-md text-gray-800">{item.name}</p>
                        <p className="text-gray-300 text-sm">{item.category}</p>
                      </div>
                    </div>
                    <p className='font-light text-lg'
                       style={{ color: item.color }}
                    >
                    {item.price}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile */}
      <div className="block lg:hidden min-h-screen bg-[#F4F7FD]">

        <div className="space-y-8 p-5">

          {/* Header */}
          <div className="flex flex-row justify-between items-top">
            <div className="flex flex-col">
              <h1 className="text-3xl font-bold text-gray-800">Home</h1> 
              <h1 className="text-2xl font-inter text-gray-400">username</h1>
            </div>
            <button className="w-16 h-16 bg-[#07B681] text-4xl text-white font-bold rounded-3xl ">+</button>
          </div>

          {/* Overview */}
          <div className="bg-white rounded-2xl shadow-md/20 p-4 h-50 w-full mt-16">

            <div className="flex flex-row justify-between items-center">
              <h1 className="text-xl font-inter font-semibold text-gray-800">Overview</h1>
              <button className="text-3xl text-gray-200">+</button>
            </div>

            <div className="space-y-4 p-4 overflow-y-auto h-30">
              {items.map((item, index) => (
                <div
                  key={index}
                  className="flex flex-row justify-between items-center"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-full bg-[#cdfaec] border border-gray-400"></div>
                    <div>
                      <p className="font-inter text-md text-gray-800">{item.name}</p>
                      <p className="text-gray-300 text-sm">{item.category}</p>
                    </div>
                  </div>
                  <p className="font-light text-lg" style={{ color: item.color }}>
                    {item.price}
                  </p>
                </div>
              ))}
            </div>
            
          </div>

          {/* Report */}
          <div className="bg-white rounded-2xl shadow-md/20 p-4 h-40 w-full">
          <div className="flex flex-row justify-between items-center">
            <h1 className="text-xl font-inter font-semibold text-gray-800">Reports</h1>
            <button className="text-3xl text-gray-200">+</button>
            </div>
          </div>
          
          {/* Scheduler */}
          <div className="bg-white rounded-2xl shadow-md/20 p-4 h-40 w-full">
            <div className="flex flex-row justify-between items-center">
              <h1 className="text-xl font-inter font-semibold text-gray-800">Scheduler</h1>
            </div>
          </div>          
          
          {/* Budget */}
          <div className="w-full p-4 bg-white rounded-xl shadow-md">

              <div className="flex flex-row justify-between items-top">
                <h2 className="text-xl font-inter font-semibold text-gray-800">Budget</h2>

                {/* Nút chọn tab */}
                <div className="flex space-x-2 mb-4 p-1">
                  <button
                    className={`rounded-xl p-2 w-25 h-10 text-gray-800 ${
                      activeTab === "Income" ? "bg-[#cdfaec]" : ""
                    }`}
                    onClick={() => setActiveTab("Income")}
                  >
                    Income
                  </button>
                  <button
                    className={`rounded-xl p-2 w-25 h-10 text-gray-800 ${
                      activeTab === "Expense" ? "bg-[#cdfaec]" : ""
                    }`}
                    onClick={() => setActiveTab("Expense")}
                  >
                    Expense
                  </button>
                </div>
              </div>
              
              {/* Tổng tiền */}
              <div className="flex justify-between mb-2">
                <p className="font-inter text-md text-gray-800">{activeTab}</p>
                <p className="font-inter text-gray-700">$9000</p>
              </div>

              {/* Danh sách item */}
              <div className="space-y-2 overflow-y-auto h-25">
                {currentItems.map((item, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center pb-2"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 rounded-full bg-[#cdfaec] border border-gray-400"></div>
                      <div>
                        <p className="font-inter text-md text-gray-800">{item.name}</p>
                        <p className="text-gray-300 text-sm">{item.category}</p>
                      </div>
                    </div>
                    <p
                      className="font-light text-sm"
                      style={{ color: item.color }}
                    >
                      {item.price}
                    </p>
                  </div>
                ))}
              </div>
          </div>

          <div className="flex justify-center items-start gap-6">
            {/* Expense Column */}
            <div className="flex-1">
              <h2 className="text-xl font-inter font-semibold text-gray-800 text-center">Expense</h2>
              <div className="space-y-3 overflow-y-auto h-38 mt-3">
                {expenses.map((item, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center bg-white rounded-4xl shadow-md/20 p-4 h-10 w-full"
                  >
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-full bg-[#cdfaec] border border-gray-400"></div>
                    <div>
                      <p className="text-gray-800 text-sm font-medium">{item.name}</p>
                      <p className="text-gray-400 text-xs">{item.category}</p>
                    </div>
                  </div>
                  <p className="text-sm font-light" style={{ color: item.color }}>
                    {item.price}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Income Column */}
          <div className="flex-1">
            <h2 className="text-xl font-inter font-semibold text-gray-800 text-center">Income</h2>
            <div className="space-y-3 overflow-y-auto h-38 mt-3">
              {incomes.map((item, index) => (
                <div
                  key={index}
                  className="flex justify-between items-center bg-white rounded-4xl shadow-md/20 p-4 h-10 w-full"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-full bg-[#cdfaec] border border-gray-400"></div>
                      <div>
                        <p className="text-gray-800 text-sm font-medium">{item.name}</p>
                        <p className="text-gray-400 text-xs">{item.category}</p>
                      </div>
                    </div>
                  <p className="text-sm font-light" style={{ color: item.color }}>
                    {item.price}
                  </p>
                </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>
    </>
  )
}
