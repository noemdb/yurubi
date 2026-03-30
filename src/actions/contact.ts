// src/actions/contact.ts
"use server";

import { z } from "zod";
import { sendEmail } from "@/lib/email";
import { ContactEmail } from "@/lib/email/templates/ContactEmail";
import React from "react";

const contactSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  message: z.string().min(10),
});

export async function sendContactEmail(
  values: z.infer<typeof contactSchema>
): Promise<{ success: boolean; error?: string }> {
  const parsed = contactSchema.safeParse(values);

  if (!parsed.success) {
    return { success: false, error: "Datos del formulario inválidos." };
  }

  const { name, email, message } = parsed.data;

  // El email se enviará al correo del hotel (RESEND_CC_EMAIL).
  // Con el dominio sandbox de Resend solo se puede enviar al email de la cuenta.
  // Una vez verificado hotelrioyurubi.com, cambiar RESEND_FROM_EMAIL y se podrá
  // enviar también al visitante.
  const hotelEmail = process.env.RESEND_CC_EMAIL;
  if (!hotelEmail) {
    console.error("RESEND_CC_EMAIL no configurado.");
    return { success: false, error: "Configuración incompleta." };
  }

  const result = await sendEmail({
    to: hotelEmail,
    subject: `Nuevo mensaje de contacto de ${name}`,
    react: React.createElement(ContactEmail, { name, email, message }),
  });

  if (!result.success) {
    console.error("Error al enviar email de contacto:", result.error);
    return { success: false, error: "No se pudo enviar el correo." };
  }

  return { success: true };
}
