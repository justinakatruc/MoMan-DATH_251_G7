export type Category = {
  id: string;
  type: "income" | "expense";
  name: string;
  icon: string;
  isDefault: boolean;
};

export type Transaction = {
  id: string;
  categoryId: string;
  type: "income" | "expense";
  name: string;
  amount: number;
  date: Date;
  isRecurring: boolean;
  recurringPeriod?: "daily" | "weekly" | "monthly" | "yearly";
  time?: string;
  nextExecutionDate?: string;
};

export type User = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  memberSince: string;
  accountType: string;
};

export type TransactionAPIResponse = {
  id: string;
  type: string;
  name: string;
  amount: number;
  date: string;
  categoryId: string;
  categoryName: string;
  categoryIcon: string;
  isRecurring: boolean;
  recurringPeriod?: string;
  time?: string;
  nextExecutionDate?: string;
};
