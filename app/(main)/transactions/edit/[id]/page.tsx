"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import { useRouter, useParams } from "next/navigation";
import Image from "next/image";
import { transactionAPI, categoryAPI } from "@/lib/api";
import { useTransactionStore } from "@/app/store/useTransactionStore";
import { Category } from "@/app/model";
import { ArrowLeft, ChevronDown, Calendar, X, Repeat, Trash2 } from "lucide-react";
import Content from "@/app/components/Content";
import { toast } from "sonner";

const RECURRING_OPTIONS = [
  { label: "Daily", value: "daily" },
  { label: "Weekly", value: "weekly" },
  { label: "Monthly", value: "monthly" },
  { label: "Yearly", value: "yearly" },
];

export type RecurringType = "daily" | "weekly" | "monthly" | "yearly";

export default function EditTransactionPage() {
  const router = useRouter();
  const { id } = useParams();
  const { transactions, fetchTransactions } = useTransactionStore();

  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Form States
  const [type, setType] = useState<"income" | "expense">("expense");
  const [categories, setCategories] = useState<{ expense: Category[]; income: Category[] }>({
    expense: [],
    income: [],
  });
  const [amount, setAmount] = useState("");
  const [name, setName] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [addToCalendar, setAddToCalendar] = useState(false);
  const [eventTime, setEventTime] = useState("12:00");
  const [recurringType, setRecurringType] = useState<RecurringType>("daily");

  const inputRef = useRef<HTMLInputElement>(null);
  // 1. Fetch Categories and Initial Transaction Data
  useEffect(() => {
    const initPage = async () => {
      try {
        // Load categories
        const [defaultRes, userRes] = await Promise.all([
          categoryAPI.getDefaultCategories(),
          categoryAPI.getUserCategories(),
        ]);
        setCategories({
          expense: [...defaultRes.categories["expense"] || [], ...userRes.categories["expense"] || []],
          income: [...defaultRes.categories["income"] || [], ...userRes.categories["income"] || []],
        });

        // Find transaction from store or fetch if needed
        const target = transactions.find((t) => t.id === id);
        if (!target) {
          await fetchTransactions();
          // We'll let the second render catch the target from store
        }
      } catch (error) {
        console.error("Initialization failed:", error);
      }
    };
    initPage();
  }, [id, fetchTransactions]);

  // 2. Populate form when transaction is found
  useEffect(() => {
    const target = transactions.find((t) => t.id === id);
    if (target) {
      setType(target.type as "income" | "expense");
      setAmount(target.amount.toString());
      setName(target.name);
      setCategoryId(target.categoryId);
      setDate(new Date(target.date).toISOString().split("T")[0]);
      setAddToCalendar(target.isRecurring || false);
      if (target.recurringPeriod) setRecurringType(target.recurringPeriod as RecurringType);
      // If your API provides 'time', set it here
    }
  }, [transactions, id]);

  const handleUpdate = async () => {
    if (!amount || !name || !categoryId) return toast.error("Please fill required fields");

    setIsLoading(true);
    try {
      await transactionAPI.updateTransaction(id as string, {
        type,
        name,
        date: new Date(date),
        amount: parseFloat(amount),
        categoryId,
        isRecurring: addToCalendar,
        recurringPeriod: addToCalendar ? recurringType : undefined,
        time: addToCalendar ? eventTime : undefined,
      });

      await fetchTransactions();
      toast.success("Transaction updated!");
      router.back();
    } catch {
      toast.error("Failed to update transaction.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      // Assuming your API lib has a delete method
      await fetch("/api/transactions", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "removeTransaction",
          transactionId: id,
          token: localStorage.getItem("token"),
        }),
      });

      await fetchTransactions();
      toast.success("Transaction deleted");
      router.push("/transactions");
    } catch {
      toast.error("Failed to delete");
    } finally {
      setIsDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  const selectedCategory = categories[type]?.find((c) => c.id === categoryId);
  const filteredCategories = useMemo(() => categories[type] || [], [categories, type]);

  return (
    <div className="flex flex-col z-40 bg-[#F1FFF3] grow">
      {(isLoading || isDeleting) && (
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-[60]">
          <div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}

      {/* HEADER */}
      <div className="pt-12 pb-8 px-6 flex items-center justify-between shrink-0 bg-[#00D09E]">
        <button onClick={() => router.back()} className="text-white cursor-pointer"><ArrowLeft /></button>
        <h1 className="text-xl font-bold text-white uppercase tracking-wider">Edit {type}</h1>
        <button onClick={() => setShowDeleteConfirm(true)} className="text-white/80 hover:text-white transition-colors cursor-pointer">
          <Trash2 className="w-6 h-6" />
        </button>
      </div>

      <Content>
        <div className="w-[380px] flex flex-col gap-y-5 h-full overflow-y-auto pt-6 px-1 pb-10">

          {/* DATE & TIME */}
          <div className="flex gap-x-3">
            <div className="flex-[2] flex flex-col gap-y-2" >
              <label className="text-[#052224] text-xs font-bold ml-1">Date</label>

              <div className="relative h-12 bg-[#DFF7E2] rounded-2xl flex items-center px-4 justify-between" onClick={() => inputRef.current?.showPicker()}>
                <span className="text-[#052224] font-bold text-sm pointer-events-none">
                  {new Date(date).toLocaleDateString("en-GB")}
                </span>

                <Calendar className="w-5 h-5 text-[#00D09E] pointer-events-none" />

                <input
                  ref={inputRef}
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
              </div>
            </div>
            {addToCalendar && (
              <div className="flex-1 flex flex-col gap-y-2 animate-in fade-in zoom-in-95">
                <label className="text-[#052224] text-xs font-bold ml-1">Time</label>
                <div className="h-12 bg-[#DFF7E2] rounded-2xl flex items-center px-4">
                  <input type="time" value={eventTime} onChange={(e) => setEventTime(e.target.value)} className="bg-transparent outline-none text-sm font-bold w-full text-[#052224] cursor-pointer" />
                </div>
              </div>
            )}
          </div>

          {/* RECURRING TOGGLE */}
          <div className={`flex flex-col gap-y-3 p-4 rounded-3xl border transition-all duration-300 ${addToCalendar ? 'bg-white border-[#00D09E] shadow-sm' : 'bg-[#DFF7E2]/30 border-transparent'}`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-xl ${addToCalendar ? 'bg-[#00D09E] text-white' : 'bg-[#DFF7E2] text-[#00D09E]'}`}>
                  <Repeat className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm font-bold text-[#052224]">Recurring Event</p>
                  <p className="text-[10px] text-[#052224]/60">Change your scheduler settings</p>
                </div>
              </div>
              <input type="checkbox" checked={addToCalendar} onChange={(e) => setAddToCalendar(e.target.checked)} className="w-6 h-6 accent-[#00D09E] cursor-pointer" />
            </div>
            {addToCalendar && (
              <div className="flex flex-wrap gap-2 pt-2 animate-in slide-in-from-top-1">
                {RECURRING_OPTIONS.map((opt) => (
                  <button key={opt.value} onClick={() => setRecurringType(opt.value as RecurringType)} className={`px-3 py-1.5 rounded-full text-[11px] font-bold transition-all cursor-pointer ${recurringType === opt.value ? 'bg-[#00D09E] text-white' : 'bg-[#F1FFF3] text-[#00D09E] border border-[#00D09E]/20'}`}>{opt.label}</button>
                ))}
              </div>
            )}
          </div>

          {/* CATEGORY, AMOUNT, TITLE */}
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
              <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} className="w-full bg-transparent outline-none font-bold text-sm text-[#052224]" />
            </div>
          </div>

          <div className="flex flex-col gap-y-2">
            <label className="text-xs font-bold ml-1 text-[#052224]">Title</label>
            <div className="h-12 bg-[#DFF7E2] rounded-2xl flex items-center px-4 focus-within:ring-1 ring-[#00D09E]">
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full bg-transparent outline-none font-bold text-sm text-[#052224]" />
            </div>
          </div>

          <button
            onClick={handleUpdate}
            disabled={isLoading}
            className={`h-14 w-full text-white font-bold text-lg rounded-2xl shadow-lg mt-6 transition-all active:scale-95 cursor-pointer ${isLoading ? "bg-gray-400" : "bg-[#00D09E] hover:bg-[#2680db]"}`}
          >
            {isLoading ? "Updating..." : "Save Changes"}
          </button>
        </div>
      </Content>

      {/* DELETE MODAL */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/40 backdrop-blur-sm">
          <div className="bg-white w-full max-w-sm rounded-[35px] p-8 text-center shadow-2xl animate-in zoom-in duration-200">
            <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <Trash2 className="w-8 h-8 text-red-500" />
            </div>
            <h3 className="text-xl font-bold text-[#052224] mb-2">Delete Transaction?</h3>
            <p className="text-gray-500 text-sm mb-8 px-4">This will permanently remove the record and update your balance.</p>
            <div className="flex gap-3">
              <button onClick={() => setShowDeleteConfirm(false)} className="flex-1 py-4 bg-gray-100 rounded-2xl font-bold text-gray-500 cursor-pointer">Cancel</button>
              <button onClick={handleDelete} className="flex-1 py-4 bg-red-500 text-white rounded-2xl font-bold cursor-pointer">Delete</button>
            </div>
          </div>
        </div>
      )}

      {/* CATEGORY PICKER (Same as your Add page) */}
      <div className={`fixed inset-0 bg-black/40 z-50 transition-opacity duration-300 ${isCategoryOpen ? "opacity-100" : "opacity-0 pointer-events-none"}`} onClick={() => setIsCategoryOpen(false)} />
      <div className={`fixed inset-x-0 bottom-0 z-50 bg-[#F1FFF3] rounded-t-[30px] transition-transform duration-300 h-[65vh] flex flex-col max-w-[430px] mx-auto ${isCategoryOpen ? "translate-y-0" : "translate-y-full"}`}>
        <div className="flex justify-between items-center p-6 border-b border-[#00D09E]/10">
          <h3 className="text-xl font-bold text-[#052224]">Select Category</h3>
          <button onClick={() => setIsCategoryOpen(false)} className="p-2 bg-[#DFF7E2] rounded-full"><X className="w-5 h-5 text-[#052224]" /></button>
        </div>
        <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3">
          {filteredCategories.map((cat) => (
            <button key={cat.id} onClick={() => { setCategoryId(cat.id); setIsCategoryOpen(false); }} className={`h-16 w-full rounded-2xl flex items-center px-4 border-2 transition-all ${categoryId === cat.id ? "bg-white border-[#00D09E]" : "bg-white border-transparent"}`}>
              <div className="w-10 h-10 rounded-full bg-[#F5F5F5] flex items-center justify-center mr-4">
                {cat.icon && <Image src={cat.icon} alt="" width={24} height={24} />}
              </div>
              <span className="font-bold text-sm text-[#052224]">{cat.name}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}