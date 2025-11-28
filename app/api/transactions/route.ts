import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import prisma from "@/lib/prisma";
import { Transaction } from "@/app/model";

const JWT_SECRET = process.env.JWT_SECRET || "fallback_secret";

async function handleAddTransaction(
  transaction: {
    type: "expense" | "income";
    name: string;
    amount: number;
    date: string;
    description: string;
    categoryId: string;
  },
  userId: string
) {
  try {
    const now = new Date();
    if (transaction.date === now.toISOString().split("T")[0]) {
      transaction.date = now.toISOString();
    }

    const result = await prisma.transaction.create({
      data: {
        type: transaction.type,
        name: transaction.name,
        amount: transaction.amount,
        date: new Date(transaction.date),
        description: transaction.description,
        categoryId: transaction.categoryId,
        userId: userId,
      },
    });

    if (result) {
      return NextResponse.json(
        { success: true, message: "Transaction added successfully." },
        { status: 201 }
      );
    }
    return NextResponse.json(
      { success: false, message: "Failed to add transaction." },
      { status: 500 }
    );
  } catch (error) {
    console.error("Error adding transaction:", error);
    return NextResponse.json(
      { success: false, message: "Failed to add transaction." },
      { status: 500 }
    );
  }
}

async function handleGetAllTransactions(userId: string) {
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonthIndex = now.getMonth();
  const startOfMonth = new Date(currentYear, currentMonthIndex, 1);
  const startOfNextMonth = new Date(currentYear, currentMonthIndex + 1, 1);

  try {
    const transactions = await prisma.transaction.findMany({
      where: {
        userId: userId,
        AND: [
          { date: { gte: startOfMonth } },
          { date: { lt: startOfNextMonth } },
        ],
      },
      select: {
        id: true,
        type: true,
        name: true,
        amount: true,
        date: true,
        description: true,
        categoryId: true,
      },
      orderBy: [{ date: "desc" }, { id: "desc" }],
    });

    const returnTransactions = await Promise.all(
      transactions.map(async (tx) => {
        let category = null;
        if (tx.type === "expense") {
          category = await prisma.expenseCategory.findUnique({
            where: { id: tx.categoryId },
          });
        } else {
          category = await prisma.incomeCategory.findUnique({
            where: { id: tx.categoryId },
          });
        }
        return {
          ...tx,
          categoryName: category?.name,
          categoryIcon: category?.icon,
        };
      })
    );

    return NextResponse.json(
      { success: true, transactions: returnTransactions },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching transactions:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch transactions." },
      { status: 500 }
    );
  }
}

async function handleGetCategoryTransactions(
  categoryId: string,
  userId: string
) {
  try {
    const transactions = await prisma.transaction.findMany({
      where: {
        userId: userId,
        categoryId: categoryId,
      },
      select: {
        id: true,
        name: true,
        amount: true,
        description: true,
        date: true,
      },
      orderBy: [{ date: "desc" }, { id: "desc" }],
    });

    return NextResponse.json(
      { success: true, transactions: transactions },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching category transactions:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch category transactions." },
      { status: 500 }
    );
  }
}

async function handleSearchTransactions(
  category: string,
  type: string,
  date: string,
  userId: string
) {
  try {
    let transactions = await prisma.transaction.findMany({
      where: {
        userId: userId,
        type: type,
      },
      select: {
        id: true,
        type: true,
        name: true,
        amount: true,
        description: true,
        date: true,
        categoryId: true,
      },
      orderBy: [{ date: "desc" }, { id: "desc" }],
    });

    if (category) {
      transactions = transactions.filter((tx) => tx.categoryId === category);
    }

    if (date) {
      transactions = transactions.filter(
        (tx) => tx.date.toISOString().split("T")[0] === date
      );
    }

    const returnTransactions = await Promise.all(
      transactions.map(async (tx) => {
        let categoryData = null;
        if (tx.type === "expense") {
          categoryData = await prisma.expenseCategory.findUnique({
            where: { id: tx.categoryId },
          });
        } else {
          categoryData = await prisma.incomeCategory.findUnique({
            where: { id: tx.categoryId },
          });
        }
        return {
          ...tx,
          categoryName: categoryData?.name,
          categoryIcon: categoryData?.icon,
        };
      })
    );

    return NextResponse.json(
      { success: true, transactions: returnTransactions },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error searching transactions:", error);
  }
}

async function handleUpdateTransaction(
  transactionId: string,
  updated: Partial<Transaction>,
  userId: string
) {
  try {
    const result = await prisma.transaction.updateMany({
      where: {
        id: transactionId,
        userId: userId,
      },
      data: updated,
    });
    if (result.count > 0) {
      return NextResponse.json(
        { success: true, message: "Transaction updated successfully." },
        { status: 200 }
      );
    }
    return NextResponse.json(
      { success: false, message: "Failed to update transaction." },
      { status: 500 }
    );
  } catch (error) {
    console.error("Error updating transaction:", error);
    return NextResponse.json(
      { success: false, message: "Failed to update transaction." },
      { status: 500 }
    );
  }
}

async function handleRemoveTransactionById(
  transactionId: string,
  userId: string
) {
  try {
    const result = await prisma.transaction.deleteMany({
      where: {
        id: transactionId,
        userId: userId,
      },
    });

    if (result.count > 0) {
      return NextResponse.json(
        { success: true, message: "Transaction removed successfully." },
        { status: 200 }
      );
    }
    return NextResponse.json(
      { success: false, message: "Failed to remove transaction." },
      { status: 500 }
    );
  } catch (error) {
    console.error("Error removing transaction:", error);
    return NextResponse.json(
      { success: false, message: "Failed to remove transaction." },
      { status: 500 }
    );
  }
}

async function handleRemoveTransactionBasedOnCategory(
  categoryId: string,
  userId: string
) {
  try {
    const result = await prisma.transaction.deleteMany({
      where: {
        categoryId: categoryId,
        userId: userId,
      },
    });
    if (result.count > 0) {
      return NextResponse.json(
        { success: true, message: "Transaction removed successfully." },
        { status: 200 }
      );
    }
    return NextResponse.json(
      { success: false, message: "Failed to remove transaction." },
      { status: 500 }
    );
  } catch (error) {
    console.error("Error removing transaction:", error);
    return NextResponse.json(
      { success: false, message: "Failed to remove transaction." },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { action, token } = body;

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
      case "addTransaction":
        const { transaction } = body;
        return await handleAddTransaction(transaction, userId);
      case "getAllTransactions":
        return await handleGetAllTransactions(userId);
      case "getCategoryTransactions":
        const { categoryId } = body;
        return await handleGetCategoryTransactions(categoryId, userId);
      case "searchTransactions":
        const { category, type, date } = body;
        return await handleSearchTransactions(category, type, date, userId);

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

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { action, token } = body;

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
      case "updateTransaction":
        const { transactionId, updated } = body;
        return await handleUpdateTransaction(transactionId, updated, userId);
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

export async function DELETE(request: Request) {
  try {
    const body = await request.json();
    const { action, token } = body;

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
      case "removeTransactionBaseOnCategory":
        const { categoryId } = body;
        return await handleRemoveTransactionBasedOnCategory(categoryId, userId);
      case "removeTransaction":
        const { transactionId } = body;
        return await handleRemoveTransactionById(transactionId, userId);
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
