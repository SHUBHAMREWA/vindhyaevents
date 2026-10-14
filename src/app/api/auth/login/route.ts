import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import connectToDatabase from "@/lib/db";
import { AdminUser } from "@/lib/models/AdminUser";
import { signAdminToken, ADMIN_COOKIE_NAME } from "@/lib/auth";
import { seedDatabaseIfEmpty } from "@/lib/seed";

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: "Email and password are required" },
        { status: 400 }
      );
    }

    await connectToDatabase();
    await seedDatabaseIfEmpty();

    const normalizedEmail = email.toLowerCase().trim();
    const admin = await AdminUser.findOne({ email: normalizedEmail });

    if (!admin) {
      return NextResponse.json(
        { success: false, message: "Invalid email or password" },
        { status: 401 }
      );
    }

    const isMatch = await bcrypt.compare(password, admin.passwordHash);
    if (!isMatch) {
      return NextResponse.json(
        { success: false, message: "Invalid email or password" },
        { status: 401 }
      );
    }

    // Update lastLogin
    admin.lastLogin = new Date();
    await admin.save();

    const token = await signAdminToken({
      adminId: admin._id.toString(),
      email: admin.email,
      role: admin.role,
      name: admin.name,
    });

    const response = NextResponse.json({
      success: true,
      message: "Login successful",
      admin: {
        id: admin._id,
        email: admin.email,
        name: admin.name,
        role: admin.role,
      },
    });

    response.cookies.set({
      name: ADMIN_COOKIE_NAME,
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return response;
  } catch (error: unknown) {
    console.error("Login API error:", error);
    return NextResponse.json(
      { success: false, message: (error as Error).message || "Internal server error" },
      { status: 500 }
    );
  }
}
