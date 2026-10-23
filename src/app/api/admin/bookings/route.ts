import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import { Booking } from "@/lib/models/Booking";
import { Customer } from "@/lib/models/Customer";
import { getAdminFromRequest } from "@/lib/auth";

function sanitizeVendorPayouts(list: any[]) {
  if (!Array.isArray(list)) return [];
  return list.map((vp: any) => ({
    ...vp,
    _id: vp._id ? String(vp._id) : undefined,
    vendorId: vp.vendorId && String(vp.vendorId).trim() ? String(vp.vendorId).trim() : null,
    source: vp.source === "VendorList" ? "VendorList" : "Manual",
    name: String(vp.name || "").trim(),
    phone: String(vp.phone || "").trim(),
    serviceCategory: String(vp.serviceCategory || "Event Service").trim(),
    subEventName: String(vp.subEventName || "").trim(),
    agreedCost: Number(vp.agreedCost) || 0,
    commissionEarned: Number(vp.commissionEarned) || 0,
    totalPaid: Number(vp.totalPaid) || 0,
    balanceDue: Number(vp.balanceDue) || 0,
    payoutStatus: vp.payoutStatus || "Pending",
    payoutHistory: Array.isArray(vp.payoutHistory)
      ? vp.payoutHistory.map((ph: any) => ({
          amount: Number(ph.amount) || 0,
          paymentDate: ph.paymentDate ? new Date(ph.paymentDate) : new Date(),
          mode: ph.mode || "UPI",
          transactionRef: String(ph.transactionRef || "").trim(),
          note: String(ph.note || "").trim(),
        }))
      : [],
  }));
}

function sanitizeSubEvents(list: any[]) {
  if (!Array.isArray(list)) return [];
  return list.map((se: any) => ({
    ...se,
    subEventName: String(se.subEventName || "").trim(),
    date: se.date ? new Date(se.date) : new Date(),
    assignedPersons: Array.isArray(se.assignedPersons)
      ? se.assignedPersons.map((p: any) => ({
          ...p,
          vendorId: p.vendorId && String(p.vendorId).trim() ? String(p.vendorId).trim() : null,
          name: String(p.name || "").trim(),
          phone: String(p.phone || "").trim(),
          assignedCost: Number(p.assignedCost) || 0,
          commissionEarned: Number(p.commissionEarned) || 0,
          totalPaidToVendor: Number(p.totalPaidToVendor) || 0,
          balanceDueToVendor: Number(p.balanceDueToVendor) || 0,
        }))
      : [],
  }));
}

export async function GET(req: NextRequest) {
  try {
    const admin = await getAdminFromRequest(req);
    if (!admin) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    await connectToDatabase();
    const { searchParams } = new URL(req.url);

    const search = searchParams.get("search")?.trim() || "";
    const status = searchParams.get("status");
    const customerId = searchParams.get("customerId");
    const month = searchParams.get("month");
    const year = searchParams.get("year");
    const pageStr = searchParams.get("page");
    const limitStr = searchParams.get("limit");

    const query: any = {};

    if (search) {
      query.$or = [
        { bookingNumber: { $regex: search, $options: "i" } },
        { "customerSnapshot.name": { $regex: search, $options: "i" } },
        { "customerSnapshot.phone": { $regex: search, $options: "i" } },
        { "subEvents.subEventName": { $regex: search, $options: "i" } },
        { "subEvents.venueName": { $regex: search, $options: "i" } },
      ];
    }

    if (status && status !== "all") {
      query.status = status;
    }

    if (customerId) {
      query.customerId = customerId;
    }

    // Month & Year Date Filtering
    if (year && year !== "all") {
      const y = parseInt(year, 10);
      if (month && month !== "all") {
        const m = parseInt(month, 10) - 1; // 0-indexed month
        const start = new Date(Date.UTC(y, m, 1, 0, 0, 0));
        const end = new Date(Date.UTC(y, m + 1, 1, 0, 0, 0));
        query.primaryEventDate = { $gte: start, $lt: end };
      } else {
        const start = new Date(Date.UTC(y, 0, 1, 0, 0, 0));
        const end = new Date(Date.UTC(y + 1, 0, 1, 0, 0, 0));
        query.primaryEventDate = { $gte: start, $lt: end };
      }
    } else if (month && month !== "all") {
      const m = parseInt(month, 10);
      query.$expr = { $eq: [{ $month: "$primaryEventDate" }, m] };
    }

    const total = await Booking.countDocuments(query);

    let bookingsQuery = Booking.find(query).sort({ primaryEventDate: 1, createdAt: -1 });

    if (limitStr && limitStr !== "all") {
      const page = Math.max(1, parseInt(pageStr || "1", 10));
      const limit = Math.max(1, parseInt(limitStr, 10));
      const skip = (page - 1) * limit;
      bookingsQuery = bookingsQuery.skip(skip).limit(limit);

      const bookings = await bookingsQuery.lean();
      return NextResponse.json({
        success: true,
        bookings,
        pagination: {
          page,
          limit,
          total,
          hasMore: skip + bookings.length < total,
        },
      });
    }

    const bookings = await bookingsQuery.lean();
    return NextResponse.json({ success: true, bookings, total });
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

    if (!body.customerId) {
      return NextResponse.json({ success: false, message: "Customer selection is required." }, { status: 400 });
    }

    if (!body.primaryEventDate) {
      return NextResponse.json({ success: false, message: "Primary event date is required." }, { status: 400 });
    }

    const customer = await Customer.findById(body.customerId);
    if (!customer) {
      return NextResponse.json({ success: false, message: "Selected customer not found." }, { status: 404 });
    }

    // Auto-generate booking number: e.g. RWJ-2026-4821
    const year = new Date().getFullYear();
    const randomCode = Math.floor(1000 + Math.random() * 9000);
    const bookingNumber = body.bookingNumber?.trim() || `RWJ-${year}-${randomCode}`;

    // Financial calculations
    const totalPkg = Number(body.financials?.totalPackageAmount) || 0;
    const discount = Number(body.financials?.discountAmount) || 0;
    const finalAmt = Math.max(0, totalPkg - discount);
    const advance = Number(body.financials?.advancePaid) || 0;
    const balance = Math.max(0, finalAmt - advance);

    let paymentStatus: "Unpaid" | "Partial" | "Paid" = "Unpaid";
    if (finalAmt > 0 && advance >= finalAmt) {
      paymentStatus = "Paid";
    } else if (advance > 0) {
      paymentStatus = "Partial";
    }

    const newBooking = await Booking.create({
      bookingNumber,
      customerId: customer._id,
      customerSnapshot: {
        name: customer.name,
        phone: customer.phone,
        email: customer.email || "",
        city: customer.locations?.[0]?.city || "Rewa",
      },
      bookingDate: body.bookingDate ? new Date(body.bookingDate) : new Date(),
      primaryEventDate: new Date(body.primaryEventDate),
      status: body.status || "Confirmed",
      subEvents: sanitizeSubEvents(body.subEvents),
      vendorPayouts: sanitizeVendorPayouts(body.vendorPayouts),
      financials: {
        totalPackageAmount: totalPkg,
        discountAmount: discount,
        finalAmount: finalAmt,
        advancePaid: advance,
        balanceDue: balance,
        paymentStatus,
        paymentHistory: Array.isArray(body.financials?.paymentHistory)
          ? body.financials.paymentHistory
          : advance > 0
          ? [
              {
                amount: advance,
                paymentDate: new Date(),
                mode: body.financials?.initialPaymentMode || "UPI",
                receiptNote: "Advance booking payment",
              },
            ]
          : [],
      },
      specialNotes: body.specialNotes || "",
    });

    // Update customer stats
    await Customer.findByIdAndUpdate(customer._id, {
      $inc: { totalBookingsCount: 1, totalSpent: finalAmt },
    });

    return NextResponse.json({ success: true, booking: newBooking }, { status: 201 });
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
      return NextResponse.json({ success: false, message: "Booking ID is required." }, { status: 400 });
    }

    // Re-calculate financials if updated
    if (updates.financials) {
      const totalPkg = Number(updates.financials.totalPackageAmount) || 0;
      const discount = Number(updates.financials.discountAmount) || 0;
      const finalAmt = Math.max(0, totalPkg - discount);
      const advance = Number(updates.financials.advancePaid) || 0;
      const balance = Math.max(0, finalAmt - advance);

      let paymentStatus: "Unpaid" | "Partial" | "Paid" = "Unpaid";
      if (finalAmt > 0 && advance >= finalAmt) {
        paymentStatus = "Paid";
      } else if (advance > 0) {
        paymentStatus = "Partial";
      }

      updates.financials.finalAmount = finalAmt;
      updates.financials.balanceDue = balance;
      updates.financials.paymentStatus = paymentStatus;
    }

    if (updates.vendorPayouts) {
      updates.vendorPayouts = sanitizeVendorPayouts(updates.vendorPayouts);
    }
    if (updates.subEvents) {
      updates.subEvents = sanitizeSubEvents(updates.subEvents);
    }

    const updated = await Booking.findByIdAndUpdate(id, { $set: updates }, { new: true });
    if (!updated) {
      return NextResponse.json({ success: false, message: "Booking not found." }, { status: 404 });
    }

    return NextResponse.json({ success: true, booking: updated });
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
      return NextResponse.json({ success: false, message: "Booking ID is required." }, { status: 400 });
    }

    await Booking.findByIdAndDelete(id);
    return NextResponse.json({ success: true, message: "Booking deleted successfully" });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
