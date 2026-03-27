"use client";

import { useState } from "react";
import { format } from "date-fns";
import { es, enUS } from "date-fns/locale";
import { Calendar as CalendarIcon, Users, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { checkAvailability } from "@/lib/actions/booking";
import { useToast } from "@/hooks/use-toast";
import { useTranslations, useLocale } from "next-intl";
import { DateRange } from "react-day-picker";
import type { BookingData } from "./BookingWizard";

export function Step1Search({
  initialData,
  locale,
  onNext,
}: {
  initialData: BookingData;
  locale: string;
  onNext: (data: Partial<BookingData>, rooms: any[]) => void;
}) {
  const t = useTranslations("booking");
  const isEs = locale === "es";
  const dateLocale = isEs ? es : enUS;
  const { toast } = useToast();

  const [date, setDate] = useState<DateRange | undefined>({
    from: initialData.checkIn || undefined,
    to: initialData.checkOut || undefined,
  });

  const [guests, setGuests] = useState<string>(initialData.guests?.toString() || "2");
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = async () => {
    if (!date?.from || !date?.to) {
      toast({ 
        title: isEs ? "Faltan fechas" : "Missing dates",
        description: isEs ? "Por favor selecciona la fecha de check-in y check-out" : "Please select check-in and check-out dates",
        variant: "destructive" 
      });
      return;
    }
    
    setIsSearching(true);
    try {
      const g = parseInt(guests);
      const rooms = await checkAvailability({ checkIn: date.from, checkOut: date.to, guests: g });
      
      if (rooms.length === 0) {
        toast({ 
          title: isEs ? "Sin disponibilidad" : "No availability",
          description: isEs ? "No hay habitaciones para estas fechas y ocupación" : "No rooms available for these dates and occupancy",
          variant: "destructive" 
        });
      } else {
        onNext({ checkIn: date.from, checkOut: date.to, guests: g }, rooms);
      }
    } catch (e: any) {
      toast({ 
        title: isEs ? "Error al buscar" : "Search error",
        description: isEs ? "Ocurrió un problema de red, intenta de nuevo" : "A network problem occurred, try again",
        variant: "destructive" 
      });
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="space-y-10 max-w-xl mx-auto py-8 animate-in fade-in zoom-in-95 duration-500">
      <div className="text-center space-y-3 mb-10">
        <h2 className="text-dashboard-title">
          {isEs ? "¿Cuándo nos visitas?" : "When are you visiting?"}
        </h2>
        <p className="text-section-subtitle">
          {isEs ? "Selecciona tus fechas para ver disponibilidad real." : "Select your dates to see real availability."}
        </p>
      </div>

      <div className="space-y-6 bg-gray-50 p-6 rounded-3xl border border-gray-100">
        {/* Date Picker */}
        <div className="space-y-2">
          <label className="text-label ml-1">
            {isEs ? "Fechas de estadía" : "Stay dates"}
          </label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                id="date"
                variant={"outline"}
                className={cn(
                  "text-slate-950 w-full justify-start text-left font-bold h-14 rounded-2xl border-gray-200 shadow-sm bg-white hover:bg-gray-50",
                  !date && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-3 h-5 w-5 text-brand-blue" />
                {date?.from ? (
                  date.to ? (
                    <span className="font-medium text-gray-900">
                      {format(date.from, "LLL dd, y", { locale: dateLocale })} -{" "}
                      {format(date.to, "LLL dd, y", { locale: dateLocale })}
                    </span>
                  ) : (
                    <span className="font-medium text-brand-blue">
                      {format(date.from, "LLL dd, y", { locale: dateLocale })} - {isEs ? "¿Check-out?" : "Check-out?"}
                    </span>
                  )
                ) : (
                  <span>{isEs ? "Seleccionar fechas de estadía" : "Select stay dates"}</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0 rounded-2xl shadow-xl border-gray-100" align="center">
              <Calendar
                initialFocus
                mode="range"
                defaultMonth={date?.from}
                selected={date}
                onSelect={setDate}
                numberOfMonths={typeof window !== "undefined" && window.innerWidth < 768 ? 1 : 2}
                locale={dateLocale}
                disabled={(d) => d < new Date(new Date().setHours(0,0,0,0))}
                className="p-4"
              />
            </PopoverContent>
          </Popover>
        </div>

        {/* Guest Selector */}
        <div className="space-y-2">
          <label className="text-label ml-1">
            {isEs ? "Huéspedes" : "Guests"}
          </label>
          <Select value={guests} onValueChange={setGuests}>
            <SelectTrigger className="text-slate-950 h-14 rounded-2xl border-gray-200 shadow-sm bg-white hover:bg-gray-50 font-bold">
              <div className="flex items-center gap-3">
                <Users className="w-5 h-5 text-brand-blue" />
                <SelectValue placeholder={isEs ? "Número de huéspedes" : "Number of guests"} />
              </div>
            </SelectTrigger>
            <SelectContent className="rounded-xl border-gray-100 shadow-lg">
              {[1, 2, 3, 4, 5, 6].map((num) => (
                <SelectItem key={num} value={num.toString()} className="font-medium">
                  {num} {num === 1 ? (isEs ? "Huésped" : "Guest") : (isEs ? "Huéspedes" : "Guests")}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <Button 
        onClick={handleSearch} 
        disabled={isSearching} 
        className="text-cta w-full h-16 bg-brand-green hover:bg-brand-green-600 rounded-2xl shadow-md transition-all active:scale-[0.98]"
      >
        {isSearching ? <Loader2 className="w-6 h-6 animate-spin mx-auto" /> : (isEs ? "Buscar Disponibilidad" : "Search Availability")}
      </Button>
    </div>
  );
}
