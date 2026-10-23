import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import { Vendor } from "@/lib/models/Vendor";
import { getAdminFromRequest } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const admin = await getAdminFromRequest(req);
    if (!admin) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    await connectToDatabase();
    const { searchParams } = new URL(req.url);
    const service = searchParams.get("service");
    const city = searchParams.get("city");
    const state = searchParams.get("state");
    const search = searchParams.get("search");

    const query: Record<string, any> = {};
    if (service && service !== "all") {
      query.services = service;
    }
    if (city && city !== "all") {
      query.city = city;
    }
    if (state && state !== "all") {
      query.state = state;
    }
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { phone: { $regex: search, $options: "i" } },
        { city: { $regex: search, $options: "i" } },
        { state: { $regex: search, $options: "i" } },
        { services: { $regex: search, $options: "i" } },
      ];
    }

    const vendors = await Vendor.find(query).sort({ rating: -1, createdAt: -1 }).lean();
    return NextResponse.json({ success: true, vendors });
  } catch (error: unknown) {
    return NextResponse.json({ success: false, message: (error as Error).message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const admin = await getAdminFromRequest(req);
    if (!admin) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    await connectToDatabase();
    const data = await req.json();

    if (!data.name || !data.phone) {
      return NextResponse.json(
        { success: false, message: "Vendor Name and Phone are required" },
        { status: 400 }
      );
    }

    const cleanServices = Array.isArray(data.services)
      ? data.services.map((s: string) => s.trim()).filter(Boolean)
      : typeof data.services === "string"
      ? data.services.split(",").map((s: string) => s.trim()).filter(Boolean)
      : [];

    const newVendor = await Vendor.create({
      name: data.name.trim(),
      phone: data.phone.trim(),
      whatsappNumber: (data.whatsappNumber || data.phone).trim(),
      state: data.state?.trim() || "Madhya Pradesh",
      city: data.city?.trim() || "Rewa",
      address: data.address?.trim() || "",
      services: cleanServices,
      rateEstimate: data.rateEstimate?.trim() || "",
      rating: Number(data.rating) || 5,
      experienceYears: Number(data.experienceYears) || 3,
      upiId: data.upiId?.trim() || "",
      bankDetails: data.bankDetails?.trim() || "",
      notes: data.notes?.trim() || "",
      isActive: data.isActive !== undefined ? Boolean(data.isActive) : true,
      totalEventsDone: Number(data.totalEventsDone) || 0,
    });

    return NextResponse.json({ success: true, vendor: newVendor });
  } catch (error: unknown) {
    return NextResponse.json({ success: false, message: (error as Error).message }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const admin = await getAdminFromRequest(req);
    if (!admin) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    await connectToDatabase();
    const data = await req.json();
    const { id } = data;

    if (!id) {
      return NextResponse.json({ success: false, message: "Vendor ID is required" }, { status: 400 });
    }

    const updateFields: Record<string, any> = {};
    if (data.name !== undefined) updateFields.name = data.name.trim();
    if (data.phone !== undefined) updateFields.phone = data.phone.trim();
    if (data.whatsappNumber !== undefined) updateFields.whatsappNumber = data.whatsappNumber.trim();
    if (data.state !== undefined) updateFields.state = data.state.trim();
    if (data.city !== undefined) updateFields.city = data.city.trim();
    if (data.address !== undefined) updateFields.address = data.address.trim();
    if (data.services !== undefined) {
      updateFields.services = Array.isArray(data.services)
        ? data.services.map((s: string) => s.trim()).filter(Boolean)
        : typeof data.services === "string"
        ? data.services.split(",").map((s: string) => s.trim()).filter(Boolean)
        : [];
    }
    if (data.rateEstimate !== undefined) updateFields.rateEstimate = data.rateEstimate.trim();
    if (data.rating !== undefined) updateFields.rating = Number(data.rating) || 5;
    if (data.experienceYears !== undefined) updateFields.experienceYears = Number(data.experienceYears) || 0;
    if (data.upiId !== undefined) updateFields.upiId = data.upiId.trim();
    if (data.bankDetails !== undefined) updateFields.bankDetails = data.bankDetails.trim();
    if (data.notes !== undefined) updateFields.notes = data.notes.trim();
    if (data.isActive !== undefined) updateFields.isActive = Boolean(data.isActive);
    if (data.totalEventsDone !== undefined) updateFields.totalEventsDone = Number(data.totalEventsDone) || 0;

    const updated = await Vendor.findByIdAndUpdate(id, { $set: updateFields }, { new: true });
    return NextResponse.json({ success: true, vendor: updated });
  } catch (error: unknown) {
    return NextResponse.json({ success: false, message: (error as Error).message }, { status: 500 });
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
      return NextResponse.json({ success: false, message: "Vendor ID is required" }, { status: 400 });
    }

    await Vendor.findByIdAndDelete(id);
    return NextResponse.json({ success: true, message: "Vendor deleted successfully" });
  } catch (error: unknown) {
    return NextResponse.json({ success: false, message: (error as Error).message }, { status: 500 });
  }
}
