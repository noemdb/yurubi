"use client";

import { useState } from "react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { ChevronDown, ChevronRight, User, Shield } from "lucide-react";

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
  const [actionFilter, setActionFilter] = useState("ALL");
  const [expanded, setExpanded] = useState<string | null>(null);

  const filtered = actionFilter === "ALL"
    ? logs
    : logs.filter((l) => l.action === actionFilter);

  const toggle = (id: string) => setExpanded((prev) => (prev === id ? null : id));

  return (
    <div className="space-y-5">
      {/* Filter bar */}
      <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm p-4 flex flex-wrap gap-2 items-center">
        <span className="text-xs font-bold text-gray-400 uppercase tracking-widest mr-2">
          {isEs ? "Filtrar:" : "Filter:"}
        </span>
        <button
          onClick={() => setActionFilter("ALL")}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            actionFilter === "ALL" ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-500 hover:bg-gray-200"
          }`}
        >
          {isEs ? "Todos" : "All"}
        </button>
        {ALL_ACTIONS.map((action) => {
          const s = ACTION_STYLES[action];
          const bg = s?.bg ?? "bg-gray-100";
          const text = s?.text ?? "text-gray-600";
          const label = s?.label ?? action;

          return (
            <button
              key={action}
              onClick={() => setActionFilter(action)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                actionFilter === action
                  ? `${bg} ${text}`
                  : "bg-gray-100 text-gray-500 hover:bg-gray-200"
              }`}
            >
              {isEs ? label : action}
            </button>
          );
        })}
        <span className="ml-auto text-xs font-bold text-gray-400">
          {filtered.length} {isEs ? "entradas" : "entries"}
        </span>
      </div>

      {/* Log list */}
      <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm overflow-hidden">
        {filtered.length === 0 ? (
          <div className="py-20 text-center text-gray-400 font-medium">
            {isEs ? "No hay registros para ese filtro." : "No records for that filter."}
          </div>
        ) : (
          <ul className="divide-y divide-gray-50">
            {filtered.map((log) => {
              const s = ACTION_STYLES[log.action];
              const badge = s ?? { bg: "bg-gray-100", text: "text-gray-600", label: log.action };
              const isOpen = expanded === log.id;
              const hasChanges = log.changes && Object.keys(log.changes).length > 0;

              return (
                <li key={log.id}>
                  <button
                    className="w-full text-left px-8 py-5 flex flex-col sm:flex-row sm:items-center gap-3 hover:bg-gray-50/80 transition-colors group"
                    onClick={() => hasChanges && toggle(log.id)}
                  >
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      {/* Action badge */}
                    <span className={`shrink-0 text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-xl ${badge.bg} ${badge.text}`}>
                        {isEs ? badge.label : log.action}
                      </span>

                      {/* Entity */}
                      <div className="min-w-0">
                        <p className="text-sm font-bold text-gray-900 truncate">
                          {log.entity}{" "}
                          <span className="text-gray-400 font-mono text-xs">
                            #{log.entityId.slice(-6).toUpperCase()}
                          </span>
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-6 shrink-0">
                      {/* User */}
                      <div className="flex items-center gap-2 text-xs text-gray-400 font-medium">
                        {log.performedBy ? (
                          <>
                            <User className="w-3.5 h-3.5" />
                            <span>{log.performedBy.name}</span>
                            <span className="text-[10px] bg-gray-100 px-1.5 py-0.5 rounded-md font-bold text-gray-500">
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
                      <p className="text-xs font-bold text-gray-400 tabular-nums">
                        {format(new Date(log.timestamp), "dd MMM HH:mm", {
                          locale: isEs ? es : undefined,
                        })}
                      </p>

                      {/* Expand icon */}
                      {hasChanges && (
                        <span className="text-gray-300 group-hover:text-gray-500 transition-colors">
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
