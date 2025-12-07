"use client";

import Content from "@/app/components/Content";
import { analysisAPI } from "@/lib/api";
import {
  Bot,
  Search,
  SquareArrowDownRight,
  SquareArrowUpRight,
  SquareCheck,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

export default function Analysis() {
  const router = useRouter();
  const [totalMonthlyIncome, setTotalMonthlyIncome] = useState(0);
  const [totalMonthlyExpenses, setTotalMonthlyExpenses] = useState(0);
  const [difference, setDifference] = useState(0);
  const [totalIncome, setTotalIncome] = useState(0);
  const [totalExpense, setTotalExpense] = useState(0);
  const [activeTab, setActiveTab] = useState("Daily");
  const tabs = ["Daily", "Weekly", "Monthly", "Yearly"];

  const [data, setData] = useState<
    { itemName: string; expense: number; income: number }[]
  >([]);

  const activeAmounts = useMemo(() => {
    const list = [
      [0, 1000, 5000, 10000, 15000],
      [0, 50000, 60000, 80000, 100000],
    ];

    switch (activeTab) {
      case "Daily":
        return list[0];
      case "Weekly":
        return list[0];
      case "Monthly":
        return list[0];
      case "Yearly":
        return list[1];
      default:
        return [];
    }
  }, [activeTab]);

  async function fetchAnalysisData() {
    try {
      const result = await analysisAPI.getTotalIncomeAndExpenses();

      if (result.success) {
        setTotalMonthlyIncome(result.totalMonthlyIncome);
        setTotalMonthlyExpenses(result.totalMonthlyExpenses);
        setDifference(result.totalMonthlyIncome - result.totalMonthlyExpenses);
      }
    } catch (error) {
      console.error("Error fetching analysis data:", error);
    }
  }

  const fetchChartData = useCallback(async () => {
    try {
      const result = await analysisAPI.getStatistic(activeTab.toLowerCase());

      if (result.success) {
        setData(result.data);
        setTotalIncome(result.totalIncome);
        setTotalExpense(result.totalExpense.toFixed(2));
      }
    } catch (error) {
      console.error("Error fetching chart data:", error);
    }
  }, [activeTab]);

  useEffect(() => {
    fetchChartData();
  }, [fetchChartData, activeTab]);

  useEffect(() => {
    fetchAnalysisData();
  }, []);

  return (
    <div className="flex flex-col gap-y-10 flex-1">
      {/* Header */}
      <div className="flex items-center h-[85px] justify-center">
        <div className="font-semibold text-xl mt-8 px-5 text-[#052224]">
          Analysis
        </div>
      </div>

      {/* Overview */}
      <div className="flex flex-col items-center gap-y-1.5 justify-center">
        <div className="flex gap-x-4">
          <div>
            <div className="flex items-center">
              <SquareArrowUpRight className="w-6 h-6" />
              <div className="ml-2 font-medium text-lg">Total Income</div>
            </div>
            <div className="font-bold text-2xl text-[#F1FFF3]">
              ${totalMonthlyIncome}
            </div>
          </div>
          <div className="flex items-center justify-center">
            <hr className="h-12 w-[0.8px] bg-white" />
          </div>
          <div>
            <div className="flex items-center">
              <SquareArrowDownRight className="w-6 h-6" />
              <div className="ml-2 font-medium text-lg">Total Expenses</div>
            </div>
            <div className="font-bold text-2xl text-[#006BFF]">
              -${totalMonthlyExpenses.toFixed(2)}
            </div>
          </div>
        </div>
        <div className="h-7 w-[330px] flex">
          <div
            className={`h-full rounded-l-2xl`}
            style={{
              width: totalMonthlyIncome
                ? `${
                    (totalMonthlyIncome /
                      (totalMonthlyIncome + totalMonthlyExpenses)) *
                    100
                  }%`
                : "0%",
              backgroundColor: "#052224",
            }}
          >
            {totalMonthlyIncome ? (
              <div className="h-full flex items-center justify-start pl-3 text-[#F1FFF3] font-medium">
                {(
                  (totalMonthlyIncome /
                    (totalMonthlyIncome + totalMonthlyExpenses)) *
                  100
                ).toFixed(1)}
                %
              </div>
            ) : null}
          </div>
          <div
            className={`h-full rounded-r-2xl`}
            style={{
              width: totalMonthlyExpenses
                ? `${
                    (totalMonthlyExpenses /
                      (totalMonthlyIncome + totalMonthlyExpenses)) *
                    100
                  }%`
                : "0%",
              backgroundColor: "#F1FFF3",
            }}
          >
            {totalMonthlyExpenses ? (
              <div className="h-full flex items-center justify-end pr-3 text-[#052224] font-medium">
                {(
                  (totalMonthlyExpenses /
                    (totalMonthlyIncome + totalMonthlyExpenses)) *
                  100
                ).toFixed(1)}
                %
              </div>
            ) : null}
          </div>
        </div>
        <div className="flex gap-x-4 mt-2">
          <SquareCheck className="w-6 h-6" />
          <div className="font-medium text-md">
            Difference:{" "}
            {(
              (difference / (totalMonthlyIncome + totalMonthlyExpenses)) *
              100
            ).toFixed(2)}
            %
          </div>
        </div>
      </div>

      {/* Content */}
      <Content>
        <div className="flex flex-col items-center gap-y-6">
          <div className="w-[358px] h-[60px] bg-[#DFF7E2] rounded-[22px] px-3.5 py-1.5">
            <div className="grid grid-cols-4">
              {tabs.map((tab) => (
                <div key={tab}>
                  <button
                    className={`w-full h-12 rounded-[18px] font-medium cursor-pointer ${
                      activeTab === tab
                        ? "bg-[#00D09E] text-white"
                        : "text-[#052224]"
                    }`}
                    onClick={() => setActiveTab(tab)}
                  >
                    {tab}
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="relative w-[358px] h-[247px] bg-[#DFF7E2] rounded-[22px] px-4 py-3.5 flex flex-col gap-y-1">
            <div className="w-full flex items-center justify-between">
              <div className="font-medium text-[15px]">Income & Expenses</div>
              <div className="flex items-center gap-x-3">
                <button
                  className="w-8 h-8 bg-[#00D09E] rounded-lg flex items-center justify-center cursor-pointer"
                  onClick={() => router.push("/analysis/report")}
                >
                  <Bot className="w-6 h-6 text-[#052224]" />
                </button>
                <button
                  className="w-8 h-8 bg-[#00D09E] rounded-lg flex items-center justify-center cursor-pointer"
                  onClick={() => router.push("/analysis/search")}
                >
                  <Search className="w-6 h-6 text-[#052224]" />
                </button>
              </div>
            </div>

            <div className="flex items-center justify-center overflow-x-auto">
              <ResponsiveContainer width={500} height={270}>
                <BarChart
                  data={data}
                  barGap={2}
                  barCategoryGap="10%"
                  margin={{ left: -20 }}
                >
                  <CartesianGrid
                    strokeDasharray="0"
                    stroke="#a8d5c8"
                    vertical={false}
                  />
                  <XAxis
                    dataKey="itemName"
                    axisLine={{ stroke: "#2d3436", strokeWidth: 2 }}
                    tickLine={false}
                    tick={{ fill: "#4db8a8", fontSize: 14 }}
                    dy={10}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#4db8a8", fontSize: 14 }}
                    ticks={activeAmounts}
                    tickFormatter={(value) =>
                      value >= 1000 ? `${value / 1000}k` : value
                    }
                    dx={-10}
                    domain={[
                      activeAmounts[0],
                      activeAmounts[activeAmounts.length - 1],
                    ]}
                  />
                  <Bar
                    dataKey="income"
                    fill="#1e8fcc"
                    radius={[4, 4, 0, 0]}
                    barSize={20}
                  />
                  <Bar
                    dataKey="expense"
                    fill="#4db8a8"
                    radius={[4, 4, 0, 0]}
                    barSize={20}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="flex items-center justify-center gap-x-20">
            <div className="flex flex-col items-center">
              <SquareArrowUpRight className="w-8 h-8 text-[#00D09E]" />
              <div className="font-medium text-[18px] text-[#093030]">
                Income
              </div>
              <div className="font-semibold text-xl text-[#093030]">
                ${totalIncome}
              </div>
            </div>
            <div className="flex flex-col items-center">
              <SquareArrowDownRight className="w-8 h-8 text-[#0068FF]" />
              <div className="font-medium text-[18px] text-[#093030]">
                Expenses
              </div>
              <div className="font-semibold text-xl text-[#0068FF]">
                ${totalExpense}
              </div>
            </div>
          </div>
        </div>
      </Content>
    </div>
  );
}
