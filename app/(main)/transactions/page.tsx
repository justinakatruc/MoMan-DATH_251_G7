"use client";

import { useEffect, useMemo, useState } from "react";
import { useTransactionStore } from "@/app/store/useTransactionStore";
import { ArrowUpRight, ArrowDownLeft, Calendar, X, Check, Repeat, ChevronRight } from "lucide-react";
import Image from "next/image";
import Content from "@/app/components/Content";
import { useRouter } from "next/navigation";

type FilterType = "all" | "income" | "expense";

export default function TransactionPage() {
  const router = useRouter();
  const { transactions, fetchTransactions } = useTransactionStore();
  const [filterType, setFilterType] = useState<FilterType>("all");
  const [selectedMonth, setSelectedMonth] = useState<string>("all");
  const [isLoading, setIsLoading] = useState(true);
  const [isMonthPickerOpen, setIsMonthPickerOpen] = useState(false);

  useEffect(() => {
    const loadTransactions = async () => {
      setIsLoading(true);
      await fetchTransactions();
      setIsLoading(false);
    };
    loadTransactions();
  }, [fetchTransactions]);

  const { totalBalance, totalIncome, totalExpense } = useMemo(() => {
    let income = 0;
    let expense = 0;
    transactions.forEach((t) => {
      if (t.type === "income") income += t.amount;
      else expense += t.amount;
    });
    return {
      totalBalance: income - expense,
      totalIncome: income,
      totalExpense: expense,
    };
  }, [transactions]);

  const filteredList = useMemo(() => {
    let filtered = transactions;

    if (filterType === "income") {
      filtered = filtered.filter((t) => t.type === "income");
    } else if (filterType === "expense") {
      filtered = filtered.filter((t) => t.type === "expense");
    }

    if (selectedMonth !== "all") {
      filtered = filtered.filter((t) => {
        const date = new Date(t.date);
        const month = date.toLocaleString("en-US", { month: "long" });
        return month === selectedMonth;
      });
    }

    return filtered;
  }, [transactions, filterType, selectedMonth]);

  const groupedTransactions = useMemo(() => {
    const groups: { [key: string]: typeof transactions } = {};
    const sorted = [...filteredList].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );

    sorted.forEach((transaction) => {
      const date = new Date(transaction.date);
      const month = date.toLocaleString("en-US", { month: "long" });
      if (!groups[month]) groups[month] = [];
      groups[month].push(transaction);
    });
    return groups;
  }, [filteredList]);

  const uniqueMonths = useMemo(() => {
    const months = new Set<string>();
    transactions.forEach((t) => {
      const date = new Date(t.date);
      const month = date.toLocaleString("en-US", { month: "long" });
      months.add(month);
    });
    return Array.from(months);
  }, [transactions]);

  const hasTransactions = Object.keys(groupedTransactions).length > 0;

  function formatMoneyShort(value: number) {
    const abs = Math.abs(value);
    if (abs >= 1_000_000_000) return (value / 1_000_000_000).toFixed(1) + "B";
    if (abs >= 1_000_000) return (value / 1_000_000).toFixed(1) + "M";
    if (abs >= 1_000) return (value / 1_000).toFixed(1) + "K";
    return value.toFixed(2);
  }

  return (
    <div className="flex flex-col grow relative">
      {/* LOADING SCREEN */}
      {isLoading && (
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
            <p className="text-white mt-4 font-bold">Loading...</p>
          </div>
        </div>
      )}

      {/* HEADER */}
      <div className="w-full pt-12 pb-10 px-6 flex flex-col items-center gap-y-6 z-10 shrink-0">
        <div className="w-full flex justify-center items-center text-[#093030]">
          <h1 className="text-xl font-medium text-white">Transaction</h1>
        </div>

        {/* Total Balance */}
        <div
          onClick={() => {
            setFilterType("all");
            setSelectedMonth("all");
          }}
          className="flex flex-col w-[358px] h-20 rounded-lg bg-[#F1FFF3] text-[#093030] items-center justify-center gap-y-1 cursor-pointer active:scale-[0.98] transition-transform"
        >
          <span className="text-sm font-medium">Total Balance</span>
          <h2 className="text-3xl font-bold">
            $
            {totalBalance.toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </h2>
        </div>

        {/* Income / Expense Blocks */}
        <div className="w-[358px] flex gap-x-5">
          <button
            onClick={() => setFilterType("income")}
            className={`flex-1 h-20 rounded-lg p-3 flex items-center justify-between transition-all shadow-sm active:scale-[0.98] ${filterType === "income"
              ? "bg-[#0055FF] text-white"
              : "bg-[#F1FFF3] text-[#093030]"
              }`}
          >
            <div className="flex flex-col items-start gap-1">
              <div className="flex items-center gap-1">
                <div
                  className={`border p-0.5 rounded-md ${filterType === "income"
                    ? "border-white"
                    : "border-[#00D09E] text-[#00D09E]"
                    }`}
                >
                  <ArrowUpRight className="w-3 h-3" />
                </div>
                <span className="text-xs font-medium">Income</span>
              </div>
              <span className="text-lg font-bold">
                ${totalIncome.toLocaleString()}
              </span>
            </div>
          </button>

          <button
            onClick={() => setFilterType("expense")}
            className={`flex-1 h-20 rounded-lg p-3 flex items-center justify-between transition-all shadow-sm active:scale-[0.98] ${filterType === "expense"
              ? "bg-[#0055FF] text-white"
              : "bg-[#F1FFF3] text-[#093030]"
              }`}
          >
            <div className="flex flex-col items-start gap-1">
              <div className="flex items-center gap-1">
                <div
                  className={`border p-0.5 rounded-md ${filterType === "expense"
                    ? "border-white"
                    : "border-[#006BFF] text-[#006BFF]"
                    }`}
                >
                  <ArrowDownLeft className="w-3 h-3" />
                </div>
                <span className="text-xs font-medium">Expense</span>
              </div>
              <span className="text-lg font-bold">
                ${totalExpense.toLocaleString()}
              </span>
            </div>
          </button>
        </div>
      </div>

      {/* CONTENT */}
      <Content>
        <div className="w-[358px] flex flex-col gap-y-6 grow pb-[55px] pt-4 flex-1">
          {!hasTransactions && (
            <div className="text-center text-[#093030] mt-10 opacity-60">
              {selectedMonth === "all"
                ? "No transactions found."
                : `No transactions in ${selectedMonth}.`}
            </div>
          )}

          {Object.keys(groupedTransactions).map((month, index) => (
            <div key={month} className="flex flex-col gap-y-4">
              <div className="flex justify-between items-center px-1">
                <h3 className="text-[#093030] font-bold text-lg">{month}</h3>
                {index === 0 && (
                  <button
                    onClick={() => setIsMonthPickerOpen(true)}
                    className={`p-2 cursor-pointer rounded-full transition-colors active:scale-95 ${selectedMonth !== "all"
                      ? "bg-[#00D09E] text-white shadow-md"
                      : "text-[#00D09E] hover:bg-[#DFF7E2]"
                      }`}
                  >
                    <Calendar className="w-5 h-5" />
                  </button>
                )}
              </div>
              {(selectedMonth === "all"
                ? groupedTransactions[month].slice(0, 7)
                : groupedTransactions[month]
              ).map((transaction) => (
                <div
                  key={transaction.id}
                  className="w-full min-h-[60px] flex items-center gap-x-4 border-b border-gray-50 pb-2 cursor-pointer group"
                  onClick={() => router.push(`/transactions/edit/${transaction.id}`)}
                >
                  {/* Category Icon */}
                  <div
                    className={`size-12 rounded-[22px] flex items-center justify-center shrink-0 ${transaction.type === "income" ? "bg-[#6DB6FE]" : "bg-[#3299FF]"
                      }`}
                  >
                    <Image
                      src={transaction.categoryIcon}
                      alt={transaction.categoryName}
                      width={20}
                      height={20}
                    />
                  </div>

                  {/* Name & Recurring Info */}
                  <div className="flex flex-col gap-0.5 flex-1">
                    <div className="font-medium text-[#093030] text-sm truncate flex items-center gap-1">
                      {transaction.name}
                      {transaction.isRecurring && (
                        <Repeat className="w-3 h-3 text-[#00D09E] shrink-0" />
                      )}
                    </div>
                    <div className="text-[10px] text-[#093030] opacity-70 flex flex-col gap-0.5">
                      <span>{new Date(transaction.date).toLocaleDateString("vi-VN")}</span>
                    </div>
                  </div>

                  {/* Category Info */}
                  <div className="flex flex-col items-center justify-center w-20 shrink-0">
                    <div className="font-light text-[12px] text-[#093030] truncate">
                      {transaction.categoryName}
                    </div>
                    {transaction.isRecurring && (
                      <span className="text-[8px] font-bold text-[#00D09E] uppercase">
                        {transaction.recurringPeriod}
                      </span>
                    )}
                  </div>

                  {/* Amount */}
                  <div className="flex items-center justify-end flex-1">
                    <div
                      className={`font-medium text-[15px] ${transaction.type === "income" ? "text-[#093030]" : "text-[#3299FF]"
                        }`}
                    >
                      {transaction.type === "expense" ? "-" : ""}$
                      {formatMoneyShort(transaction.amount)}
                    </div>

                    <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-[#00D09E] transition-colors" />
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </Content>

      {/* MONTH PICKER */}
      <div
        className={`fixed inset-0 bg-black/40 z-50 transition-opacity duration-300 ${isMonthPickerOpen
          ? "opacity-100 pointer-events-auto"
          : "opacity-0 pointer-events-none"
          }`}
        onClick={() => setIsMonthPickerOpen(false)}
      />

      <div
        className={`fixed inset-x-0 bottom-0 z-50 bg-[#F1FFF3] rounded-t-[30px] shadow-[0_-5px_40px_rgba(0,0,0,0.2)] transition-transform duration-300 ease-out h-[50vh] flex flex-col max-w-[430px] mx-auto ${isMonthPickerOpen ? "translate-y-0" : "translate-y-full"
          }`}
      >
        <div className="flex justify-between items-center p-6 border-b border-[#00D09E]/10 shrink-0">
          <h3 className="text-xl font-bold text-[#052224]">Filter by Month</h3>
          <button
            onClick={() => setIsMonthPickerOpen(false)}
            className="p-2 bg-[#DFF7E2] rounded-full hover:bg-[#00D09E]/20 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5 text-[#052224]" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3">
          <button
            onClick={() => {
              setSelectedMonth("all");
              setIsMonthPickerOpen(false);
            }}
            className={`h-14 w-full rounded-2xl flex items-center justify-between px-4 transition-all shrink-0 border-2 active:scale-[0.98] ${selectedMonth === "all"
              ? "bg-white border-[#00D09E] shadow-sm"
              : "bg-white border-transparent hover:border-[#00D09E]/30"
              }`}
          >
            <span
              className={`font-bold text-sm ${selectedMonth === "all" ? "text-[#00D09E]" : "text-[#052224]"
                }`}
            >
              All Months
            </span>
            {selectedMonth === "all" && (
              <div className="w-6 h-6 bg-[#00D09E] rounded-full flex items-center justify-center">
                <Check className="w-3.5 h-3.5 text-white" />
              </div>
            )}
          </button>

          {uniqueMonths.map((month) => (
            <button
              key={month}
              onClick={() => {
                setSelectedMonth(month);
                setIsMonthPickerOpen(false);
              }}
              className={`h-14 w-full rounded-2xl flex items-center justify-between px-4 transition-all shrink-0 border-2 active:scale-[0.98] cursor-pointer ${selectedMonth === month
                ? "bg-white border-[#00D09E] shadow-sm"
                : "bg-white border-transparent hover:border-[#00D09E]/30"
                }`}
            >
              <span
                className={`font-bold text-sm ${selectedMonth === month ? "text-[#00D09E]" : "text-[#052224]"
                  }`}
              >
                {month}
              </span>
              {selectedMonth === month && (
                <div className="w-6 h-6 bg-[#00D09E] rounded-full flex items-center justify-center">
                  <Check className="w-3.5 h-3.5 text-white" />
                </div>
              )}
            </button>
          ))}

          {uniqueMonths.length === 0 && (
            <div className="text-center text-gray-400 py-4">
              No data available
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
