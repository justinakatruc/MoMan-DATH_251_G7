export type Category = {
  id: string;
  type: "income" | "expense";
  name: string;
  icon: string;
  isDefault: boolean;
};

export type Transaction = {
  id: number;
  categoryId: string;
  type: "income" | "expense";
  name: string;
  amount: number;
  date: Date;
  description?: string;
};

export type EventType = {
  date: Date;
  title: string;
  time: string;
};

export type User = {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  memberSince: string;
  accountType: string;
};
