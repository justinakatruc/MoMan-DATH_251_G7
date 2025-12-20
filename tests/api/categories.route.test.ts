/** @jest-environment node */

jest.mock("jsonwebtoken", () => ({
  __esModule: true,
  default: {
    verify: jest.fn().mockReturnValue({ id: "user-1" }),
  },
}));

jest.mock("@/lib/prisma", () => ({
  __esModule: true,
  default: {
    expenseCategory: {
      findMany: jest.fn(),
      create: jest.fn(),
      deleteMany: jest.fn(),
    },
    incomeCategory: {
      findMany: jest.fn(),
      create: jest.fn(),
      deleteMany: jest.fn(),
    },
  },
}));

import prisma from "@/lib/prisma";
import { POST, DELETE } from "@/app/api/categories/route";

describe("UC-04: Manage Categories - /api/categories", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should list all categories for a user (Main Success Scenario)", async () => {
    (prisma as any).expenseCategory.findMany.mockResolvedValue([{ name: "Food" }]);
    (prisma as any).incomeCategory.findMany.mockResolvedValue([{ name: "Salary" }]);

    const req = new Request("http://localhost/api/categories", {
      method: "POST",
      body: JSON.stringify({ action: "getDefaultCategories", token: "t" }),
    });

    const res = await POST(req);
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(body.categories.expense[0].name).toBe("Food");
    expect(body.categories.income[0].name).toBe("Salary");
  });

  it("should add a new category (Main Success Scenario)", async () => {
    (prisma as any).incomeCategory.findMany.mockResolvedValue([]);
    (prisma as any).incomeCategory.create.mockResolvedValue({ name: "Bonus" });

    const req = new Request("http://localhost/api/categories", {
      method: "POST",
      body: JSON.stringify({
        action: "addCategory",
        token: "t",
        category: { type: "income", name: "Bonus" },
      }),
    });

    const res = await POST(req);
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(body.category.name).toBe("Bonus");
  });

  it("should prevent adding a duplicate category (Alternative Flow)", async () => {
    (prisma as any).expenseCategory.findMany.mockResolvedValue([{ name: "Groceries" }]);

    const req = new Request("http://localhost/api/categories", {
      method: "POST",
      body: JSON.stringify({
        action: "addCategory",
        token: "t",
        category: { type: "expense", name: "Groceries" },
      }),
    });

    const res = await POST(req);
    const body = await res.json();

    expect(res.status).toBe(400);
    expect(body.message).toMatch(/already exists/i);
  });

  it("should remove a category (Main Success Scenario)", async () => {
    (prisma as any).expenseCategory.deleteMany.mockResolvedValue({ count: 1 });

    const req = new Request("http://localhost/api/categories", {
      method: "DELETE",
      body: JSON.stringify({
        action: "removeCategory",
        token: "t",
        categoryId: "e1",
        type: "expense",
      }),
    });

    const res = await DELETE(req);
    expect(res.status).toBe(200);
    expect((prisma as any).expenseCategory.deleteMany).toHaveBeenCalledWith({
      where: { id: "e1", userId: "user-1", isDefault: false },
    });
  });
});