"use client";
import { useState, useRef, useEffect, useMemo, useCallback } from "react";
import { useCategories } from "@/app/context/CategoryContext";
import Topbar from "@/app/components/Topbar";
import { Transaction } from "@/app/model";
import { usePathname } from "next/navigation";
import { transactionAPI } from "@/lib/api";
import { useCategoryStore } from "@/app/store/useCategoryStore";
import { ArrowDownToLine } from "lucide-react";

export default function CategoryPage() {
  const pathname = usePathname();
  const categoryName = pathname.split("/")[2];

  const formatLink = (name: string) => {
    let lower = name.toLowerCase().trim();

    if (lower.includes("&")) {
      lower = lower.replace(/\s*&\s*/g, "&");
      return lower.replace(/\s+/g, "-");
    }

    return lower.replace(/\s+/g, "-");
  };

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const getMonthIndex = (month: string) => months.findIndex((m) => m === month);

  const { expensesCategory, incomesCategory } = useCategoryStore();
  const { transactions, removeTransaction, updateTransaction } =
    useCategories();
  const [transactionsSet, setTransactionsSet] = useState<Transaction[]>([]);
  const [isEditMode, setIsEditMode] = useState(false);
  const [fromMonth, setFromMonth] = useState("January");
  const [toMonth, setToMonth] = useState("December");
  const fromMonthIndex = getMonthIndex(fromMonth);
  const toMonthIndex = getMonthIndex(toMonth);

  const [showFromDropdown, setShowFromDropdown] = useState(false);
  const [showToDropdown, setShowToDropdown] = useState(false);

  const fromDropdownRef = useRef<HTMLDivElement>(null);
  const toDropdownRef = useRef<HTMLDivElement>(null);

  const fetchTransactions = useCallback(async () => {
    let categoryId: string | null = null;
    const expenseCategory = expensesCategory.find(
      (cat) => formatLink(cat.name) === categoryName
    );
    if (expenseCategory) {
      categoryId = expenseCategory.id;
    } else {
      const incomeCategory = incomesCategory.find(
        (cat) => formatLink(cat.name) === categoryName
      );
      if (incomeCategory) {
        categoryId = incomeCategory.id;
      }
    }

    if (categoryId) {
      const result = await transactionAPI.getCategoryTransactions(categoryId);

      if (result.success) {
        // Convert date strings to Date objects
        const fetchedTransactions: Transaction[] = result.transactions.map(
          (tx: {
            id: number;
            type: "expense" | "income";
            name: string;
            amount: number;
            date: string;
            description?: string;
            categoryId: string;
          }) => ({
            ...tx,
            date: tx.date ? new Date(tx.date) : null,
          })
        );
        setTransactionsSet(fetchedTransactions);
      }
    }
  }, [categoryName, expensesCategory, incomesCategory]);

  // Check if the use click outside Dropdown Menu and close it
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        fromDropdownRef.current &&
        !fromDropdownRef.current.contains(event.target as Node)
      ) {
        setShowFromDropdown(false);
      }
      if (
        toDropdownRef.current &&
        !toDropdownRef.current.contains(event.target as Node)
      ) {
        setShowToDropdown(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions, isEditMode, transactions]);

  const filteredTransactions = useMemo(() => {
    if (fromMonthIndex > toMonthIndex) return [];

    return transactionsSet.filter((transaction) => {
      if (!transaction.date) return true;
      const tMonth = transaction.date.getMonth();
      return tMonth >= fromMonthIndex && tMonth <= toMonthIndex;
    });
  }, [transactionsSet, fromMonthIndex, toMonthIndex]);

  type EditForm = {
    id: string;
    name: string;
    amount: string;
    description: string;
    date: string;
  };

  const [editForms, setEditForms] = useState<{ [id: number]: EditForm }>({});
  // Intialize EditFrom for each transaction
  useEffect(() => {
    if (isEditMode) {
      const forms: { [id: number]: EditForm } = {};
      transactionsSet.forEach((transaction, index) => {
        forms[index] = {
          id: transaction.id,
          name: transaction.name,
          amount: transaction.amount?.toString() || "",
          description: transaction.description || "",
          date: transaction.date
            ? new Date(transaction.date).toISOString().split("T")[0]
            : "",
        };
      });
      setEditForms(forms);
    }
  }, [isEditMode, transactionsSet]);

  const convertToCSV = (data: Transaction[]) => {
    const headers = ["Name", "Price", "Description", "Date"];

    const rows = data.map((transaction) => [
      transaction.name,
      transaction.amount?.toFixed(2),
      transaction.description || "",
      new Date(transaction.date).toISOString().split("T")[0],
    ]);

    const csvContent = [headers, ...rows]
      .map((row) => row.map((item) => `"${item}"`).join(","))
      .join("\n");

    return csvContent;
  };

  const downloadCSV = () => {
    if (!filteredTransactions || filteredTransactions.length === 0) {
      alert("No transactions to export.");
      return;
    }

    const csvContent = convertToCSV(filteredTransactions);
    const bom = "\uFEFF";
    const blob = new Blob([bom + csvContent], {
      type: "text/csv;charset=utf-8;",
    });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `${categoryName}-transactions.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="flex w-full items-center justify-center">
      <div className="flex flex-col min-h-screen gap-8 w-full">
        {/* Header */}
        <Topbar />

        <div className="flex flex-col w-full items-start gap-4 justify-between text-black px-6">
          <div className="flex w-full items-center justify-between gap-4">
            <div className="flex gap-2">
              <span className="font-medium text-xl lg:text-2xl">From</span>
              <div className="relative " ref={fromDropdownRef}>
                <button
                  onClick={() => {
                    setShowFromDropdown(!showFromDropdown);
                    setShowToDropdown(false);
                  }}
                  className="flex px-2 py-1 w-30 rounded-md bg-[#FBFDFF] border-2 border-gray-200 text-center items-center justify-between shadow-md cursor-pointer"
                >
                  <span>{fromMonth}</span>
                  <svg
                    className="w-4 h-4 ml-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>
                {showFromDropdown && (
                  <div className="absolute top-full left-0 mt-0.5 w-full rounded-md bg-[#FBFDFF] border-2 border-gray-200 shadow-md text-start">
                    {months.map((month) => (
                      <button
                        key={month}
                        onClick={() => {
                          setFromMonth(month);
                          setShowFromDropdown(!showFromDropdown);
                        }}
                        className="w-full px-2 py-1 text-left hover:bg-gray-300 focus:outline-none focus:bg-gray-300 cursor-pointer"
                      >
                        {month}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <span className="font-medium text-xl lg:text-2xl">To</span>
              <div className="relative" ref={toDropdownRef}>
                <button
                  onClick={() => {
                    setShowToDropdown(!showToDropdown);
                    setShowFromDropdown(false);
                  }}
                  className="flex px-2 py-1 w-30 rounded-md bg-[#FBFDFF] border-2 border-gray-200 text-center items-center justify-between shadow-md cursor-pointer"
                >
                  <span>{toMonth}</span>
                  <svg
                    className="w-4 h-4 ml-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>
                {showToDropdown && (
                  <div className="absolute top-full left-0 mt-0.5 w-full rounded-md bg-[#FBFDFF] border-2 border-gray-200 shadow-md text-start">
                    {months.map((month) => (
                      <button
                        key={month}
                        onClick={() => {
                          setToMonth(month);
                          setShowToDropdown(!showToDropdown);
                        }}
                        className="w-full px-2 py-1 text-left hover:bg-gray-300 focus:outline-none focus:bg-gray-300 cursor-pointer"
                      >
                        {month}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <div className="hidden lg:flex items-center">
              <button
                onClick={async () => {
                  if (isEditMode) {
                    Object.entries(editForms).forEach(([, form]) => {
                      const nameEmpty = !form.name.trim();
                      const amountEmpty = !form.amount.trim();
                      const dateEmpty = !form.date?.trim();
                      const isAllEmpty = nameEmpty && amountEmpty && dateEmpty;

                      const isAnyEmpty = nameEmpty || amountEmpty || dateEmpty;

                      if (isAllEmpty) {
                        removeTransaction(form.id);
                      } else if (isAnyEmpty) {
                        return;
                      } else {
                        updateTransaction(form.id, {
                          name: form.name,
                          amount: parseFloat(form.amount),
                          description: form.description,
                          date: new Date(form.date),
                        });
                      }
                    });

                    await fetchTransactions();
                  }
                  setIsEditMode(!isEditMode);
                }}
                className="w-20 text-2xl bg-[#FBFDFF] border-2 border-gray-200 rounded-md text-center justify-center shadow-md cursor-pointer"
              >
                {isEditMode && filteredTransactions.length > 0
                  ? "Done"
                  : "Edit"}
              </button>
              <button
                onClick={downloadCSV}
                className="flex flex-row items-center px-4 py-2 font-medium text-black cursor-pointer"
              >
                <ArrowDownToLine />
                <span>Download</span>
              </button>
            </div>
          </div>
          <div className="flex lg:hidden justify-between w-full">
            <button
              onClick={() => {
                if (isEditMode) {
                  Object.entries(editForms).forEach(([, form]) => {
                    const isAllEmpty =
                      !form.name.trim() &&
                      !form.amount.trim() &&
                      !form.description.trim();

                    if (isAllEmpty) {
                      removeTransaction(form.id);
                    } else {
                      updateTransaction(form.id, {
                        name: form.name,
                        amount: parseFloat(form.amount),
                        description: form.description,
                        date: new Date(form.date),
                      });
                    }
                  });
                }
                setIsEditMode(!isEditMode);
              }}
              className="w-18 h-8 text-base bg-[#FBFDFF] border-2 border-gray-200 rounded-md text-center justify-center shadow-md cursor-pointer"
            >
              {isEditMode && filteredTransactions.length > 0 ? "Done" : "Edit"}
            </button>
          </div>
          {/* Main table */}
          <div className="w-full bg-white rounded-xl shadow-md border border-gray-200 mt-4 overflow-x-auto">
            <div className="grid grid-cols-4 gap-4 p-4 bg-gray-50 border-b border-gray-200">
              <div className="font-semibold text-gray-700 text-center">
                Name
              </div>
              <div className="font-semibold text-gray-700 text-center">
                Price
              </div>
              <div className="font-semibold text-gray-700 text-center">
                Description
              </div>
              <div className="font-semibold text-gray-700 text-center">
                Date
              </div>
            </div>
            <div className="max-h-[600px] lg:max-h-[700px] overflow-y-auto">
              {filteredTransactions.length === 0 ? (
                <div className="p-8 text-center text-gray-500">
                  No transactions yet. Click the green button to create one!
                </div>
              ) : (
                filteredTransactions.map((transaction, index) => (
                  <div
                    key={transaction.id}
                    className="grid grid-cols-4 gap-4 p-4 border-b border-gray-100 hover:bg-gray-50 text-center"
                  >
                    {isEditMode ? (
                      <>
                        <input
                          className="text-gray-900 border rounded px-2"
                          value={editForms[index]?.name || ""}
                          onChange={(e) =>
                            setEditForms((forms) => ({
                              ...forms,
                              [index]: {
                                ...(forms[index] || {}),
                                name: e.target.value,
                              },
                            }))
                          }
                        />
                        <input
                          className="text-gray-900 border rounded px-2"
                          type="number"
                          value={editForms[index]?.amount || ""}
                          onChange={(e) =>
                            setEditForms((forms) => ({
                              ...forms,
                              [index]: {
                                ...(forms[index] || {}),
                                amount: e.target.value,
                              },
                            }))
                          }
                        />
                        <input
                          className="text-gray-600 border rounded px-2"
                          value={editForms[index]?.description || ""}
                          onChange={(e) =>
                            setEditForms((forms) => ({
                              ...forms,
                              [index]: {
                                ...(forms[index] || {}),
                                description: e.target.value,
                              },
                            }))
                          }
                        />
                        <input
                          className="text-gray-600 border rounded px-2"
                          type="date"
                          value={editForms[index]?.date || ""}
                          onChange={(e) =>
                            setEditForms((forms) => ({
                              ...forms,
                              [index]: {
                                ...(forms[index] || {}),
                                date: e.target.value,
                              },
                            }))
                          }
                        />
                      </>
                    ) : (
                      <>
                        <div className="text-gray-900">{transaction.name}</div>
                        <div className="text-gray-900">
                          ${transaction.amount?.toFixed(2)}
                        </div>
                        <div className="text-gray-600 truncate max-w-[120px] lg:max-w-none">
                          {transaction.description || "—"}
                        </div>
                        <div className="text-gray-600">
                          {transaction.date?.toLocaleDateString()}
                        </div>
                      </>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
