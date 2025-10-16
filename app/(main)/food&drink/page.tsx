"use client";
import { useState, useRef, useEffect } from "react";
import TransactionButton from "@/app/components/TransactionButton";
import { useCategories } from "@/app/context/CategoryContext";

export default function FoodnDrink() {
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

  const { transactions, removeTransaction, updateTransaction } =
    useCategories();
  const [fromMonth, setFromMonth] = useState("January");
  const [toMonth, setToMonth] = useState("December");
  const fromMonthIndex = getMonthIndex(fromMonth);
  const toMonthIndex = getMonthIndex(toMonth);

  const [showFromDropdown, setShowFromDropdown] = useState(false);
  const [showToDropdown, setShowToDropdown] = useState(false);

  const fromDropdownRef = useRef<HTMLDivElement>(null);
  const toDropdownRef = useRef<HTMLDivElement>(null);

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

  // Get Food & Drink transaction with month filter applied
  const FoodnDrinkTransactions = transactions.filter((transaction) => {
    if (transaction.categoryId !== 1) return false;
    if (!transaction.date) return true;

    const tMonth = transaction.date.getMonth();
    return tMonth >= fromMonthIndex && tMonth <= toMonthIndex;
  });

  const [isEditMode, setIsEditMode] = useState(false);

  // Temporay form to store edit transaction details
  type EditForm = {
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
      transactions
        .filter((transaction) => transaction.categoryId === 1)
        .forEach((transaction) => {
          forms[transaction.id] = {
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
  }, [isEditMode, transactions]);

  return (
    <div className="flex lg:ml-[260px] w-full items-center justify-center">
      <div className="flex flex-col items-center min-h-screen gap-8 p-4 w-full lg:max-w-[95%]">
        {/* Header */}
        <div className="flex flex-col w-full gap-4 select-none">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl lg:text-4xl font-bold text-black">
              Food & Drink
            </h1>
            <div className="flex items-center">
              <TransactionButton />
              {/* Logo goes here */}
            </div>
          </div>
        </div>

        <div className="flex flex-col w-full items-start gap-4 justify-between text-black">
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
                onClick={() => {
                  if (isEditMode) {
                    Object.entries(editForms).forEach(([id, form]) => {
                      const isAllEmpty =
                        !form.name.trim() &&
                        !form.amount.trim() &&
                        !form.description.trim();

                      if (isAllEmpty) {
                        removeTransaction(Number(id));
                      } else {
                        updateTransaction(Number(id), {
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
                className="w-20 text-2xl bg-[#FBFDFF] border-2 border-gray-200 rounded-md text-center justify-center shadow-md cursor-pointer"
              >
                {isEditMode && FoodnDrinkTransactions.length > 0
                  ? "Done"
                  : "Edit"}
              </button>
              <a
                href="./"
                download
                className="hidden lg:flex flex-row items-center px-4 py-2 font-medium text-black"
              >
                <svg
                  width="32"
                  height="32"
                  viewBox="0 0 32 32"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-8 h-8 text-gray-700"
                >
                  <rect
                    x="10"
                    y="26"
                    width="12"
                    height="2"
                    rx="1"
                    fill="currentColor"
                  />
                  <path
                    d="M16 6v14M16 20l-5-5M16 20l5-5"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <span>Download</span>
              </a>
            </div>
          </div>
          <div className="flex lg:hidden justify-between w-full">
            <button
              onClick={() => {
                if (isEditMode) {
                  Object.entries(editForms).forEach(([id, form]) => {
                    const isAllEmpty =
                      !form.name.trim() &&
                      !form.amount.trim() &&
                      !form.description.trim();

                    if (isAllEmpty) {
                      removeTransaction(Number(id));
                    } else {
                      updateTransaction(Number(id), {
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
              {isEditMode && FoodnDrinkTransactions.length > 0
                ? "Done"
                : "Edit"}
            </button>
            <a
              href="./"
              download
              className="flex lg:hidden flex-row items-center px-4 py-2 font-medium text-black"
            >
              <svg
                width="32"
                height="32"
                viewBox="0 0 32 32"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="w-8 h-8 text-gray-700"
              >
                <rect
                  x="10"
                  y="26"
                  width="12"
                  height="2"
                  rx="1"
                  fill="currentColor"
                />
                <path
                  d="M16 6v14M16 20l-5-5M16 20l5-5"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <span>Download</span>
            </a>
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
              {FoodnDrinkTransactions.length === 0 ? (
                <div className="p-8 text-center text-gray-500">
                  No transactions yet. Click the green button to create one!
                </div>
              ) : (
                FoodnDrinkTransactions.map((transaction) => (
                  <div
                    key={transaction.id}
                    className="grid grid-cols-4 gap-4 p-4 border-b border-gray-100 hover:bg-gray-50 text-center"
                  >
                    {isEditMode ? (
                      <>
                        <input
                          className="text-gray-900 border rounded px-2"
                          value={editForms[transaction.id]?.name || ""}
                          onChange={(e) =>
                            setEditForms((forms) => ({
                              ...forms,
                              [transaction.id]: {
                                ...(forms[transaction.id] || {}),
                                name: e.target.value,
                              },
                            }))
                          }
                        />
                        <input
                          className="text-gray-900 border rounded px-2"
                          type="number"
                          value={editForms[transaction.id]?.amount || ""}
                          onChange={(e) =>
                            setEditForms((forms) => ({
                              ...forms,
                              [transaction.id]: {
                                ...(forms[transaction.id] || {}),
                                amount: e.target.value,
                              },
                            }))
                          }
                        />
                        <input
                          className="text-gray-600 border rounded px-2"
                          value={editForms[transaction.id]?.description || ""}
                          onChange={(e) =>
                            setEditForms((forms) => ({
                              ...forms,
                              [transaction.id]: {
                                ...(forms[transaction.id] || {}),
                                description: e.target.value,
                              },
                            }))
                          }
                        />
                        <input
                          className="text-gray-600 border rounded px-2"
                          type="date"
                          value={editForms[transaction.id]?.date || ""}
                          onChange={(e) =>
                            setEditForms((forms) => ({
                              ...forms,
                              [transaction.id]: {
                                ...(forms[transaction.id] || {}),
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
