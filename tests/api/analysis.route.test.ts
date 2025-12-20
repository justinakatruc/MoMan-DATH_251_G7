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
      aggregate: jest.fn(),
    },
  },
}));

import jwt from "jsonwebtoken";
import prisma from "@/lib/prisma";
import { POST } from "@/app/api/analysis/route";

describe("Analysis API - /api/analysis", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return 400 when token is missing", async () => {
    const req = new Request("http://localhost/api/analysis", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "getTotalIncomeAndExpenses" }),
    });

    const res = await POST(req);
    expect(res.status).toBe(400);
  });

  it("should calculate total income and expenses for reports", async () => {
    (jwt as any).verify.mockReturnValue({ id: "u1", email: "a@b.com" });
    (prisma as any).transaction.aggregate
      .mockResolvedValueOnce({ _sum: { amount: 1000 } }) // Income
      .mockResolvedValueOnce({ _sum: { amount: 450 } }); // Expenses

    const req = new Request("http://localhost/api/analysis", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "getTotalIncomeAndExpenses", token: "t" }),
    });

    const res = await POST(req);
    expect(res.status).toBe(200);

    const body = await res.json();
    expect(body.totalMonthlyIncome).toBe(1000);
    expect(body.totalMonthlyExpenses).toBe(450);
  });
});
