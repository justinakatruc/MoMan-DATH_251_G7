"use client";
import { useState } from "react";
import Image from "next/image";
import { useCategories } from "@/app/context/CategoryContext";
import { Transaction } from "@/app/model";

export default function TransactionButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [transactionType, setTransactionType] = useState<"income" | "expense">(
    "income"
  );
  const [formData, setFormData] = useState({
    name: "",
    amount: "",
    date: new Date().toISOString().split("T")[0],
    description: "",
    categoryId: 0,
  });

  const { userExpenseCategories, userIncomeCategories, addTransaction } =
    useCategories();

  const currentCategories =
    transactionType === "income" ? userIncomeCategories : userExpenseCategories;

  const handleSubmit = () => {
    if (formData.name.trim() && formData.amount && formData.categoryId) {
      const newTransaction: Transaction = {
        id: Date.now() + Math.floor(Math.random() * 1000),
        categoryId: formData.categoryId,
        type: transactionType,
        name: formData.name.trim(),
        amount: parseFloat(formData.amount),
        date: new Date(formData.date),
        description: formData.description.trim() || undefined,
      };

      addTransaction(newTransaction);

      // Reset form
      setFormData({
        name: "",
        amount: "",
        date: new Date().toISOString().split("T")[0],
        description: "",
        categoryId: 0,
      });
      setIsOpen(false);
    }
  };

  const handleClose = () => {
    setIsOpen(false);
    // Reset form on close
    setFormData({
      name: "",
      amount: "",
      date: new Date().toISOString().split("T")[0],
      description: "",
      categoryId: 0,
    });
  };

  return (
    <>
      {/* Responsive Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="flex w-10 h-10 sm:w-12 sm:h-12 bg-green-500 rounded-[8px] sm:rounded-[12px] items-center justify-center shadow-md hover:bg-green-600 transition-colors cursor-pointer"
      >
        <svg
          className="w-6 h-6 sm:w-8 sm:h-8 text-white"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="square"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 6v6m0 0v6m0-6h6m-6 0H6"
          />
        </svg>
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4">
          <div
            onClick={handleClose}
            className="absolute inset-0 bg-black/50 backdrop-blur-[2px]"
          />

          {/* Responsive Modal Container */}
          <div className="relative flex flex-col w-full max-w-xs sm:max-w-md lg:max-w-lg bg-white rounded-xl sm:rounded-2xl mx-2 sm:mx-4 p-4 sm:p-6 max-h-[95vh]">
            {/* Close Button */}
            <button
              onClick={handleClose}
              className="absolute top-3 right-3 sm:top-4 sm:right-4 text-gray-500 hover:text-gray-700 z-10 cursor-pointer"
            >
              <svg
                className="w-5 h-5 sm:w-6 sm:h-6"
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

            {/* Fixed Header Section */}
            <div className="text-center mb-4 sm:mb-6 flex-shrink-0">
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-700 mb-3 sm:mb-4">
                Add Transaction
              </h2>

              {/* Responsive Income/Expense Toggle */}
              <div className="flex bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => {
                    setTransactionType("income");
                    setFormData((prev) => ({ ...prev, categoryId: 0 }));
                  }}
                  className={`flex-1 py-2 sm:py-3 px-3 sm:px-4 rounded-md text-sm sm:text-base font-medium transition-colors cursor-pointer ${
                    transactionType === "income"
                      ? "bg-green-500 text-white"
                      : "text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  Income
                </button>
                <button
                  onClick={() => {
                    setTransactionType("expense");
                    setFormData((prev) => ({ ...prev, categoryId: 0 }));
                  }}
                  className={`flex-1 py-2 sm:py-3 px-3 sm:px-4 rounded-md text-sm sm:text-base font-medium transition-colors cursor-pointer ${
                    transactionType === "expense"
                      ? "bg-green-500 text-white"
                      : "text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  Expense
                </button>
              </div>
            </div>

            {/* Scrollable Form Fields */}
            <div className="flex-1 overflow-y-auto">
              <div className="space-y-3 sm:space-y-4">
                {/* Date Input */}
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                    Date
                  </label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, date: e.target.value }))
                    }
                    className="w-full px-3 py-2 sm:py-3 text-sm sm:text-base text-gray-700 border border-gray-300 rounded-lg focus:outline-none focus:border-green-500"
                  />
                </div>

                {/* Name Input */}
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                    Name
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, name: e.target.value }))
                    }
                    placeholder="Enter transaction name"
                    maxLength={25}
                    className="w-full px-3 py-2 sm:py-3 text-sm sm:text-base text-gray-700 placeholder:text-gray-400 border border-gray-300 rounded-lg focus:outline-none focus:border-green-500"
                  />
                  <div className="text-right text-xs text-gray-400 mt-1">
                    {formData.name.length}/25
                  </div>
                </div>

                {/* Amount Input */}
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                    {transactionType === "income" ? "Income" : "Expense"}
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-2 sm:top-3 text-gray-500 text-sm sm:text-base">
                      $
                    </span>
                    <input
                      type="number"
                      step="0.01"
                      min={0.0}
                      value={formData.amount}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          amount: e.target.value,
                        }))
                      }
                      placeholder="0.00"
                      className="w-full pl-7 sm:pl-8 pr-3 py-2 sm:py-3 text-sm sm:text-base text-gray-700 placeholder:text-gray-400 border border-gray-300 rounded-lg focus:outline-none focus:border-green-500"
                    />
                  </div>
                </div>

                {/* Category Selection - Responsive Grid */}
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                    Category
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-1 sm:gap-2 max-h-24 sm:max-h-32 lg:max-h-40 overflow-y-auto border border-gray-300 rounded-lg p-2">
                    {currentCategories.map((category) => (
                      <button
                        key={category.id}
                        onClick={() =>
                          setFormData((prev) => ({
                            ...prev,
                            categoryId: category.id,
                          }))
                        }
                        className={`flex flex-col items-center p-1 sm:p-2 rounded-lg border-2 transition-colors cursor-pointer ${
                          formData.categoryId === category.id
                            ? "border-green-500 bg-green-50"
                            : "border-gray-300 hover:border-green-300"
                        }`}
                      >
                        <Image
                          src={category.icon}
                          alt={category.name}
                          width={16}
                          height={16}
                          className="mb-1 w-4 h-4 sm:w-5 sm:h-5"
                        />
                        <span className="text-xs sm:text-sm text-center text-gray-700 leading-tight">
                          {category.name.length > 8
                            ? `${category.name.substring(0, 6)}...`
                            : category.name}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Description Input */}
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        description: e.target.value,
                      }))
                    }
                    placeholder="Enter description (optional)"
                    rows={2}
                    className="w-full px-3 py-2 sm:py-3 text-sm sm:text-base text-gray-700 placeholder:text-gray-400 border border-gray-300 rounded-lg focus:outline-none focus:border-green-500 resize-none"
                  />
                </div>
              </div>
            </div>

            {/* Fixed Submit Button */}
            <div className="flex-shrink-0 pt-4 sm:pt-6">
              <button
                onClick={handleSubmit}
                disabled={
                  !formData.name.trim() ||
                  !formData.amount ||
                  !formData.categoryId
                }
                className={`w-full py-3 sm:py-4 rounded-lg cursor-pointer text-sm sm:text-base font-medium text-white transition-colors ${
                  formData.name.trim() && formData.amount && formData.categoryId
                    ? "bg-green-500 hover:bg-green-600"
                    : "bg-gray-300 cursor-not-allowed"
                }`}
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
