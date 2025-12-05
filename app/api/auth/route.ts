import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import crypto from "crypto";

const JWT_SECRET = process.env.JWT_SECRET || "fallback_secret";
  async function handleSignUp(data: {
    fullName: string;
    email: string;
    password: string;
  }) {
    const { fullName, email, password } = data;

    const missingFields: string[] = [];
    if (!fullName) missingFields.push("fullName");
    if (!email) missingFields.push("email");
    if (!password) missingFields.push("password");

    if (missingFields.length > 0) {
      return NextResponse.json(
        {
          success: false,
          message: "Missing required fields",
          missing: missingFields,
        },
        { status: 400 }
      );
    }

    const nameParts = fullName.trim().split(/\s+/);
    const lastName = nameParts.length > 1 ? nameParts.pop()! : "";
    const firstName = nameParts.join(" ");

    const existingUser = await prisma.user.findUnique({ where: { email } });

    // CASE: user exists but not verified
    if (existingUser && !existingUser.isActive) {
      const hashedPassword = await bcrypt.hash(password, 10);

      // update info
      const updatedUser = await prisma.user.update({
        where: { id: existingUser.id },
        data: {
          firstName,
          lastName,
          password: hashedPassword,
        },
      });

      const token = await generateVerifyToken(updatedUser.id);

      await sendVerificationEmail(email, token);

      return NextResponse.json(
        {
          success: true,
          message: "Unverified account exists. New verification email sent.",
        },
        { status: 200 }
      );
    }

    if (existingUser) {
      return NextResponse.json(
        { success: false, message: "User already exists." },
        { status: 409 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: {
        firstName,
        lastName,
        email,
        memberSince: new Date(),
        password: hashedPassword,
        accountType: "User",
        isActive: false,
      },
    });

    const token = await generateVerifyToken(newUser.id);

    await sendVerificationEmail(email, token);

    return NextResponse.json(
      {
        success: true,
        message: "User created. Verification email sent.",
      },
      { status: 201 }
    );
  }

  async function generateVerifyToken(userId: string) {
  
    await prisma.verify.deleteMany({
      where: { userId },
    });

    const token = crypto.randomUUID();
    const expiresAt = new Date(Date.now() + 1000 * 60 * 30);

    await prisma.verify.create({
      data: { userId, token, expiresAt },
    });

    return token;
  }

  async function sendVerificationEmail(email: string, token: string) {
    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const verifyLink = `${process.env.BASE_URL}/verify?token=${token}&email=${encodeURIComponent(email)}`;

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Verify Your Email",
      html: `
        <h2>Verify Your Email</h2>
        <p>Click the link below to verify your account:</p>
        <a href="${verifyLink}" target="_blank">Verify Email</a>
        <p>This link expires in <b>30 minutes</b>.</p>
      `,
    });
  }

  async function handleVerifyEmail(token: string) {
    if (!token) {
      return NextResponse.json(
        { success: false, message: "Token is required" },
        { status: 400 }
      );
    }

    const verifyRecord = await prisma.verify.findUnique({
      where: { token },
    });

    if (!verifyRecord) {
      return NextResponse.json(
        { success: false, message: "Invalid token" },
        { status: 400 }
      );
    }

    if (verifyRecord.expiresAt < new Date()) {
      return NextResponse.json(
        { success: false, message: "Token expired" },
        { status: 400 }
      );
    }

    await prisma.user.update({
      where: { id: verifyRecord.userId },
      data: { isActive: true },
    });

    await prisma.verify.delete({ where: { token } });

    return NextResponse.json(
      { success: true, message: "Email verified successfully" },
      { status: 200 }
    );
  }

async function handleResendVerify(email: string) {
  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) {
    return NextResponse.json(
      { success: false, message: "Email not found" },
      { status: 404 }
    );
  }

  if (user.isActive) {
    return NextResponse.json(
      { success: false, message: "Account already verified" },
      { status: 400 }
    );
  }

  let record = await prisma.verify.findFirst({
    where: { userId: user.id },
  });

  if (!record) {
    const newToken = await generateVerifyToken(user.id);
    await sendVerificationEmail(email, newToken);
    return NextResponse.json(
      { success: true, message: "Verification email resent" },
      { status: 200 }
    );
  }

  const cooldown = 60 * 1000;
  const now = Date.now();

  if (now - record.lastSentAt.getTime() < cooldown) {
    const sec = Math.ceil((cooldown - (now - record.lastSentAt.getTime())) / 1000);
    return NextResponse.json(
      { success: false, message: `Please wait ${sec}s before resending.` },
      { status: 429 }
    );
  }

  const oneDay = 24 * 60 * 60 * 1000;

  if (now - record.createdAt.getTime() > oneDay) {
    record = await prisma.verify.update({
      where: { id: record.id },
      data: { resendCount: 0, createdAt: new Date() },
    });
  }

  if (record.resendCount >= 5) {
    return NextResponse.json(
      { success: false, message: "Daily resend limit reached (5 times)." },
      { status: 429 }
    );
  }

  const newToken = await generateVerifyToken(user.id);

  await prisma.verify.update({
    where: { id: record.id },
    data: {
      token: newToken,
      lastSentAt: new Date(),
      resendCount: record.resendCount + 1,
      expiresAt: new Date(Date.now() + 60 * 60 * 1000),
    },
  });

  await sendVerificationEmail(email, newToken);

  return NextResponse.json(
    { success: true, message: "Verification email resent" },
    { status: 200 }
  );
}


// =====================================================
// LOGIN
// =====================================================

async function handleLogin(data: { email: string; password: string }) {
  const { email, password } = data;

  if (!email || !password) {
    return NextResponse.json(
      { success: false, message: "Missing required fields." },
      { status: 400 }
    );
  }

  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) {
    return NextResponse.json(
      { success: false, message: "Invalid email or password." },
      { status: 401 }
    );
  }

  if (!user.isActive) {
    return NextResponse.json(
      {
        success: false,
        message: "Your email is not verified. Please check your inbox.",
        needVerify: true,
      },
      { status: 403 }
    );
  }

  const match = await bcrypt.compare(password, user.password);

  if (!match) {
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
    { id: user.id, email: user.email, role: user.accountType },
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

// =====================================================
// LOGOUT
// =====================================================

async function handleLogout(token: string) {
  if (!token) {
    return NextResponse.json(
      { success: false, message: "Authentication token is missing." },
      { status: 401 }
    );
  }

  let decoded: any;
  try {
    decoded = jwt.verify(token, JWT_SECRET);
  } catch {
    return NextResponse.json(
      { success: false, message: "Invalid or expired token." },
      { status: 401 }
    );
  }

  await prisma.user.update({
    where: { id: decoded.id },
    data: { isActive: false },
  });

  return NextResponse.json(
    { success: true, message: "Logged out successfully." },
    { status: 200 }
  );
}

// =====================================================
// FORGOT PASSWORD
// =====================================================

async function handleForgotPassword(email: string) {
  if (!email) {
    return NextResponse.json(
      { success: false, message: "Email is required" },
      { status: 400 }
    );
  }

  const user = await prisma.user.findUnique({ where: { email } });

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

  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Reset Your Password",
    html: `Click here: <a href="${resetLink}">${resetLink}</a>`,
  });

  return NextResponse.json(
    { success: true, message: "Password reset link sent." },
    { status: 200 }
  );
}

// =====================================================
// RESET PASSWORD
// =====================================================

async function handleResetPassword(token: string, password: string) {
  if (!token || !password) {
    return NextResponse.json(
      { success: false, message: "Missing fields." },
      { status: 400 }
    );
  }

  let decoded: any;
  try {
    decoded = jwt.verify(token, JWT_SECRET);
  } catch {
    return NextResponse.json(
      { success: false, message: "Invalid or expired token." },
      { status: 401 }
    );
  }

  const userId = decoded.id;

  const hashedPassword = await bcrypt.hash(password, 10);

  await prisma.user.update({
    where: { id: decoded.id },
    data: { password: hashedPassword },
  });

  return NextResponse.json(
    { success: true, message: "Password reset successfully." },
    { status: 200 }
  );
}

// =====================================================
// AUTHORIZE
// =====================================================

async function handleAuthorize(token: string) {
  if (!token) {
    return NextResponse.json(
      { success: false, message: "Missing token" },
      { status: 401 }
    );
  }

  let decoded: any;
  try {
    decoded = jwt.verify(token, JWT_SECRET);
  } catch {
    return NextResponse.json(
      { success: false, message: "Invalid or expired token" },
      { status: 401 }
    );
  }

  const user = await prisma.user.findUnique({ where: { id: decoded.id } });

  if (!user) {
    return NextResponse.json(
      { success: false, message: "User not found" },
      { status: 404 }
    );
  }

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

// =====================================================
// MAIN ROUTE HANDLER
// =====================================================

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
        return handleSignUp(userData);
      case "verify-email":
        return handleVerifyEmail(token);
      case "resend-verify-email":
        return handleResendVerify(userData.email);
      case "login":
        return handleLogin(userData);
      case "logout":
        return handleLogout(token);
      case "forgot-password":
        return handleForgotPassword(userData.email);
      case "reset-password":
        return handleResetPassword(token, userData.password);
      case "authorize":
        return handleAuthorize(token);
      
      default:
        return NextResponse.json(
          { success: false, message: "Invalid action." },
          { status: 400 }
        );
    }
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { success: false, message: "Internal server error." },
      { status: 500 }
    );
  }
}
