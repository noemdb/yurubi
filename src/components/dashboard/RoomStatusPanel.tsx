// src/components/dashboard/RoomStatusPanel.tsx
// Server Component — no "use client" needed, rendered server-side.

import { Bed, CheckCircle, XCircle, Clock } from "lucide-react";

interface Room {
  id: string;
  roomNumber: string;
  floor: number | null;
  isAvailable: boolean;
  // Active confirmed reservation overlapping today
  activeReservation: {
    id: string;
    status: string;
    guest: { fullName: string };
    checkIn: Date;
    checkOut: Date;
  } | null;
}

interface RoomTypeWithRooms {
  id: string;
  name: string;
  slug: string;
  rooms: Room[];
}

interface RoomStatusPanelProps {
  roomTypes: RoomTypeWithRooms[];
  locale: string;
  fullPage?: boolean;
}

function RoomDot({ room, isEs }: { room: Room; isEs: boolean }) {
  const today = new Date();
  const isOccupied =
    room.activeReservation !== null &&
    new Date(room.activeReservation.checkIn) <= today &&
    new Date(room.activeReservation.checkOut) >= today;

  const isReservedFuture =
    room.activeReservation !== null &&
    new Date(room.activeReservation.checkIn) > today;

  const isMaintenance = !room.isAvailable && !room.activeReservation;

  let statusColor = "bg-green-500"; // libre
  let ringColor = "ring-green-200";
  let tooltip = isEs ? "Libre" : "Free";

  if (isMaintenance) {
    statusColor = "bg-gray-400";
    ringColor = "ring-gray-200";
    tooltip = isEs ? "Mantenimiento" : "Maintenance";
  } else if (isOccupied) {
    statusColor = "bg-red-500";
    ringColor = "ring-red-200";
    tooltip = `${isEs ? "Ocupada" : "Occupied"}: ${room.activeReservation!.guest.fullName}`;
  } else if (isReservedFuture) {
    statusColor = "bg-amber-400";
    ringColor = "ring-amber-200";
    const ci = new Date(room.activeReservation!.checkIn).toLocaleDateString(
      isEs ? "es-VE" : "en-US",
      { day: "2-digit", month: "short" }
    );
    tooltip = `${isEs ? "Reservada" : "Reserved"} ${ci}: ${room.activeReservation!.guest.fullName}`;
  }

  return (
    <div
      title={tooltip}
      className={`relative group flex items-center justify-center w-10 h-10 rounded-xl border-2 border-white dark:border-slate-900 ring-2 ${ringColor} ${statusColor} cursor-default transition-transform hover:scale-110`}
    >
      <span className="text-white text-[10px] font-black">{room.roomNumber}</span>

      {/* Tooltip */}
      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:flex z-10 pointer-events-none">
        <div className="bg-gray-900 text-white text-xs font-medium px-3 py-1.5 rounded-xl whitespace-nowrap max-w-[180px] text-center leading-tight">
          {tooltip}
        </div>
      </div>
    </div>
  );
}

export function RoomStatusPanel({ roomTypes, locale, fullPage = false }: RoomStatusPanelProps) {
  const isEs = locale === "es";

  const totalRooms = roomTypes.reduce((s, rt) => s + rt.rooms.length, 0);
  const today = new Date();

  const occupiedCount = roomTypes.reduce((s, rt) =>
    s + rt.rooms.filter(r =>
      r.activeReservation &&
      new Date(r.activeReservation.checkIn) <= today &&
      new Date(r.activeReservation.checkOut) >= today
    ).length, 0
  );
  const reservedCount = roomTypes.reduce((s, rt) =>
    s + rt.rooms.filter(r =>
      r.activeReservation && new Date(r.activeReservation.checkIn) > today
    ).length, 0
  );
  const freeCount = totalRooms - occupiedCount - reservedCount;

  return (
    <aside className={fullPage ? "w-full space-y-5" : "w-full xl:w-80 shrink-0 space-y-5"}>
      {/* Header card */}
      <div className="bg-white dark:bg-slate-900 rounded-[2rem] border border-gray-100 dark:border-slate-800 shadow-sm dark:shadow-none p-6">
        <h2 className="text-card-title flex items-center gap-2 mb-5">
          <Bed className="w-4 h-4 text-brand-blue" />
          {isEs ? "Estado de Habitaciones" : "Room Status"}
        </h2>

        {/* Legend */}
        <div className="flex flex-wrap gap-3 mb-5">
          {[
            { color: "bg-green-500", label: isEs ? `${freeCount} Libres` : `${freeCount} Free` },
            { color: "bg-red-500", label: isEs ? `${occupiedCount} Ocupadas` : `${occupiedCount} Occupied` },
            { color: "bg-amber-400", label: isEs ? `${reservedCount} Reservadas` : `${reservedCount} Reserved` },
            { color: "bg-gray-400", label: isEs ? "Mant." : "Maint." },
          ].map((item) => (
            <div key={item.label} className="flex items-center gap-1.5">
              <div className={`w-2.5 h-2.5 rounded-full ${item.color}`} />
              <span className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide">{item.label}</span>
            </div>
          ))}
        </div>

        {/* Summary bar */}
        <div className="h-2 rounded-full bg-gray-100 dark:bg-slate-800 overflow-hidden flex">
          {occupiedCount > 0 && (
            <div
              className="bg-red-500 h-full transition-all"
              style={{ width: `${(occupiedCount / totalRooms) * 100}%` }}
            />
          )}
          {reservedCount > 0 && (
            <div
              className="bg-amber-400 h-full transition-all"
              style={{ width: `${(reservedCount / totalRooms) * 100}%` }}
            />
          )}
          <div className="bg-green-500 h-full flex-1" />
        </div>
        <p className="text-badge text-gray-400 dark:text-gray-500 uppercase mt-2 text-right">
          {freeCount}/{totalRooms} {isEs ? "disponibles" : "available"}
        </p>
      </div>

      {/* Per-category breakdown */}
      <div className={fullPage ? "grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4" : "space-y-3"}>
        {roomTypes.map((rt) => (
          <div key={rt.id} className="bg-white dark:bg-slate-900 rounded-[2rem] border border-gray-100 dark:border-slate-800 shadow-sm dark:shadow-none p-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-ui-bold text-gray-900 dark:text-gray-100 leading-none">{rt.name}</p>
                <p className="text-badge text-gray-400 dark:text-gray-500 uppercase mt-0.5">
                  {rt.rooms.length} {isEs ? "hab." : "rooms"}
                </p>
              </div>
              <div className="flex gap-1">
                {rt.rooms.some(r =>
                  r.activeReservation &&
                  new Date(r.activeReservation.checkIn) <= today &&
                  new Date(r.activeReservation.checkOut) >= today
                ) && <CheckCircle className="w-4 h-4 text-red-400" />}
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              {rt.rooms.map((room) => (
                <RoomDot key={room.id} room={room} isEs={isEs} />
              ))}
              {rt.rooms.length === 0 && (
                <p className="text-xs text-gray-300 dark:text-gray-600 font-medium italic">
                  {isEs ? "Sin habitaciones físicas" : "No physical rooms"}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </aside>
  );
}
