"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { transactionAPI, categoryAPI } from "@/lib/api";
import { useTransactionStore } from "@/app/store/useTransactionStore";
import { Category } from "@/app/model";
import { ArrowLeft, ChevronDown, Calendar, X } from "lucide-react";
import Content from "@/app/components/Content";

export default function AddTransactionPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { fetchTransactions } = useTransactionStore();

  const [isLoading, setIsLoading] = useState(false);

  const type = searchParams.get("type") === "income" ? "income" : "expense";

  const [categories, setCategories] = useState<{
    expense: Category[];
    income: Category[];
  }>({
    expense: [],
    income: [],
  });

  const [amount, setAmount] = useState("");
  const [name, setName] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [description, setDescription] = useState("");
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const [defaultRes, userRes] = await Promise.all([
          categoryAPI.getDefaultCategories(),
          categoryAPI.getUserCategories(),
        ]);

        const safeExtract = (
          data: { categories?: { [key: string]: Category[] } },
          key: string
        ): Category[] => {
          return Array.isArray(data?.categories?.[key])
            ? data.categories[key]
            : [];
        };

        setCategories({
          expense: [
            ...safeExtract(defaultRes, "expense"),
            ...safeExtract(userRes, "expense"),
          ],
          income: [
            ...safeExtract(defaultRes, "income"),
            ...safeExtract(userRes, "income"),
          ],
        });
      } catch (error) {
        console.error("Failed to load categories:", error);
      }
    };

    loadCategories();
  }, []);

  useEffect(() => {
    setCategoryId("");
  }, [type]);

  const handleSubmit = async () => {
    if (!amount || !name || !categoryId)
      return alert("Please fill required fields");
    setIsLoading(true);
    try {
      await transactionAPI.addTransaction({
        type,
        date,
        name,
        amount: parseFloat(amount),
        categoryId,
        description,
      });
      await fetchTransactions();
      router.back();
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const formattedDate = new Date(date).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  const selectedCategory = categories[type]?.find((c) => c.id === categoryId);
  const filteredCategories = useMemo(
    () => categories[type] || [],
    [categories, type]
  );

  return (
    <div className="w-screen h-screen flex flex-col z-40 bg-[#F1FFF3]">
      {isLoading && (
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
            <p className="text-white mt-4 font-bold">Loading...</p>
          </div>
        </div>
      )}

      {/* HEADER */}
      <div className="pt-14 pb-8 px-6 flex items-center justify-between shrink-0 bg-[#00D09E]">
        <button onClick={() => router.back()} className="text-white">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <div className="flex flex-col items-center">
          <h1 className="text-xl font-bold text-white tracking-wide">
            Add {type === "expense" ? "Expense" : "Income"}
          </h1>
        </div>
        <div></div>
      </div>

      {/* CONTENT */}
      <Content>
        <div className="flex flex-col gap-y-6 w-full h-full overflow-y-auto pt-6 pb-32 px-1">
          <div className="flex flex-col gap-y-2">
            <label className="text-[#052224] text-xs font-bold ml-1">
              Date
            </label>
            <div className="relative h-12 bg-[#DFF7E2] rounded-2xl flex items-center px-4 justify-between group active:scale-[0.99] transition-transform">
              <span className="text-[#052224] font-bold text-sm pointer-events-none">
                {formattedDate}
              </span>
              <Calendar className="w-5 h-5 text-[#00D09E] pointer-events-none" />
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
              />
            </div>
          </div>

          {/* CATEGORY SELECTOR */}
          <div className="flex flex-col gap-y-2">
            <label className="text-[#052224] text-xs font-bold ml-1">
              Category
            </label>
            <div
              onClick={() => setIsCategoryOpen(true)}
              className="relative h-12 bg-[#DFF7E2] rounded-2xl flex items-center px-4 justify-between cursor-pointer active:scale-[0.99] transition-transform"
            >
              {selectedCategory ? (
                <div className="flex items-center gap-2">
                  {selectedCategory.icon && (
                    <Image
                      src={selectedCategory.icon}
                      alt={selectedCategory.name}
                      width={24}
                      height={24}
                    />
                  )}
                  <span className="text-[#052224] font-bold text-sm">
                    {selectedCategory.name}
                  </span>
                </div>
              ) : (
                <span className="text-[#052224]/50 font-medium text-sm">
                  Select the category
                </span>
              )}
              <ChevronDown className="w-5 h-5 text-[#00D09E]" />
            </div>
          </div>

          {/* AMOUNT INPUT */}
          <div className="flex flex-col gap-y-2">
            <label className="text-[#052224] text-xs font-bold ml-1">
              Amount
            </label>
            <div className="h-12 bg-[#DFF7E2] rounded-2xl flex items-center px-4">
              <span className="text-[#052224] font-bold mr-1 text-sm">$</span>
              <input
                type="number"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full h-full bg-transparent outline-none text-[#052224] font-bold text-sm"
              />
            </div>
          </div>

          {/* TITLE INPUT */}
          <div className="flex flex-col gap-y-2">
            <label className="text-[#052224] text-xs font-bold ml-1">
              {type === "expense" ? "Expense Title" : "Income Title"}
            </label>
            <div className="h-12 bg-[#DFF7E2] rounded-2xl flex items-center px-4">
              <input
                type="text"
                placeholder={type === "expense" ? "Dinner" : "Freelance"}
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full h-full bg-transparent outline-none text-[#052224] font-bold text-sm"
              />
            </div>
          </div>

          {/* MESSAGE INPUT */}
          <div className="flex flex-col gap-y-2 flex-1 min-h-[150px]">
            <label className="text-[#052224] text-xs font-bold ml-1">
              Enter Message:
            </label>
            <div className="h-40 bg-[#E8F5E9] rounded-[20px] p-5">
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder={`Enter Message:\n• Repeated event?\n• Cycle?\n• Time?\n• Recurring?\n• AI generated`}
                className="w-full h-full bg-transparent outline-none text-[#00D09E] placeholder:text-[#00D09E]/50 text-sm font-medium resize-none"
              />
            </div>
          </div>

          {/* SAVE BUTTON */}
          <button
            onClick={handleSubmit}
            disabled={isLoading}
            className={`h-12 w-[180px] self-center text-white font-bold text-lg rounded-[20px] shadow-lg transition-all shrink-0 ${
              isLoading ? "bg-[#00D09E]/70" : "bg-[#00D09E] hover:bg-[#00b58a]"
            }`}
          >
            {isLoading ? "Saving..." : "Save"}
          </button>
        </div>
      </Content>

      {/* SLIDE UP CATEGORY */}
      <div
        className={`fixed inset-0 bg-black/40 z-50 transition-opacity duration-300 ${
          isCategoryOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setIsCategoryOpen(false)}
      />
      <div
        className={`fixed inset-x-0 bottom-0 z-50 bg-[#F1FFF3] rounded-t-[30px] shadow-[0_-5px_40px_rgba(0,0,0,0.2)] transition-transform duration-300 ease-out h-[65vh] flex flex-col max-w-[430px] mx-auto ${
          isCategoryOpen ? "translate-y-0" : "translate-y-full"
        }`}
      >
        <div className="flex justify-between items-center p-6 border-b border-[#00D09E]/10 shrink-0">
          <h3 className="text-xl font-bold text-[#052224]">
            Select {type} Category
          </h3>
          <button
            onClick={() => setIsCategoryOpen(false)}
            className="p-2 bg-[#DFF7E2] rounded-full"
          >
            <X className="w-5 h-5 text-[#052224]" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3">
          {filteredCategories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => {
                setCategoryId(cat.id);
                setIsCategoryOpen(false);
              }}
              className={`h-16 w-full rounded-2xl flex items-center justify-between px-4 transition-all shrink-0 border-2 active:scale-[0.98] ${
                categoryId === cat.id
                  ? "bg-white border-[#00D09E]"
                  : "bg-white border-transparent"
              }`}
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-[#F5F5F5] flex items-center justify-center">
                  {cat.icon && (
                    <Image
                      src={cat.icon}
                      alt={cat.name}
                      width={24}
                      height={24}
                    />
                  )}
                </div>
                <span className="font-bold text-sm text-[#052224]">
                  {cat.name}
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
