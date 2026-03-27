"use client";

import { useState } from "react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { ChevronDown, ChevronRight, User, Shield, Search, Calendar as CalendarIcon, Eraser } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { isWithinInterval, startOfDay, endOfDay } from "date-fns";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface AuditLog {
  id: string;
  entity: string;
  entityId: string;
  action: string;
  timestamp: Date;
  changes: any;
  performedBy: {
    name: string;
    email: string;
    role: string;
  } | null;
}

const ACTION_STYLES: Record<string, { bg: string; text: string; label: string }> = {
  CREATE:  { bg: "bg-green-100",  text: "text-green-700",  label: "Creación" },
  UPDATE:  { bg: "bg-blue-100",   text: "text-blue-700",   label: "Actualización" },
  DELETE:  { bg: "bg-red-100",    text: "text-red-700",    label: "Eliminación" },
  CONFIRM: { bg: "bg-teal-100",   text: "text-teal-700",   label: "Confirmación" },
  CANCEL:  { bg: "bg-amber-100",  text: "text-amber-700",  label: "Cancelación" },
  REJECT:  { bg: "bg-rose-100",   text: "text-rose-700",   label: "Rechazo" },
};

const ALL_ACTIONS = Object.keys(ACTION_STYLES);

export function BitacoraTable({ logs, locale }: { logs: AuditLog[]; locale: string }) {
  const isEs = locale === "es";
  const dateLocale = isEs ? es : undefined;
  const [actionFilter, setActionFilter] = useState("ALL");
  const [search, setSearch] = useState("");
  const [dateRange, setDateRange] = useState<{ from: Date | undefined; to: Date | undefined }>({
    from: undefined,
    to: undefined
  });
  const [expanded, setExpanded] = useState<string | null>(null);

  const filtered = logs.filter((l) => {
    const matchesAction = actionFilter === "ALL" || l.action === actionFilter;
    const matchesSearch = 
      l.entity.toLowerCase().includes(search.toLowerCase()) ||
      l.performedBy?.name.toLowerCase().includes(search.toLowerCase()) ||
      l.performedBy?.email.toLowerCase().includes(search.toLowerCase());
    
    const logDate = new Date(l.timestamp);
    const matchesDate = !dateRange.from || !dateRange.to || isWithinInterval(logDate, {
      start: startOfDay(dateRange.from),
      end: endOfDay(dateRange.to)
    });

    return matchesAction && matchesSearch && matchesDate;
  });

  const clearFilters = () => {
    setActionFilter("ALL");
    setSearch("");
    setDateRange({ from: undefined, to: undefined });
  };

  return (
    <div className="space-y-5">
      {/* Filter bar */}
      <div className="bg-white dark:bg-slate-900 rounded-[2rem] border border-gray-100 dark:border-slate-800 shadow-sm dark:shadow-none p-6 flex flex-col lg:flex-row gap-6 items-center">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-500" />
          <Input
            placeholder={isEs ? "Buscar por entidad o usuario..." : "Search by entity or user..."}
            className="pl-10 h-11 rounded-xl border-gray-100 dark:border-slate-800 bg-gray-50 dark:bg-slate-800/50 text-sm shadow-none focus:bg-white transition-all"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="flex flex-wrap gap-2 items-center">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="h-11 rounded-xl border-gray-100 dark:border-slate-800 bg-gray-50 dark:bg-slate-800/50 px-4 text-xs font-bold text-gray-500 dark:text-gray-400 gap-2 hover:bg-white dark:hover:bg-slate-900 transition-all shadow-none">
                <CalendarIcon className="w-4 h-4 text-brand-blue" />
                {dateRange.from ? (
                  dateRange.to ? (
                    <>{format(dateRange.from, "dd MMM")} - {format(dateRange.to, "dd MMM")}</>
                  ) : format(dateRange.from, "dd MMM")
                ) : (isEs ? "Periodo" : "Period")}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0 rounded-2xl border-gray-100 dark:border-slate-800 shadow-2xl dark:shadow-none" align="end">
              <Calendar
                mode="range"
                selected={{ from: dateRange.from, to: dateRange.to }}
                onSelect={(range) => setDateRange({ from: range?.from, to: range?.to })}
                numberOfMonths={2}
                locale={isEs ? es : undefined}
              />
            </PopoverContent>
          </Popover>

          <div className="flex bg-gray-50 dark:bg-slate-800/50 p-1 rounded-xl border border-gray-100 dark:border-slate-800 h-11">
            <button
              onClick={() => setActionFilter("ALL")}
              className={cn(
                "px-3 rounded-lg text-[10px] font-bold uppercase transition-all",
                actionFilter === "ALL" ? "bg-white dark:bg-slate-900 text-gray-900 dark:text-gray-100 shadow-sm dark:shadow-none" : "text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300"
              )}
            >
              {isEs ? "Todos" : "All"}
            </button>
            {ALL_ACTIONS.map((action) => (
              <button
                key={action}
                onClick={() => setActionFilter(action)}
                className={cn(
                  "px-3 rounded-lg text-[10px] font-bold uppercase transition-all",
                  actionFilter === action ? "bg-white dark:bg-slate-900 text-brand-blue shadow-sm dark:shadow-none" : "text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300"
                )}
              >
                {isEs ? ACTION_STYLES[action].label : action}
              </button>
            ))}
          </div>

          <Button variant="ghost" size="icon" onClick={clearFilters} className="h-11 w-11 rounded-xl text-gray-300 dark:text-gray-600 hover:text-red-500 hover:bg-red-50">
            <Eraser className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Log list */}
      <div className="bg-white dark:bg-slate-900 rounded-[2rem] border border-gray-100 dark:border-slate-800 shadow-sm dark:shadow-none overflow-hidden">
        {filtered.length === 0 ? (
          <div className="py-20 text-center text-gray-400 dark:text-gray-500 font-medium">
            {isEs ? "No hay registros para ese filtro." : "No records for that filter."}
          </div>
        ) : (
          <ul className="divide-y divide-gray-50">
            {filtered.map((log) => {
              const s = ACTION_STYLES[log.action];
              const badge = s ?? { bg: "bg-gray-100 dark:bg-slate-800", text: "text-gray-600 dark:text-gray-400", label: log.action };
              const isOpen = expanded === log.id;
              const hasChanges = log.changes && Object.keys(log.changes).length > 0;

              return (
                <li key={log.id}>
                  <button
                    className="w-full text-left px-8 py-5 flex flex-col sm:flex-row sm:items-center gap-3 hover:bg-gray-50 dark:hover:bg-slate-800/80 transition-colors group"
                    onClick={() => hasChanges && toggle(log.id)}
                  >
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      {/* Action badge */}
                    <span className={`shrink-0 text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-xl ${badge.bg} ${badge.text}`}>
                        {isEs ? badge.label : log.action}
                      </span>

                      {/* Entity */}
                      <div className="min-w-0">
                        <p className="text-sm font-bold text-gray-900 dark:text-gray-100 truncate">
                          {log.entity}{" "}
                          <span className="text-gray-400 dark:text-gray-500 font-mono text-xs">
                            #{log.entityId.slice(-6).toUpperCase()}
                          </span>
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-6 shrink-0">
                      {/* User */}
                      <div className="flex items-center gap-2 text-xs text-gray-400 dark:text-gray-500 font-medium">
                        {log.performedBy ? (
                          <>
                            <User className="w-3.5 h-3.5" />
                            <span>{log.performedBy.name}</span>
                            <span className="text-[10px] bg-gray-100 dark:bg-slate-800 px-1.5 py-0.5 rounded-md font-bold text-gray-500 dark:text-gray-400">
                              {log.performedBy.role}
                            </span>
                          </>
                        ) : (
                          <>
                            <Shield className="w-3.5 h-3.5" />
                            <span className="italic">{isEs ? "Sistema / Visitante" : "System / Visitor"}</span>
                          </>
                        )}
                      </div>

                      {/* Timestamp */}
                      <p className="text-xs font-bold text-gray-400 dark:text-gray-500 tabular-nums">
                        {format(new Date(log.timestamp), "dd MMM HH:mm", {
                          locale: isEs ? es : undefined,
                        })}
                      </p>

                      {/* Expand icon */}
                      {hasChanges && (
                        <span className="text-gray-300 dark:text-gray-600 group-hover:text-gray-500 transition-colors">
                          {isOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                        </span>
                      )}
                    </div>
                  </button>

                  {/* Changes expanded */}
                  {isOpen && hasChanges && (
                    <div className="px-8 pb-5">
                      <div className="bg-gray-950 rounded-2xl p-5 overflow-x-auto">
                        <pre className="text-[11px] text-green-400 font-mono leading-relaxed">
                          {JSON.stringify(log.changes, null, 2)}
                        </pre>
                      </div>
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}
