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
  if (!process.env.RESEND_API_KEY) {
    console.warn("RESEND_API_KEY is not set. Email won't be sent.");
    return { success: false, error: "Missing API Key" };
  }

  // Instantiate lazily so a missing key doesn't crash the module on import
  const resend = new Resend(process.env.RESEND_API_KEY);

  try {
    const { data, error } = await resend.emails.send({
      from: "Hotel Río Yurubí <reservas@hotelrioyurubi.com>",
      to: Array.isArray(to) ? to : [to],
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
