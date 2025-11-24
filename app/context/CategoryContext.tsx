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
import { categoryAPI, transactionAPI } from "@/lib/api";
import { toast } from "sonner";
import { useTransactionStore } from "../store/useTransactionStore";
interface CategoryContextType {
  userExpenseCategories: Category[];
  userIncomeCategories: Category[];
  transactions: Transaction[];
  addCategory: (category: Category) => Promise<boolean>;
  removeCategory: (
    categoryId: string,
    type: "expense" | "income",
    isDefault: boolean
  ) => void;
  addTransaction: (transaction: Transaction) => void;
  removeTransaction: (transactionId: string) => void;
  updateTransaction: (
    transactionId: string,
    updated: Partial<Transaction>
  ) => void;
  getTransactionsByCategory: (categoryId: string) => Transaction[];
}

const CategoryContext = createContext<CategoryContextType | undefined>(
  undefined
);

export function CategoryProvider({ children }: { children: ReactNode }) {
  const { expensesCategory, incomesCategory, fetchCategories } =
    useCategoryStore();
  const { fetchTransactions } = useTransactionStore();
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
    type: "expense" | "income",
    isDefault: boolean = false
  ) => {
    try {
      const result = await categoryAPI.removeCategory(
        categoryId,
        type,
        isDefault
      );
      if (result.success) {
        await fetchCategories();
        if (!isDefault) {
          await transactionAPI.removeTransactionBaseOnCategory(categoryId);
          setTransactions((prev) =>
            prev.filter((transaction) => transaction.categoryId !== categoryId)
          );
          toast.success("Category removed successfully!");
        }
      }
    } catch (error) {
      console.error("Error removing category:", error);
      toast.error("Failed to remove category.");
    }
  };

  const addTransaction = async (transaction: Transaction) => {
    try {
      const result = await transactionAPI.addTransaction({
        type: transaction.type,
        date: new Date(transaction.date).toISOString(),
        name: transaction.name,
        amount: transaction.amount,
        description: transaction.description,
        categoryId: transaction.categoryId,
      });

      if (result.success) {
        toast.success("Transaction added successfully!");
        await fetchTransactions();
        setTransactions((prev) => [...prev, transaction]);
      } else {
        toast.error("Failed to add transaction.");
      }
    } catch (error) {
      console.error("Error adding transaction:", error);
      toast.error("Failed to add transaction.");
    }
  };

  const removeTransaction = async (transactionId: string) => {
    try {
      const result = await transactionAPI.removeTransaction(transactionId);

      if (result.success) {
        await fetchTransactions();
        setTransactions((prev) => prev.filter((t) => t.id !== transactionId));
      }
    } catch (error) {
      console.error("Error removing transaction:", error);
    }
  };

  async function updateTransaction(
    transactionId: string,
    updated: Partial<Transaction>
  ) {
    try {
      const result = await transactionAPI.updateTransaction(
        transactionId,
        updated
      );

      if (result.success) {
        await fetchTransactions();
        setTransactions((prev) =>
          prev.map((tx) =>
            tx.id === transactionId ? { ...tx, ...updated } : tx
          )
        );
      }
    } catch (error) {
      console.error("Error updating transaction:", error);
    }
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
