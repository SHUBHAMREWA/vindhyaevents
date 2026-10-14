import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export interface BookingDetails {
  name: string;
  phone: string;
  email?: string;
  date?: string;
  eventType?: string;
  message?: string;
}

/**
 * Generate Admin Lead Notification Email HTML
 */
function generateAdminEmail(details: BookingDetails): string {
  return `
  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #ffffff; border: 1px solid #fecdd3; border-radius: 12px; overflow: hidden;">
    <div style="background: linear-gradient(135deg, #881337, #e11d48); padding: 24px; text-align: center; color: white;">
      <h2 style="margin: 0; font-size: 24px;">🎉 New Wedding Consultation Lead!</h2>
      <p style="margin: 6px 0 0; opacity: 0.9;">RIWAJ Weddings & Events Query</p>
    </div>
    <div style="padding: 24px; color: #1c1917;">
      <p style="font-size: 16px; margin-top: 0;">A new couple has requested a consultation on the website:</p>
      
      <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
        <tr style="background-color: #fff1f2;">
          <td style="padding: 10px; font-weight: bold; border-bottom: 1px solid #ffe4e6; width: 35%;">Client Name:</td>
          <td style="padding: 10px; border-bottom: 1px solid #ffe4e6;">${details.name}</td>
        </tr>
        <tr>
          <td style="padding: 10px; font-weight: bold; border-bottom: 1px solid #ffe4e6;">Phone Number:</td>
          <td style="padding: 10px; border-bottom: 1px solid #ffe4e6;"><a href="tel:${details.phone}" style="color: #e11d48; text-decoration: none; font-weight: bold;">${details.phone}</a></td>
        </tr>
        <tr style="background-color: #fff1f2;">
          <td style="padding: 10px; font-weight: bold; border-bottom: 1px solid #ffe4e6;">Email Address:</td>
          <td style="padding: 10px; border-bottom: 1px solid #ffe4e6;">${details.email || "Not provided"}</td>
        </tr>
        <tr>
          <td style="padding: 10px; font-weight: bold; border-bottom: 1px solid #ffe4e6;">Event Date:</td>
          <td style="padding: 10px; border-bottom: 1px solid #ffe4e6;">${details.date || "Not specified"}</td>
        </tr>
        <tr style="background-color: #fff1f2;">
          <td style="padding: 10px; font-weight: bold; border-bottom: 1px solid #ffe4e6;">Event Type:</td>
          <td style="padding: 10px; border-bottom: 1px solid #ffe4e6;">${details.eventType || "Wedding"}</td>
        </tr>
        <tr>
          <td style="padding: 10px; font-weight: bold; border-bottom: 1px solid #ffe4e6;">Message / Vision:</td>
          <td style="padding: 10px; border-bottom: 1px solid #ffe4e6;">${details.message || "No special message provided"}</td>
        </tr>
      </table>

      <div style="text-align: center; margin-top: 25px;">
        <a href="tel:${details.phone}" style="display: inline-block; background-color: #e11d48; color: white; padding: 12px 24px; border-radius: 50px; text-decoration: none; font-weight: bold;">Call Client Now: ${details.phone}</a>
      </div>
    </div>
    <div style="background-color: #f8fafc; padding: 14px; text-align: center; font-size: 12px; color: #64748b; border-top: 1px solid #e2e8f0;">
      © 2026 RIWAJ — Rewa, Madhya Pradesh. Automatic Lead Notification.
    </div>
  </div>
  `;
}

/**
 * Generate Customer Confirmation Email HTML
 */
function generateCustomerEmail(name: string): string {
  return `
  <div style="font-family: 'Georgia', serif; max-width: 600px; margin: 0 auto; background-color: #ffffff; border: 1px solid #fecdd3; border-radius: 12px; overflow: hidden;">
    <div style="background: linear-gradient(135deg, #881337, #e11d48); padding: 30px; text-align: center; color: white;">
      <h1 style="margin: 0; font-size: 28px;">RIWAJ</h1>
      <p style="margin: 8px 0 0; font-size: 14px; letter-spacing: 1px;">Luxury Wedding & Royal Event Specialists</p>
    </div>
    <div style="padding: 30px; color: #1c1917; line-height: 1.8;">
      <h2 style="color: #e11d48; margin-top: 0;">Thank You for Reaching Out, ${name}! 🌸</h2>
      <p>We are delighted to receive your wedding consultation request. We believe every love story deserves a grand celebration rooted in your rituals and aesthetic dreams.</p>
      <p>Our senior wedding planner in Rewa will personally contact you shortly to discuss your venue, decor themes, and timeline.</p>
      
      <div style="background-color: #fff1f2; border-left: 4px solid #e11d48; padding: 16px; margin: 20px 0; border-radius: 4px;">
        <p style="margin: 0; font-weight: bold; color: #881337;">Need urgent assistance?</p>
        <p style="margin: 4px 0 0; color: #4c0519;">Call or WhatsApp us directly at: <strong>+91 7898522932</strong></p>
      </div>
      
      <p style="font-size: 14px; color: #78716c;">Warm regards,<br /><strong>Vindhya Events Team</strong><br />Rewa, Madhya Pradesh</p>
    </div>
  </div>
  `;
}

export async function sendConsultationEmails(details: BookingDetails) {
  try {
    const adminEmail = process.env.EMAIL_USER;

    // 1. Send Email to Admin with full lead information
    if (adminEmail) {
      await transporter.sendMail({
        from: `"RIWAJ Leads" <${adminEmail}>`,
        to: adminEmail,
        subject: `🔔 New Consultation Lead: ${details.name} (${details.phone})`,
        html: generateAdminEmail(details),
      });
    }

    // 2. Send Confirmation Email to Customer if email provided
    if (details.email && details.email.includes("@")) {
      await transporter.sendMail({
        from: `"RIWAJ Weddings & Events" <${adminEmail}>`,
        to: details.email,
        subject: `Thank you for choosing RIWAJ 💍`,
        html: generateCustomerEmail(details.name),
      });
    }

    return { success: true };
  } catch (error: unknown) {
    console.error("Email notification error:", error);
    return { success: false, error: (error as Error).message };
  }
}

// Backward compatibility
export const BookConsultant = async (to: string, _subject?: string) => {
  return sendConsultationEmails({
    name: "Website Visitor",
    phone: "Check Admin Portal",
    email: to,
  });
};
