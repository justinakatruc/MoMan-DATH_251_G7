import { create } from "zustand";
import { Category } from "@/app/model";
import { categoryAPI } from "@/lib/api";

interface CategoryState {
  expensesCategory: Category[];
  incomesCategory: Category[];
  isLoading: boolean;

  fetchCategories: () => Promise<void>;
  addCategory: (category: Category) => Promise<void>;
  removeCategory: (categoryId: string, type: "expense" | "income", isDefault?: boolean) => Promise<void>;
}

export const useCategoryStore = create<CategoryState>((set, get) => ({
  expensesCategory: [],
  incomesCategory: [],
  isLoading: false,

  fetchCategories: async () => {
    set({ isLoading: true });

    try {
      const [defaultResult, userResult] = await Promise.all([
        categoryAPI.getDefaultCategories(),
        categoryAPI.getUserCategories(),
      ]);

      let finalExpenses = defaultResult.categories.expense || [];
      let finalIncomes = defaultResult.categories.income || [];

      if (userResult.success) {
        finalExpenses = finalExpenses.concat(userResult.categories.expense);
        finalIncomes = finalIncomes.concat(userResult.categories.income);
      }

      set({
        expensesCategory: finalExpenses,
        incomesCategory: finalIncomes,
        isLoading: false,
      });
    } catch (error) {
      console.error("Error fetching categories:", error);
      set({ isLoading: false });
    }
  },

  addCategory: async (category: Category) => {
    await categoryAPI.addCategory(category);
    await get().fetchCategories();
  },

  removeCategory: async (categoryId: string, type: "expense" | "income", isDefault: boolean = false) => {
    await categoryAPI.removeCategory(categoryId, type, isDefault);
    await get().fetchCategories();
  },
}));
