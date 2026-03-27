// src/app/[locale]/(admin)/dashboard/recepcionista/reservas/page.tsx
import { prisma } from "@/lib/prisma";
import { ReservationsTable } from "@/components/dashboard/ReservationsTable";
import { Plus } from "lucide-react";
import { Link } from "@/routing";
import { Button } from "@/components/ui/button";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Reservas | Recepción",
};

export default async function ReceptionistReservationsPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ status?: string }>;
}) {
  const { locale } = await params;
  const { status } = await searchParams;
  const session = await auth();
  if (!session) redirect(`/${locale}/login`);

  const isEs = locale === "es";

  const reservations = await prisma.reservation.findMany({
    orderBy: { createdAt: "desc" },
    include: { guest: true, roomType: true, room: true },
  });

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 max-w-7xl mx-auto pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-serif font-bold text-gray-900 dark:text-gray-100 mb-2">
            {isEs ? "Listado de Reservas" : "Reservations List"}
          </h1>
          <p className="text-gray-500 dark:text-gray-400">
            {isEs
              ? "Gestiona y filtra todas las reservas del hotel."
              : "Manage and filter all hotel reservations."}
          </p>
        </div>

        <Link href={`/${locale}/dashboard/recepcionista/nueva-reserva`}>
          <Button className="bg-brand-blue hover:bg-brand-blue/90 text-white rounded-2xl h-14 px-8 shadow-lg dark:shadow-none shadow-brand-blue/20 gap-2 font-bold transition-all active:scale-95">
            <Plus className="w-5 h-5" />
            {isEs ? "Nueva Reserva" : "New Booking"}
          </Button>
        </Link>
      </div>

      <ReservationsTable initialData={reservations} locale={locale} />
    </div>
  );
}
