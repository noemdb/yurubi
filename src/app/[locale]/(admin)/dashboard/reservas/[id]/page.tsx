// src/app/[locale]/(admin)/dashboard/reservas/[id]/page.tsx
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { setRequestLocale } from "next-intl/server";
import { ReservationDetail } from "@/components/dashboard/ReservationDetail";
import { RoomAssignment } from "@/components/dashboard/RoomAssignment";

interface PageProps {
  params: Promise<{
    locale: string;
    id: string;
  }>;
}

export default async function ReservationIdPage({ params }: PageProps) {
  const { locale, id } = await params;
  setRequestLocale(locale);

  const reservation = await prisma.reservation.findUnique({
    where: { id },
    include: {
      guest: true,
      roomType: true,
      room: true,
      createdBy: { select: { name: true, email: true } },
      confirmedBy: { select: { name: true, email: true } }
    }
  });

  if (!reservation) {
    return notFound();
  }

  // Fetch available rooms of the SAME TYPE as the reservation
  // That are either free OR currently assigned to THIS reservation
  const availableRooms = await prisma.room.findMany({
    where: {
      roomTypeId: reservation.roomTypeId,
      OR: [
        { isAvailable: true },
        { id: reservation.roomId || undefined }
      ]
    },
    orderBy: { roomNumber: "asc" }
  });

  return (
    <div className="p-4 sm:p-8 space-y-8 min-h-screen bg-gray-50 dark:bg-slate-800/50/30">
      <ReservationDetail 
        reservation={reservation} 
        locale={locale} 
      />
      
      {reservation.status === "CONFIRMED" && (
        <div className="max-w-5xl mx-auto">
          <RoomAssignment 
            reservationId={reservation.id}
            currentRoomId={reservation.roomId}
            availableRooms={availableRooms}
            locale={locale}
          />
        </div>
      )}
    </div>
  );
}
