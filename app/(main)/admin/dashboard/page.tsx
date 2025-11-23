"use client";

import { adminAPI } from "@/lib/api";
import { Users, Activity, Layers, TrendingUp } from "lucide-react";
import { useEffect, useState } from "react";

type UserReturn = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  accountType: string;
  isActive: boolean;
  transactions: number;
};

type TransactionReturn = {
  id: string;
  userId: string;
  date: string;
  type: string;
  categoryId: string;
  amount: string;
  description: string;
  firstName: string;
  lastName: string;
  category: string;
};

export default function DashboardPage() {
  const [itemsList, setItemsList] = useState<
    { title: string; value: number; icon: string }[]
  >([
    {
      title: "Total Users",
      value: 0,
      icon: "users",
    },
    {
      title: "Total Transactions",
      value: 0,
      icon: "transactions",
    },
    {
      title: "Revenue",
      value: 0,
      icon: "revenue",
    },
    {
      title: "Active Users",
      value: 0,
      icon: "activeUsers",
    },
  ]);

  const [recentUsers, setRecentUsers] = useState<UserReturn[]>([]);
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalTransactions, setTotalTransactions] = useState(0);
  const [totalBaseCategories, setTotalBaseCategories] = useState(0);

  const [recentTransactions, setRecentTransactions] = useState<
    TransactionReturn[]
  >([]);

  const fetchUsers = async () => {
    const resultUsers = await adminAPI.getUsersDashboard();

    if (resultUsers.success) {
      setRecentUsers(resultUsers.users);
      setTotalUsers(resultUsers.totalUsers);
    }

    const resultTransactions = await adminAPI.getTransactionsDashboard();
    if (resultTransactions.success) {
      setRecentTransactions(resultTransactions.transactions);
      setTotalTransactions(resultTransactions.totalTransactions);
    }

    const resultCategories = await adminAPI.getTotalBaseCategories();
    if (resultCategories.success) {
      setTotalBaseCategories(resultCategories.totalBaseCategories);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    setItemsList([
      {
        title: "Total Users",
        value: totalUsers,
        icon: "users",
      },
      {
        title: "Total Transactions",
        value: totalTransactions,
        icon: "transactions",
      },
      {
        title: "Base Category",
        value: totalBaseCategories,
        icon: "layers",
      },
      {
        title: "Active Users",
        value: recentUsers.reduce((acc: number, user: UserReturn) => {
          return user.isActive ? acc + 1 : acc;
        }, 0),
        icon: "activeUsers",
      },
    ]);
  }, [
    recentUsers,
    recentTransactions,
    totalUsers,
    totalTransactions,
    totalBaseCategories,
  ]);

  return (
    <div className="px-6 mt-14">
      <div className="flex flex-col gap-y-12">
        <div className="flex flex-col gap-y-2">
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-gray-600">
            Overview of system performance and user activity
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {itemsList.map((item, index) => (
            <div
              key={index}
              className="bg-white h-[200px] px-8 pt-6 rounded-[20px] flex flex-col gap-y-6"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center justify-center size-12 bg-[rgba(7,182,129,0.125)] rounded-[10px]">
                  {item.icon === "users" ? (
                    <Users className="size-6 text-[#07B681]" />
                  ) : item.icon === "transactions" ? (
                    <Activity className="size-6 text-[#07B681]" />
                  ) : item.icon === "layers" ? (
                    <Layers className="size-6 text-[#07B681]" />
                  ) : (
                    <TrendingUp className="size-6 text-[#07B681]" />
                  )}
                </div>
              </div>
              <p className="font-medium text-[#000000] text-[16px] h-6">
                {item.title}
              </p>
              <p className="font-bold text-[24px] 2xl:text-[32px] text-[#000000]">
                {item.value}
              </p>
            </div>
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="h-[500px] bg-white rounded-[20px] py-6 px-8 flex flex-col gap-y-9">
            <h2 className="font-medium text-[24px] 2xl:text-[32px]">
              Recent Users
            </h2>
            <div className="w-full">
              <div className="grid grid-cols-3 gap-x-2 font-bold text-[16px]">
                <p>Name</p>
                <p>Status</p>
                <p>Transactions</p>
              </div>
              <div className="mt-4 max-h-80 overflow-y-auto">
                {recentUsers.map((user, index) => (
                  <div
                    key={index}
                    className="grid grid-cols-3 gap-x-2 items-center py-3 border-t border-gray-200"
                  >
                    <div>
                      <div className="font-medium text-[16px]">
                        {user.firstName} {user.lastName}
                      </div>
                      <div className="text-[14px] text-[rgba(0,0,0,0.5)]">
                        {user.email}
                      </div>
                    </div>
                    <div
                      className={`w-20 h-9 rounded-[15px] flex items-center justify-center ${
                        user.isActive === true
                          ? "bg-[#CFF0E7]"
                          : "bg-[#F0F0F0] text-[rgba(0,0,0,0.5)]"
                      }`}
                    >
                      {user.isActive ? "Active" : "Inactive"}
                    </div>
                    <div className="font-medium text-[16px] pl-12">
                      {user.transactions}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="h-[500px] bg-white rounded-[20px] py-6 px-8 flex flex-col gap-y-9">
            <h2 className="font-medium text-[24px] 2xl:text-[32px]">
              Recent Transactions
            </h2>
            <div className="w-full">
              <div className="grid grid-cols-3 gap-x-2 font-bold text-[16px]">
                <p>User</p>
                <p>Category</p>
                <p>Amount</p>
              </div>
              <div className="mt-4 max-h-80 overflow-y-auto">
                {recentTransactions.map((transaction, index) => (
                  <div
                    key={index}
                    className="grid grid-cols-3 gap-x-2 items-center py-3 border-t border-gray-200"
                  >
                    <div>
                      <div className="font-medium text-[16px]">
                        {transaction.firstName} {transaction.lastName}
                      </div>
                      <div className="text-[14px] text-[rgba(0,0,0,0.5)]">
                        {new Date(transaction.date).toLocaleDateString()}
                      </div>
                    </div>
                    <div className="pl-2 font-medium text-[16px]">
                      {transaction.category}
                    </div>
                    <div
                      className={`font-medium text-[16px] pl-6 ${
                        transaction.type === "income"
                          ? "text-[#37C39A]"
                          : "text-[#ED7771]"
                      }`}
                    >
                      $ {transaction.amount}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
