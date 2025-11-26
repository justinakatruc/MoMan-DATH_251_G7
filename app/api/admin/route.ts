import prisma from "@/lib/prisma";
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";

const JWT_SECRET = process.env.JWT_SECRET || "fallback_secret";

async function handleGetUsersDashboard() {
  try {
    const totalUsers = await prisma.user.count();

    const users = await prisma.user.findMany({
      take: 20,
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        accountType: true,
        isActive: true,
      },
    });

    const returnUsers = await Promise.all(
      users.map(async (user) => {
        const transactionCount = await prisma.transaction.count({
          where: { userId: user.id },
        });

        return {
          ...user,
          transactions: transactionCount,
        };
      })
    );

    return NextResponse.json(
      { success: true, users: returnUsers, totalUsers: totalUsers },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching users dashboard data:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch users dashboard data." },
      { status: 500 }
    );
  }
}

async function handleGetTransactionsDashboard() {
  try {
    const totalTransactions = await prisma.transaction.count();

    const transactions = await prisma.transaction.findMany({
      take: 20,
      select: {
        id: true,
        userId: true,
        date: true,
        type: true,
        categoryId: true,
        amount: true,
        description: true,
      },
      orderBy: { date: "desc" },
    });

    const returnTransactions = await Promise.all(
      transactions.map(async (transaction) => {
        const user = await prisma.user.findUnique({
          where: { id: transaction.userId },
          select: { firstName: true, lastName: true },
        });
        let category = null;
        if (transaction.type === "expense") {
          category = await prisma.expenseCategory.findUnique({
            where: { id: transaction.categoryId },
            select: { name: true },
          });
        } else {
          category = await prisma.incomeCategory.findUnique({
            where: { id: transaction.categoryId },
            select: { name: true },
          });
        }
        return {
          ...transaction,
          firstName: user?.firstName,
          lastName: user?.lastName,
          category: category?.name,
        };
      })
    );

    return NextResponse.json(
      {
        success: true,
        transactions: returnTransactions,
        totalTransactions: totalTransactions,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching transactions dashboard data:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch transactions dashboard data.",
      },
      { status: 500 }
    );
  }
}

async function handleGetTotalBaseCategories() {
  try {
    const totalExpenseCategories = await prisma.expenseCategory.count({
      where: { isDefault: true },
    });
    const totalIncomeCategories = await prisma.incomeCategory.count({
      where: { isDefault: true },
    });
    const totalBaseCategories = totalExpenseCategories + totalIncomeCategories;
    return NextResponse.json(
      { success: true, totalBaseCategories: totalBaseCategories },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching total base categories:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch total base categories.",
      },
      { status: 500 }
    );
  }
}

async function handleGetAllDefaultCategories() {
  try {
    const expenseCategories = await prisma.expenseCategory.findMany({
      where: { isDefault: true },
    });

    const returnedExpenseCategories = expenseCategories.map((category) => ({
      id: category.id,
      type: "expense",
      name: category.name,
      icon: category.icon,
      isDefault: category.isDefault,
    }));

    const incomeCategories = await prisma.incomeCategory.findMany({
      where: { isDefault: true },
    });

    const returnedIncomeCategories = incomeCategories.map((category) => ({
      id: category.id,
      type: "income",
      name: category.name,
      icon: category.icon,
      isDefault: category.isDefault,
    }));

    return NextResponse.json(
      {
        success: true,
        expenseCategories: returnedExpenseCategories,
        incomeCategories: returnedIncomeCategories,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching all default categories:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch all default categories.",
      },
      { status: 500 }
    );
  }
}

async function handleGetAllUsers() {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        accountType: true,
        isActive: true,
        memberSince: true,
      },
    });

    const returnUsers = await Promise.all(
      users.map(async (user) => {
        const transactionCount = await prisma.transaction.count({
          where: { userId: user.id },
        });

        return {
          ...user,
          transactions: transactionCount,
        };
      })
    );

    return NextResponse.json(
      { success: true, users: returnUsers },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching all users:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch all users." },
      { status: 500 }
    );
  }
}

async function handleGetAllTransactions() {
  try {
    const transactions = await prisma.transaction.findMany({
      orderBy: { date: "desc" },
    });

    const returnTransactions = await Promise.all(
      transactions.map(async (transaction) => {
        const user = await prisma.user.findUnique({
          where: { id: transaction.userId },
          select: { firstName: true, lastName: true, email: true },
        });
        let category = null;
        if (transaction.type === "expense") {
          category = await prisma.expenseCategory.findUnique({
            where: { id: transaction.categoryId },
            select: { name: true },
          });
        } else {
          category = await prisma.incomeCategory.findUnique({
            where: { id: transaction.categoryId },
            select: { name: true },
          });
        }
        return {
          ...transaction,
          firstName: user?.firstName,
          lastName: user?.lastName,
          email: user?.email,
          category: category?.name,
        };
      })
    );
    return NextResponse.json(
      { success: true, transactions: returnTransactions },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching all transactions:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch all transactions." },
      { status: 500 }
    );
  }
}

async function handleDeleteTransaction(transactionId: string) {
  try {
    if (!transactionId) {
      return NextResponse.json(
        { success: false, message: "Transaction ID is required." },
        { status: 400 }
      );
    }

    const transaction = await prisma.transaction.findUnique({
      where: { id: transactionId },
    });

    if (!transaction) {
      return NextResponse.json(
        { success: false, message: "Transaction not found." },
        { status: 404 }
      );
    }

    await prisma.transaction.delete({
      where: { id: transactionId },
    });

    return NextResponse.json(
      { success: true, message: "Transaction deleted successfully." },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting transaction:", error);
    return NextResponse.json(
      { success: false, message: "Failed to delete transaction." },
      { status: 500 }
    );
  }
}

async function handleDeleteUser(userId: string) {
  try {
    if (!userId) {
      return NextResponse.json(
        { success: false, message: "User ID is required." },
        { status: 400 }
      );
    }

    console.log("Deleting user with ID:", userId);

    await prisma.user.delete({
      where: { id: userId },
    });

    await prisma.transaction.deleteMany({
      where: { userId: userId },
    });

    await prisma.event.deleteMany({
      where: { userId: userId },
    });

    await prisma.incomeCategory.deleteMany({
      where: { userId: userId, isDefault: false },
    });

    await prisma.expenseCategory.deleteMany({
      where: { userId: userId, isDefault: false },
    });

    return NextResponse.json(
      { success: true, message: "User deleted successfully." },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting user:", error);
    return NextResponse.json(
      { success: false, message: "Failed to delete user." },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  const body = await request.json();

  const { action, token } = body;

  if (!token) {
    return NextResponse.json(
      { success: false, message: "Authentication token is missing." },
      { status: 401 }
    );
  }

  let decoded: { id: string; email: string; role: string };
  try {
    decoded = jwt.verify(token, JWT_SECRET) as {
      id: string;
      email: string;
      role: string;
    };
  } catch (error) {
    console.error("JWT verification error:", error);
    return NextResponse.json(
      { success: false, message: "Invalid authentication token." },
      { status: 401 }
    );
  }

  if (decoded.role !== "Admin") {
    return NextResponse.json(
      { success: false, message: "Access denied. Admins only." },
      { status: 403 }
    );
  }

  if (!action) {
    return NextResponse.json(
      { success: false, message: "Missing action field in request body." },
      { status: 400 }
    );
  }

  switch (action) {
    case "getUsersDashboard":
      return await handleGetUsersDashboard();
    case "getTransactionsDashboard":
      return await handleGetTransactionsDashboard();
    case "getTotalBaseCategories":
      return await handleGetTotalBaseCategories();
    case "getAllDefaultCategories":
      return await handleGetAllDefaultCategories();
    case "getAllUsers":
      return await handleGetAllUsers();
    case "getAllTransactions":
      return await handleGetAllTransactions();
    default:
      return NextResponse.json(
        { success: false, message: "Invalid action." },
        { status: 400 }
      );
  }
}

export async function DELETE(request: Request) {
  const body = await request.json();
  const { action, token, userId, transactionId } = body;

  if (!token) {
    return NextResponse.json(
      { success: false, message: "Authentication token is missing." },
      { status: 401 }
    );
  }

  let decoded: { id: string; email: string; role: string };
  try {
    decoded = jwt.verify(token, JWT_SECRET) as {
      id: string;
      email: string;
      role: string;
    };
  } catch (error) {
    console.error("JWT verification error:", error);
    return NextResponse.json(
      { success: false, message: "Invalid authentication token." },
      { status: 401 }
    );
  }

  if (decoded.role !== "Admin") {
    return NextResponse.json(
      { success: false, message: "Access denied. Admins only." },
      { status: 403 }
    );
  }

  if (!action) {
    return NextResponse.json(
      { success: false, message: "Missing action field in request body." },
      { status: 400 }
    );
  }

  switch (action) {
    case "deleteTransaction":
      return await handleDeleteTransaction(transactionId);
    case "deleteUser":
      return await handleDeleteUser(userId);
    default:
      return NextResponse.json(
        { success: false, message: "Invalid action." },
        { status: 400 }
      );
  }
}
