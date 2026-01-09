import nodemailer from "nodemailer"  ;


 const transporter  = nodemailer.createTransport({
    service : "gmail" ,
    auth : {
           user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
    }
})


const htmlforBookconsultant = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Vindhya Events | Wedding Consultation</title>
</head>
<body style="margin:0; padding:0; background-color:#120b0c; font-family:'Georgia', 'Times New Roman', serif;">

  <table width="100%" cellpadding="0" cellspacing="0" style="background:linear-gradient(180deg,#120b0c,#1a0e10); padding:50px 0;">
    <tr>
      <td align="center">

        <!-- Main Container -->
        <table width="600" cellpadding="0" cellspacing="0" style="background:#1f1214; border-radius:16px; overflow:hidden; box-shadow:0 0 30px rgba(180,120,120,0.35);">

          <!-- Header (Wedding Theme with Elegant Font) -->
          <tr>
            <td style="background:linear-gradient(135deg,#3b0a0f,#6b1118,#8b0000); padding:40px 30px; text-align:center;">
              <h1 style="margin:0; color:#fff6f6; font-size:34px; letter-spacing:2.5px; font-weight:700; font-family:'Playfair Display','Georgia','Times New Roman',serif;">
                Vindhya Events
              </h1>
              <p style="margin:14px 0 0; color:#ffe0e0; font-size:16px; letter-spacing:1.5px; font-family:'Cormorant Garamond','Georgia','Times New Roman',serif;">
                Wedding & Luxury Event Specialists
              </p>
              <div style="width:90px; height:2px; background:linear-gradient(90deg,#ffd1d1,#ff6b6b); margin:22px auto 0; border-radius:2px;"></div>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:36px; color:#f6eaea; font-family:'Georgia','Times New Roman',serif;">
              <h2 style="color:#ffb3b3; margin-top:0; font-size:24px; font-family:'Playfair Display','Georgia','Times New Roman',serif;">
                Thank You for Your Enquiry 🌸
              </h2>

              <p style="line-height:1.8; font-size:16px;">
                Thank you for choosing <strong>Vindhya Events</strong> for your special celebration.
                We are delighted to inform you that we have <strong>successfully received your request</strong>.
              </p>

              <p style="line-height:1.8; font-size:16px;">
                Weddings are moments of love, tradition, and memories — and our expert team is honored to assist you.
                One of our dedicated consultants will <strong>personally reach out to you shortly</strong> to understand
                your vision and help craft an unforgettable experience.
              </p>

              <!-- Highlight Box -->
              <table width="100%" cellpadding="0" cellspacing="0" style="background:#2a1518; border-radius:12px; margin:26px 0;">
                <tr>
                  <td style="padding:22px; color:#ffdede;">
                    <ul style="padding-left:20px; margin:0; font-family:'Georgia','Times New Roman',serif;">
                      <li>Wedding planning & theme design</li>
                      <li>Venue décor & floral arrangements</li>
                      <li>Guest management & logistics</li>
                      <li>Timeline planning for your big day</li>
                    </ul>
                  </td>
                </tr>
              </table>

              <p style="line-height:1.7; font-size:15px; color:#e7caca;">
                Until then, feel free to gather inspiration, share your ideas, and dream big —
                we are here to turn your wedding into a beautiful story.
              </p>

              <p style="font-size:13px; color:#d9b3b3; margin-top:34px;">
                This is an automated confirmation email from Vindhya Events.
                Please do not reply unless requested by our team.
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background:#16090b; padding:22px; text-align:center; color:#c9a3a3; font-size:12px; font-family:'Georgia','Times New Roman',serif;">
              © 2026 Vindhya Events. All rights reserved.<br />
              <span style="color:#ffb3b3; font-family:'Cormorant Garamond','Georgia','Times New Roman',serif;">
                Designing weddings filled with love & elegance 💍
              </span>
            </td>
          </tr>

        </table>
        <!-- End Container -->

      </td>
    </tr>
  </table>

</body>
</html>
`


//  email send function for Booking or consultant
export const BookConsultant  = async(to , subject )=>{   
     
    try {
    const mailOptions = {
      from: `"Vindhya Events" <${process.env.EMAIL_USER}>`,
      to  ,
      cc : process.env.EMAIL_USER ,
      subject ,
      html : htmlforBookconsultant,
    }

    const result = await transporter.sendMail(mailOptions)  

    return { success: true, messageId: result.messageId } 

  } catch (error) {
    console.error("Email sending error:", error)
    return { success: false, error: error.message }
  }


}
