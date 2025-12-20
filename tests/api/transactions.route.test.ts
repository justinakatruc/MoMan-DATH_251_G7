/** @jest-environment node */

jest.mock("jsonwebtoken", () => ({
  __esModule: true,
  default: {
    verify: jest.fn().mockReturnValue({ id: "u1" }),
  },
}));

jest.mock("@/lib/prisma", () => ({
  __esModule: true,
  default: {
    transaction: {
      create: jest.fn(),
      findMany: jest.fn(),
      updateMany: jest.fn(),
      deleteMany: jest.fn(),
    },
    expenseCategory: { findUnique: jest.fn() },
    incomeCategory: { findUnique: jest.fn() },
  },
}));

import prisma from "@/lib/prisma";
import { POST, PUT, DELETE } from "@/app/api/transactions/route";

describe("UC-05: Manage Transactions - /api/transactions", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should add a new transaction (Main Success Scenario)", async () => {
    (prisma as any).transaction.create.mockResolvedValue({ id: "tx1" });

    const req = new Request("http://localhost/api/transactions", {
      method: "POST",
      body: JSON.stringify({
        action: "addTransaction",
        token: "t",
        transaction: { type: "income", name: "Salary", amount: 5000, date: "2025-12-20", note: "Monthly salary" },
      }),
    });

    const res = await POST(req);
    expect(res.status).toBe(201);
    expect((prisma as any).transaction.create).toHaveBeenCalled();
  });

  it("should find and return transactions", async () => {
    (prisma as any).transaction.findMany.mockResolvedValue([{ id: "tx1", name: "Coffee" }]);
    (prisma as any).expenseCategory.findUnique.mockResolvedValue({ name: "Food" });

    const req = new Request("http://localhost/api/transactions", {
      method: "POST",
      body: JSON.stringify({ action: "searchTransactions", token: "t", type: "expense" }),
    });

    const res = await POST(req);
    const body = await res.json();
    expect(res.status).toBe(200);
    expect(body.transactions).toHaveLength(1);
    expect(body.transactions[0].name).toBe("Coffee");
  });

  it("should update an existing transaction (Alternative Flow A1)", async () => {
    (prisma as any).transaction.updateMany.mockResolvedValue({ count: 1 });

    const req = new Request("http://localhost/api/transactions", {
      method: "PUT",
      body: JSON.stringify({
        action: "updateTransaction",
        token: "t",
        transactionId: "tx1",
        updated: { name: "Latte" },
      }),
    });

    const res = await PUT(req);
    expect(res.status).toBe(200);
    expect((prisma as any).transaction.updateMany).toHaveBeenCalledWith({
      where: { id: "tx1", userId: "u1" },
      data: { name: "Latte" },
    });
  });

  it("should delete a transaction (Alternative Flow A1)", async () => {
    (prisma as any).transaction.deleteMany.mockResolvedValue({ count: 1 });

    const req = new Request("http://localhost/api/transactions", {
      method: "DELETE",
      body: JSON.stringify({
        action: "removeTransaction",
        token: "t",
        transactionId: "tx1",
      }),
    });

    const res = await DELETE(req);
    expect(res.status).toBe(200);
    expect((prisma as any).transaction.deleteMany).toHaveBeenCalledWith({
      where: { id: "tx1", userId: "u1" },
    });
  });
});
