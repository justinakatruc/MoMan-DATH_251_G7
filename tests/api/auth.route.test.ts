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
const createTransportMock = jest.fn(() => ({ sendMail: sendMailMock }));

jest.mock("nodemailer", () => ({
  __esModule: true,
  default: {
    createTransport: (...args: any[]) => createTransportMock(...args),
  },
}));

jest.mock("crypto", () => ({
  __esModule: true,
  default: {
    randomUUID: jest.fn(),
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
      findFirst: jest.fn(),
      update: jest.fn(),
    },
  },
}));

import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import prisma from "@/lib/prisma";
import { POST } from "@/app/api/auth/route";

describe("/api/auth route", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("signup", () => {
    it("returns 400 with missing fields", async () => {
      const req = new Request("http://localhost/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "signup", email: "a@b.com" }),
      });

      const res = await POST(req);
      expect(res.status).toBe(400);
      const body = await res.json();
      expect(body.success).toBe(false);
      expect(body.missing).toEqual(expect.arrayContaining(["fullName", "password"]));
    });

    it("returns 409 when user already exists (verified)", async () => {
      (prisma as any).user.findUnique.mockResolvedValue({
        id: "u1",
        email: "a@b.com",
        isActive: true,
      });

      const req = new Request("http://localhost/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "signup",
          fullName: "A B",
          email: "a@b.com",
          password: "pw",
        }),
      });

      const res = await POST(req);
      expect(res.status).toBe(409);
      const body = await res.json();
      expect(body.success).toBe(false);
      expect(body.message).toMatch(/already exists/i);
    });

    it("re-sends verification when unverified account exists", async () => {
      (prisma as any).user.findUnique.mockResolvedValue({
        id: "u1",
        email: "a@b.com",
        isActive: false,
      });
      (bcrypt as any).hash.mockResolvedValue("hashed");
      (prisma as any).user.update.mockResolvedValue({ id: "u1" });
      (crypto as any).randomUUID.mockReturnValue("verify-token");
      (prisma as any).verify.create.mockResolvedValue({});
      sendMailMock.mockResolvedValue({});

      const req = new Request("http://localhost/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "signup",
          fullName: "A B",
          email: "a@b.com",
          password: "pw",
        }),
      });

      const res = await POST(req);
      expect(res.status).toBe(200);
      const body = await res.json();
      expect(body.success).toBe(true);
      expect(sendMailMock).toHaveBeenCalledTimes(1);
    });
  });

  describe("verify-email", () => {
    it("returns 400 when token is missing", async () => {
      const req = new Request("http://localhost/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "verify-email" }),
      });

      const res = await POST(req);
      expect(res.status).toBe(400);
      const body = await res.json();
      expect(body.message).toMatch(/token is required/i);
    });

    it("returns 400 when token is invalid", async () => {
      (prisma as any).verify.findUnique.mockResolvedValue(null);

      const req = new Request("http://localhost/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "verify-email", token: "t" }),
      });

      const res = await POST(req);
      expect(res.status).toBe(400);
      const body = await res.json();
      expect(body.message).toMatch(/invalid token/i);
    });

    it("returns 400 when token is expired", async () => {
      (prisma as any).verify.findUnique.mockResolvedValue({
        token: "t",
        userId: "u1",
        expiresAt: new Date(Date.now() - 1000),
      });

      const req = new Request("http://localhost/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "verify-email", token: "t" }),
      });

      const res = await POST(req);
      expect(res.status).toBe(400);
      const body = await res.json();
      expect(body.message).toMatch(/expired/i);
    });

    it("activates user when token is valid", async () => {
      (prisma as any).verify.findUnique.mockResolvedValue({
        token: "t",
        userId: "u1",
        expiresAt: new Date(Date.now() + 60_000),
      });
      (prisma as any).user.update.mockResolvedValue({});
      (prisma as any).verify.delete.mockResolvedValue({});

      const req = new Request("http://localhost/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "verify-email", token: "t" }),
      });

      const res = await POST(req);
      expect(res.status).toBe(200);
      const body = await res.json();
      expect(body.success).toBe(true);
      expect((prisma as any).user.update).toHaveBeenCalled();
      expect((prisma as any).verify.delete).toHaveBeenCalled();
    });
  });

  describe("login", () => {
    it("returns 400 on missing credentials", async () => {
      const req = new Request("http://localhost/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "login", email: "a@b.com" }),
      });

      const res = await POST(req);
      expect(res.status).toBe(400);
    });

    it("returns 403 when user email not verified", async () => {
      (prisma as any).user.findUnique.mockResolvedValue({
        id: "u1",
        email: "a@b.com",
        password: "hashed",
        isActive: false,
      });

      const req = new Request("http://localhost/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "login", email: "a@b.com", password: "pw" }),
      });

      const res = await POST(req);
      expect(res.status).toBe(403);
      const body = await res.json();
      expect(body.needVerify).toBe(true);
    });

    it("returns 200 and signs JWT for valid credentials", async () => {
      (prisma as any).user.findUnique.mockResolvedValue({
        id: "u1",
        firstName: "A",
        lastName: "B",
        email: "a@b.com",
        password: "hashed",
        isActive: true,
        accountType: "Admin",
        memberSince: new Date("2024-01-01T00:00:00.000Z"),
      });
      (bcrypt as any).compare.mockResolvedValue(true);
      (jwt as any).sign.mockReturnValue("jwt-token");
      (prisma as any).user.update.mockResolvedValue({});

      const req = new Request("http://localhost/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "login", email: "a@b.com", password: "pw" }),
      });

      const res = await POST(req);
      expect(res.status).toBe(200);
      const body = await res.json();
      expect(body.success).toBe(true);
      expect(body.token).toBe("jwt-token");
      expect((jwt as any).sign).toHaveBeenCalledWith(
        expect.objectContaining({ role: "Admin" }),
        expect.any(String),
        expect.objectContaining({ expiresIn: "12h" })
      );
    });
  });

  describe("forgot-password & reset-password", () => {
    it("forgot-password returns 404 when email not found", async () => {
      (prisma as any).user.findUnique.mockResolvedValue(null);

      const req = new Request("http://localhost/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "forgot-password", email: "a@b.com" }),
      });

      const res = await POST(req);
      expect(res.status).toBe(404);
    });

    it("reset-password returns 401 for invalid token", async () => {
      (jwt as any).verify.mockImplementation(() => {
        throw new Error("bad");
      });

      const req = new Request("http://localhost/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "reset-password", token: "t", password: "new" }),
      });

      const res = await POST(req);
      expect(res.status).toBe(401);
    });

    it("reset-password updates hashed password", async () => {
      (jwt as any).verify.mockReturnValue({ id: "u1", email: "a@b.com", role: "User" });
      (bcrypt as any).hash.mockResolvedValue("hashed-new");
      (prisma as any).user.update.mockResolvedValue({});

      const req = new Request("http://localhost/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "reset-password", token: "t", password: "new" }),
      });

      const res = await POST(req);
      expect(res.status).toBe(200);
      const body = await res.json();
      expect(body.success).toBe(true);
      expect((prisma as any).user.update).toHaveBeenCalledWith(
        expect.objectContaining({ where: { id: "u1" } })
      );
    });
  });

  describe("authorize", () => {
    it("returns 401 when token missing", async () => {
      const req = new Request("http://localhost/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "authorize" }),
      });

      const res = await POST(req);
      expect(res.status).toBe(401);
    });

    it("returns 404 when user not found", async () => {
      (jwt as any).verify.mockReturnValue({ id: "u1", email: "a@b.com", role: "User" });
      (prisma as any).user.findUnique.mockResolvedValue(null);

      const req = new Request("http://localhost/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "authorize", token: "t" }),
      });

      const res = await POST(req);
      expect(res.status).toBe(404);
    });
  });
});
