import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import prisma from "@/lib/prisma";

const JWT_SECRET = process.env.JWT_SECRET || "fallback_secret";

async function handleGetTotalIncomeAndExpenses(userId: string) {
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonthIndex = now.getMonth();
  const startOfMonth = new Date(currentYear, currentMonthIndex, 1);
  const startOfNextMonth = new Date(currentYear, currentMonthIndex + 1, 1);

  try {
    const incomeResult = await prisma.transaction.aggregate({
      where: {
        userId: userId,
        type: "income",
        AND: [
          { date: { gte: startOfMonth } },
          { date: { lt: startOfNextMonth } },
        ],
      },
      _sum: {
        amount: true,
      },
    });
    const expenseResult = await prisma.transaction.aggregate({
      where: {
        userId: userId,
        type: "expense",
        AND: [
          { date: { gte: startOfMonth } },
          { date: { lt: startOfNextMonth } },
        ],
      },
      _sum: {
        amount: true,
      },
    });

    const totalIncome = incomeResult._sum.amount || 0;
    const totalExpenses = expenseResult._sum.amount || 0;

    return NextResponse.json(
      {
        success: true,
        totalMonthlyIncome: totalIncome,
        totalMonthlyExpenses: totalExpenses,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Database query error:", error);
    return NextResponse.json(
      { success: false, message: "Database query error." },
      { status: 500 }
    );
  }
}

async function handleGetStatistics(userId: string, timeFrame: string) {
  let startDate: Date;
  const now = new Date();

  switch (timeFrame) {
    case "daily":
      startDate = new Date(now);
      startDate.setDate(now.getDate() - 7);
      break;
    case "weekly":
      startDate = new Date(
        now.getFullYear(),
        now.getMonth() - 1,
        now.getDate()
      );
      break;
    case "monthly":
      startDate = new Date(
        now.getFullYear() - 1,
        now.getMonth(),
        now.getDate()
      );
      break;
    case "yearly":
      startDate = new Date(
        now.getFullYear() - 4,
        now.getMonth(),
        now.getDate()
      );
      break;
    default:
      return NextResponse.json(
        { success: false, message: "Invalid time frame." },
        { status: 400 }
      );
  }

  try {
    const transactions = await prisma.transaction.findMany({
      where: {
        userId: userId,
        date: { gte: startDate },
      },
      orderBy: {
        date: "asc",
      },
    });

    let result = null;
    let totalIncome = 0;
    let totalExpense = 0;
    if (timeFrame === "daily") {
      const dailyTotalsMap: Record<
        string,
        { expense: number; income: number }
      > = {
        Mon: { expense: 0, income: 0 },
        Tue: { expense: 0, income: 0 },
        Wed: { expense: 0, income: 0 },
        Thu: { expense: 0, income: 0 },
        Fri: { expense: 0, income: 0 },
        Sat: { expense: 0, income: 0 },
        Sun: { expense: 0, income: 0 },
      };

      const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

      for (const transaction of transactions) {
        const date = new Date(transaction.date);

        const dayIndex = date.getDay();
        const dayName = dayNames[dayIndex];

        if (transaction.type === "income") {
          dailyTotalsMap[dayName].income += transaction.amount;
        } else if (transaction.type === "expense") {
          dailyTotalsMap[dayName].expense += transaction.amount;
        }
      }

      const data = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map(
        (day) => ({
          itemName: day,
          expense: dailyTotalsMap[day].expense,
          income: dailyTotalsMap[day].income,
        })
      );

      result = data;
      totalIncome = data.reduce((sum, item) => sum + item.income, 0);
      totalExpense = data.reduce((sum, item) => sum + item.expense, 0);
    } else if (timeFrame === "weekly") {
      const weeklyTotalsMap: Record<
        string,
        { expense: number; income: number }
      > = {
        "1st Week": { expense: 0, income: 0 },
        "2nd Week": { expense: 0, income: 0 },
        "3rd Week": { expense: 0, income: 0 },
        "4th Week": { expense: 0, income: 0 },
      };

      const weekNames = ["1st Week", "2nd Week", "3rd Week", "4th Week"];

      for (const transaction of transactions) {
        const date = new Date(transaction.date);
        const dayOfMonth = date.getDate();

        let weekKey;

        if (dayOfMonth >= 1 && dayOfMonth <= 7) {
          weekKey = "1st Week";
        } else if (dayOfMonth >= 8 && dayOfMonth <= 14) {
          weekKey = "2nd Week";
        } else if (dayOfMonth >= 15 && dayOfMonth <= 21) {
          weekKey = "3rd Week";
        } else {
          // Covers days 22 up to 31
          weekKey = "4th Week";
        }

        if (transaction.type === "income") {
          weeklyTotalsMap[weekKey].income += transaction.amount;
        } else if (transaction.type === "expense") {
          weeklyTotalsMap[weekKey].expense += transaction.amount;
        }
      }

      const data = weekNames.map((week) => ({
        itemName: week,
        expense: weeklyTotalsMap[week].expense,
        income: weeklyTotalsMap[week].income,
      }));

      result = data;
      totalIncome = data.reduce((sum, item) => sum + item.income, 0);
      totalExpense = data.reduce((sum, item) => sum + item.expense, 0);
    } else if (timeFrame === "monthly") {
      const monthlyTotalsMap: Record<
        string,
        { expense: number; income: number }
      > = {
        Jan: { expense: 0, income: 0 },
        Feb: { expense: 0, income: 0 },
        Mar: { expense: 0, income: 0 },
        Apr: { expense: 0, income: 0 },
        May: { expense: 0, income: 0 },
        Jun: { expense: 0, income: 0 },
        Jul: { expense: 0, income: 0 },
        Aug: { expense: 0, income: 0 },
        Sep: { expense: 0, income: 0 },
        Oct: { expense: 0, income: 0 },
        Nov: { expense: 0, income: 0 },
        Dec: { expense: 0, income: 0 },
      };

      const monthNames = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ];

      for (const transaction of transactions) {
        const date = new Date(transaction.date);
        const monthIndex = date.getMonth();
        const monthName = monthNames[monthIndex];
        if (transaction.type === "income") {
          monthlyTotalsMap[monthName].income += transaction.amount;
        } else if (transaction.type === "expense") {
          monthlyTotalsMap[monthName].expense += transaction.amount;
        }
      }

      const data = monthNames.map((month) => ({
        itemName: month,
        expense: monthlyTotalsMap[month].expense,
        income: monthlyTotalsMap[month].income,
      }));

      result = data;
      totalIncome = data.reduce((sum, item) => sum + item.income, 0);
      totalExpense = data.reduce((sum, item) => sum + item.expense, 0);
    } else if (timeFrame === "yearly") {
      const yearlyTotalsMap: Record<
        string,
        { expense: number; income: number }
      > = {};

      const currentYear = now.getFullYear();

      for (let i = 0; i < 5; i++) {
        const year = (currentYear - i).toString();
        yearlyTotalsMap[year] = { expense: 0, income: 0 };
      }

      for (const transaction of transactions) {
        const date = new Date(transaction.date);
        const year = date.getFullYear().toString();
        if (transaction.type === "income") {
          yearlyTotalsMap[year].income += transaction.amount;
        } else if (transaction.type === "expense") {
          yearlyTotalsMap[year].expense += transaction.amount;
        }
      }

      const data = Object.keys(yearlyTotalsMap)
        .sort((a, b) => parseInt(a) - parseInt(b))
        .map((year) => ({
          itemName: year,
          expense: yearlyTotalsMap[year].expense,
          income: yearlyTotalsMap[year].income,
        }));

      result = data;
      totalIncome = data.reduce((sum, item) => sum + item.income, 0);
      totalExpense = data.reduce((sum, item) => sum + item.expense, 0);
    }

    return NextResponse.json(
      {
        success: true,
        data: result,
        totalIncome: totalIncome,
        totalExpense: totalExpense,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Database query error:", error);
    return NextResponse.json(
      { success: false, message: "Database query error." },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { action, token, timeFrame } = body;

    if (!token) {
      return NextResponse.json(
        { success: false, message: "Missing token in request body." },
        { status: 400 }
      );
    }

    let decoded: { id: string; email: string };
    try {
      decoded = jwt.verify(token, JWT_SECRET) as { id: string; email: string };
    } catch (error) {
      console.error("Token verification error:", error);
      return NextResponse.json(
        { success: false, message: "Invalid or expired token." },
        { status: 401 }
      );
    }

    const userId = decoded.id;

    if (!action) {
      return NextResponse.json(
        { success: false, message: "Missing action field in request body." },
        { status: 400 }
      );
    }

    switch (action) {
      case "getTotalIncomeAndExpenses":
        return await handleGetTotalIncomeAndExpenses(userId);
      case "getStatistics":
        return await handleGetStatistics(userId, timeFrame);

      default:
        return NextResponse.json(
          { success: false, message: "Invalid action." },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error("Error processing request:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error." },
      { status: 500 }
    );
  }
}
