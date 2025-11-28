"use client";

import { TransactionAPIResponse } from "@/app/model";
import { useEffect, useMemo, useState } from "react";
import { useTransactionStore } from "@/app/store/useTransactionStore";
import { useUserStore } from "@/app/store/useUserStore";
import {
  BanknoteArrowUp,
  Coins,
  SquareArrowDownRight,
  SquareArrowUpRight,
  SquareCheck,
} from "lucide-react";
import Content from "@/app/components/Content";
import Image from "next/image";

export default function Home() {
  const { user } = useUserStore();
  const { transactions, fetchTransactions } = useTransactionStore();

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  const [totalMonthlyIncome, setTotalMonthlyIncome] = useState(0);
  const [totalMonthlyExpenses, setTotalMonthlyExpenses] = useState(0);
  const [difference, setDifference] = useState(0);
  const [revenueLastWeek, setRevenueLastWeek] = useState(0);
  const [todayDifference, setTodayDifference] = useState(0);
  const tabs = ["Daily", "Weekly", "Monthly"];
  const [selectedTab, setSelectedTab] = useState("Monthly");
  const [screenHeight, setScreenHeight] = useState(0);

  useEffect(() => {
    const updateHeight = () => {
      setScreenHeight(window.innerHeight);
    };

    updateHeight();

    window.addEventListener("resize", updateHeight);

    return () => {
      window.removeEventListener("resize", updateHeight);
    };
  }, []);

  useEffect(() => {
    const expenseList = transactions.filter(
      (transaction) => transaction.type === "expense"
    );
    const incomeList = transactions.filter(
      (transaction) => transaction.type === "income"
    );

    setTotalMonthlyExpenses(
      expenseList.reduce(
        (acc: number, curr: TransactionAPIResponse) => acc + curr.amount,
        0
      )
    );

    setTotalMonthlyIncome(
      incomeList.reduce(
        (acc: number, curr: TransactionAPIResponse) => acc + curr.amount,
        0
      )
    );

    setDifference(
      incomeList.reduce(
        (acc: number, curr: TransactionAPIResponse) => acc + curr.amount,
        0
      ) -
        expenseList.reduce(
          (acc: number, curr: TransactionAPIResponse) => acc + curr.amount,
          0
        )
    );

    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    const revenue = incomeList
      .filter((transaction) => new Date(transaction.date) >= oneWeekAgo)
      .reduce(
        (acc: number, curr: TransactionAPIResponse) => acc + curr.amount,
        0
      );
    setRevenueLastWeek(revenue);

    const today = new Date();
    const todayProfit = incomeList
      .filter(
        (transaction) =>
          new Date(transaction.date).toDateString() === today.toDateString()
      )
      .reduce(
        (acc: number, curr: TransactionAPIResponse) => acc + curr.amount,
        0
      );
    const todayExpense = expenseList
      .filter(
        (transaction) =>
          new Date(transaction.date).toDateString() === today.toDateString()
      )
      .reduce(
        (acc: number, curr: TransactionAPIResponse) => acc + curr.amount,
        0
      );
    const profit = todayProfit - todayExpense;
    setTodayDifference(profit);
  }, [transactions]);

  const filteredTransactions = useMemo(() => {
    if (selectedTab === "Daily") {
      const today = new Date();
      return transactions.filter(
        (transaction) =>
          new Date(transaction.date).toDateString() === today.toDateString()
      );
    } else if (selectedTab === "Weekly") {
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
      return transactions.filter(
        (transaction) => new Date(transaction.date) >= oneWeekAgo
      );
    } else {
      const oneMonthAgo = new Date();
      oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
      return transactions.filter(
        (transaction) => new Date(transaction.date) >= oneMonthAgo
      );
    }
  }, [selectedTab, transactions]);

  return (
    <div className="flex flex-col gap-y-10 flex-1 items-center">
      {/* Header */}
      <div className="flex flex-col gap-y-1 mt-8 px-5 text-[#052224]">
        <div className="font-medium text-xl">Hi, Welcome Back</div>
        <div className="text-[14px] font-bold">
          {user?.firstName} {user?.lastName}
        </div>
      </div>

      {/* Overview */}
      <div className="flex flex-col items-center gap-y-1.5">
        <div className="flex gap-x-4">
          <div>
            <div className="flex items-center">
              <SquareArrowUpRight className="w-6 h-6" />
              <div className="ml-2 font-medium text-lg">Total Income</div>
            </div>
            <div className="font-bold text-2xl text-[#F1FFF3]">
              ${totalMonthlyIncome}
            </div>
          </div>
          <div className="flex items-center justify-center">
            <hr className="h-12 w-[0.8px] bg-white" />
          </div>
          <div>
            <div className="flex items-center">
              <SquareArrowDownRight className="w-6 h-6" />
              <div className="ml-2 font-medium text-lg">Total Expenses</div>
            </div>
            <div className="font-bold text-2xl text-[#006BFF]">
              -${totalMonthlyExpenses.toFixed(2)}
            </div>
          </div>
        </div>
        <div className="h-7 w-[330px] flex">
          <div
            className={`h-full rounded-l-2xl`}
            style={{
              width: totalMonthlyIncome
                ? `${
                    (totalMonthlyIncome /
                      (totalMonthlyIncome + totalMonthlyExpenses)) *
                    100
                  }%`
                : "0%",
              backgroundColor: "#052224",
            }}
          >
            {totalMonthlyIncome ? (
              <div className="h-full flex items-center justify-start pl-3 text-[#F1FFF3] font-medium">
                {(
                  (totalMonthlyIncome /
                    (totalMonthlyIncome + totalMonthlyExpenses)) *
                  100
                ).toFixed(1)}
                %
              </div>
            ) : null}
          </div>
          <div
            className={`h-full rounded-r-2xl`}
            style={{
              width: totalMonthlyExpenses
                ? `${
                    (totalMonthlyExpenses /
                      (totalMonthlyIncome + totalMonthlyExpenses)) *
                    100
                  }%`
                : "0%",
              backgroundColor: "#F1FFF3",
            }}
          >
            {totalMonthlyExpenses ? (
              <div className="h-full flex items-center justify-end pr-3 text-[#052224] font-medium">
                {(
                  (totalMonthlyExpenses /
                    (totalMonthlyIncome + totalMonthlyExpenses)) *
                  100
                ).toFixed(1)}
                %
              </div>
            ) : null}
          </div>
        </div>
        <div className="flex gap-x-4 mt-2">
          <SquareCheck className="w-6 h-6" />
          <div className="font-medium text-md">
            Difference:{" "}
            {(
              (difference / (totalMonthlyIncome + totalMonthlyExpenses)) *
              100
            ).toFixed(2)}
            %
          </div>
        </div>
      </div>

      {/* Content */}
      <Content>
        <div className="flex flex-col items-center gap-y-5">
          <div className="w-[358px] h-[152px] bg-[#00D09E] rounded-4xl px-8 py-6 flex flex-col gap-y-4">
            <div className="flex gap-x-4 items-center">
              <BanknoteArrowUp className="w-9 h-9" />
              <div className="text-[#052224]">
                <div className="text-[13px]">Revenue Last Week</div>
                <div className="font-bold">${revenueLastWeek.toFixed(2)}</div>
              </div>
            </div>
            <hr className="bg-white" />
            <div className="flex gap-x-4 items-center">
              <Coins className="w-9 h-9" />
              <div className="text-[#052224]">
                <div className="text-[13px]">Today Net Income</div>
                <div className="font-bold text-[#0068FF]">
                  ${todayDifference.toFixed(2)}
                </div>
              </div>
            </div>
          </div>

          <div className="w-[358px] h-[60px] bg-[#DFF7E2] rounded-[22px] px-3.5 py-1.5">
            <div className="grid grid-cols-3">
              {tabs.map((tab) => (
                <div key={tab}>
                  <button
                    className={`w-full h-12 rounded-[18px] font-medium cursor-pointer ${
                      selectedTab === tab
                        ? "bg-[#00D09E] text-white"
                        : "text-[#052224]"
                    }`}
                    onClick={() => setSelectedTab(tab)}
                  >
                    {tab}
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div
            className={`flex flex-col gap-y-4 overflow-y-auto pt-1.5 ${
              screenHeight > 950 ? "max-h-[200px]" : "max-h-[200px]"
            }`}
          >
            {filteredTransactions.length === 0 ? (
              <div className="text-center text-[#052224]">
                No transactions found.
              </div>
            ) : (
              filteredTransactions.map((transaction) => (
                <div
                  key={transaction.id}
                  className="w-[358px] h-[53px] flex items-center gap-x-4"
                >
                  <div
                    className={`size-14 rounded-[22px] flex items-center justify-center ${
                      transaction.type === "income"
                        ? "bg-[#6DB6FE]"
                        : "bg-[#3299FF]"
                    }`}
                  >
                    <Image
                      src={transaction.categoryIcon}
                      alt={transaction.categoryName}
                      width={24}
                      height={24}
                    />
                  </div>
                  <div className="w-[88px]">
                    <div className="font-medium text-[#052224]">
                      {transaction.name.length > 15
                        ? transaction.name.slice(0, 15) + "..."
                        : transaction.name}
                    </div>
                    <div className="text-[13px] text-[#052224]">
                      {new Date(transaction.date).toLocaleDateString()}
                    </div>
                  </div>
                  <hr className="bg-[#00D09E] w-0.5 h-full" />
                  <div className="flex items-center justify-center w-10">
                    <div className="font-light text-[13px] text-[#052224]">
                      {transaction.categoryName.length > 9
                        ? transaction.categoryName.slice(0, 9) + "..."
                        : transaction.categoryName}
                    </div>
                  </div>
                  <hr className="bg-[#00D09E] w-0.5 h-full" />
                  <div className="flex items-center justify-center">
                    <div
                      className={`font-medium text-[15px] ${
                        transaction.type === "income"
                          ? "text-[#052224]"
                          : "text-[#3299FF]"
                      }`}
                    >
                      ${transaction.amount.toFixed(2)}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </Content>
    </div>
  );
}
