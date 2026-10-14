import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import connectToDatabase from "@/lib/db";
import { AdminUser } from "@/lib/models/AdminUser";
import { getAdminFromRequest } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const currentAdmin = await getAdminFromRequest(req);
    if (!currentAdmin) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    await connectToDatabase();
    const users = await AdminUser.find()
      .select("-passwordHash")
      .sort({ createdAt: -1 });

    return NextResponse.json({ success: true, users });
  } catch (error: unknown) {
    return NextResponse.json({ success: false, message: (error as Error).message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const currentAdmin = await getAdminFromRequest(req);
    if (!currentAdmin) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    await connectToDatabase();
    const { name, email, password, role = "superadmin" } = await req.json();

    if (!email || !email.includes("@")) {
      return NextResponse.json({ success: false, message: "Valid email address is required" }, { status: 400 });
    }

    if (!password || password.length < 6) {
      return NextResponse.json({ success: false, message: "Password must be at least 6 characters" }, { status: 400 });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const existing = await AdminUser.findOne({ email: normalizedEmail });
    if (existing) {
      return NextResponse.json(
        { success: false, message: `An admin user with email ${normalizedEmail} already exists` },
        { status: 409 }
      );
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const newUser = await AdminUser.create({
      name: name?.trim() || "Admin",
      email: normalizedEmail,
      passwordHash,
      role: role === "editor" ? "editor" : "superadmin",
    });

    return NextResponse.json({
      success: true,
      message: `Admin access granted to ${normalizedEmail}`,
      user: {
        _id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        createdAt: newUser.createdAt,
      },
    });
  } catch (error: unknown) {
    return NextResponse.json({ success: false, message: (error as Error).message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const currentAdmin = await getAdminFromRequest(req);
    if (!currentAdmin) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    await connectToDatabase();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ success: false, message: "Admin user ID required" }, { status: 400 });
    }

    // Safety check 1: Cannot delete own logged-in account
    if (currentAdmin.adminId === id) {
      return NextResponse.json(
        { success: false, message: "You cannot delete your own admin account while logged in" },
        { status: 400 }
      );
    }

    // Safety check 2: Cannot delete if it is the only remaining admin
    const totalAdmins = await AdminUser.countDocuments();
    if (totalAdmins <= 1) {
      return NextResponse.json(
        { success: false, message: "Cannot delete the last remaining admin account" },
        { status: 400 }
      );
    }

    const deleted = await AdminUser.findByIdAndDelete(id);
    if (!deleted) {
      return NextResponse.json({ success: false, message: "Admin user not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: `Admin access revoked for ${deleted.email}`,
    });
  } catch (error: unknown) {
    return NextResponse.json({ success: false, message: (error as Error).message }, { status: 500 });
  }
}
