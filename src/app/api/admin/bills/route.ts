import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import { Bill } from "@/lib/models/Bill";
import { getAdminFromRequest } from "@/lib/auth";
import { calculateTotals, toNumber } from "@/lib/billing";

export const dynamic = "force-dynamic";

const unauthorized = () =>
  NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });

const str = (value: unknown, max = 500) => (typeof value === "string" ? value.trim().slice(0, max) : "");

const date = (value: unknown) => {
  if (!value) return null;
  const d = new Date(value as string);
  return Number.isNaN(d.getTime()) ? null : d;
};

// Keeps only the fields admins may set and recalculates every total on the server.
function parseBill(body: any) {
  const customerName = str(body?.customer?.name, 120);
  if (!customerName) return { error: "Customer name is required" };

  const items = (Array.isArray(body.items) ? body.items : [])
    .map((item: any) => ({
      title: str(item?.title, 150),
      description: str(item?.description, 500),
      quantity: toNumber(item?.quantity),
      rate: toNumber(item?.rate),
    }))
    .filter((item: { title: string }) => item.title);
  if (items.length === 0) return { error: "Add at least one service to the bill" };

  const payments = (Array.isArray(body.payments) ? body.payments : [])
    .map((p: any) => ({
      date: date(p?.date) || new Date(),
      amount: toNumber(p?.amount),
      mode: str(p?.mode, 30) || "Cash",
      note: str(p?.note, 200),
    }))
    .filter((p: { amount: number }) => p.amount > 0);

  const billDate = date(body.billDate) || new Date();
  const discount = toNumber(body.discount);
  const taxPercent = Math.min(toNumber(body.taxPercent), 100);
  const totals = calculateTotals({
    items,
    discount,
    taxPercent,
    payments: payments.map((p: { amount: number }) => ({ ...p, date: "", mode: "" })),
  });

  return {
    data: {
      billDate,
      dueDate: date(body.dueDate),
      subject: str(body.subject, 150),
      customer: {
        name: customerName,
        phone: str(body.customer?.phone, 30),
        email: str(body.customer?.email, 120),
        address: str(body.customer?.address, 300),
      },
      event: {
        type: str(body.event?.type, 60),
        date: date(body.event?.date),
        endDate: date(body.event?.endDate),
        venue: str(body.event?.venue, 200),
        guests: toNumber(body.event?.guests) || null,
      },
      items: items.map((item: { quantity: number; rate: number }, i: number) => ({ ...item, amount: totals.lines[i] })),
      discount: totals.discount,
      taxPercent,
      businessGstin: str(body.businessGstin, 20).toUpperCase(),
      payments,
      subtotal: totals.subtotal,
      taxAmount: totals.taxAmount,
      total: totals.total,
      paid: totals.paid,
      balance: totals.balance,
      notes: str(body.notes, 1000),
      terms: str(body.terms, 2000),
      isCancelled: body.isCancelled === true,
    },
  };
}

// Next number for the bill's year, e.g. RW-2026-0007.
async function nextBillNumber(billDate: Date) {
  const prefix = `RW-${billDate.getFullYear()}-`;
  const last = await Bill.findOne({ billNumber: { $regex: `^${prefix}\\d+$` } })
    .sort({ billNumber: -1 })
    .select("billNumber")
    .lean();
  const lastSeq = last ? parseInt(last.billNumber.slice(prefix.length), 10) || 0 : 0;
  return `${prefix}${String(lastSeq + 1).padStart(4, "0")}`;
}

const errorResponse = (error: unknown) =>
  NextResponse.json({ success: false, message: (error as Error).message }, { status: 500 });

export async function GET(req: NextRequest) {
  try {
    if (!(await getAdminFromRequest(req))) return unauthorized();
    await connectToDatabase();
    const bills = await Bill.find().sort({ billDate: -1, createdAt: -1 }).lean();
    return NextResponse.json({ success: true, bills });
  } catch (error) {
    return errorResponse(error);
  }
}

export async function POST(req: NextRequest) {
  try {
    if (!(await getAdminFromRequest(req))) return unauthorized();
    const parsed = parseBill(await req.json());
    if (!parsed.data) {
      return NextResponse.json({ success: false, message: parsed.error }, { status: 400 });
    }

    await connectToDatabase();
    // Two admins saving at the same moment could pick the same number; retry on a clash.
    for (let attempt = 0; attempt < 5; attempt++) {
      try {
        const billNumber = await nextBillNumber(parsed.data.billDate);
        const bill = await Bill.create({ ...parsed.data, billNumber });
        return NextResponse.json({ success: true, bill });
      } catch (error) {
        if ((error as { code?: number })?.code !== 11000) throw error;
      }
    }
    return NextResponse.json({ success: false, message: "Could not create a bill number. Try again." }, { status: 409 });
  } catch (error) {
    return errorResponse(error);
  }
}

export async function PUT(req: NextRequest) {
  try {
    if (!(await getAdminFromRequest(req))) return unauthorized();
    const body = await req.json();
    if (!body.id) {
      return NextResponse.json({ success: false, message: "Bill ID required" }, { status: 400 });
    }
    const parsed = parseBill(body);
    if (!parsed.data) {
      return NextResponse.json({ success: false, message: parsed.error }, { status: 400 });
    }

    await connectToDatabase();
    // The bill number never changes after it is issued.
    const bill = await Bill.findByIdAndUpdate(body.id, parsed.data, { new: true, runValidators: true });
    if (!bill) {
      return NextResponse.json({ success: false, message: "Bill not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true, bill });
  } catch (error) {
    return errorResponse(error);
  }
}

export async function DELETE(req: NextRequest) {
  try {
    if (!(await getAdminFromRequest(req))) return unauthorized();
    const id = new URL(req.url).searchParams.get("id");
    if (!id) {
      return NextResponse.json({ success: false, message: "Bill ID required" }, { status: 400 });
    }
    await connectToDatabase();
    await Bill.findByIdAndDelete(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    return errorResponse(error);
  }
}
