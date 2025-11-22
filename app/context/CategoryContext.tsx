// app/context/CategoryContext.tsx
"use client";
import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { Category, Transaction } from "@/app/model";
import { useCategoryStore } from "../store/useCategoryStore";
import { categoryAPI } from "@/lib/api";
import { toast } from "sonner";
interface CategoryContextType {
  userExpenseCategories: Category[];
  userIncomeCategories: Category[];
  transactions: Transaction[];
  addCategory: (category: Category) => Promise<boolean>;
  removeCategory: (categoryId: string, type: "expense" | "income") => void;
  addTransaction: (transaction: Transaction) => void;
  removeTransaction: (transactionId: number) => void;
  updateTransaction: (id: number, updated: Partial<Transaction>) => void;
  getTransactionsByCategory: (categoryId: string) => Transaction[];
}

const CategoryContext = createContext<CategoryContextType | undefined>(
  undefined
);

export function CategoryProvider({ children }: { children: ReactNode }) {
  const { expensesCategory, incomesCategory, fetchCategories } =
    useCategoryStore();
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  useEffect(() => {
    const storedTransactions = localStorage.getItem("transactions");

    if (storedTransactions) {
      const parsed = JSON.parse(storedTransactions);
      const fixed = (parsed as Transaction[]).map((transaction) => ({
        ...transaction,
        date: new Date(transaction.date),
      }));
      setTransactions(fixed);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("transactions", JSON.stringify(transactions));
  }, [transactions]);

  const addCategory = async (category: Category) => {
    try {
      const result = await categoryAPI.addCategory({
        type: category.type,
        name: category.name,
        icon: category.icon,
        isDefault: category.isDefault,
      });

      if (!result.success) {
        if (result.status === 400) {
          toast.error("Category already exists.");
        } else {
          toast.error("Failed to add category.");
        }
        return false;
      }

      if (result.success) {
        toast.success("Category added successfully!");
        await fetchCategories();
        return true;
      } else {
        toast.error("Failed to add category.");
        return false;
      }
    } catch (error) {
      console.error("Error adding category:", error);
      return false;
    }
  };

  const removeCategory = async (
    categoryId: string,
    type: "expense" | "income"
  ) => {
    try {
      const result = await categoryAPI.removeCategory(categoryId, type);

      if (result.success) {
        await fetchCategories();

        setTransactions((prev) =>
          prev.filter((transaction) => transaction.categoryId !== categoryId)
        );

        toast.success("Category removed successfully!");
      }
    } catch (error) {
      console.error("Error removing category:", error);
      toast.error("Failed to remove category.");
    }
  };

  const addTransaction = (transaction: Transaction) => {
    setTransactions((prev) => [...prev, transaction]);
  };

  const removeTransaction = (transactionId: number) => {
    setTransactions((prev) => prev.filter((t) => t.id !== transactionId));
  };

  function updateTransaction(id: number, updated: Partial<Transaction>) {
    setTransactions((prev) =>
      prev.map((tx) => (tx.id === id ? { ...tx, ...updated } : tx))
    );
  }

  const getTransactionsByCategory = (categoryId: string) => {
    return transactions.filter((t) => t.categoryId === categoryId);
  };

  return (
    <CategoryContext.Provider
      value={{
        userExpenseCategories: expensesCategory,
        userIncomeCategories: incomesCategory,
        transactions,
        addCategory,
        removeCategory,
        addTransaction,
        removeTransaction,
        updateTransaction,
        getTransactionsByCategory,
      }}
    >
      {children}
    </CategoryContext.Provider>
  );
}

export function useCategories() {
  const context = useContext(CategoryContext);
  if (context === undefined) {
    throw new Error("useCategories must be used within a CategoryProvider");
  }
  return context;
}
