import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";

const JWT_SECRET = process.env.JWT_SECRET || "fallback_secret";

async function handleUpdateUserProfile(
  userId: string,
  updatedData: {
    firstName?: string;
    lastName?: string;
    email?: string;
    password?: string;
  }
) {
  try {
    if (updatedData.password) {
      const hashedPassword = await bcrypt.hash(updatedData.password, 10);
      updatedData.password = hashedPassword;
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: updatedData,
    });
    if (updatedUser) {
      return NextResponse.json(
        {
          success: true,
          user: {
            id: updatedUser.id,
            firstName: updatedUser.firstName,
            lastName: updatedUser.lastName,
            email: updatedUser.email,
            memberSince: updatedUser.memberSince,
            accountType: updatedUser.accountType,
          },
        },
        { status: 200 }
      );
    }
    return NextResponse.json(
      { success: false, error: "Failed to update user" },
      { status: 400 }
    );
  } catch (error) {
    console.error("Error updating user profile:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { action, token } = body;

    if (!token) {
      return NextResponse.json(
        { error: "Authentication token is required" },
        { status: 401 }
      );
    }

    let decoded: { id: string; email: string };
    try {
      decoded = jwt.verify(token, JWT_SECRET) as { id: string; email: string };
    } catch (error) {
      console.error("Invalid token:", error);
      return NextResponse.json(
        { error: "Invalid authentication token" },
        { status: 401 }
      );
    }

    const userId = decoded.id;

    if (!action) {
      return NextResponse.json(
        { error: "Action is required" },
        { status: 400 }
      );
    }

    switch (action) {
      case "updateUserProfile":
        const { updatedData } = body;
        return await handleUpdateUserProfile(userId, updatedData);
      default:
        return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }
  } catch (error) {
    console.error("Error in users route:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
