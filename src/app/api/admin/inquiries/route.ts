import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import { Inquiry } from "@/lib/models/Inquiry";
import { getAdminFromRequest } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const admin = await getAdminFromRequest(req);
    if (!admin) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    await connectToDatabase();
    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");

    const query: Record<string, unknown> = {};
    if (status && status !== "all") query.status = status;
    if (startDate || endDate) {
      const dateFilter: Record<string, any> = {};
      if (startDate) dateFilter.$gte = new Date(startDate);
      if (endDate) {
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        dateFilter.$lte = end;
      }
      query.createdAt = dateFilter;
    }

    const inquiries = await Inquiry.find(query).sort({ createdAt: -1 });

    return NextResponse.json({ success: true, inquiries });
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
    const body = await req.json();

    if (!body.name || !body.phone) {
      return NextResponse.json(
        { success: false, message: "Client name and Phone number are required." },
        { status: 400 }
      );
    }

    const newInquiry = await Inquiry.create({
      name: body.name.trim(),
      phone: body.phone.trim(),
      email: (body.email || "").trim(),
      date: body.date || "",
      eventType: body.eventType || "Wedding",
      guestCount: body.guestCount || "",
      budget: body.budget || "",
      message: body.message || "",
      status: body.status || "pending",
      adminNotes: body.adminNotes || "",
      source: body.source || "Admin Manual Entry",
    });

    return NextResponse.json({ success: true, inquiry: newInquiry }, { status: 201 });
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
    const body = await req.json();
    const { id } = body;

    if (!id) {
      return NextResponse.json({ success: false, message: "Inquiry ID required" }, { status: 400 });
    }

    const updateData: Record<string, any> = {};
    if (body.name !== undefined) updateData.name = body.name.trim();
    if (body.phone !== undefined) updateData.phone = body.phone.trim();
    if (body.email !== undefined) updateData.email = body.email.trim();
    if (body.date !== undefined) updateData.date = body.date;
    if (body.eventType !== undefined) updateData.eventType = body.eventType;
    if (body.guestCount !== undefined) updateData.guestCount = body.guestCount;
    if (body.budget !== undefined) updateData.budget = body.budget;
    if (body.message !== undefined) updateData.message = body.message;
    if (body.status !== undefined) updateData.status = body.status;
    if (body.adminNotes !== undefined) updateData.adminNotes = body.adminNotes;

    const updated = await Inquiry.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true }
    );

    return NextResponse.json({ success: true, inquiry: updated });
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
      return NextResponse.json({ success: false, message: "Inquiry ID required" }, { status: 400 });
    }

    await Inquiry.findByIdAndDelete(id);
    return NextResponse.json({ success: true, message: "Inquiry deleted" });
  } catch (error: unknown) {
    return NextResponse.json({ success: false, message: (error as Error).message }, { status: 500 });
  }
}
