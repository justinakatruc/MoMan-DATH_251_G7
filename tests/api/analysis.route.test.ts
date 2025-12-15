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
      findMany: jest.fn(),
    },
  },
}));

import jwt from "jsonwebtoken";
import prisma from "@/lib/prisma";
import { POST } from "@/app/api/analysis/route";

describe("/api/analysis route", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("returns 400 when token missing", async () => {
    const req = new Request("http://localhost/api/analysis", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "getTotalIncomeAndExpenses" }),
    });

    const res = await POST(req);
    expect(res.status).toBe(400);
  });

  it("returns 400 for invalid time frame", async () => {
    (jwt as any).verify.mockReturnValue({ id: "u1", email: "a@b.com" });

    const req = new Request("http://localhost/api/analysis", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "getStatistics", token: "t", timeFrame: "nope" }),
    });

    const res = await POST(req);
    expect(res.status).toBe(400);
  });

  it("getTotalIncomeAndExpenses returns 200 with sums", async () => {
    (jwt as any).verify.mockReturnValue({ id: "u1", email: "a@b.com" });
    (prisma as any).transaction.aggregate
      .mockResolvedValueOnce({ _sum: { amount: 500 } })
      .mockResolvedValueOnce({ _sum: { amount: 200 } });

    const req = new Request("http://localhost/api/analysis", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "getTotalIncomeAndExpenses", token: "t" }),
    });

    const res = await POST(req);
    expect(res.status).toBe(200);

    const body = await res.json();
    expect(body.totalMonthlyIncome).toBe(500);
    expect(body.totalMonthlyExpenses).toBe(200);
  });
});
