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
  description?: string;
};

export type EventType = {
  id: string;
  date: Date;
  title: string;
  time: string;
  isRecurring: boolean;
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
  type: string;
  name: string;
  amount: number;
  date: string;
  description: string;
  categoryName: string;
  categoryIcon: string;
};
