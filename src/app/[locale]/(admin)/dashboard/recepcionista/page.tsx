// src/app/[locale]/(admin)/dashboard/recepcionista/page.tsx
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { startOfDay, endOfDay } from "date-fns";
import { Clock, LogIn, LogOut, Bed } from "lucide-react";
import { ReceptionistDashboard } from "@/components/dashboard/ReceptionistDashboard";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Recepción | Hotel Río Yurubí",
};

export default async function ReceptionistHomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const session = await auth();

  if (!session) redirect(`/${locale}/login`);

  const isEs = locale === "es";
  const today = new Date();
  const todayStart = startOfDay(today);
  const todayEnd = endOfDay(today);

  // ─── Data queries ────────────────────────────────────────────
  const [pendingReservations, checkInsToday, checkOutsToday, totalRooms, occupiedToday] =
    await Promise.all([
      prisma.reservation.findMany({
        where: { status: "PENDING" },
        orderBy: { createdAt: "asc" },
        include: { guest: true, roomType: true },
        take: 20,
      }),
      prisma.reservation.findMany({
        where: {
          status: "CONFIRMED",
          checkIn: { gte: todayStart, lte: todayEnd },
        },
        include: { guest: true, roomType: true },
        orderBy: { checkIn: "asc" },
      }),
      prisma.reservation.findMany({
        where: {
          status: "CONFIRMED",
          checkOut: { gte: todayStart, lte: todayEnd },
        },
        include: { guest: true, roomType: true },
        orderBy: { checkOut: "asc" },
      }),
      prisma.room.count(),
      prisma.reservation.count({
        where: {
          status: "CONFIRMED",
          checkIn: { lte: today },
          checkOut: { gte: today },
        },
      }),
    ]);

  const kpis = [
    {
      label: isEs ? "Reservas Pendientes" : "Pending Reservations",
      value: pendingReservations.length,
      icon: <Clock className="w-6 h-6" />,
      color: pendingReservations.length > 0 ? "bg-amber-500" : "bg-gray-300",
      description: isEs ? "Requieren tu atención" : "Require your attention",
    },
    {
      label: isEs ? "Check-ins Hoy" : "Today's Check-ins",
      value: checkInsToday.length,
      icon: <LogIn className="w-6 h-6" />,
      color: "bg-green-500",
    },
    {
      label: isEs ? "Check-outs Hoy" : "Today's Check-outs",
      value: checkOutsToday.length,
      icon: <LogOut className="w-6 h-6" />,
      color: "bg-blue-500",
    },
    {
      label: isEs ? "Habitaciones Ocupadas" : "Occupied Rooms",
      value: occupiedToday,
      icon: <Bed className="w-6 h-6" />,
      color: "bg-purple-500",
      description: isEs ? `de ${totalRooms} disponibles` : `of ${totalRooms} total`,
    },
  ];

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      <div>
        <h1 className="text-3xl font-serif font-bold text-gray-900 dark:text-gray-100">
          {isEs ? `Bienvenido, ${session.user?.name?.split(" ")[0]} 👋` : `Welcome, ${session.user?.name?.split(" ")[0]} 👋`}
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1 font-medium">
          {isEs
            ? "Aquí tienes el resumen del día en Hotel Río Yurubí."
            : "Here is today's overview for Hotel Río Yurubí."}
        </p>
      </div>

      <ReceptionistDashboard
        pendingReservations={pendingReservations as any}
        checkInsToday={checkInsToday as any}
        checkOutsToday={checkOutsToday as any}
        kpis={kpis}
        locale={locale}
      />
    </div>
  );
}
