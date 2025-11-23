import { transactionAPI } from "@/lib/api";
import { create } from "zustand";
import { TransactionAPIResponse } from "../model";

interface TransactionState {
  transactions: TransactionAPIResponse[];
  isLoading: boolean;

  fetchTransactions: () => Promise<void>;
}

export const useTransactionStore = create<TransactionState>((set) => ({
  transactions: [],
  isLoading: false,

  fetchTransactions: async () => {
    set({ isLoading: true });

    try {
      const result = await transactionAPI.getAllTransactions();
      if (result.success) {
        set({ transactions: result.transactions, isLoading: false });
      }
    } catch (error) {
      console.error("Error fetching transactions:", error);
      set({ isLoading: false });
    }
  },
}));
