// src/app/[locale]/(admin)/dashboard/recepcionista/nueva-reserva/page.tsx
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { BookingWizard } from "@/components/booking/BookingWizard";
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

  return (
    <div className="max-w-5xl mx-auto pb-12 space-y-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <Link
            href={`/${locale}/dashboard/recepcionista`}
            className="inline-flex items-center gap-1.5 text-sm text-gray-400 dark:text-gray-500 hover:text-brand-blue font-bold mb-4 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            {isEs ? "Volver al inicio" : "Back to home"}
          </Link>
          <h1 className="text-4xl font-serif font-bold text-gray-900 dark:text-gray-100 leading-tight">
            {isEs ? "Nueva Reserva" : "New Booking"}
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-2 font-medium max-w-xl text-lg">
            {isEs
              ? "Sigue los pasos para completar el registro de una nueva estancia."
              : "Follow the steps to complete the registration of a new stay."}
          </p>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-[3rem] border border-gray-100 dark:border-slate-800 shadow-2xl dark:shadow-none shadow-brand-blue/5 overflow-hidden">
        <div className="p-8 md:p-12">
          <BookingWizard locale={locale} />
        </div>
      </div>
    </div>
  );
}
