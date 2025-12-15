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
    user: {
      count: jest.fn(),
      findMany: jest.fn(),
      delete: jest.fn(),
    },
    transaction: {
      count: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      delete: jest.fn(),
      deleteMany: jest.fn(),
    },
    expenseCategory: {
      count: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      deleteMany: jest.fn(),
    },
    incomeCategory: {
      count: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      deleteMany: jest.fn(),
    },
    event: {
      deleteMany: jest.fn(),
    },
  },
}));

import jwt from "jsonwebtoken";
import prisma from "@/lib/prisma";
import { POST, DELETE } from "@/app/api/admin/route";

describe("/api/admin route", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("POST returns 401 when token missing", async () => {
    const req = new Request("http://localhost/api/admin", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "getUsersDashboard" }),
    });

    const res = await POST(req);
    expect(res.status).toBe(401);
  });

  it("POST returns 403 for non-admin role", async () => {
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

  it("POST getUsersDashboard returns 200 for admin", async () => {
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
    expect(body.users[0].transactions).toBe(2);
  });

  it("DELETE deleteTransaction returns 400 when transactionId missing", async () => {
    (jwt as any).verify.mockReturnValue({ id: "admin", email: "a@b.com", role: "Admin" });

    const req = new Request("http://localhost/api/admin", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "deleteTransaction", token: "t" }),
    });

    const res = await DELETE(req);
    expect(res.status).toBe(400);
  });
});
