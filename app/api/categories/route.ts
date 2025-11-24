import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import jwt from "jsonwebtoken";
import { Category } from "@/app/model";

const JWT_SECRET = process.env.JWT_SECRET || "fallback_secret";

async function handleGetDefaultCategories() {
  const defaultExpenseCategories = await prisma.expenseCategory.findMany({
    where: { isDefault: true },
  });

  const returnExpenseCategories: Category[] = defaultExpenseCategories.map(
    (category) => ({
      id: category.id,
      type: "expense",
      name: category.name,
      icon: category.icon,
      isDefault: category.isDefault,
    })
  );

  const defaultIncomeCategories = await prisma.incomeCategory.findMany({
    where: { isDefault: true },
  });

  const returnIncomeCategories: Category[] = defaultIncomeCategories.map(
    (category) => ({
      id: category.id,
      type: "income",
      name: category.name,
      icon: category.icon,
      isDefault: category.isDefault,
    })
  );

  return NextResponse.json({
    success: true,
    categories: {
      expense: returnExpenseCategories,
      income: returnIncomeCategories,
    },
  });
}

async function handleGetUserCategories(userId: string) {
  const userExpenseCategories = await prisma.expenseCategory.findMany({
    where: {
      userId: userId,
      isDefault: false,
    },
  });

  const returnUserExpenseCategories: Category[] = userExpenseCategories.map(
    (category) => ({
      id: category.id,
      type: "expense",
      name: category.name,
      icon: category.icon,
      isDefault: category.isDefault,
    })
  );

  const userIncomeCategories = await prisma.incomeCategory.findMany({
    where: {
      userId: userId,
      isDefault: false,
    },
  });

  const returnUserIncomeCategories: Category[] = userIncomeCategories.map(
    (category) => ({
      id: category.id,
      type: "income",
      name: category.name,
      icon: category.icon,
      isDefault: category.isDefault,
    })
  );

  return NextResponse.json({
    success: true,
    categories: {
      expense: returnUserExpenseCategories,
      income: returnUserIncomeCategories,
    },
  });
}

async function handleAddCategory(
  category: {
    type: "expense" | "income";
    name: string;
    icon: string;
    isDefault: boolean;
  },
  userId: string
) {
  try {
    let newCategory: Category | null = null;
    let result = null;

    if (category.type === "expense") {
      const allExpenseCategories = await prisma.expenseCategory.findMany({
        where: {
          OR: [{ userId: userId }, { isDefault: true }],
        },
      });

      const existing = allExpenseCategories.find(
        (cat) => cat.name.toLowerCase() === category.name.toLowerCase()
      );

      if (existing) {
        return NextResponse.json(
          { success: false, message: "Category already exists." },
          { status: 400 }
        );
      }

      result = await prisma.expenseCategory.create({
        data: {
          name: category.name,
          icon: category.icon,
          isDefault: category.isDefault,
          userId: category.isDefault ? null : userId,
        },
      });
    } else if (category.type === "income") {
      const allIncomeCategories = await prisma.incomeCategory.findMany({
        where: {
          OR: [{ userId: userId }, { isDefault: true }],
        },
      });

      const existing = allIncomeCategories.find(
        (cat) => cat.name.toLowerCase() === category.name.toLowerCase()
      );

      if (existing) {
        return NextResponse.json(
          { success: false, message: "Category already exists." },
          { status: 400 }
        );
      }

      result = await prisma.incomeCategory.create({
        data: {
          name: category.name,
          icon: category.icon,
          isDefault: category.isDefault,
          userId: category.isDefault ? null : userId,
        },
      });
    }

    if (result) {
      newCategory = {
        id: result.id,
        type: category.type,
        name: result.name,
        icon: result.icon,
        isDefault: result.isDefault,
      };
    }

    return NextResponse.json(
      { success: true, category: newCategory },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error adding category:", error);
    return NextResponse.json(
      { success: false, message: "Failed to add category." },
      { status: 500 }
    );
  }
}

async function handleRemoveCategory(
  categoryId: string,
  type: "expense" | "income",
  userId: string,
  isDefault?: boolean
) {
  try {
    if (type === "expense") {
      if (isDefault) {
        await prisma.expenseCategory.deleteMany({
          where: {
            id: categoryId,
            isDefault: true,
          },
        });
      } else {
        await prisma.expenseCategory.deleteMany({
          where: {
            id: categoryId,
            userId: userId,
            isDefault: false,
          },
        });
      }
    } else if (type === "income") {
      if (isDefault) {
        await prisma.incomeCategory.deleteMany({
          where: {
            id: categoryId,
            isDefault: true,
          },
        });
      } else {
        await prisma.incomeCategory.deleteMany({
          where: {
            id: categoryId,
            userId: userId,
            isDefault: false,
          },
        });
      }
    }

    // Remove associated transactions

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Error removing category:", error);
    return NextResponse.json(
      { success: false, message: "Failed to remove category." },
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
      case "getDefaultCategories":
        return await handleGetDefaultCategories();

      case "getUserCategories":
        return await handleGetUserCategories(userId);

      case "addCategory":
        const { category } = body;
        return await handleAddCategory(category, userId);

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
      case "removeCategory":
        const { categoryId, type, isDefault } = body;
        return await handleRemoveCategory(categoryId, type, userId, isDefault);

      default:
        return NextResponse.json(
          { success: false, message: "Invalid action." },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error("Error processing request:", error);
  }
}
