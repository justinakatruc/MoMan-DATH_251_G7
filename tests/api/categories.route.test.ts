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

import jwt from "jsonwebtoken";

import { POST } from "@/app/api/categories/route";

describe("/api/categories route", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("returns 400 when token is missing", async () => {
    const req = new Request("http://localhost/api/categories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "getDefaultCategories" }),
    });

    const res = await POST(req);
    expect(res.status).toBe(400);

    const body = await res.json();
    expect(body.success).toBe(false);
    expect(body.message).toMatch(/missing token/i);
  });

  it("returns 401 when token is invalid", async () => {
    const consoleErrorSpy = jest
      .spyOn(console, "error")
      .mockImplementation(() => undefined);

    (jwt as any).verify.mockImplementation(() => {
      throw new Error("bad token");
    });

    const req = new Request("http://localhost/api/categories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "getDefaultCategories", token: "x" }),
    });

    const res = await POST(req);
    expect(res.status).toBe(401);

    const body = await res.json();
    expect(body.success).toBe(false);
    expect(body.message).toMatch(/invalid|expired/i);

    consoleErrorSpy.mockRestore();
  });

  it("returns 400 for invalid action", async () => {
    (jwt as any).verify.mockReturnValue({ id: "user-1", email: "a@b.com" });

    const req = new Request("http://localhost/api/categories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "nope", token: "ok" }),
    });

    const res = await POST(req);
    expect(res.status).toBe(400);

    const body = await res.json();
    expect(body.success).toBe(false);
    expect(body.message).toMatch(/invalid action/i);
  });
});
