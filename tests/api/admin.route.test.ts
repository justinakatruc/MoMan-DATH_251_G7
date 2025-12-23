/** @jest-environment node */

jest.mock("jsonwebtoken", () => ({
  __esModule: true,
  default: {
    verify: jest.fn(),
  },
}));

jest.mock("@/lib/prisma", () => {
  const mockPrisma = {
    user: {
      count: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      delete: jest.fn(),
    },
    transaction: {
      count: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      delete: jest.fn(),
      deleteMany: jest.fn(),
    },
    event: {
      deleteMany: jest.fn(),
    },
    incomeCategory: {
      count: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      deleteMany: jest.fn(),
    },
    expenseCategory: {
      count: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      deleteMany: jest.fn(),
    },
  };
  return {
    __esModule: true,
    default: mockPrisma,
    ...mockPrisma,
  };
});

import jwt from "jsonwebtoken";
import prisma from "@/lib/prisma";
import { POST, DELETE } from "@/app/api/admin/route";

describe("UC-08: Admin Management - /api/admin", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return 403 for non-admin users", async () => {
    (jwt as any).verify.mockReturnValue({ id: "u1", email: "a@b.com", role: "User" });

    const req = new Request("http://localhost/api/admin", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "getUsersDashboard", token: "t" }),
    });

    const res = await POST(req);
    expect(res.status).toBe(403);
    const body = await res.json();
    expect(body.message).toMatch(/admins only/i);
  });

  it("should allow admin to view users (UC-06: Main Success Scenario)", async () => {
    (jwt as any).verify.mockReturnValue({ id: "admin", email: "a@b.com", role: "Admin" });
    (prisma as any).user.count.mockResolvedValue(1);
    (prisma as any).user.findMany.mockResolvedValue([
      { id: "u1", firstName: "A", lastName: "B", email: "a@b.com", accountType: "User", isActive: true },
    ]);
    (prisma as any).transaction.count.mockResolvedValue(2);

    const req = new Request("http://localhost/api/admin", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "getUsersDashboard", token: "t" }),
    });

    const res = await POST(req);
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.success).toBe(true);
    expect(body.totalUsers).toBe(1);
  });

  it("should allow admin to delete a user (UC-06: Delete User Success Scenario)", async () => {
    (jwt as any).verify.mockReturnValue({ id: "admin", email: "a@b.com", role: "Admin" });
    (prisma as any).user.delete.mockResolvedValue({});
    (prisma as any).transaction.deleteMany.mockResolvedValue({});
    (prisma as any).event.deleteMany.mockResolvedValue({});

    const req = new Request("http://localhost/api/admin", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "deleteUser", token: "t", userId: "u1" }),
    });

    const res = await DELETE(req);
    expect(res.status).toBe(200);
    expect((prisma as any).user.delete).toHaveBeenCalledWith({ where: { id: "u1" } });
  });

  it("should allow admin to delete a transaction (UC-06: Delete Transaction Success Scenario)", async () => {
    (jwt as any).verify.mockReturnValue({ id: "admin", email: "a@b.com", role: "Admin" });
    (prisma as any).transaction.findUnique.mockResolvedValue({ id: "tx1", userId: "u1" });
    (prisma as any).transaction.delete.mockResolvedValue({});

    const req = new Request("http://localhost/api/admin", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "deleteTransaction", token: "t", transactionId: "tx1" }),
    });

    const res = await DELETE(req);
    expect(res.status).toBe(200);
    expect((prisma as any).transaction.delete).toHaveBeenCalledWith({ where: { id: "tx1" } });
  });

  it("should allow admin to view all transactions (UC-06: View All Transactions Success Scenario)", async () => {
    (jwt as any).verify.mockReturnValue({ id: "admin", email: "a@b.com", role: "Admin" });
    (prisma as any).transaction.findMany.mockResolvedValue([{ id: "tx1", amount: 100, type: "expense" }]);

    const req = new Request("http://localhost/api/admin", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "getAllTransactions", token: "t" }),
    });

    const res = await POST(req);
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.success).toBe(true);
    expect(body.transactions).toHaveLength(1);
  });

  it("should allow admin to view all default categories (UC-06: View All Default Categories Success Scenario)", async () => {
    (jwt as any).verify.mockReturnValue({ id: "admin", email: "a@b.com", role: "Admin" });
    (prisma as any).expenseCategory.findMany.mockResolvedValue([{ id: "e1", name: "Food", isDefault: true }]);
    (prisma as any).incomeCategory.findMany.mockResolvedValue([{ id: "i1", name: "Salary", isDefault: true }]);

    const req = new Request("http://localhost/api/admin", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "getAllDefaultCategories", token: "t" }),
    });

    const res = await POST(req);
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.success).toBe(true);
    expect(body.expenseCategories).toHaveLength(1);
  });
});