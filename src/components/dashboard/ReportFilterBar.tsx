"use client";

import { useState } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { Calendar as CalendarIcon, Filter, Eraser } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { es, enUS } from "date-fns/locale";

export function ReportFilterBar({ locale }: { locale: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const isEs = locale === "es";
  const dateLocale = isEs ? es : enUS;

  const [dateRange, setDateRange] = useState<{ from: Date | undefined; to: Date | undefined }>({
    from: searchParams.get("startDate") ? new Date(searchParams.get("startDate")!) : undefined,
    to: searchParams.get("endDate") ? new Date(searchParams.get("endDate")!) : undefined,
  });

  const applyFilters = (range: { from: Date | undefined; to: Date | undefined }) => {
    const params = new URLSearchParams(searchParams.toString());
    if (range.from) params.set("startDate", format(range.from, "yyyy-MM-dd"));
    else params.delete("startDate");
    
    if (range.to) params.set("endDate", format(range.to, "yyyy-MM-dd"));
    else params.delete("endDate");

    router.push(`${pathname}?${params.toString()}`);
  };

  const clearFilters = () => {
    setDateRange({ from: undefined, to: undefined });
    router.push(pathname);
  };

  return (
    <div className="flex items-center gap-2">
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" className="h-11 rounded-xl border-gray-100 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 text-xs font-bold text-gray-500 dark:text-gray-400 gap-2 hover:bg-gray-50 dark:hover:bg-slate-800/50 shadow-sm dark:shadow-none transition-all">
            <CalendarIcon className="w-4 h-4 text-brand-blue" />
            {dateRange.from ? (
              dateRange.to ? (
                <>
                  {format(dateRange.from, "dd MMM", { locale: dateLocale })} - {" "}
                  {format(dateRange.to, "dd MMM", { locale: dateLocale })}
                </>
              ) : (
                format(dateRange.from, "dd MMM", { locale: dateLocale })
              )
            ) : (
              <span>{isEs ? "Filtrar por periodo" : "Filter by period"}</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0 rounded-2xl border-gray-100 dark:border-slate-800 shadow-2xl dark:shadow-none" align="end">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={dateRange.from}
            selected={{ from: dateRange.from, to: dateRange.to }}
            onSelect={(range) => {
              setDateRange({ from: range?.from, to: range?.to });
              if (range?.from && range?.to) {
                applyFilters({ from: range.from, to: range.to });
              }
            }}
            numberOfMonths={2}
            locale={dateLocale}
          />
        </PopoverContent>
      </Popover>

      {(dateRange.from || dateRange.to) && (
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={clearFilters}
          className="h-11 w-11 rounded-xl text-gray-300 dark:text-gray-600 hover:text-red-500 hover:bg-red-50 transition-all"
        >
          <Eraser className="w-4 h-4" />
        </Button>
      )}
    </div>
  );
}
