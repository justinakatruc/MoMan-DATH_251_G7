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

  const token = jwt.sign(
    {
      id: user.id,
      email: user.email,
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

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { action, ...userData } = body;

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
