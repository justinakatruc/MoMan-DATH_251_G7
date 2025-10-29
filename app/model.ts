export type Category = {
    id: number;
    type: "income" | "expense";
    name: string;
    icon: string;
    isDefault: boolean;
}

export type Transaction = {
  id: number;
  categoryId: number;
  type: "income" | "expense";
  name: string;
  amount: number;
  date: Date;
  description?: string;
}

export type UserType = {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  memberSince: string;
  accountType: string;
}