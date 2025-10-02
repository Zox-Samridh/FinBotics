import { Resend } from "resend";

export async function sendEmail({ to, subject, react }) {
  const resend = new Resend(process.env.RESEND_API_KEY || "");

  try {
    const data = await resend.emails.send({
      from: "Finance App <idotic007@gmail.com>", // ✅ use your domain
      to,
      subject,
      react,
    });

    console.log("✅ Email sent:", data);
    return { success: true, data };
  } catch (error) {
    console.error("❌ Failed to send email: ", error);
    return { success: false, error };
  }
}
