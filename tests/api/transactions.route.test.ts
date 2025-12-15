/** @jest-environment node */

jest.mock("jsonwebtoken", () => ({
  __esModule: true,
  default: {
    verify: jest.fn(),
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
    expenseCategory: {
      findUnique: jest.fn(),
    },
    incomeCategory: {
      findUnique: jest.fn(),
    },
  },
}));

import jwt from "jsonwebtoken";
import prisma from "@/lib/prisma";
import { POST, PUT, DELETE } from "@/app/api/transactions/route";

describe("/api/transactions route", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("POST returns 400 when token missing", async () => {
    const req = new Request("http://localhost/api/transactions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "getAllTransactions" }),
    });

    const res = await POST(req);
    expect(res.status).toBe(400);
  });

  it("POST returns 401 when token invalid", async () => {
    jest.spyOn(console, "error").mockImplementation(() => undefined);
    (jwt as any).verify.mockImplementation(() => {
      throw new Error("bad");
    });

    const req = new Request("http://localhost/api/transactions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "getAllTransactions", token: "t" }),
    });

    const res = await POST(req);
    expect(res.status).toBe(401);
    (console.error as any).mockRestore?.();
  });

  it("addTransaction returns 201 on success", async () => {
    (jwt as any).verify.mockReturnValue({ id: "u1", email: "a@b.com" });
    (prisma as any).transaction.create.mockResolvedValue({ id: "tx1" });

    const req = new Request("http://localhost/api/transactions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "addTransaction",
        token: "t",
        transaction: {
          type: "income",
          name: "Salary",
          amount: 100,
          date: "2025-01-01",
          description: "",
          categoryId: "c1",
        },
      }),
    });

    const res = await POST(req);
    expect(res.status).toBe(201);
  });

  it("PUT updateTransaction returns 200 when record updated", async () => {
    (jwt as any).verify.mockReturnValue({ id: "u1", email: "a@b.com" });
    (prisma as any).transaction.updateMany.mockResolvedValue({ count: 1 });

    const req = new Request("http://localhost/api/transactions", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "updateTransaction",
        token: "t",
        transactionId: "tx1",
        updated: { name: "Updated" },
      }),
    });

    const res = await PUT(req);
    expect(res.status).toBe(200);
  });

  it("DELETE removeTransaction returns 200 when deleted", async () => {
    (jwt as any).verify.mockReturnValue({ id: "u1", email: "a@b.com" });
    (prisma as any).transaction.deleteMany.mockResolvedValue({ count: 1 });

    const req = new Request("http://localhost/api/transactions", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "removeTransaction",
        token: "t",
        transactionId: "tx1",
      }),
    });

    const res = await DELETE(req);
    expect(res.status).toBe(200);
  });
});
