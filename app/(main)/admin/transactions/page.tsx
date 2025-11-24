"use client";

import {
  NativeSelect,
  NativeSelectOption,
} from "@/app/components/ui/native-select";
import { adminAPI } from "@/lib/api";
import {
  Search,
  ArrowDownToLine,
  TrendingUp,
  TrendingDown,
} from "lucide-react";
import { useEffect, useState } from "react";

type Transaction = {
  id: string;
  type: "income" | "expense";
  date: string;
  name: string;
  amount: number;
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  categoryId: string;
  category: string;
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
            {`Transaction Details - ${transaction.id}`}
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
            <span className="font-semibold">User:</span> {transaction.firstName}{" "}
            {transaction.lastName} (ID: {transaction.userId} |{" "}
            {transaction.email})
          </p>
          <p>
            <span className="font-semibold">Category:</span>{" "}
            {transaction.category}
          </p>
          <p>
            <span className="font-semibold">Date & Time:</span>{" "}
            {new Date(transaction.date).toLocaleString()}
          </p>
          <p>
            <span className="font-semibold">Type:</span> {transaction.type}
          </p>
          <p>
            <span className="font-semibold">Amount:</span>{" "}
            {transaction.type === "income"
              ? `+ $${transaction.amount}`
              : `- $${transaction.amount}`}
          </p>
        </div>
      </div>
    </div>
  );
}

export default function TransactionsPage() {
  const [transactionsList, setTransactionsList] = useState([]);
  const [filteredTransactions, setFilteredTransactions] =
    useState(transactionsList);

  const convertToCSV = (data: Transaction[]) => {
    const headers = [
      "Transaction ID",
      "User",
      "Category",
      "Date",
      "Type",
      "Amount",
    ];

    const rows = data.map((transaction) => [
      transaction.id,
      `${transaction.firstName} ${transaction.lastName} (${transaction.email})`,
      transaction.category,
      new Date(transaction.date).toISOString().split("T")[0],
      transaction.type,
      `$${transaction.amount}`,
    ]);

    const csvContent = [headers, ...rows]
      .map((row) => row.map((item) => `"${item}"`).join(","))
      .join("\n");

    return csvContent;
  };

  const downloadCSV = () => {
    if (!transactionsList || transactionsList.length === 0) {
      alert("No transactions to export.");
      return;
    }

    const csvContent = convertToCSV(transactionsList);
    const bom = "\uFEFF";
    const blob = new Blob([bom + csvContent], {
      type: "text/csv;charset=utf-8;",
    });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "transactions.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const [itemsList, setItemsList] = useState([
    {
      title: "Total Income",
      value: "$0",
    },
    {
      title: "Total Expense",
      value: "$0",
    },
    {
      title: "Total Transactions",
      value: transactionsList.length.toString(),
    },
  ]);
  const [isOpenTransactionInfo, setIsOpenTransactionInfo] =
    useState<boolean>(false);
  const [transaction, setTransaction] = useState<Transaction | null>(null);
  const [inputValue, setInputValue] = useState<string>("");
  const [type, setType] = useState<"all" | "expense" | "income">("all");

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const result = await adminAPI.getAllTransactions();

        if (result.success) {
          setTransactionsList(result.transactions);
        }
      } catch (error) {
        console.error("Error fetching transactions:", error);
      }
    };
    fetchTransactions();
  }, []);

  useEffect(() => {
    setItemsList([
      {
        title: "Total Income",
        value: transactionsList
          .reduce(
            (acc: number, tx: Transaction) =>
              tx.type === "income" ? acc + tx.amount : acc,
            0
          )
          .toLocaleString("en-US", { style: "currency", currency: "USD" }),
      },
      {
        title: "Total Expense",
        value: transactionsList
          .reduce(
            (acc: number, tx: Transaction) =>
              tx.type === "expense" ? acc + tx.amount : acc,
            0
          )
          .toLocaleString("en-US", { style: "currency", currency: "USD" }),
      },
      {
        title: "Total Transactions",
        value: transactionsList.length.toString(),
      },
    ]);
  }, [transactionsList]);

  useEffect(() => {
    let filteredList = transactionsList;
    if (type === "expense" || type === "income") {
      filteredList = filteredList.filter((tx: Transaction) => tx.type === type);
    }
    if (inputValue) {
      filteredList = filteredList.filter(
        (tx: Transaction) =>
          tx.name.toLowerCase().includes(inputValue.toLowerCase()) ||
          tx.id.toLowerCase().includes(inputValue.toLowerCase()) ||
          tx.category.toLowerCase().includes(inputValue.toLowerCase()) ||
          tx.date.toLowerCase().includes(inputValue.toLowerCase()) ||
          tx.firstName.toLowerCase().includes(inputValue.toLowerCase()) ||
          tx.lastName.toLowerCase().includes(inputValue.toLowerCase()) ||
          tx.email.toLowerCase().includes(inputValue.toLowerCase())
      );
    }
    setFilteredTransactions(filteredList);
  }, [inputValue, type, transactionsList]);

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
          <button
            onClick={downloadCSV}
            className="h-12 bg-[#07B681] rounded-[10px] flex items-center gap-x-2 px-2"
          >
            <ArrowDownToLine className="text-white" />
            <div className="text-white">Export Data</div>
          </button>
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
            <div className="lg:w-1/2 flex items-center border rounded-[10px] px-4 bg-[#F4F7FD]">
              <Search className="size-5 text-[rgba(0,0,0,0.5)]" />
              <input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Search transactions..."
                className="w-full h-12 py-0 px-3 border-none focus:outline-none"
              />
            </div>
            <div className="lg:w-1/2 flex items-center gap-x-4">
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
            </div>
          </div>
          <div className="w-full">
            <div className="grid grid-cols-3 xl:grid-cols-6 gap-x-10 font-bold text-[16px]">
              <p className="">Transaction ID</p>
              <p className="hidden xl:flex">User</p>
              <p className="hidden xl:flex">Category</p>
              <p className="hidden xl:flex">Date & Time</p>
              <p className="">Type</p>
              <p className="">Amount</p>
            </div>
            <div className="mt-4 max-h-[400px] overflow-y-auto">
              {filteredTransactions.length > 0 ? (
                filteredTransactions.map((tx: Transaction, index) => (
                  <div
                    key={index}
                    className="grid grid-cols-3 xl:grid-cols-6 gap-x-10 items-center py-3 border-t border-gray-200"
                  >
                    <div
                      className="cursor-pointer font-medium text-[16px] hover:underline"
                      onClick={() => {
                        setTransaction(tx);
                        setIsOpenTransactionInfo(true);
                      }}
                    >
                      {tx.id}
                    </div>
                    <div className="hidden xl:flex flex-col gap-y-1">
                      <div className="font-medium text-[16px]">
                        {tx.firstName} {tx.lastName}
                      </div>
                      <div className="text-[14px] text-[rgba(0,0,0,0.5)]">
                        ID: {tx.userId} | {tx.email}
                      </div>
                    </div>
                    <div className="hidden xl:flex text-[16px]">
                      {tx.category}
                    </div>
                    <div className="hidden xl:flex text-[16px]">
                      {new Date(tx.date).toLocaleString()}
                    </div>
                    <div
                      className={`flex w-[100px] h-[35px] rounded-[15px] items-center justify-center ${
                        tx.type === "income"
                          ? "bg-[#CFF0E7] text-[#07B681]"
                          : "bg-[#FFCCCB] text-[#ED7771]"
                      }`}
                    >
                      {tx.type}
                    </div>
                    <div
                      className={`font-medium text-[16px] pl-4 ${
                        tx.type === "income"
                          ? "text-[#37C39A]"
                          : "text-[#ED7771]"
                      }`}
                    >
                      {tx.type === "income"
                        ? `+ $${tx.amount}`
                        : `- $${tx.amount}`}
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center text-gray-500 mt-10 text-lg">
                  No transactions found.
                </p>
              )}
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
