/** @jest-environment node */

jest.mock("bcryptjs", () => ({
  __esModule: true,
  default: {
    hash: jest.fn(),
    compare: jest.fn(),
  },
}));

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
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    transaction: {
      deleteMany: jest.fn(),
    },
  },
}));

import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import prisma from "@/lib/prisma";
import { PUT } from "@/app/api/users/route";

describe("/api/users route", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("returns 401 when token missing", async () => {
    const req = new Request("http://localhost/api/users", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "updatePassword" }),
    });

    const res = await PUT(req);
    expect(res.status).toBe(401);
  });

  it("updatePassword returns 400 when current password incorrect", async () => {
    (jwt as any).verify.mockReturnValue({ id: "u1" });
    (prisma as any).user.findUnique.mockResolvedValue({ id: "u1", password: "hashed" });
    (bcrypt as any).compare.mockResolvedValue(false);

    const req = new Request("http://localhost/api/users", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "updatePassword",
        token: "t",
        currentPassword: "old",
        newPassword: "new",
      }),
    });

    const res = await PUT(req);
    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.message).toMatch(/incorrect/i);
  });

  it("deleteAccount deletes user when password matches", async () => {
    (jwt as any).verify.mockReturnValue({ id: "u1" });
    (prisma as any).user.findUnique.mockResolvedValue({ id: "u1", password: "hashed" });
    (bcrypt as any).compare.mockResolvedValue(true);
    (prisma as any).transaction.deleteMany.mockResolvedValue({});
    (prisma as any).user.delete.mockResolvedValue({});

    const req = new Request("http://localhost/api/users", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "deleteAccount", token: "t", password: "pw" }),
    });

    const res = await PUT(req);
    expect(res.status).toBe(200);
    expect((prisma as any).transaction.deleteMany).toHaveBeenCalled();
    expect((prisma as any).user.delete).toHaveBeenCalled();
  });
});
