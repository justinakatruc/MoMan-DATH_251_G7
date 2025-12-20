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
    sign: jest.fn(),
    verify: jest.fn(),
  },
}));

const sendMailMock = jest.fn();
jest.mock("nodemailer", () => ({
  __esModule: true,
  default: {
    createTransport: () => ({ sendMail: sendMailMock }),
  },
}));

jest.mock("crypto", () => ({
  __esModule: true,
  default: {
    randomUUID: jest.fn().mockReturnValue("mock-uuid"),
  },
}));

jest.mock("@/lib/prisma", () => ({
  __esModule: true,
  default: {
    user: {
      findUnique: jest.fn(),
      update: jest.fn(),
      create: jest.fn(),
    },
    verify: {
      deleteMany: jest.fn(),
      create: jest.fn(),
      findUnique: jest.fn(),
      delete: jest.fn(),
    },
  },
}));

import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import prisma from "@/lib/prisma";
import { POST } from "@/app/api/auth/route";

describe("/api/auth route", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("UC-01: Register / Login", () => {
    // Signup
    it("should create a new user and send a verification email (Main Success Scenario)", async () => {
      (prisma as any).user.findUnique.mockResolvedValue(null);
      (bcrypt as any).hash.mockResolvedValue("hashedPassword");
      (prisma as any).user.create.mockResolvedValue({ id: "u1" });
      sendMailMock.mockResolvedValue({});

      const req = new Request("http://localhost/api/auth", {
        method: "POST",
        body: JSON.stringify({ action: "signup", fullName: "Test User", email: "test@example.com", password: "pw" }),
      });

      const res = await POST(req);
      expect(res.status).toBe(201);
      expect((prisma as any).user.create).toHaveBeenCalled();
      expect(sendMailMock).toHaveBeenCalled();
    });

    it("should return 409 if user already exists (Alternative Flow A1)", async () => {
      (prisma as any).user.findUnique.mockResolvedValue({ id: "u1", isActive: true });
      const req = new Request("http://localhost/api/auth", {
        method: "POST",
        body: JSON.stringify({ action: "signup", fullName: "Test User", email: "test@example.com", password: "pw" }),
      });
      const res = await POST(req);
      expect(res.status).toBe(409);
    });

    it("should handle unverified account exists (Alternative Flow)", async () => {
      (prisma as any).user.findUnique.mockResolvedValue({ id: "u1", isActive: false });
      (bcrypt as any).hash.mockResolvedValue("hashedPassword");
      (prisma as any).user.update.mockResolvedValue({ id: "u1" });
      sendMailMock.mockResolvedValue({});

      const req = new Request("http://localhost/api/auth", {
        method: "POST",
        body: JSON.stringify({ action: "signup", fullName: "Test User", email: "test@example.com", password: "pw" }),
      });

      const res = await POST(req);
      expect(res.status).toBe(200);
      expect((prisma as any).user.update).toHaveBeenCalled();
    });

    // Login
    it("should log in an existing user with correct credentials (Main Success Scenario)", async () => {
      (prisma as any).user.findUnique.mockResolvedValue({
        id: "u1",
        password: "hashedPassword",
        isActive: true,
        accountType: "User",
      });
      (bcrypt as any).compare.mockResolvedValue(true);
      (jwt as any).sign.mockReturnValue("jwt-token");

      const req = new Request("http://localhost/api/auth", {
        method: "POST",
        body: JSON.stringify({ action: "login", email: "test@example.com", password: "pw" }),
      });

      const res = await POST(req);
      expect(res.status).toBe(200);
      const body = await res.json();
      expect(body.token).toBe("jwt-token");
    });

    it("should return 401 for incorrect password (Alternative Flow A1)", async () => {
      (prisma as any).user.findUnique.mockResolvedValue({ password: "hashedPassword", isActive: true });
      (bcrypt as any).compare.mockResolvedValue(false);
      const req = new Request("http://localhost/api/auth", {
        method: "POST",
        body: JSON.stringify({ action: "login", email: "test@example.com", password: "wrong-pw" }),
      });
      const res = await POST(req);
      expect(res.status).toBe(401);
    });

    it("should return 401 if user not found (Alternative Flow A1)", async () => {
      (prisma as any).user.findUnique.mockResolvedValue(null);
      const req = new Request("http://localhost/api/auth", {
        method: "POST",
        body: JSON.stringify({ action: "login", email: "nonexistent@example.com", password: "pw" }),
      });
      const res = await POST(req);
      expect(res.status).toBe(401);
    });
  });

  describe("Email Verification", () => {
    it("should activate a user with a valid token", async () => {
      (prisma as any).verify.findUnique.mockResolvedValue({ userId: "u1", expiresAt: new Date(Date.now() + 60000) });
      (prisma as any).user.update.mockResolvedValue({});
      (prisma as any).verify.delete.mockResolvedValue({});
      const req = new Request("http://localhost/api/auth", {
        method: "POST",
        body: JSON.stringify({ action: "verify-email", token: "valid-token" }),
      });
      const res = await POST(req);
      expect(res.status).toBe(200);
      expect((prisma as any).user.update).toHaveBeenCalledWith({ where: { id: "u1" }, data: { isActive: true } });
    });

    it("should return 400 for an invalid token", async () => {
      (prisma as any).verify.findUnique.mockResolvedValue(null);
      const req = new Request("http://localhost/api/auth", {
        method: "POST",
        body: JSON.stringify({ action: "verify-email", token: "invalid-token" }),
      });
      const res = await POST(req);
      expect(res.status).toBe(400);
    });
  });

  describe("Password Recovery (Forgot/Reset)", () => {
    it("should send a password reset email for a valid user", async () => {
      (prisma as any).user.findUnique.mockResolvedValue({ id: "u1", email: "test@example.com" });
      sendMailMock.mockResolvedValue({});
      const req = new Request("http://localhost/api/auth", {
        method: "POST",
        body: JSON.stringify({ action: "forgot-password", email: "test@example.com" }),
      });
      const res = await POST(req);
      expect(res.status).toBe(200);
      expect(sendMailMock).toHaveBeenCalled();
    });

    it("should reset the password with a valid token", async () => {
      (jwt as any).verify.mockReturnValue({ id: "u1" });
      (bcrypt as any).hash.mockResolvedValue("newHashedPassword");
      (prisma as any).user.update.mockResolvedValue({});
      const req = new Request("http://localhost/api/auth", {
        method: "POST",
        body: JSON.stringify({ action: "reset-password", token: "valid-token", password: "new-password" }),
      });
      const res = await POST(req);
      expect(res.status).toBe(200);
      expect((prisma as any).user.update).toHaveBeenCalledWith(
        expect.objectContaining({ data: { password: "newHashedPassword" } })
      );
    });
  });

  describe("UC-02: Logout", () => {
    it("should log out an authenticated user (Main Success Scenario)", async () => {
      (jwt as any).verify.mockReturnValue({ id: "u1" });
      (prisma as any).user.update.mockResolvedValue({});
      const req = new Request("http://localhost/api/auth", {
        method: "POST",
        body: JSON.stringify({ action: "logout", token: "valid-token" }),
      });
      const res = await POST(req);
      expect(res.status).toBe(200);
      expect((prisma as any).user.update).toHaveBeenCalledWith({ where: { id: "u1" }, data: { isActive: false } });
    });

    it("should return 401 for an invalid token", async () => {
      (jwt as any).verify.mockImplementation(() => {
        throw new Error("Invalid token");
      });
      const req = new Request("http://localhost/api/auth", {
        method: "POST",
        body: JSON.stringify({ action: "logout", token: "invalid-token" }),
      });
      const res = await POST(req);
      expect(res.status).toBe(401);
    });
  });
});
