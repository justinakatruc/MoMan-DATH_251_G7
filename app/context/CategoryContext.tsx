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
import { expenseCategories, incomeCategories } from "@/app/(main)/store/CategoryStore";

interface CategoryContextType {
  userExpenseCategories: Category[];
  userIncomeCategories: Category[];
  transactions: Transaction[];
  addCategory: (category: Category) => boolean;
  removeCategory: (categoryId: number, type: "expense" | "income") => void;
  addTransaction: (transaction: Transaction) => void;
  removeTransaction: (transactionId: number) => void;
  updateTransaction: (id: number, updated: Partial<Transaction>) => void;
  getTransactionsByCategory: (categoryId: number) => Transaction[];
}

const CategoryContext = createContext<CategoryContextType | undefined>(
  undefined
);

export function CategoryProvider({ children }: { children: ReactNode }) {
  const [userExpenseCategories, setUserExpenseCategories] =
    useState<Category[]>(expenseCategories);
  const [userIncomeCategories, setUserIncomeCategories] =
    useState<Category[]>(incomeCategories);
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  useEffect(() => {
    const storedExpense = localStorage.getItem("userExpenseCategories");
    const storedIncome = localStorage.getItem("userIncomeCategories");
    const storedTransactions = localStorage.getItem("transactions");

    if (storedExpense) setUserExpenseCategories(JSON.parse(storedExpense));
    if (storedIncome) setUserIncomeCategories(JSON.parse(storedIncome));
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
    localStorage.setItem(
      "userExpenseCategories",
      JSON.stringify(userExpenseCategories)
    );
  }, [userExpenseCategories]);

  useEffect(() => {
    localStorage.setItem(
      "userIncomeCategories",
      JSON.stringify(userIncomeCategories)
    );
  }, [userIncomeCategories]);

  useEffect(() => {
    localStorage.setItem("transactions", JSON.stringify(transactions));
  }, [transactions]);

  const addCategory = (category: Category) => {
    const exist = [...userExpenseCategories, ...userIncomeCategories].some(
      (cat) =>
        cat.name.trim().toLowerCase() === category.name.trim().toLowerCase()
    );
    if (exist) {
      return false;
    }
    if (category.type === "expense") {
      const exist = userExpenseCategories.some((cat) => cat.id === category.id);
      if (!exist) {
        setUserExpenseCategories([...userExpenseCategories, category]);
        return true;
      }
    } else {
      const exist = userIncomeCategories.some((cat) => cat.id === category.id);
      if (!exist) {
        setUserIncomeCategories([...userIncomeCategories, category]);
        return true;
      }
    }
    return true;
  };

  const removeCategory = (categoryId: number, type: "expense" | "income") => {
    setTransactions((prev) =>
      prev.filter((transaction) => transaction.categoryId !== categoryId)
    );

    if (type === "expense") {
      setUserExpenseCategories((prev) =>
        prev.filter((cat) => cat.id !== categoryId || cat.isDefault)
      );
    } else {
      setUserIncomeCategories((prev) =>
        prev.filter((cat) => cat.id !== categoryId || cat.isDefault)
      );
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

  const getTransactionsByCategory = (categoryId: number) => {
    return transactions.filter((t) => t.categoryId === categoryId);
  };

  return (
    <CategoryContext.Provider
      value={{
        userExpenseCategories,
        userIncomeCategories,
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
