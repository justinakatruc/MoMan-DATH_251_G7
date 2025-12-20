"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { transactionAPI, categoryAPI } from "@/lib/api";
import { useTransactionStore } from "@/app/store/useTransactionStore";
import { Category } from "@/app/model";
import { ArrowLeft, ChevronDown, Calendar, X, Repeat } from "lucide-react";
import Content from "@/app/components/Content";
import { toast } from "sonner";
import { calculateNextDate } from "@/lib/utils";

// Định nghĩa các kiểu định kỳ
const RECURRING_OPTIONS = [
  { label: "Daily", value: "daily" },
  { label: "Weekly", value: "weekly" },
  { label: "Monthly", value: "monthly" },
  { label: "Yearly", value: "yearly" },
];

export type RecurringType = "daily" | "weekly" | "monthly" | "yearly";

export default function AddTransactionPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { fetchTransactions } = useTransactionStore();

  const [isLoading, setIsLoading] = useState(false);
  const type = searchParams.get("type") === "income" ? "income" : "expense";

  // State cơ bản
  const [categories, setCategories] = useState<{ expense: Category[]; income: Category[] }>({
    expense: [],
    income: [],
  });
  const [amount, setAmount] = useState("");
  const [name, setName] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);

  // LOGIC MỚI: Event & Recurring
  const [addToCalendar, setAddToCalendar] = useState(false);
  const [eventTime, setEventTime] = useState("12:00");
  const [recurringType, setRecurringType] = useState<RecurringType>("daily"); // daily, weekly, monthly, yearly

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const [defaultRes, userRes] = await Promise.all([
          categoryAPI.getDefaultCategories(),
          categoryAPI.getUserCategories(),
        ]);
        setCategories({
          expense: [...defaultRes.categories["expense"] || [], ...userRes.categories["expense"] || []],
          income: [...defaultRes.categories["income"] || [], ...userRes.categories["income"] || []],
        });
      } catch (error) {
        console.error("Failed to load categories:", error);
      }
    };
    loadCategories();
  }, []);

  const handleSubmit = async () => {
    if (!amount || !name || !categoryId) return toast.error("Please fill required fields");

    setIsLoading(true);
    try {
      // Treat the event as a transaction with extra attributes
      await transactionAPI.addTransaction({
        type,
        name,
        date: new Date(date).toISOString(),
        amount: parseFloat(amount),
        categoryId,
        // Add these attributes to the transaction object
        isRecurring: addToCalendar,
        recurringPeriod: addToCalendar ? recurringType : undefined,
        time: addToCalendar ? eventTime : undefined,
        nextExecutionDate: addToCalendar ? calculateNextDate(new Date(date), recurringType).toISOString() : undefined,
      });

      await fetchTransactions();
      toast.success("Transaction saved successfully!");
      router.back();
    } catch (e) {
      console.error(e);
      toast.error("An error occurred while saving.");
    } finally {
      setIsLoading(false);
    }
  };

  const selectedCategory = categories[type]?.find((c) => c.id === categoryId);
  const filteredCategories = useMemo(() => categories[type] || [], [categories, type]);

  return (
    <div className="flex flex-col z-40 bg-[#F1FFF3] grow">
      {isLoading && (
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}

      {/* HEADER */}
      <div className="pt-12 pb-8 px-6 flex items-center justify-between shrink-0 bg-[#00D09E]">
        <button onClick={() => router.back()} className="text-white"><ArrowLeft /></button>
        <h1 className="text-xl font-bold text-white uppercase tracking-wider">Add {type}</h1>
        <div className="w-6"></div>
      </div>

      <Content>
        <div className="w-[380px] flex flex-col gap-y-5 h-full overflow-y-auto pt-6 px-1 pb-10">

          {/* DATE & TIME ROW */}
          <div className="flex gap-x-3">
            <div className="flex-[2] flex flex-col gap-y-2">
              <label className="text-[#052224] text-xs font-bold ml-1">Date</label>
              <div className="relative h-12 bg-[#DFF7E2] rounded-2xl flex items-center px-4 justify-between" onClick={() => inputRef.current?.showPicker()}>
                <span className="text-[#052224] font-bold text-sm">
                  {new Date(date).toLocaleDateString("en-GB")}
                </span>
                <Calendar className="w-5 h-5 text-[#00D09E]" />
                <input ref={inputRef} type="date" value={date} onChange={(e) => setDate(e.target.value)} className="absolute inset-0 opacity-0 cursor-pointer" />
              </div>
            </div>

            {addToCalendar && (
              <div className="flex-1 flex flex-col gap-y-2 animate-in fade-in zoom-in-95">
                <label className="text-[#052224] text-xs font-bold ml-1">Time</label>
                <div className="h-12 bg-[#DFF7E2] rounded-2xl flex items-center px-4">
                  <input type="time" value={eventTime} onChange={(e) => setEventTime(e.target.value)} className="bg-transparent outline-none text-sm font-bold w-full text-[#052224]" />
                </div>
              </div>
            )}
          </div>

          {/* TOGGLE ADD TO CALENDAR */}
          <div className={`flex flex-col gap-y-3 p-4 rounded-3xl border transition-all duration-300 ${addToCalendar ? 'bg-white border-[#00D09E] shadow-sm' : 'bg-[#DFF7E2]/30 border-transparent'}`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-xl ${addToCalendar ? 'bg-[#00D09E] text-white' : 'bg-[#DFF7E2] text-[#00D09E]'}`}>
                  <Repeat className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm font-bold text-[#052224]">Recurring Event</p>
                  <p className="text-[10px] text-[#052224]/60">Add this to your scheduler</p>
                </div>
              </div>
              <input
                type="checkbox"
                checked={addToCalendar}
                onChange={(e) => setAddToCalendar(e.target.checked)}
                className="w-6 h-6 accent-[#00D09E] cursor-pointer"
              />
            </div>

            {/* ĐỊNH KỲ OPTIONS */}
            {addToCalendar && (
              <div className="flex flex-wrap gap-2 pt-2 animate-in slide-in-from-top-1">
                {RECURRING_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => setRecurringType(opt.value as RecurringType)}
                    className={`px-3 py-1.5 rounded-full text-[11px] font-bold transition-all ${recurringType === opt.value
                      ? 'bg-[#00D09E] text-white'
                      : 'bg-[#F1FFF3] text-[#00D09E] border border-[#00D09E]/20'
                      }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* CATEGORY & AMOUNT (Giữ nguyên) */}
          <div className="flex flex-col gap-y-2">
            <label className="text-xs font-bold ml-1 text-[#052224]">Category</label>
            <div onClick={() => setIsCategoryOpen(true)} className="h-12 bg-[#DFF7E2] rounded-2xl flex items-center px-4 justify-between cursor-pointer active:scale-95 transition-transform">
              {selectedCategory ? (
                <div className="flex items-center gap-2">
                  {selectedCategory.icon && <Image src={selectedCategory.icon} alt="" width={20} height={20} />}
                  <span className="font-bold text-sm text-[#052224]">{selectedCategory.name}</span>
                </div>
              ) : <span className="text-[#052224]/50 text-sm font-medium">Select category</span>}
              <ChevronDown className="w-5 h-5 text-[#00D09E]" />
            </div>
          </div>

          <div className="flex flex-col gap-y-2">
            <label className="text-xs font-bold ml-1 text-[#052224]">Amount</label>
            <div className="h-12 bg-[#DFF7E2] rounded-2xl flex items-center px-4 focus-within:ring-1 ring-[#00D09E]">
              <span className="font-bold mr-1 text-[#052224]">$</span>
              <input type="number" placeholder="0.00" value={amount} onChange={(e) => setAmount(e.target.value)} className="w-full bg-transparent outline-none font-bold text-sm text-[#052224]" />
            </div>
          </div>

          <div className="flex flex-col gap-y-2">
            <label className="text-xs font-bold ml-1 text-[#052224]">Title</label>
            <div className="h-12 bg-[#DFF7E2] rounded-2xl flex items-center px-4 focus-within:ring-1 ring-[#00D09E]">
              <input type="text" placeholder="What is this for?" value={name} onChange={(e) => setName(e.target.value)} className="w-full bg-transparent outline-none font-bold text-sm text-[#052224]" />
            </div>
          </div>

          {/* BUTTON SAVE */}
          <button
            onClick={handleSubmit}
            disabled={isLoading}
            className={`h-14 w-full text-white font-bold text-lg rounded-2xl shadow-lg mt-6 transition-all active:scale-95 ${isLoading ? "bg-gray-400" : "bg-[#00D09E] hover:bg-[#00b58a]"}`}
          >
            {isLoading ? "Saving..." : `Confirm ${type}`}
          </button>
        </div>
      </Content>

      {/* SLIDE UP CATEGORY */}
      <div
        className={`fixed inset-0 bg-black/40 z-50 transition-opacity duration-300 ${isCategoryOpen
          ? "opacity-100 pointer-events-auto"
          : "opacity-0 pointer-events-none"
          }`}
        onClick={() => setIsCategoryOpen(false)}
      />
      <div
        className={`fixed inset-x-0 bottom-0 z-50 bg-[#F1FFF3] rounded-t-[30px] shadow-[0_-5px_40px_rgba(0,0,0,0.2)] transition-transform duration-300 ease-out h-[65vh] flex flex-col max-w-[430px] mx-auto ${isCategoryOpen ? "translate-y-0" : "translate-y-full"
          }`}
      >
        <div className="flex justify-between items-center p-6 border-b border-[#00D09E]/10 shrink-0">
          <h3 className="text-xl font-bold text-[#052224]">
            Select {type} Category
          </h3>
          <button
            onClick={() => setIsCategoryOpen(false)}
            className="p-2 bg-[#DFF7E2] rounded-full cursor-pointer"
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
              className={`h-16 w-full rounded-2xl flex items-center justify-between px-4 transition-all shrink-0 border-2 active:scale-[0.98] cursor-pointer ${categoryId === cat.id
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