/** @jest-environment node */

jest.mock("bcryptjs", () => ({
  __esModule: true,
  default: { hash: jest.fn(), compare: jest.fn() },
}));

jest.mock("jsonwebtoken", () => ({
  __esModule: true,
  default: { verify: jest.fn().mockReturnValue({ id: "u1" }) },
}));

jest.mock("@/lib/prisma", () => ({
  __esModule: true,
  default: {
    user: { findUnique: jest.fn(), update: jest.fn(), delete: jest.fn() },
    transaction: { deleteMany: jest.fn() },
  },
}));

import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";
import { PUT } from "@/app/api/users/route";

describe("UC-03: Manage Accounts - /api/users", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should update a user's profile information (Main Success Scenario)", async () => {
    (prisma as any).user.update.mockResolvedValue({ email: "new@example.com" });

    const req = new Request("http://localhost/api/users", {
      method: "PUT",
      body: JSON.stringify({
        action: "updateUserProfile",
        token: "t",
        updatedData: { firstName: "New", email: "new@example.com" },
      }),
    });

    const res = await PUT(req);
    const body = await res.json();
    expect(res.status).toBe(200);
    expect(body.user.email).toBe("new@example.com");
  });

  it("should return 400 if profile update fails (Alternative Flow 2 - Email already taken)", async () => {
    (prisma as any).user.update.mockRejectedValue(new Error("Unique constraint failed"));

    const req = new Request("http://localhost/api/users", {
      method: "PUT",
      body: JSON.stringify({
        action: "updateUserProfile",
        token: "t",
        updatedData: { email: "taken@example.com" },
      }),
    });

    const res = await PUT(req);
    expect(res.status).toBe(500); // The code catches and returns 500 for general errors
  });

  it("should reject password update with incorrect current password (Alternative Flow 1)", async () => {
    (prisma as any).user.findUnique.mockResolvedValue({ password: "hashed" });
    (bcrypt as any).compare.mockResolvedValue(false);

    const req = new Request("http://localhost/api/users", {
      method: "PUT",
      body: JSON.stringify({
        action: "updatePassword",
        token: "t",
        currentPassword: "wrong-old-pw",
        newPassword: "new-pw",
      }),
    });

    const res = await PUT(req);
    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.message).toMatch(/incorrect/i);
  });

  it("should update the password with correct current password (Main Success Scenario)", async () => {
    (prisma as any).user.findUnique.mockResolvedValue({ password: "hashed" });
    (bcrypt as any).compare.mockResolvedValue(true);
    (bcrypt as any).hash.mockResolvedValue("new-hashed");
    (prisma as any).user.update.mockResolvedValue({});

    const req = new Request("http://localhost/api/users", {
      method: "PUT",
      body: JSON.stringify({
        action: "updatePassword",
        token: "t",
        currentPassword: "old-pw",
        newPassword: "new-pw",
      }),
    });

    const res = await PUT(req);
    expect(res.status).toBe(200);
    expect((prisma as any).user.update).toHaveBeenCalledWith(
      expect.objectContaining({ data: { password: "new-hashed" } })
    );
  });

  it("should delete the user account with correct password", async () => {
    (prisma as any).user.findUnique.mockResolvedValue({ password: "hashed" });
    (bcrypt as any).compare.mockResolvedValue(true);
    (prisma as any).transaction.deleteMany.mockResolvedValue({});
    (prisma as any).user.delete.mockResolvedValue({});

    const req = new Request("http://localhost/api/users", {
      method: "PUT",
      body: JSON.stringify({ action: "deleteAccount", token: "t", password: "pw" }),
    });

    const res = await PUT(req);
    expect(res.status).toBe(200);
    expect((prisma as any).user.delete).toHaveBeenCalledWith({ where: { id: "u1" } });
  });
});
