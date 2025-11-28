"use client";

import Content from "@/app/components/Content";
import { Category, TransactionAPIResponse } from "@/app/model";
import { useCategoryStore } from "@/app/store/useCategoryStore";
import { transactionAPI } from "@/lib/api";
import { ArrowLeft } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

export default function AnalysisSearch() {
  const router = useRouter();
  const today = new Date();
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [hasClicked, setHasClicked] = useState(false);
  const { expensesCategory, incomesCategory, fetchCategories } =
    useCategoryStore();

  const [category, setCategory] = useState<string>("");
  const [type, setType] = useState<string>("expense");
  const categoryTypes = ["expense", "income"];
  const [date, setDate] = useState<string>(today.toISOString().split("T")[0]);
  const [transactions, setTransactions] = useState<TransactionAPIResponse[]>(
    []
  );

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const fullExpensesList = useMemo(() => {
    const baseExpense: Category = {
      id: "",
      type: "expense",
      name: "All Expenses",
      icon: "",
      isDefault: true,
    };

    return [baseExpense, ...expensesCategory];
  }, [expensesCategory]);

  const fullIncomesList = useMemo(() => {
    const baseIncome: Category = {
      id: "",
      type: "income",
      name: "All Incomes",
      icon: "",
      isDefault: true,
    };

    return [baseIncome, ...incomesCategory];
  }, [incomesCategory]);
  const activeCategories = useMemo(() => {
    if (type === "expense") {
      return fullExpensesList;
    }
    return fullIncomesList;
  }, [type, fullExpensesList, fullIncomesList]);

  useEffect(() => {
    if (activeCategories.length > 0) {
      const firstCategoryId = activeCategories[0].id;
      setCategory(firstCategoryId);
    }
  }, [activeCategories]);

  const filteredTransactions = useMemo(() => {
    return transactions.filter(
      (transaction: TransactionAPIResponse) =>
        transaction.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        transaction.categoryName
          .toLowerCase()
          .includes(searchQuery.toLowerCase())
    );
  }, [transactions, searchQuery]);

  const handleSearch = async () => {
    setHasClicked(true);
    setIsLoading(true);

    const result = await transactionAPI.searchTransactions(
      category ? category : undefined,
      type,
      date
    );

    if (result.success) {
      setTransactions(result.transactions);
    }

    setIsLoading(false);
  };

  return (
    <div className="flex flex-col gap-y-10 flex-1 items-center relative">
      {/* Header */}
      <div className="flex items-center h-[85px]">
        <div className="font-semibold text-xl mt-8 px-5 text-[#052224]">
          Search
        </div>
        <div
          onClick={() => {
            router.back();
          }}
          className="absolute left-3 top-12"
        >
          <ArrowLeft className="text-white" />
        </div>
      </div>

      {/* Input */}
      <div className="w-full flex items-center justify-center">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search..."
          className="w-[358px] h-[34px] p-3 rounded-lg bg-[#F1FFF3] text-[#232323] focus:outline-none"
        />
      </div>

      {/* Content */}
      <Content>
        <div className="flex flex-col items-center gap-y-5">
          <div className="flex flex-col gap-y-5">
            <div className="flex flex-col gap-y-3">
              <div className="font-medium text-lg text-[#052224]">
                Categories
              </div>
              <select
                defaultValue={
                  type === "expense" ? "All Expenses" : "All Incomes"
                }
                onChange={(e) => setCategory(e.target.value)}
                className="w-[358px] h-[41px] p-2.5 rounded-[18px] bg-[#DFF7E2] focus:outline-none cursor-pointer text-[#0E3E3E]"
              >
                {type === "expense"
                  ? fullExpensesList.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))
                  : fullIncomesList.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
              </select>
            </div>
            <div className="flex flex-col gap-y-3">
              <div className="font-medium text-lg text-[#052224]">Date</div>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-[358px] h-[41px] p-2.5 rounded-[18px] bg-[#DFF7E2] focus:outline-none cursor-pointer text-[#0E3E3E]"
              />
            </div>
            <div className="flex flex-col gap-y-3">
              <div className="font-medium text-lg text-[#052224]">Report</div>
              <div className="flex gap-x-10">
                {categoryTypes.map((option) => (
                  <button
                    key={option}
                    onClick={() => {
                      setType(option);
                    }}
                    className="flex items-center cursor-pointer"
                  >
                    <div
                      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all duration-150 ${
                        type === option
                          ? "border-[#00D09E]"
                          : "border-[#00D09E]/50"
                      }`}
                    >
                      <div
                        className={`w-3 h-3 rounded-full bg-[#00D09E] transition-opacity duration-150 ${
                          type === option ? "opacity-100" : "opacity-0"
                        }`}
                      />
                    </div>
                    <span className="ml-2 text-lg font-medium text-[#052224] capitalize">
                      {option}{" "}
                    </span>
                  </button>
                ))}
              </div>
            </div>
            <div className="w-full flex items-center justify-center">
              <button
                className="w-[169px] h-9 bg-[#00D09E] hover:bg-[#00C08C] rounded-lg text-[#093030] font-medium text-lg cursor-pointer"
                disabled={isLoading}
                onClick={handleSearch}
              >
                Search
              </button>
            </div>
          </div>

          <div>
            {isLoading ? (
              <div className="w-full flex items-center justify-center">
                <div className="text-center text-[#052224] font-medium">
                  Loading...
                </div>
              </div>
            ) : (
              <>
                {filteredTransactions.length === 0 ? (
                  <div className="text-center text-[#052224] font-medium">
                    {hasClicked && "No transactions found."}
                  </div>
                ) : (
                  <div className="flex flex-col gap-y-4 max-h-[200px] overflow-y-auto">
                    {filteredTransactions.map((transaction) => (
                      <div
                        key={transaction.id}
                        className="px-3 py-2 bg-[#DFF7E2] rounded-[18px] w-[340px] h-[86px] flex items-center justify-between"
                      >
                        <div className="flex gap-x-3 items-center">
                          <div
                            className={`size-[50px] ${
                              transaction.type === "income"
                                ? "bg-[#6DB6FE]"
                                : "bg-[#3299FF]"
                            } rounded-[22px] flex items-center justify-center`}
                          >
                            <Image
                              src={transaction.categoryIcon}
                              alt={transaction.categoryName}
                              width={24}
                              height={25}
                            />
                          </div>
                          <div className="flex flex-col w-[180px]">
                            <div className="font-medium text-lg text-[#052224]">
                              {transaction.name}
                            </div>
                            <div
                              className={`font-normal text-sm text-gray-400`}
                            >
                              {new Date(transaction.date).toLocaleDateString()}
                            </div>
                          </div>
                        </div>
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
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </Content>
    </div>
  );
}
