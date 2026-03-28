import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

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

    // 🔥 DISCORD NOTIFICATION (FIXED)
    if (process.env.DISCORD_WEBHOOK_URL) {
      await fetch(process.env.DISCORD_WEBHOOK_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content: `🔥 New Debt Lead

👤 Name: ${firstName} ${lastName || ""}
📧 Email: ${email}
📱 Phone: ${phone}
💰 Debt: ${debtAmount}
📍 State: ${state || "N/A"}
          `,
        }),
      });
    }

    // 📧 Email transporter
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // 🔁 Send to partner
    await sendToPartner(body);

    // 📧 Email HTML
    const html = `
      <h2>🔥 New Debt Relief Lead</h2>
      <p><strong>Name:</strong> ${firstName} ${lastName || ""}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Phone:</strong> ${phone}</p>
      <p><strong>Debt Amount:</strong> ${debtAmount}</p>

      <hr/>

      <h3>Details</h3>
      <p><strong>State:</strong> ${state || "Not provided"}</p>
      <p><strong>Behind on Payments:</strong> ${behindOnPayments || "Not provided"}</p>
      <p><strong>Debt Types:</strong> ${formatList(debtTypes)}</p>
      <p><strong>Credit Score:</strong> ${creditScore || "Not provided"}</p>
      <p><strong>Main Hardship:</strong> ${hardship || "Not provided"}</p>
      <p><strong>Notes:</strong> ${notes || "None"}</p>
    `;

    // 📧 Send email
    await transporter.sendMail({
      from: `"Debt Relief Lead" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_TO,
      subject: "🔥 New Debt Relief Lead",
      html,
    });

    // 📊 Google Sheets webhook
    if (process.env.GOOGLE_SHEET_WEBHOOK) {
      await fetch(process.env.GOOGLE_SHEET_WEBHOOK, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Lead API error:", error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}