import { Category } from "@/app/model";

export const expenseCategories: Category[] = [
    { id: 1, type: "expense", name: "Food & Drink", icon: "/food&drink.png", isDefault: true },
    { id: 2, type: "expense", name: "Entertainment", icon: "/entertainment.png", isDefault: true },
    { id: 3, type: "expense", name: "Shopping", icon: "/shopping.png", isDefault: true  },
    { id: 4, type: "expense", name: "Transportation", icon: "/transport.png", isDefault: true },
    { id: 5, type: "expense", name: "Housing", icon: "/housing.png", isDefault: true },
    { id: 6, type: "expense", name: "Utilities", icon: "/utilities.png", isDefault: true },
]

export const incomeCategories: Category[] = [
    { id: 7, type: "income", name: "Salary", icon: "/salary.png", isDefault: true },
    { id: 8, type: "income", name: "Stock", icon: "/stock.png", isDefault: true },
    { id: 9, type: "income", name: "Savings", icon: "/savings.png", isDefault: true },
]