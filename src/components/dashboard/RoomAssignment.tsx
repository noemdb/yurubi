"use client";

import { useTransition, useState } from "react";
import { 
  Home, 
  Check, 
  Loader2,
  ChevronRight
} from "lucide-react";
import { assignRoom } from "@/lib/actions/reservations";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

export function RoomAssignment({ 
  reservationId, 
  currentRoomId, 
  availableRooms, 
  locale 
}: { 
  reservationId: string; 
  currentRoomId: string | null; 
  availableRooms: any[]; 
  locale: string 
}) {
  const [selectedRoomId, setSelectedRoomId] = useState(currentRoomId || "");
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();
  const isEs = locale === "es";

  const handleAssign = () => {
    if (!selectedRoomId) return;
    
    startTransition(async () => {
      try {
        await assignRoom(reservationId, selectedRoomId);
        toast({ title: isEs ? "Habitación asignada" : "Room assigned" });
      } catch (e) {
        toast({ title: "Error", variant: "destructive" });
      }
    });
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-[2rem] border border-gray-100 dark:border-slate-800 shadow-sm dark:shadow-none p-8 sm:p-10 mt-8 mb-20 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex items-center gap-4 mb-8">
        <div className="p-3 bg-brand-blue/5 dark:bg-brand-blue/10 rounded-2xl text-brand-blue">
          <Home className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-xl font-serif font-bold text-gray-900 dark:text-gray-100">
            {isEs ? "Asignar Habitación Física" : "Assign Physical Room"}
          </h2>
          <p className="text-gray-400 dark:text-gray-500 text-sm">
            {isEs ? "Selecciona el número de habitación para este huésped." : "Select the room number for this guest."}
          </p>
        </div>
      </div>

      <div className="flex flex-col md:flex-row items-end gap-6 max-w-2xl">
        <div className="flex-1 space-y-3 w-full">
          <Label className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest ml-1 lowercase first-letter:uppercase">
            {isEs ? "Habitaciones Disponibles" : "Available Rooms"}
          </Label>
          <Select 
            value={selectedRoomId} 
            onValueChange={setSelectedRoomId}
            disabled={isPending}
          >
            <SelectTrigger className="h-14 rounded-2xl border-gray-100 dark:border-slate-800 bg-gray-50 dark:bg-slate-800/50 focus:ring-brand-blue/20 transition-all font-bold text-gray-900 dark:text-gray-100 shadow-none">
              <SelectValue placeholder={isEs ? "Seleccionar número..." : "Select number..."} />
            </SelectTrigger>
            <SelectContent className="rounded-2xl border-gray-100 dark:border-slate-800 shadow-xl dark:shadow-none p-2">
              {availableRooms.map((room) => (
                <SelectItem 
                  key={room.id} 
                  value={room.id}
                  className="rounded-xl py-3 font-medium cursor-pointer focus:bg-brand-blue/5"
                >
                  Habitación {room.roomNumber} (Piso {room.floor})
                </SelectItem>
              ))}
              {availableRooms.length === 0 && (
                <div className="p-4 text-center text-sm text-gray-400 dark:text-gray-500">
                  {isEs ? "No hay habitaciones libres de este tipo." : "No free rooms of this type."}
                </div>
              )}
            </SelectContent>
          </Select>
        </div>

        <Button 
          className="h-14 px-10 bg-brand-blue hover:bg-brand-blue/90 text-white rounded-2xl font-bold shadow-lg dark:shadow-none shadow-brand-blue/20 gap-2 transition-all active:scale-95 disabled:opacity-50"
          onClick={handleAssign}
          disabled={isPending || !selectedRoomId || selectedRoomId === currentRoomId}
        >
          {isPending ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <Check className="w-5 h-5" />
          )}
          {isEs ? "Confirmar Asignación" : "Confirm Assignment"}
        </Button>
      </div>

      {currentRoomId && (
        <div className="mt-8 pt-8 border-t border-gray-50 dark:border-slate-800/50 flex items-center gap-3 text-sm text-brand-green font-medium">
          <div className="w-2 h-2 rounded-full bg-brand-green animate-pulse" />
          <span>{isEs ? "Habitación actualmente asignada" : "Currently assigned room"}</span>
        </div>
      )}
    </div>
  );
}
