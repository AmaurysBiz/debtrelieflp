import { NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

function formatList(arr?: string[]) {
  if (!arr || arr.length === 0) return "None";
  return arr.join(", ");
}

async function sendToPartner(lead: any) {
  const PARTNER_URL = process.env.CURADEBT_ENDPOINT;

  if (!PARTNER_URL) return;

  try {
    await fetch(PARTNER_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.CURADEBT_API_KEY}`,
      },
      body: JSON.stringify(lead),
    });
  } catch (err) {
    console.error("Partner ping failed:", err);
  }
}

export async function POST(req: Request) {
  try {
    console.log("🔥 API HIT");

    const body = await req.json();

    const {
      firstName,
      lastName,
      email,
      phone,
      debtAmount,
      state,
      debtTypes,
      behindOnPayments,
      creditScore,
      hardship,
      notes,
    } = body;

    console.log("📩 Incoming Lead:", email);

    // ✅ BUILD EMAIL FIRST
    const html = `
      <h2>🔥 New Debt Relief Lead</h2>
      <p><strong>Name:</strong> ${firstName} ${lastName || ""}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Phone:</strong> ${phone}</p>
      <p><strong>Debt Amount:</strong> ${debtAmount}</p>
    `;

    // 🔥 DISCORD
    if (process.env.DISCORD_WEBHOOK_URL) {
      try {
        await fetch(process.env.DISCORD_WEBHOOK_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            content: `🔥 New Lead: ${firstName} (${email})`,
          }),
        });
        console.log("✅ Discord sent");
      } catch (err) {
        console.error("❌ Discord failed:", err);
      }
    }

    // 🔥 TEMP SAFE SENDER (IMPORTANT TEST)
    const FROM_EMAIL = "onboarding@resend.dev"; // <-- TEMP FIX

    // 🔥 EMAIL TO YOU
    try {
      const res1 = await resend.emails.send({
        from: FROM_EMAIL,
        to: process.env.EMAIL_TO!,
        subject: "🔥 New Lead",
        html,
      });

      console.log("✅ Email to you:", res1);
    } catch (err) {
      console.error("❌ Email to YOU failed:", err);
    }

    // 🔥 EMAIL TO USER
    try {
      const res2 = await resend.emails.send({
        from: FROM_EMAIL,
        to: email,
        subject: "You're All Set",
        html: `
          <h2>You're All Set ✅</h2>
          <p>Hi ${firstName},</p>
          <p>We received your request.</p>
          <p>A specialist will contact you shortly.</p>
        `,
      });

      console.log("✅ Email to user:", res2);
    } catch (err) {
      console.error("❌ Email to USER failed:", err);
    }

    // 🔁 PARTNER
    await sendToPartner(body);

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error("🔥 API ERROR:", error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}






 /*html: `
  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto;">

    <h2 style="color:#1a1a1a;">You're All Set ✅</h2>

    <p>Hi ${firstName || ""},</p>

    <p>We received your request for debt relief options.</p>

    <p>
      A licensed specialist will review your information and reach out shortly 
      to go over your options.
    </p>

    <div style="background:#f5f7fa; padding:15px; border-radius:8px; margin:20px 0;">
      <strong>What happens next:</strong>
      <ul>
        <li>📞 You may receive a call within the next few hours</li>
        <li>💬 They’ll review your situation and options</li>
        <li>🔒 No obligation to proceed</li>
      </ul>
    </div>

    <p style="font-size:14px; color:#555;">
      Please keep your phone nearby so you don’t miss your consultation.
    </p>

    <p style="font-size:14px; color:#555;">
We work with licensed debt relief specialists across the U.S.
</p>

<li>🔒 Your information is kept private and secure</li>

    <hr style="margin:30px 0;" />

    <p style="font-size:12px; color:#888;">
      Debt Options<br/>
      support@debtoptionsnow.com
    </p>

  </div>
`,

*/