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
  Calendar as CalendarIcon,
  Filter,
  Eraser
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { 
  Tooltip, 
  TooltipContent, 
  TooltipProvider, 
  TooltipTrigger 
} from "@/components/ui/tooltip";
import { Input } from "@/components/ui/input";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue 
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";

interface OccupancyCalendarProps {
  rooms: any[];
  reservations: any[];
  locale: string;
}

export function OccupancyCalendar({ rooms, reservations, locale }: OccupancyCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [categoryFilter, setCategoryFilter] = useState("ALL");
  const [goToDate, setGoToDate] = useState<Date | undefined>(undefined);
  
  const isEs = locale === "es";
  const dateLocale = isEs ? es : enUS;

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const nextMonth = () => setCurrentDate(addMonths(currentDate, 1));
  const prevMonth = () => setCurrentDate(subMonths(currentDate, 1));

  const categories = useMemo(() => {
    const cats = new Set<string>();
    rooms.forEach(room => cats.add(room.roomType.name));
    return Array.from(cats);
  }, [rooms]);

  // Filtrar reservaciones basadas en los criterios de búsqueda
  const filteredReservations = useMemo(() => {
    return reservations.filter(res => {
      const matchesSearch = res.guest.fullName.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = statusFilter === "ALL" || res.status === statusFilter;
      
      return matchesSearch && matchesStatus;
    });
  }, [reservations, search, statusFilter]);

  // Filtrar habitaciones si hay búsqueda específica o categoría
  const filteredRooms = useMemo(() => {
    return rooms.filter(room => {
      const matchesCategory = categoryFilter === "ALL" || room.roomType.name === categoryFilter;
      const matchesRoomSearch = search === "" || room.roomNumber.includes(search) || 
                               filteredReservations.some(res => res.roomId === room.id);
      
      return matchesCategory && matchesRoomSearch;
    });
  }, [rooms, categoryFilter, search, filteredReservations]);

  // Pre-calcular reservas por habitación para optimizar
  const reservationsByRoom = useMemo(() => {
    const map: Record<string, any[]> = {};
    filteredReservations.forEach((res) => {
      if (res.roomId) {
        if (!map[res.roomId]) map[res.roomId] = [];
        map[res.roomId]!.push(res);
      }
    });
    return map;
  }, [filteredReservations]);

  const getReservationOnDay = (roomId: string, day: Date) => {
    const roomRes = reservationsByRoom[roomId] || [];
    return roomRes.find((res) => 
      isWithinInterval(startOfDay(day), { 
        start: startOfDay(new Date(res.checkIn)), 
        end: startOfDay(new Date(res.checkOut)) 
      }) && !isSameDay(day, new Date(res.checkOut))
    );
  };

  const clearFilters = () => {
    setSearch("");
    setStatusFilter("ALL");
    setCategoryFilter("ALL");
    setGoToDate(undefined);
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-gray-100 dark:border-slate-800 shadow-sm dark:shadow-none overflow-hidden flex flex-col h-[70vh]">
      {/* Calendar Header */}
      <div className="p-6 md:p-8 border-b border-gray-50 dark:border-slate-800/50 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="flex flex-col sm:flex-row items-center gap-6">
          <div className="flex items-center gap-4">
            <div className="bg-brand-blue/10 dark:bg-brand-blue/20 p-3 rounded-2xl text-brand-blue">
              <CalendarIcon className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-2xl font-serif font-bold text-gray-900 dark:text-gray-100 capitalize">
                {format(currentDate, "MMMM yyyy", { locale: dateLocale })}
              </h3>
              <p className="text-xs text-gray-400 dark:text-gray-500 font-bold uppercase tracking-widest mt-1">
                {isEs ? "Estado de Ocupación" : "Occupancy Status"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 bg-gray-50 dark:bg-slate-800/50 p-1.5 rounded-2xl border border-gray-100 dark:border-slate-800">
            <Button variant="ghost" size="icon" onClick={prevMonth} className="rounded-xl hover:bg-white dark:hover:bg-slate-900 shadow-none text-gray-500 dark:text-gray-400 hover:text-brand-blue transition-all">
              <ChevronLeft className="w-5 h-5" />
            </Button>
            <Button 
              variant="ghost" 
              onClick={() => setCurrentDate(new Date())}
              className="text-xs font-bold uppercase tracking-widest px-4 hover:bg-white dark:hover:bg-slate-900 text-gray-400 dark:text-gray-500 hover:text-brand-blue"
            >
              {isEs ? "Hoy" : "Today"}
            </Button>
            <Button variant="ghost" size="icon" onClick={nextMonth} className="rounded-xl hover:bg-white dark:hover:bg-slate-900 shadow-none text-gray-500 dark:text-gray-400 hover:text-brand-blue transition-all">
              <ChevronRight className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 dark:text-gray-500" />
            <Input 
              placeholder={isEs ? "Huésped o habitación..." : "Guest or room..."}
              className="pl-9 h-10 rounded-xl border-gray-100 dark:border-slate-800 bg-gray-50 dark:bg-slate-800/50 text-xs shadow-none focus:bg-white transition-all"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="h-10 w-[140px] rounded-xl border-gray-100 dark:border-slate-800 bg-gray-50 dark:bg-slate-800/50 text-[10px] font-bold uppercase tracking-widest text-gray-500 dark:text-gray-400 hover:bg-white dark:hover:bg-slate-900">
              <SelectValue placeholder={isEs ? "Categoría" : "Category"} />
            </SelectTrigger>
            <SelectContent className="rounded-xl border-gray-100 dark:border-slate-800 shadow-lg dark:shadow-none">
              <SelectItem value="ALL" className="text-[10px] font-bold uppercase tracking-widest">{isEs ? "Todas" : "All"}</SelectItem>
              {categories.map(cat => (
                <SelectItem key={cat} value={cat} className="text-xs font-medium">{cat}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="h-10 w-[140px] rounded-xl border-gray-100 dark:border-slate-800 bg-gray-50 dark:bg-slate-800/50 text-[10px] font-bold uppercase tracking-widest text-gray-500 dark:text-gray-400 hover:bg-white dark:hover:bg-slate-900">
              <SelectValue placeholder={isEs ? "Estado" : "Status"} />
            </SelectTrigger>
            <SelectContent className="rounded-xl border-gray-100 dark:border-slate-800 shadow-lg dark:shadow-none">
              <SelectItem value="ALL" className="text-[10px] font-bold uppercase tracking-widest">{isEs ? "Todos" : "All"}</SelectItem>
              <SelectItem value="CONFIRMED" className="text-xs font-medium">{isEs ? "Confirmadas" : "Confirmed"}</SelectItem>
              <SelectItem value="PENDING" className="text-xs font-medium">{isEs ? "Pendientes" : "Pending"}</SelectItem>
            </SelectContent>
          </Select>

          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="h-10 rounded-xl border-gray-100 dark:border-slate-800 bg-gray-50 dark:bg-slate-800/50 px-4 text-[10px] font-bold uppercase tracking-widest text-gray-500 dark:text-gray-400 hover:bg-white dark:hover:bg-slate-900 transition-all shadow-none flex items-center gap-2">
                <CalendarIcon className="w-3.5 h-3.5" />
                {goToDate ? format(goToDate, "PP", { locale: dateLocale }) : (isEs ? "Ir a Fecha" : "Go to Date")}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0 rounded-2xl border-gray-100 dark:border-slate-800 shadow-2xl dark:shadow-none" align="end">
              <Calendar
                mode="single"
                selected={goToDate}
                onSelect={(date) => {
                  setGoToDate(date);
                  if (date) setCurrentDate(date);
                }}
                initialFocus
                locale={dateLocale}
              />
            </PopoverContent>
          </Popover>

          <Button 
            variant="ghost" 
            size="icon" 
            onClick={clearFilters}
            className="h-10 w-10 rounded-xl text-gray-300 dark:text-gray-600 hover:text-red-500 hover:bg-red-50"
            title={isEs ? "Limpiar filtros" : "Clear filters"}
          >
            <Eraser className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Grid Area */}
      <div className="flex-1 overflow-auto custom-scrollbar relative">
        <div className="min-w-max">
          {/* Legend / Days Header */}
          <div className="flex sticky top-0 z-10 bg-white dark:bg-slate-900 shadow-sm dark:shadow-none border-b border-gray-50 dark:border-slate-800/50">
            <div className="w-48 sticky left-0 z-20 bg-white dark:bg-slate-900 p-4 font-bold text-[10px] text-gray-400 dark:text-gray-500 uppercase tracking-widest border-r border-gray-50 dark:border-slate-800/50 flex items-center justify-center text-center">
              {isEs ? "Habitación" : "Room"}
            </div>
            {days.map((day) => (
              <div 
                key={day.toString()} 
                className={cn(
                  "w-12 h-14 flex flex-col items-center justify-center border-r border-gray-50 dark:border-slate-800/50 transition-colors",
                  isSameDay(day, new Date()) ? "bg-brand-blue/5 dark:bg-brand-blue/10" : ""
                )}
              >
                <span className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase leading-none mb-1">
                  {format(day, "EEE", { locale: dateLocale })}
                </span>
                <span className={cn(
                  "text-sm font-bold",
                  isSameDay(day, new Date()) ? "text-brand-blue" : "text-gray-900 dark:text-gray-100"
                )}>
                  {format(day, "d")}
                </span>
              </div>
            ))}
          </div>

          {/* Room Rows */}
          {filteredRooms.map((room) => (
            <div key={room.id} className="flex border-b border-gray-50 dark:border-slate-800/50 hover:bg-gray-50 dark:hover:bg-slate-800/30 transition-colors group">
              <div className="w-48 sticky left-0 z-10 bg-white dark:bg-slate-900 p-4 border-r border-gray-50 dark:border-slate-800/50 flex flex-col justify-center group-hover:bg-gray-50 transition-colors">
                <p className="font-bold text-gray-900 dark:text-gray-100 leading-tight">Room {room.roomNumber}</p>
                <p className="text-[10px] text-gray-400 dark:text-gray-500 font-bold uppercase truncate">{room.roomType.name}</p>
              </div>
              
              {days.map((day) => {
                const res = getReservationOnDay(room.id, day);
                const isStart = res && isSameDay(day, new Date(res.checkIn));
                
                return (
                  <div key={day.toString()} className="w-12 h-16 border-r border-gray-50 dark:border-slate-800/50 relative flex items-center justify-center">
                    {res ? (
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div className={cn(
                              "h-10 w-full flex items-center justify-center transition-all cursor-pointer relative",
                              res.status === 'CONFIRMED' ? "bg-brand-green/20 text-brand-green" : "bg-brand-blue/10 dark:bg-brand-blue/20 text-brand-blue",
                              isStart ? "rounded-l-lg ml-1" : ""
                            )}>
                              {isStart && <Users className="w-3 h-3 animate-in zoom-in" />}
                            </div>
                          </TooltipTrigger>
                          <TooltipContent side="top" className="rounded-xl border-gray-100 dark:border-slate-800 shadow-xl dark:shadow-none p-3 bg-white dark:bg-slate-900">
                            <div className="space-y-1">
                              <p className="text-xs font-bold text-gray-900 dark:text-gray-100">{res.guest.fullName}</p>
                              <p className="text-[10px] text-gray-400 dark:text-gray-500 font-bold uppercase tracking-wider">
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
                      <div className="w-full h-full hover:bg-gray-50 dark:hover:bg-slate-800/50 transition-colors" />
                    )}
                  </div>
                );
              })}
            </div>
          ))}

          {filteredRooms.length === 0 && (
            <div className="py-20 text-center w-full">
              <Filter className="w-10 h-10 text-gray-100 mx-auto mb-4" />
              <p className="text-sm text-gray-400 dark:text-gray-500 font-medium">{isEs ? "No se encontraron habitaciones con esos criterios." : "No rooms found with those criteria."}</p>
            </div>
          )}
        </div>
      </div>
      
      {/* Legend Footer */}
      <div className="p-4 bg-gray-50 dark:bg-slate-800/50 border-t border-gray-100 dark:border-slate-800 flex items-center gap-6 overflow-x-auto whitespace-nowrap">
         <div className="flex items-center gap-2 text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest">
            <div className="w-3 h-3 bg-brand-green/30 rounded-full" />
            {isEs ? "Confirmada" : "Confirmed"}
         </div>
         <div className="flex items-center gap-2 text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest">
            <div className="w-3 h-3 bg-brand-blue/20 rounded-full" />
            {isEs ? "Pendiente" : "Pending"}
         </div>
         <div className="flex items-center gap-2 text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest">
            <div className="w-3 h-3 bg-gray-200 rounded-full" />
            {isEs ? "Fuera de Servicio" : "Out of Order"}
         </div>
      </div>
    </div>
  );
}
