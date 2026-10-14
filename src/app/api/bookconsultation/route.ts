import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import { Inquiry } from "@/lib/models/Inquiry";
import { sendConsultationEmails } from "@/lib/backendhelper/email";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { captchaToken, name, email, phone, date, eventType, message, guestCount, budget } = body;

    // Validate phone and name
    if (!name || !name.trim()) {
      return NextResponse.json(
        { success: false, message: "Please provide your name" },
        { status: 400 }
      );
    }

    if (!phone || !phone.trim()) {
      return NextResponse.json(
        { success: false, message: "Please provide a contact phone number" },
        { status: 400 }
      );
    }

    // Optional Turnstile Verification if token or secret is configured
    if (process.env.TURNSTILE_SECRET_KEY && captchaToken) {
      try {
        const verifyRes = await fetch(
          "https://challenges.cloudflare.com/turnstile/v0/siteverify",
          {
            method: "POST",
            body: new URLSearchParams({
              secret: process.env.TURNSTILE_SECRET_KEY,
              response: captchaToken,
            }),
          }
        );
        const captchaResult = await verifyRes.json();
        if (!captchaResult.success) {
          return NextResponse.json(
            { success: false, message: "Security verification failed. Please try again." },
            { status: 403 }
          );
        }
      } catch (captchaErr) {
        console.warn("Turnstile check warning:", captchaErr);
      }
    }

    // 1. Save to MongoDB
    await connectToDatabase();
    const newInquiry = await Inquiry.create({
      name: name.trim(),
      phone: phone.trim(),
      email: email ? email.trim() : "",
      date: date || "",
      eventType: eventType || "Wedding",
      guestCount: guestCount || "",
      budget: budget || "",
      message: message ? message.trim() : "",
      status: "pending",
      source: "Website Consultation Form",
    });

    // 2. Send email notification in background (won't block response if mail has transient delay)
    sendConsultationEmails({
      name: name.trim(),
      phone: phone.trim(),
      email: email ? email.trim() : undefined,
      date,
      eventType,
      message,
    }).catch((err) => console.error("Email dispatch failed:", err));

    return NextResponse.json({
      success: true,
      message: "Consultation request received successfully! We will call you shortly.",
      inquiryId: newInquiry._id,
    });
  } catch (error: unknown) {
    console.error("Booking API Error:", error);
    return NextResponse.json(
      { success: false, message: (error as Error).message || "Failed to process consultation request" },
      { status: 500 }
    );
  }
}
