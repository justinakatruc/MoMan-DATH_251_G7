"use client";

import Topbar from "@/app/components/Topbar";
import { EventType, TransactionAPIResponse } from "@/app/model";
import { useEffect, useState } from "react";
import Image from "next/image";
import { useTransactionStore } from "@/app/store/useTransactionStore";
import { eventAPI } from "@/lib/api";

export default function Home() {
  const [activeTab, setActiveTab] = useState("Expense");
  const [displayIncome, setDisplayIncome] = useState(false);
  const [displayExpense, setDisplayExpense] = useState(false);
  const { transactions, fetchTransactions } = useTransactionStore();

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  const [reports, setReports] = useState<{ title: string; value: number }[]>([
    {
      title: "Monthly Expenses",
      value: 0,
    },
    {
      title: "Monthly Income",
      value: 0,
    },
  ]);

  const [savingsRate, setSavingsRate] = useState(0);
  const [events, setEvents] = useState<EventType[]>([]);
  const [expenses, setExpenses] = useState<TransactionAPIResponse[]>([]);
  const [incomes, setIncomes] = useState<TransactionAPIResponse[]>([]);
  const currentItems = activeTab === "Income" ? incomes : expenses;
  const [items, setItems] = useState<TransactionAPIResponse[]>([]);

  const [itemsExpense, setItemsExpense] = useState<TransactionAPIResponse[]>(
    []
  );

  const [itemsIncome, setItemsIncome] = useState<TransactionAPIResponse[]>([]);

  useEffect(() => {
    const expenseList = transactions.filter(
      (transaction) => transaction.type === "expense"
    );
    const incomeList = transactions.filter(
      (transaction) => transaction.type === "income"
    );
    setExpenses(expenseList);
    setIncomes(incomeList);
    setItemsExpense(expenseList);
    setItemsIncome(incomeList);
    setItems(transactions.slice(0, 5));
    setReports([
      {
        title: "Monthly Expenses",
        value: expenseList.reduce(
          (acc: number, curr: TransactionAPIResponse) => acc + curr.amount,
          0
        ),
      },
      {
        title: "Monthly Income",
        value: incomeList.reduce(
          (acc: number, curr: TransactionAPIResponse) => acc + curr.amount,
          0
        ),
      },
    ]);
    setSavingsRate(
      ((incomeList.reduce(
        (acc: number, curr: TransactionAPIResponse) => acc + curr.amount,
        0
      ) -
        expenseList.reduce(
          (acc: number, curr: TransactionAPIResponse) => acc + curr.amount,
          0
        )) /
        incomeList.reduce(
          (acc: number, curr: TransactionAPIResponse) => acc + curr.amount,
          0
        )) *
        100
    );
  }, [transactions]);

  useEffect(() => {
    const fetchEvents = async () => {
      const result = await eventAPI.getEvents();
      if (result.success) {
        const events = result.events;
        setEvents(
          events.sort((a: EventType, b: EventType) => {
            if (a.time < b.time) return -1;
            if (a.time > b.time) return 1;

            if (a.title < b.title) return -1;
            if (a.title > b.title) return 1;

            return 0;
          })
        );
      }
    };
    fetchEvents();
  }, []);

  return (
    <>
      {/* PC */}
      <div className="hidden lg:flex flex-col min-h-screen bg-[#F4F7FD]">
        {/* Header */}
        <Topbar />

        <div className="flex flex-row justify-around items-center mt-8 w-full gap-x-4 px-6">
          {/* Overview */}
          <div className="bg-white rounded-2xl shadow-md/20 p-4 h-74 w-1/3 flex flex-col gap-y-1">
            <div className="flex flex-row justify-between items-center">
              <h1 className="text-2xl font-inter font-semibold text-gray-800">
                Overview
              </h1>
            </div>

            <div className="space-y-4 mt-2 overflow-y-auto px-2">
              {items.map((item: TransactionAPIResponse, index) => (
                <div
                  key={index}
                  className="flex flex-row justify-between items-center"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full border border-gray-400 flex justify-center items-center">
                      <Image
                        src={item.categoryIcon}
                        alt={item.name}
                        width={20}
                        height={20}
                      />
                    </div>
                    <div>
                      <p className="font-inter text-md text-gray-800">
                        {item.name}
                      </p>
                      <p className="text-gray-500 text-sm">
                        {item.categoryName}
                      </p>
                    </div>
                  </div>
                  <p
                    className="font-light text-lg"
                    style={{
                      color: item.type === "expense" ? "#eb6a63" : "#37C39A",
                    }}
                  >
                    ${item.amount}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Report */}
          <div className="bg-white rounded-2xl shadow-md/20 p-4 h-74 w-1/3 flex flex-col gap-y-1">
            <div className="flex flex-row justify-between items-center">
              <a
                href="/report"
                className="text-2xl font-inter font-semibold text-gray-800 hover:underline"
              >
                Reports
              </a>
            </div>
            <div className="flex flex-col px-2 gap-y-2">
              {reports.map((report, index) => (
                <div key={index} className="space-y-1">
                  <div className="text-lg text-gray-600">{report.title}</div>
                  <div
                    className={`text-lg ${
                      report.title === "Monthly Income"
                        ? "text-emerald-500"
                        : "text-red-500"
                    }`}
                  >
                    ${report.value}
                  </div>
                </div>
              ))}
              <div className="space-y-1">
                <div className="text-lg text-gray-600">Savings Rate</div>
                <div
                  className={`text-lg ${
                    savingsRate >= 50 ? "text-emerald-500" : "text-red-500"
                  }`}
                >
                  {savingsRate.toFixed(2)}%
                </div>
              </div>
            </div>
          </div>

          {/* Scheduler */}
          <div className="bg-white rounded-2xl shadow-md/20 p-4 h-74 w-1/3 flex flex-col gap-y-1">
            <div className="flex flex-row justify-between items-center">
              <a
                href="/scheduler"
                className="text-2xl font-inter font-semibold text-gray-800 hover:underline"
              >
                Scheduler
              </a>
            </div>
            <div className="flex flex-col px-2 gap-y-2 overflow-y-auto">
              {events.map((event, index) => (
                <div key={index} className="flex gap-3">
                  <div className="shrink-0 w-12 h-12 rounded-lg bg-emerald-100 flex flex-col items-center justify-center">
                    <div className="text-gray-900">
                      {new Date(event.date).getDate()}
                    </div>
                    <div className="text-xs text-gray-500">
                      {new Date(event.date).toLocaleString("en-US", {
                        month: "short",
                      })}
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-gray-900">{event.title}</div>
                    <div className="text-sm text-gray-400">{event.time}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex flex-row justify-around gap-x-4 mt-8 px-6">
          {/* Expense/Income List */}

          {/* Expense */}
          <div className="space-y-2 w-1/3">
            <h1 className="text-2xl font-inter font-semibold text-gray-800 ">
              Expense
            </h1>
            <ul className="flex flex-col gap-y-2.5 overflow-y-auto max-h-[450px] pb-2">
              {expenses.map((item: TransactionAPIResponse, index) => (
                <li
                  key={index}
                  className="bg-white rounded-2xl shadow-md/20 p-4 h-20 w-full"
                >
                  <div className="flex flex-row justify-between items-center">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-full border border-gray-400 flex items-center justify-center">
                        <Image
                          src={item.categoryIcon}
                          alt={item.name}
                          width={20}
                          height={20}
                        />
                      </div>
                      <div>
                        <p className="font-inter text-md text-gray-800">
                          {item.name}
                        </p>
                        <p className="text-gray-500 text-sm">
                          {item.categoryName}
                        </p>
                      </div>
                    </div>
                    <p
                      className="font-light text-lg"
                      style={{
                        color: item.type === "expense" ? "#eb6a63" : "#37C39A",
                      }}
                    >
                      ${item.amount}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Income */}
          <div className="space-y-2 w-1/3">
            <h1 className="text-2xl font-inter font-semibold text-gray-800">
              Income
            </h1>
            <ul className="flex flex-col gap-y-2.5 overflow-y-auto max-h-[450px] pb-2">
              {incomes.map((item: TransactionAPIResponse, index) => (
                <li
                  key={index}
                  className="bg-white rounded-2xl shadow-md/20 p-4 h-20 w-full"
                >
                  <div className="flex flex-row justify-between items-center">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-full border border-gray-400 flex items-center justify-center">
                        <Image
                          src={item.categoryIcon}
                          alt={item.name}
                          width={20}
                          height={20}
                        />
                      </div>
                      <div>
                        <p className="font-inter text-md text-gray-800 w">
                          {item.name.length > 20
                            ? `${item.name.substring(0, 20)}...`
                            : item.name}
                        </p>
                        <p className="text-gray-500 text-sm">
                          {item.categoryName}
                        </p>
                      </div>
                    </div>
                    <p
                      className="font-light text-lg"
                      style={{
                        color: item.type === "expense" ? "#eb6a63" : "#37C39A",
                      }}
                    >
                      ${item.amount}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Budget */}
          <div className="bg-white rounded-2xl shadow-md/20 p-4 h-120 w-1/3">
            <div className="flex flex-col space-y-2 px-2">
              <h1 className="text-2xl font-inter font-semibold text-gray-800">
                Budget
              </h1>
              {/* Income */}
              <div className="border-b border-gray-200 pb-2">
                <div className="flex flex-row justify-between border-gray-500 pb-3">
                  <div className="font-inter text-md text-gray-800">Income</div>
                  <div className="flex flex-row space-x-4">
                    <div className="font-inter text-md text-gray-800">
                      {itemsIncome.reduce(
                        (acc: number, curr: TransactionAPIResponse) =>
                          acc + curr.amount,
                        0
                      )}{" "}
                      $
                    </div>
                    <div
                      className="font-inter text-md text-gray-800 cursor-pointer"
                      onClick={() => setDisplayIncome(!displayIncome)}
                    >
                      {displayIncome ? <>&#x2191;</> : <>&#x2193;</>}
                    </div>
                  </div>
                </div>

                {displayIncome && (
                  <div className="flex flex-col gap-y-3 mt-2 w-full max-h-40 overflow-y-auto">
                    {itemsIncome.map((item: TransactionAPIResponse, index) => (
                      <div
                        key={index}
                        className="flex flex-row justify-between items-center w-full px-2"
                      >
                        <div className="flex items-center space-x-3">
                          <div className="size-8 xl:size-10 rounded-full border border-gray-400 flex items-center justify-center">
                            <Image
                              src={item.categoryIcon}
                              alt={item.name}
                              width={15}
                              height={15}
                              className="size-5 xl:size-6"
                            />
                          </div>
                          <div>
                            <p className="font-inter lg:text-[14px] xl:text-lg text-gray-800 max-w-[120px] xl:max-w-full">
                              {item.name}
                            </p>
                            <p className="text-gray-500 text-sm">
                              {item.categoryName}
                            </p>
                          </div>
                        </div>
                        <p
                          className="font-light lg:text-[14px] xl:text-lg"
                          style={{
                            color:
                              item.type === "expense" ? "#eb6a63" : "#37C39A",
                          }}
                        >
                          ${item.amount}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Expense */}
              <div>
                <div className="flex flex-row justify-between">
                  <div className="font-inter text-md text-gray-800">
                    Expense
                  </div>
                  <div className="flex flex-row space-x-4">
                    <div className="font-inter text-md text-gray-800">
                      {itemsExpense.reduce(
                        (acc: number, curr: TransactionAPIResponse) =>
                          acc + curr.amount,
                        0
                      )}{" "}
                      $
                    </div>
                    <div
                      className="font-inter text-md text-gray-800 cursor-pointer"
                      onClick={() => setDisplayExpense(!displayExpense)}
                    >
                      {displayExpense ? <>&#x2191;</> : <>&#x2193;</>}
                    </div>
                  </div>
                </div>

                {displayExpense && (
                  <div className="flex flex-col gap-y-3 mt-2 w-full max-h-40 overflow-y-auto">
                    {itemsExpense.map((item: TransactionAPIResponse, index) => (
                      <div
                        key={index}
                        className="flex flex-row justify-between items-center w-full px-2"
                      >
                        <div className="flex items-center space-x-3">
                          <div className="size-8 xl:size-10 rounded-full border border-gray-400 flex items-center justify-center">
                            <Image
                              src={item.categoryIcon}
                              alt={item.name}
                              width={15}
                              height={15}
                              className="size-5 xl:size-6"
                            />
                          </div>
                          <div>
                            <p className="font-inter lg:text-[14px] xl:text-lg text-gray-800 max-w-[120px]">
                              {item.name}
                            </p>
                            <p className="text-gray-500 text-sm">
                              {item.categoryName}
                            </p>
                          </div>
                        </div>
                        <p
                          className="font-light lg:text-[14px] xl:text-lg"
                          style={{
                            color:
                              item.type === "expense" ? "#eb6a63" : "#37C39A",
                          }}
                        >
                          ${item.amount}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile */}
      <div className="block lg:hidden min-h-screen bg-[#F4F7FD]">
        <div className="space-y-8 p-5">
          {/* Header */}
          <Topbar />

          {/* Overview */}
          <div className="bg-white rounded-2xl shadow-md/20 p-4 h-50 w-full mt-16">
            <h1 className="text-xl font-inter font-semibold text-gray-800">
              Overview
            </h1>

            <div className="space-y-4 p-4 overflow-y-auto h-30">
              {items.map((item: TransactionAPIResponse, index) => (
                <div
                  key={index}
                  className="flex flex-row justify-between items-center"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-full border border-gray-400 flex justify-center items-center">
                      <Image
                        src={item.categoryIcon}
                        alt={item.name}
                        width={20}
                        height={20}
                      />
                    </div>
                    <div>
                      <p className="font-inter text-md text-gray-800">
                        {item.name}
                      </p>
                      <p className="text-gray-500 text-sm">
                        {item.categoryName}
                      </p>
                    </div>
                  </div>
                  <p
                    className="font-light text-lg"
                    style={{
                      color: item.type === "expense" ? "#eb6a63" : "#37C39A",
                    }}
                  >
                    ${item.amount}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Report */}
          <div className="bg-white rounded-2xl shadow-md/20 p-4 h-70 w-full">
            <div className="flex flex-row justify-between items-center">
              <a
                href="/report"
                className="text-xl font-inter font-semibold text-gray-800 hover:underline"
              >
                Reports
              </a>
            </div>
            <div className="flex flex-col px-2 gap-y-3 mt-4">
              {reports.map((report, index) => (
                <div key={index} className="space-y-1">
                  <div className="text-lg text-gray-600">{report.title}</div>
                  <div
                    className={`text-lg ${
                      report.title === "Monthly Income"
                        ? "text-emerald-500"
                        : "text-red-500"
                    }`}
                  >
                    ${report.value}
                  </div>
                </div>
              ))}
              <div className="space-y-1">
                <div className="text-lg text-gray-600">Savings Rate</div>
                <div
                  className={`text-lg ${
                    savingsRate >= 50 ? "text-emerald-500" : "text-red-500"
                  }`}
                >
                  {savingsRate.toFixed(2)}%
                </div>
              </div>
            </div>
          </div>

          {/* Scheduler */}
          <div className="bg-white rounded-2xl shadow-md/20 p-4 h-70 w-full">
            <div className="flex flex-row justify-between items-center">
              <a
                href="/scheduler"
                className="text-xl font-inter font-semibold text-gray-800 hover:underline"
              >
                Scheduler
              </a>
            </div>
            <div className="flex flex-col px-2 gap-y-3 mt-4 h-50 overflow-y-auto">
              {events.map((event, index) => (
                <div
                  key={index}
                  className="flex gap-3 items-center justify-between"
                >
                  <div className="flex gap-x-3 items-center">
                    <div className="shrink-0 w-12 h-12 rounded-lg bg-emerald-100 flex items-center justify-center">
                      <div className="text-gray-900">
                        {new Date(event.date).getDate()}
                      </div>
                    </div>
                    <div className="flex flex-col gap-y-1">
                      <div className="text-lg text-gray-500 flex items-center justify-center">
                        {new Date(event.date).toLocaleDateString("en-GB", {
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric",
                        })}
                      </div>
                      <div className="text-sm text-gray-400">{event.time}</div>
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-gray-900 text-lg">{event.title}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Budget */}
          <div className="w-full p-4 bg-white rounded-xl shadow-md">
            <div className="flex flex-row justify-between items-top">
              <h2 className="text-xl font-inter font-semibold text-gray-800">
                Budget
              </h2>

              {/* Nút chọn tab */}
              <div className="flex space-x-2 mb-4 p-1">
                <button
                  className={`rounded-xl p-2 w-25 h-10 text-gray-800 cursor-pointer ${
                    activeTab === "Income" ? "bg-[#cdfaec]" : ""
                  }`}
                  onClick={() => setActiveTab("Income")}
                >
                  Income
                </button>
                <button
                  className={`rounded-xl p-2 w-25 h-10 text-gray-800 cursor-pointer ${
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
            <div className="space-y-2 overflow-y-auto h-40">
              {currentItems.map((item: TransactionAPIResponse, index) => (
                <div
                  key={index}
                  className="px-2 flex justify-between items-center pb-2"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-full border border-gray-400 flex items-center justify-center">
                      <Image
                        src={item.categoryIcon}
                        alt={item.name}
                        width={15}
                        height={15}
                      />
                    </div>
                    <div>
                      <p className="font-inter text-md text-gray-800">
                        {item.name}
                      </p>
                      <p className="text-gray-500 text-sm">
                        {item.categoryName}
                      </p>
                    </div>
                  </div>
                  <p
                    className="font-light text-sm"
                    style={{
                      color: item.type === "expense" ? "#eb6a63" : "#37C39A",
                    }}
                  >
                    ${item.amount}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-center items-start gap-6">
            {/* Expense Column */}
            <div className="flex-1">
              <h2 className="text-xl font-inter font-semibold text-gray-800 text-center">
                Expense
              </h2>
              <div className="space-y-3 overflow-y-auto h-42 mt-3">
                {expenses.map((item: TransactionAPIResponse, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center bg-white rounded-4xl shadow-md/20 p-4 h-14 w-full"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 rounded-full border border-gray-400 flex items-center justify-center">
                        <Image
                          src={item.categoryIcon}
                          alt={item.name}
                          width={15}
                          height={15}
                        />
                      </div>
                      <div>
                        <p className="text-gray-800 text-sm font-medium">
                          {item.name}
                        </p>
                        <p className="text-gray-500 text-xs">
                          {item.categoryName}
                        </p>
                      </div>
                    </div>
                    <p
                      className="text-sm font-light"
                      style={{
                        color: item.type === "expense" ? "#eb6a63" : "#37C39A",
                      }}
                    >
                      ${item.amount}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Income Column */}
            <div className="flex-1">
              <h2 className="text-xl font-inter font-semibold text-gray-800 text-center">
                Income
              </h2>
              <div className="space-y-3 overflow-y-auto h-42 mt-3">
                {incomes.map((item: TransactionAPIResponse, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center bg-white rounded-4xl shadow-md/20 p-4 h-14 w-full"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 rounded-full border border-gray-400 flex items-center justify-center">
                        <Image
                          src={item.categoryIcon}
                          alt={item.name}
                          width={15}
                          height={15}
                        />
                      </div>
                      <div>
                        <p className="text-gray-800 text-sm font-medium">
                          {item.name}
                        </p>
                        <p className="text-gray-500 text-xs">
                          {item.categoryName}
                        </p>
                      </div>
                    </div>
                    <p
                      className="text-sm font-light"
                      style={{
                        color: item.type === "expense" ? "#eb6a63" : "#37C39A",
                      }}
                    >
                      ${item.amount}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
