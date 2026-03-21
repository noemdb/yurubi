// src/components/dashboard/OccupancyCalendar.tsx
"use client";

import { useState, useMemo } from "react";
import { 
  format, 
  addMonths, 
  subMonths, 
  startOfMonth, 
  endOfMonth, 
  eachDayOfInterval, 
  isSameDay, 
  isWithinInterval,
  startOfDay
} from "date-fns";
import { es, enUS } from "date-fns/locale";
import { 
  ChevronLeft, 
  ChevronRight, 
  Search,
  Users,
  Calendar as CalendarIcon
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { 
  Tooltip, 
  TooltipContent, 
  TooltipProvider, 
  TooltipTrigger 
} from "@/components/ui/tooltip";

interface OccupancyCalendarProps {
  rooms: any[];
  reservations: any[];
  locale: string;
}

export function OccupancyCalendar({ rooms, reservations, locale }: OccupancyCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const isEs = locale === "es";
  const dateLocale = isEs ? es : enUS;

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const nextMonth = () => setCurrentDate(addMonths(currentDate, 1));
  const prevMonth = () => setCurrentDate(subMonths(currentDate, 1));

  // Pre-calcular reservas por habitación para optimizar
  const reservationsByRoom = useMemo(() => {
    const map: Record<string, any[]> = {};
    reservations.forEach((res) => {
      if (res.roomId) {
        if (!map[res.roomId]) map[res.roomId] = [];
        map[res.roomId]!.push(res);
      }
    });
    return map;
  }, [reservations]);

  const getReservationOnDay = (roomId: string, day: Date) => {
    const roomRes = reservationsByRoom[roomId] || [];
    return roomRes.find((res) => 
      isWithinInterval(startOfDay(day), { 
        start: startOfDay(new Date(res.checkIn)), 
        end: startOfDay(new Date(res.checkOut)) 
      }) && !isSameDay(day, new Date(res.checkOut)) // El día de salida no cuenta como ocupado en la noche
    );
  };

  return (
    <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden flex flex-col h-[70vh]">
      {/* Calendar Header */}
      <div className="p-6 md:p-8 border-b border-gray-50 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="bg-brand-blue/10 p-3 rounded-2xl text-brand-blue">
            <CalendarIcon className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-2xl font-serif font-bold text-gray-900 capitalize">
              {format(currentDate, "MMMM yyyy", { locale: dateLocale })}
            </h3>
            <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mt-1">
              {isEs ? "Estado de Ocupación" : "Occupancy Status"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 bg-gray-50 p-1.5 rounded-2xl border border-gray-100">
          <Button variant="ghost" size="icon" onClick={prevMonth} className="rounded-xl hover:bg-white shadow-none text-gray-500 hover:text-brand-blue transition-all">
            <ChevronLeft className="w-5 h-5" />
          </Button>
          <Button 
            variant="ghost" 
            onClick={() => setCurrentDate(new Date())}
            className="text-xs font-bold uppercase tracking-widest px-4 hover:bg-white text-gray-400 hover:text-brand-blue"
          >
            {isEs ? "Hoy" : "Today"}
          </Button>
          <Button variant="ghost" size="icon" onClick={nextMonth} className="rounded-xl hover:bg-white shadow-none text-gray-500 hover:text-brand-blue transition-all">
            <ChevronRight className="w-5 h-5" />
          </Button>
        </div>
      </div>

      {/* Grid Area */}
      <div className="flex-1 overflow-auto custom-scrollbar relative">
        <div className="min-w-max">
          {/* Legend / Days Header */}
          <div className="flex sticky top-0 z-10 bg-white shadow-sm border-b border-gray-50">
            <div className="w-48 sticky left-0 z-20 bg-white p-4 font-bold text-[10px] text-gray-400 uppercase tracking-widest border-r border-gray-50 flex items-center justify-center">
              {isEs ? "Habitación" : "Room"}
            </div>
            {days.map((day) => (
              <div 
                key={day.toString()} 
                className={cn(
                  "w-12 h-14 flex flex-col items-center justify-center border-r border-gray-50 transition-colors",
                  isSameDay(day, new Date()) ? "bg-brand-blue/5" : ""
                )}
              >
                <span className="text-[10px] font-bold text-gray-400 uppercase leading-none mb-1">
                  {format(day, "EEE", { locale: dateLocale })}
                </span>
                <span className={cn(
                  "text-sm font-bold",
                  isSameDay(day, new Date()) ? "text-brand-blue" : "text-gray-900"
                )}>
                  {format(day, "d")}
                </span>
              </div>
            ))}
          </div>

          {/* Room Rows */}
          {rooms.map((room) => (
            <div key={room.id} className="flex border-b border-gray-50 hover:bg-gray-50/30 transition-colors group">
              <div className="w-48 sticky left-0 z-10 bg-white p-4 border-r border-gray-50 flex flex-col justify-center group-hover:bg-gray-50 transition-colors">
                <p className="font-bold text-gray-900 leading-tight">Room {room.roomNumber}</p>
                <p className="text-[10px] text-gray-400 font-bold uppercase truncate">{room.roomType.name}</p>
              </div>
              
              {days.map((day) => {
                const res = getReservationOnDay(room.id, day);
                const isStart = res && isSameDay(day, new Date(res.checkIn));
                
                return (
                  <div key={day.toString()} className="w-12 h-16 border-r border-gray-50 relative flex items-center justify-center">
                    {res ? (
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div className={cn(
                              "h-10 w-full flex items-center justify-center transition-all cursor-pointer relative",
                              res.status === 'CONFIRMED' ? "bg-brand-green/20 text-brand-green" : "bg-brand-blue/10 text-brand-blue",
                              isStart ? "rounded-l-lg ml-1" : ""
                            )}>
                              {isStart && <Users className="w-3 h-3 animate-in zoom-in" />}
                            </div>
                          </TooltipTrigger>
                          <TooltipContent side="top" className="rounded-xl border-gray-100 shadow-xl p-3 bg-white">
                            <div className="space-y-1">
                              <p className="text-xs font-bold text-gray-900">{res.guest.fullName}</p>
                              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                                {format(new Date(res.checkIn), "MMM dd")} - {format(new Date(res.checkOut), "MMM dd")}
                              </p>
                              <p className={cn(
                                "text-[9px] font-bold px-2 py-0.5 rounded-full w-fit uppercase",
                                res.status === 'CONFIRMED' ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"
                              )}>
                                {res.status}
                              </p>
                            </div>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    ) : (
                      <div className="w-full h-full hover:bg-gray-50/50 transition-colors" />
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
      
      {/* Legend Footer */}
      <div className="p-4 bg-gray-50 border-t border-gray-100 flex items-center gap-6 overflow-x-auto whitespace-nowrap">
         <div className="flex items-center gap-2 text-[10px] font-bold text-gray-500 uppercase tracking-widest">
            <div className="w-3 h-3 bg-brand-green/30 rounded-full" />
            {isEs ? "Confirmada" : "Confirmed"}
         </div>
         <div className="flex items-center gap-2 text-[10px] font-bold text-gray-500 uppercase tracking-widest">
            <div className="w-3 h-3 bg-brand-blue/20 rounded-full" />
            {isEs ? "Pendiente" : "Pending"}
         </div>
         <div className="flex items-center gap-2 text-[10px] font-bold text-gray-500 uppercase tracking-widest">
            <div className="w-3 h-3 bg-gray-200 rounded-full" />
            {isEs ? "Fuera de Servicio" : "Out of Order"}
         </div>
      </div>
    </div>
  );
}
