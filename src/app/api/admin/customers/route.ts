import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import { Customer } from "@/lib/models/Customer";
import { getAdminFromRequest } from "@/lib/auth";
import { safeDeleteCloudinaryImage } from "@/lib/cloudinary";

export async function GET(req: NextRequest) {
  try {
    const admin = await getAdminFromRequest(req);
    if (!admin) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    await connectToDatabase();
    const { searchParams } = new URL(req.url);

    const search = searchParams.get("search")?.trim() || "";
    const tier = searchParams.get("tier");
    const profession = searchParams.get("profession");
    const city = searchParams.get("city");
    const birthMonth = searchParams.get("birthMonth"); // 1-12

    const query: any = {};

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { phone: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { professions: { $regex: search, $options: "i" } },
        { tags: { $regex: search, $options: "i" } },
        { "locations.city": { $regex: search, $options: "i" } },
        { "locations.state": { $regex: search, $options: "i" } },
        { "locations.address": { $regex: search, $options: "i" } },
      ];
    }

    if (tier && tier !== "all") {
      query.customerTier = tier;
    }

    if (profession && profession !== "all") {
      query.professions = { $in: [profession] };
    }

    if (city && city !== "all") {
      query["locations.city"] = { $regex: city, $options: "i" };
    }

    let customers = await Customer.find(query).sort({ createdAt: -1 });

    // Optional filter by birth month if selected
    if (birthMonth && birthMonth !== "all") {
      const monthIndex = parseInt(birthMonth, 10);
      if (!isNaN(monthIndex) && monthIndex >= 1 && monthIndex <= 12) {
        customers = customers.filter((c) => {
          if (!c.dateOfBirth) return false;
          return new Date(c.dateOfBirth).getMonth() + 1 === monthIndex;
        });
      }
    }

    return NextResponse.json({ success: true, customers });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const admin = await getAdminFromRequest(req);
    if (!admin) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    await connectToDatabase();
    const body = await req.json();

    if (!body.name?.trim() || !body.phone?.trim()) {
      return NextResponse.json(
        { success: false, message: "Name and Phone number are required." },
        { status: 400 }
      );
    }

    // Auto-calculate age if DOB is provided and age is not explicitly set
    let age = body.age;
    if (body.dateOfBirth && !age) {
      const diffMs = Date.now() - new Date(body.dateOfBirth).getTime();
      age = Math.floor(diffMs / (1000 * 60 * 60 * 24 * 365.25));
    }

    const formatChildren = (children: any[]) => {
      if (!Array.isArray(children)) return [];
      return children
        .map((c) => ({
          name: c.name?.trim() || "",
          relation: c.relation?.trim() || "Son",
          gender: c.gender || "Other",
          age: typeof c.age === "number" ? c.age : (c.age ? parseInt(c.age, 10) : undefined),
          dateOfBirth: c.dateOfBirth ? new Date(c.dateOfBirth) : undefined,
          maritalStatus: (c.maritalStatus === "Married" ? "Married" : "Unmarried") as "Married" | "Unmarried",
          notes: c.notes?.trim() || "",
        }))
        .filter((c) => c.name.length > 0 || c.notes.length > 0 || c.age !== undefined);
    };

    const customer = await Customer.create({
      name: body.name.trim(),
      phone: body.phone.trim(),
      whatsappNumber: body.whatsappNumber?.trim() || body.phone.trim(),
      email: body.email?.trim() || "",
      photo: body.photo || { url: "", public_id: "" },
      professions: Array.isArray(body.professions) ? body.professions.filter(Boolean) : [],
      locations: Array.isArray(body.locations) ? body.locations : [],
      dateOfBirth: body.dateOfBirth ? new Date(body.dateOfBirth) : undefined,
      age: age || undefined,
      anniversaryDate: body.anniversaryDate ? new Date(body.anniversaryDate) : undefined,
      maritalStatus: body.maritalStatus || "Married",
      spouseName: body.spouseName || "",
      children: formatChildren(body.children),
      customerTier: body.customerTier || "Mid-Level",
      tags: Array.isArray(body.tags) ? body.tags.filter(Boolean) : [],
      notes: body.notes || "",
    });

    return NextResponse.json({ success: true, customer }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const admin = await getAdminFromRequest(req);
    if (!admin) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    await connectToDatabase();
    const body = await req.json();
    const { id, ...updates } = body;

    if (!id) {
      return NextResponse.json({ success: false, message: "Customer ID is required." }, { status: 400 });
    }

    const existing = await Customer.findById(id);
    if (!existing) {
      return NextResponse.json({ success: false, message: "Customer not found." }, { status: 404 });
    }

    // Safe Cloudinary cleanup if photo was replaced or removed
    if (updates.photo && existing.photo?.url && existing.photo.url !== updates.photo.url) {
      await safeDeleteCloudinaryImage(existing.photo.public_id || existing.photo.url);
    }

    if (Array.isArray(updates.children)) {
      updates.children = updates.children
        .map((c: any) => ({
          name: c.name?.trim() || "",
          relation: c.relation?.trim() || "Son",
          gender: c.gender || "Other",
          age: typeof c.age === "number" ? c.age : (c.age ? parseInt(c.age, 10) : undefined),
          dateOfBirth: c.dateOfBirth ? new Date(c.dateOfBirth) : undefined,
          maritalStatus: c.maritalStatus === "Married" ? "Married" : "Unmarried",
          notes: c.notes?.trim() || "",
        }))
        .filter((c: any) => c.name.length > 0 || c.notes.length > 0 || c.age !== undefined);
    }

    // Recalculate age if DOB changed
    if (updates.dateOfBirth && !updates.age) {
      const diffMs = Date.now() - new Date(updates.dateOfBirth).getTime();
      updates.age = Math.floor(diffMs / (1000 * 60 * 60 * 24 * 365.25));
    }

    const updated = await Customer.findByIdAndUpdate(id, { $set: updates }, { new: true });
    return NextResponse.json({ success: true, customer: updated });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const admin = await getAdminFromRequest(req);
    if (!admin) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    await connectToDatabase();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ success: false, message: "Customer ID is required." }, { status: 400 });
    }

    const existing = await Customer.findById(id);
    if (existing?.photo?.url) {
      await safeDeleteCloudinaryImage(existing.photo.public_id || existing.photo.url);
    }

    await Customer.findByIdAndDelete(id);
    return NextResponse.json({ success: true, message: "Customer deleted successfully" });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
