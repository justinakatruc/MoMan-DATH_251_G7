import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";

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

async function handleForgotPassword(email: string) {
  if (!email) {
    return NextResponse.json(
      { success: false, message: "Email is required" },
      { status: 400 }
    );
  }

  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    return NextResponse.json(
      { success: false, message: "Email not found" },
      { status: 404 }
    );
  }

  const resetToken = jwt.sign({ id: user.id }, JWT_SECRET, {
    expiresIn: "1h", 
  });

  const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const resetLink = `${process.env.BASE_URL}/reset-password?token=${resetToken}`;

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Reset Your Password",
    html: `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e5e5e5; border-radius: 8px;">
      <h2 style="text-align: center; color: #333;">Password Reset Request</h2>
      
      <p style="font-size: 15px; color: #555;">
        We received a request to reset your password. Click the button below to proceed:
      </p>

      <div style="text-align: center; margin: 25px 0;">
        <a href="${resetLink}" 
          style="background-color: #4f46e5; color: #fff; padding: 12px 20px; text-decoration: none; border-radius: 6px; font-size: 16px;">
          Reset Password
        </a>
      </div>

      <p style="font-size: 14px; color: #555;">
        If the button doesn't work, you can use the link below:
      </p>

      <p style="word-break: break-all; font-size: 14px;">
        <a href="${resetLink}">${resetLink}</a>
      </p>

      <p style="font-size: 14px; color: #888;">
        If you did not request a password reset, please ignore this email. Your account is safe.
      </p>

      <p style="font-size: 13px; color: #aaa; text-align: center; margin-top: 30px;">
        This email was sent automatically. Please do not reply.
      </p>
    </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    return NextResponse.json(
      { success: true, message: "Password reset link sent to your email." },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error sending email:", error);
    return NextResponse.json(
      { success: false, message: "Failed to send reset link." },
      { status: 500 }
    );
  }}

async function handleResetPassword(token: string, password: string) {
  if (!token || !password) {
    return NextResponse.json(
      { success: false, message: "Missing required fields" },
      { status: 400 }
    );
  }

  let decoded: { id: string };
  try {
    decoded = jwt.verify(token, JWT_SECRET) as { id: string };
  } catch (error) {
    console.error("Token verification error:", error);
    return NextResponse.json(
      { success: false, message: "Invalid or expired token" },
      { status: 401 }
    );
  }

  const userId = decoded.id;

  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    await prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword },
    });

    return NextResponse.json(
      { success: true, message: "Password reset successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error resetting password:", error);
    return NextResponse.json(
      { success: false, message: "Failed to reset password." },
      { status: 500 }
    );
  }
}

async function handleAuthorize(token: string) {
  if (!token) {
    return NextResponse.json(
      { success: false, message: "Authentication token is missing" },
      { status: 401 }
    );
  }

  let decoded: { id: string; email: string };
  try {
    decoded = jwt.verify(token, JWT_SECRET) as { id: string; email: string };
  } catch (error) {
    console.error("Token verification error:", error);
    return NextResponse.json(
      { success: false, message: "Invalid or expired token" },
      { status: 401 }
    );
  }

  const user = await prisma.user.findUnique({
    where: { id: decoded.id },
  });

  if (!user) {
    return NextResponse.json(
      { success: false, message: "User not found" },
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
      case "forgot-password":
        return await handleForgotPassword(userData.email);
      case "reset-password":
        return await handleResetPassword(token, userData.password);
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
