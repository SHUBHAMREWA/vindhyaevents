import { NextResponse } from "next/server";
import { BookConsultant } from "@/lib/backendhelper/email";

export async function POST(req) { 

  try {

    const {
      captchaToken,
      name,
      email,
      phone,
      date,
      eventType,
      message,
    } = await req.json();  


  

  
    // 🔐 CAPTCHA verify
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
        { success: false, message: "Captcha verification failed" },
        { status: 403 }
      );
    }

     
       
     if(!email) {
      return NextResponse.json({
            success : false , 
            message : "email is not defign"
      })
     }
    // 📩 Email send (after captcha success)
    const mailResult = await BookConsultant(
      email, // ✅ better
      "Consultant Booking "
    );

    return NextResponse.json(mailResult);
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}
