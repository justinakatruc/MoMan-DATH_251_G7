"use client";

import {
  NativeSelect,
  NativeSelectOption,
} from "@/app/components/ui/native-select";
import { Search, Download, TrendingUp, TrendingDown } from "lucide-react";
import { useEffect, useState } from "react";

type Transaction = {
  transaction_id: string;
  id: number;
  name: string;
  category: string;
  date: string;
  time: string;
  type: string;
  status: string;
  amount: string;
};

interface TransactionProps {
  transaction: Transaction;
  setOpen: (open: boolean) => void;
}

function TransactionInformation({ transaction, setOpen }: TransactionProps) {
  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-[2px] flex items-center justify-center z-50"
      onClick={() => setOpen(false)}
    >
      <div
        className="bg-white rounded-[20px] p-6 max-w-md w-full mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-6 z-50">
          <h2 className="text-xl font-bold text-gray-700">
            {`Transaction Details - ${transaction.transaction_id}`}
          </h2>
          <button
            onClick={() => setOpen(false)}
            className="text-gray-500 hover:text-gray-700 cursor-pointer"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
        <div className="space-y-4">
          <p>
            <span className="font-semibold">User:</span> {transaction.name} (ID:{" "}
            {transaction.id})
          </p>
          <p>
            <span className="font-semibold">Category:</span>{" "}
            {transaction.category}
          </p>
          <p>
            <span className="font-semibold">Date & Time:</span>{" "}
            {transaction.date} {transaction.time}
          </p>
          <p>
            <span className="font-semibold">Type:</span> {transaction.type}
          </p>
          <p>
            <span className="font-semibold">Status:</span> {transaction.status}
          </p>
          <p>
            <span className="font-semibold">Amount:</span>{" "}
            {transaction.type === "Income"
              ? `+ $${transaction.amount}`
              : `- $${transaction.amount}`}
          </p>
        </div>
      </div>
    </div>
  );
}

export default function TransactionsPage() {
  const [transactionsList, setTransactionsList] = useState([
    {
      transaction_id: "TRX001",
      id: 1,
      name: "John Doe",
      category: "Food & Drink",
      date: "2025-10-27",
      time: "14:32",
      type: "Expense",
      status: "Completed",
      amount: "25.50",
    },
    {
      transaction_id: "TRX002",
      id: 2,
      name: "Jane Smith",
      category: "Utilities",
      date: "2025-10-28",
      time: "09:15",
      type: "Expense",
      status: "Completed",
      amount: "100.00",
    },
    {
      transaction_id: "TRX003",
      id: 3,
      name: "Bob Johnson",
      category: "Entertainment",
      date: "2025-10-29",
      time: "18:45",
      type: "Expense",
      status: "Completed",
      amount: "75.00",
    },
    {
      transaction_id: "TRX004",
      id: 4,
      name: "Alice Williams",
      category: "Groceries",
      date: "2025-10-30",
      time: "12:00",
      type: "Expense",
      status: "Completed",
      amount: "50.00",
    },
    {
      transaction_id: "TRX005",
      id: 5,
      name: "Michael Brown",
      category: "Salary",
      date: "2025-10-31",
      time: "10:00",
      type: "Income",
      status: "Completed",
      amount: "100.00",
    },
    {
      transaction_id: "TRX006",
      id: 6,
      name: "Emily Davis",
      category: "Utilities",
      date: "2025-11-01",
      time: "09:00",
      type: "Expense",
      status: "Pending",
      amount: "80.00",
    },
    {
      transaction_id: "TRX007",
      id: 7,
      name: "David Wilson",
      category: "Stock",
      date: "2025-11-02",
      time: "15:30",
      type: "Income",
      status: "Completed",
      amount: "60.00",
    },
  ]);
  const [filteredTransactions, setFilteredTransactions] =
    useState(transactionsList);

  const [itemsList, setItemsList] = useState([
    {
      title: "Total Income",
      value:
        "$" +
        transactionsList
          .filter((tx) => tx.type === "Income")
          .reduce((sum, tx) => sum + parseFloat(tx.amount), 0)
          .toFixed(2)
          .toString(),
    },
    {
      title: "Total Expense",
      value:
        "$" +
        transactionsList
          .filter((tx) => tx.type === "Expense")
          .reduce((sum, tx) => sum + parseFloat(tx.amount), 0)
          .toFixed(2)
          .toString(),
    },
    {
      title: "Total Transactions",
      value: transactionsList.length.toString(),
    },
    {
      title: "Pending",
      value: transactionsList
        .filter((tx) => tx.status === "Pending")
        .length.toString(),
    },
  ]);
  const [isOpenTransactionInfo, setIsOpenTransactionInfo] =
    useState<boolean>(false);
  const [transaction, setTransaction] = useState<Transaction | null>(null);
  const [inputValue, setInputValue] = useState<string>("");
  const [type, setType] = useState<"all" | "expense" | "income">("all");
  const [status, setStatus] = useState<"all" | "completed" | "pending">("all");

  useEffect(() => {
    setItemsList([
      {
        title: "Total Income",
        value:
          "$" +
          transactionsList
            .filter((tx) => tx.type === "Income")
            .reduce((sum, tx) => sum + parseFloat(tx.amount), 0)
            .toFixed(2)
            .toString(),
      },
      {
        title: "Total Expense",
        value:
          "$" +
          transactionsList
            .filter((tx) => tx.type === "Expense")
            .reduce((sum, tx) => sum + parseFloat(tx.amount), 0)
            .toFixed(2)
            .toString(),
      },
      {
        title: "Total Transactions",
        value: transactionsList.length.toString(),
      },
      {
        title: "Pending",
        value: transactionsList
          .filter((tx) => tx.status === "Pending")
          .length.toString(),
      },
    ]);
  }, [transactionsList]);

  useEffect(() => {
    let filteredList = transactionsList;
    if (type === "expense" || type === "income") {
      filteredList = filteredList.filter(
        (tx) => tx.type.toLowerCase() === type.toLowerCase()
      );
    }
    if (status === "completed" || status === "pending") {
      filteredList = filteredList.filter(
        (tx) => tx.status.toLowerCase() === status.toLowerCase()
      );
    }
    if (inputValue) {
      filteredList = filteredList.filter(
        (tx) =>
          tx.name.toLowerCase().includes(inputValue.toLowerCase()) ||
          tx.transaction_id.toLowerCase().includes(inputValue.toLowerCase()) ||
          tx.category.toLowerCase().includes(inputValue.toLowerCase()) ||
          tx.date.toLowerCase().includes(inputValue.toLowerCase()) ||
          tx.time.toLowerCase().includes(inputValue.toLowerCase())
      );
    }
    setFilteredTransactions(filteredList);
  }, [inputValue, type, status, transactionsList]);

  return (
    <div className="lg:px-6 mt-14">
      <div className="flex flex-col gap-y-12">
        <div className="flex justify-between items-center">
          <div className="flex flex-col gap-y-2">
            <h1 className="text-3xl font-bold">Transaction Management</h1>
            <p className="text-gray-600">
              Monitor and manage all platform transactions
            </p>
          </div>
          <a
            href="./"
            download
            className="h-12 bg-[#07B681] rounded-[10px] flex items-center gap-x-2 px-2"
          >
            <Download className="size-5 text-white" />
            <div className="text-white">Export Data</div>
          </a>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {itemsList.map((item, index) => (
            <div
              key={index}
              className="bg-white h-[188px] px-8 pt-6 rounded-[20px] text-[rgba(0,0,0,0.6)] flex flex-col gap-y-6"
            >
              <div className="flex gap-x-4 items-center">
                {item.title === "Total Income" ? (
                  <div className="size-9 rounded-[10px] bg-[#CFF0E7] flex items-center justify-center">
                    <TrendingUp className="size-5 text-[#07B681]" />
                  </div>
                ) : item.title === "Total Expense" ? (
                  <div className="size-9 rounded-[10px] bg-[#FEE4E2] flex items-center justify-center">
                    <TrendingDown className="size-5 text-[#ED7771]" />
                  </div>
                ) : null}
                <p className={`font-medium text-[16px] h-6`}>{item.title}</p>
              </div>
              <p
                className={`font-bold text-[32px] ${
                  item.title === "Total Income"
                    ? "text-[#07B681]"
                    : item.title === "Total Expense"
                    ? "text-[#ED7771]"
                    : ""
                }`}
              >
                {item.value}
              </p>
            </div>
          ))}
        </div>
        <div className="h-[620px] bg-white rounded-[20px] py-6 px-8 flex flex-col gap-y-[30px]">
          <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center w-full lg:gap-x-8 lg:gap-y-0 gap-y-4">
            <div className="lg:w-3/5 flex items-center border rounded-[10px] px-4 bg-[#F4F7FD]">
              <Search className="size-5 text-[rgba(0,0,0,0.5)]" />
              <input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Search transactions..."
                className="w-full h-12 py-0 px-3 border-none focus:outline-none"
              />
            </div>
            <div className="lg:w-2/5 flex items-center gap-x-4">
              <NativeSelect
                className="bg-[#F4F7FD]"
                value={type}
                onChange={(e) =>
                  setType(e.target.value as "all" | "expense" | "income")
                }
              >
                <NativeSelectOption value="all" className="cursor-pointer">
                  All Types
                </NativeSelectOption>
                <NativeSelectOption value="expense" className="cursor-pointer">
                  Expense
                </NativeSelectOption>
                <NativeSelectOption value="income" className="cursor-pointer">
                  Income
                </NativeSelectOption>
              </NativeSelect>
              <NativeSelect
                className="bg-[#F4F7FD]"
                value={status}
                onChange={(e) =>
                  setStatus(e.target.value as "all" | "completed" | "pending")
                }
              >
                <NativeSelectOption value="all" className="cursor-pointer">
                  All Status
                </NativeSelectOption>
                <NativeSelectOption
                  value="completed"
                  className="cursor-pointer"
                >
                  Completed
                </NativeSelectOption>
                <NativeSelectOption value="pending" className="cursor-pointer">
                  Pending
                </NativeSelectOption>
              </NativeSelect>
            </div>
          </div>
          <div className="w-full">
            <div className="grid grid-cols-3 xl:grid-cols-7 gap-x-10 font-bold text-[16px]">
              <p className="">Transaction ID</p>
              <p className="hidden xl:flex">User</p>
              <p className="hidden xl:flex">Category</p>
              <p className="hidden xl:flex">Date & Time</p>
              <p className="hidden xl:flex">Type</p>
              <p className="">Status</p>
              <p className="">Amount</p>
            </div>
            <div className="mt-4 max-h-[400px] overflow-y-auto">
              {filteredTransactions.map((tx, index) => (
                <div
                  key={index}
                  className="grid grid-cols-3 xl:grid-cols-7 gap-x-10 items-center py-3 border-t border-gray-200"
                >
                  <div
                    className="cursor-pointer font-medium text-[16px] hover:underline"
                    onClick={() => {
                      setTransaction({
                        transaction_id: tx.transaction_id,
                        id: tx.id,
                        name: tx.name,
                        category: tx.category,
                        date: tx.date,
                        time: tx.time,
                        type: tx.type,
                        status: tx.status,
                        amount: tx.amount,
                      });
                      setIsOpenTransactionInfo(true);
                    }}
                  >
                    {tx.transaction_id}
                  </div>
                  <div className="hidden xl:flex flex-col gap-y-1">
                    <div className="font-medium text-[16px]">{tx.name}</div>
                    <div className="text-[14px] text-[rgba(0,0,0,0.5)]">
                      ID: {tx.id}
                    </div>
                  </div>
                  <div className="hidden xl:flex text-[16px]">
                    {tx.category}
                  </div>
                  <div className="hidden xl:flex text-[16px]">
                    {tx.date} {tx.time}
                  </div>
                  <div
                    className={`hidden xl:flex w-[100px] h-[35px] rounded-[15px] items-center justify-center ${
                      tx.type === "Income"
                        ? "bg-[#CFF0E7] text-[#07B681]"
                        : "bg-[#FFCCCB] text-[#ED7771]"
                    }`}
                  >
                    {tx.type}
                  </div>
                  <div
                    className={`w-[100px] h-[35px] rounded-[15px] flex items-center justify-center ${
                      tx.status === "Completed"
                        ? "bg-[#CFF0E7] text-[#07B681]"
                        : "bg-[#FFE584] text-[#D4A017]"
                    }`}
                  >
                    {tx.status}
                  </div>
                  <div
                    className={`font-medium text-[16px] pl-4 ${
                      tx.type === "Income" ? "text-[#37C39A]" : "text-[#ED7771]"
                    }`}
                  >
                    {tx.type === "Income"
                      ? `+ $${tx.amount}`
                      : `- $${tx.amount}`}
                  </div>
                </div>
              ))}
            </div>
            {isOpenTransactionInfo && transaction && (
              <TransactionInformation
                transaction={transaction}
                setOpen={setIsOpenTransactionInfo}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
