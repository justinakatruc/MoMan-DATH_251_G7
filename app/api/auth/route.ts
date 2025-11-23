import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "fallback_secret";

async function handleSignUp(data: {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}) {
  const { firstName, lastName, email, password } = data;
  if (!firstName || !lastName || !email || !password) {
    return NextResponse.json(
      { success: false, message: "Missing required fields." },
      { status: 400 }
    );
  }

  const exisitingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (exisitingUser) {
    return NextResponse.json(
      { success: false, message: "User already exists." },
      { status: 409 }
    );
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  await prisma.user.create({
    data: {
      firstName,
      lastName,
      email,
      memberSince: new Date(),
      password: hashedPassword,
      accountType: "User",
    },
  });

  return NextResponse.json({ success: true }, { status: 201 });
}

async function handleLogin(data: { email: string; password: string }) {
  const { email, password } = data;
  if (!email || !password) {
    return NextResponse.json(
      { success: false, message: "Missing required fields." },
      { status: 400 }
    );
  }

  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    return NextResponse.json(
      { success: false, message: "Invalid email or password." },
      { status: 401 }
    );
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    return NextResponse.json(
      { success: false, message: "Invalid email or password." },
      { status: 401 }
    );
  }

  await prisma.user.update({
    where: { id: user.id },
    data: { isActive: true },
  });

  const token = jwt.sign(
    {
      id: user.id,
      email: user.email,
      role: user.accountType,
    },
    JWT_SECRET,
    { expiresIn: "12h" }
  );

  return NextResponse.json(
    {
      success: true,
      token,
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        accountType: user.accountType,
        memberSince: user.memberSince,
      },
    },
    { status: 200 }
  );
}

async function handleLogout(token: string) {
  if (!token) {
    return NextResponse.json(
      { success: false, message: "Authentication token is missing." },
      { status: 401 }
    );
  }

  let decoded: { id: string; email: string };
  try {
    decoded = jwt.verify(token, JWT_SECRET) as { id: string; email: string };
  } catch (error) {
    console.error("Token verification error:", error);
    return NextResponse.json(
      { success: false, message: "Invalid or expired token." },
      { status: 401 }
    );
  }

  const userId = decoded.id;
  try {
    await prisma.user.update({
      where: { id: userId },
      data: { isActive: false },
    });
    return NextResponse.json(
      { success: true, message: "Logged out successfully." },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error logging out user:", error);
    return NextResponse.json(
      { success: false, message: "Failed to log out." },
      { status: 500 }
    );
  }
}

async function handleAuthorize(token: string) {
  if (!token) {
    return NextResponse.json(
      { success: false, message: "Authentication token is missing." },
      { status: 401 }
    );
  }

  let decoded: { id: string; email: string };
  try {
    decoded = jwt.verify(token, JWT_SECRET) as { id: string; email: string };
  } catch (error) {
    console.error("Token verification error:", error);
    return NextResponse.json(
      { success: false, message: "Invalid or expired token." },
      { status: 401 }
    );
  }

  const user = await prisma.user.findUnique({
    where: { id: decoded.id },
  });

  if (!user) {
    return NextResponse.json(
      { success: false, message: "User not found." },
      { status: 404 }
    );
  } else {
    await prisma.user.update({
      where: { id: user.id },
      data: { isActive: true },
    });

    return NextResponse.json(
      {
        success: true,
        user: {
          id: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          accountType: user.accountType,
          memberSince: user.memberSince,
        },
      },
      { status: 200 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { action, token, ...userData } = body;

    if (!action) {
      return NextResponse.json(
        { success: false, message: "Missing action field in request body." },
        { status: 400 }
      );
    }

    switch (action) {
      case "signup":
        return await handleSignUp(userData);
      case "login":
        return await handleLogin(userData);
      case "logout":
        return await handleLogout(token);
      case "authorize":
        return await handleAuthorize(token);
      default:
        return NextResponse.json(
          { success: false, message: "Invalid action." },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error("Error processing request:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error." },
      { status: 500 }
    );
  }
}
