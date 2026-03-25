// src/app/[locale]/(admin)/dashboard/recepcionista/nueva-reserva/page.tsx
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { NewBookingForm } from "@/components/dashboard/NewBookingForm";
import { Metadata } from "next";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Nueva Reserva | Recepción",
};

export default async function NewBookingPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const session = await auth();
  if (!session) redirect(`/${locale}/login`);

  const isEs = locale === "es";

  const roomTypes = await prisma.roomType.findMany({
    where: { isActive: true },
    select: { id: true, name: true, basePrice: true, maxOccupancy: true },
    orderBy: { name: "asc" },
  });

  return (
    <div className="max-w-4xl mx-auto pb-12 space-y-8">
      <div>
        <Link
          href={`/${locale}/dashboard/recepcionista`}
          className="inline-flex items-center gap-1.5 text-sm text-gray-400 hover:text-brand-blue font-bold mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          {isEs ? "Volver al inicio" : "Back to home"}
        </Link>
        <h1 className="text-3xl font-serif font-bold text-gray-900">
          {isEs ? "Nueva Reserva Manual" : "New Manual Booking"}
        </h1>
        <p className="text-gray-500 mt-1 font-medium">
          {isEs
            ? "Registra manualmente una reserva para un huésped que llamó por teléfono o se presentó en recepción."
            : "Manually register a booking for a guest who called by phone or walked in."}
        </p>
      </div>

      <NewBookingForm roomTypes={roomTypes} locale={locale} />
    </div>
  );
}
