import { NextRequest, NextResponse } from "next/server";

type DonationLead = {
  name?: string;
  email?: string;
  amount?: number;
  note?: string;
};

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as DonationLead;
    const name = typeof body.name === "string" ? body.name.trim() : "";
    const email = typeof body.email === "string" ? body.email.trim() : "";
    const amount = typeof body.amount === "number" ? body.amount : undefined;
    const note = typeof body.note === "string" ? body.note.trim() : "";

    if (!email) {
      return NextResponse.json({ error: "Email required" }, { status: 400 });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: "Invalid email" }, { status: 400 });
    }

    const resendKey = process.env.RESEND_API_KEY;
    const donationsInbox = process.env.DONATIONS_FORWARD_TO;
    const fromEmail = process.env.DONATIONS_FROM_EMAIL ?? "onboarding@resend.dev";

    if (resendKey && donationsInbox) {
      const supporter = name || "Anonymous";
      const intent = amount ? `$${amount}` : "Unspecified amount";
      const summary = [
        `Supporter: ${supporter}`,
        `Email: ${email}`,
        `Intent: ${intent}`,
        note ? `Note: ${note}` : undefined,
      ]
        .filter(Boolean)
        .join("\n");

      await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${resendKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: fromEmail,
          to: [donationsInbox],
          subject: `Donation inquiry from ${supporter}`,
          text: summary,
          reply_to: email,
        }),
      });
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: true });
  }
}
