// src/app/[locale]/(admin)/dashboard/recepcionista/habitaciones/page.tsx
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { RoomStatusPanel } from "@/components/dashboard/RoomStatusPanel";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Estado de Habitaciones | Recepción",
};

export default async function ReceptionistHabitacionesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const session = await auth();
  if (!session) redirect(`/${locale}/login`);

  const isEs = locale === "es";
  const today = new Date();

  const roomTypes = await prisma.roomType.findMany({
    where: { isActive: true },
    orderBy: { name: "asc" },
    select: {
      id: true,
      name: true,
      slug: true,
      rooms: {
        orderBy: { roomNumber: "asc" },
        select: {
          id: true,
          roomNumber: true,
          floor: true,
          isAvailable: true,
          reservations: {
            where: {
              status: { in: ["CONFIRMED", "PENDING"] },
              checkOut: { gte: today },
            },
            orderBy: { checkIn: "asc" },
            take: 1,
            select: {
              id: true,
              status: true,
              checkIn: true,
              checkOut: true,
              guest: { select: { fullName: true } },
            },
          },
        },
      },
    },
  });

  const normalizedRoomTypes = roomTypes.map((rt) => ({
    ...rt,
    rooms: rt.rooms.map((room) => ({
      ...room,
      activeReservation: room.reservations[0] ?? null,
    })),
  }));

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div>
        <h1 className="text-3xl font-serif font-bold text-gray-900 dark:text-gray-100">
          {isEs ? "Estado de Habitaciones" : "Room Status"}
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1 font-medium">
          {isEs
            ? "Vista general del estado actual de cada habitación por categoría."
            : "Overview of the current status of each room by category."}
        </p>
      </div>

      {/* Full-width panel — remove the sidebar width constraint for full-page view */}
      <RoomStatusPanel
        roomTypes={normalizedRoomTypes as any}
        locale={locale}
        fullPage
      />
    </div>
  );
}
