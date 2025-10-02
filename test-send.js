// test-send.js
import { Resend } from "resend";
import React from "react";
import { render } from "@react-email/render";
import EmailTemplate from "./emails/template"; // adjust path if needed

const resend = new Resend(process.env.RESEND_API_KEY);

async function main() {
  try {
    const html = render(<EmailTemplate userName="Sam" />);

    const res = await resend.emails.send({
      from: "Finance App <noreply@alerts.example.com>",
      to: "your-email@example.com",
      subject: "Test Email from Resend",
      html, // send the rendered HTML instead of JSX
    });

    console.log("✅ Email sent:", res);
  } catch (err) {
    console.error("❌ Failed to send:", err);
  }
}

main();
