// src/lib/actions/email.ts
"use server";

import { prisma } from "@/lib/prisma";
import { sendEmail } from "@/lib/email";
import { BookingEmail } from "@/components/email/BookingEmail";
import { formatPrice } from "@/lib/utils";
import React from "react";

export async function sendReservationStatusEmail(reservationId: string) {
  try {
    const res = await prisma.reservation.findUnique({
      where: { id: reservationId },
      include: {
        guest: true,
        roomType: true,
      },
    });

    if (!res) throw new Error("Reservation not found");

    const locale = res.language || "es";
    const subject = locale === "es" 
      ? `Actualización de tu Reserva #${res.id.slice(-6).toUpperCase()} - Hotel Río Yurubí`
      : `Booking Update #${res.id.slice(-6).toUpperCase()} - Hotel Río Yurubí`;

    await sendEmail({
      to: res.guest.email,
      subject,
      react: React.createElement(BookingEmail, {
        guestName: res.guest.fullName,
        reservationId: res.id,
        checkIn: res.checkIn.toLocaleDateString(locale),
        checkOut: res.checkOut.toLocaleDateString(locale),
        roomType: res.roomType.name,
        totalPrice: formatPrice(res.totalPrice),
        status: res.status as any,
        locale: locale,
      }),
    });

    return { success: true };
  } catch (error) {
    console.error("Failed to send status email:", error);
    return { success: false, error };
  }
}
