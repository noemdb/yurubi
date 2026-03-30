// src/lib/email/index.ts
import { Resend } from "resend";

export async function sendEmail({
  to,
  subject,
  react,
}: {
  to: string | string[];
  subject: string;
  react: React.ReactElement;
}) {
  if (!process.env.RESEND_API_KEY || !process.env.RESEND_FROM_EMAIL) {
    console.warn("Email configuration is incomplete. Email won't be sent.");
    return { success: false, error: "Missing Email Configuration" };
  }

  // Instantiate lazily so a missing key doesn't crash the module on import
  const resend = new Resend(process.env.RESEND_API_KEY);

  try {
    const { data, error } = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL,
      to: Array.isArray(to) ? to : [to],
      cc: process.env.RESEND_CC_EMAIL,
      subject,
      react,
    });

    if (error) {
      console.error("Resend Error:", error);
      return { success: false, error };
    }

    return { success: true, data };
  } catch (err) {
    console.error("Email Exception:", err);
    return { success: false, error: err };
  }
}
