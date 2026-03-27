"use client";

import { ChevronUp, ChevronDown, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface TableSortHeaderProps {
  label: string;
  sortKey: string;
  currentSort: { key: string; direction: "asc" | "desc" | null };
  onSort: (key: string) => void;
  className?: string;
}

export function TableSortHeader({
  label,
  sortKey,
  currentSort,
  onSort,
  className
}: TableSortHeaderProps) {
  const isActive = currentSort.key === sortKey;
  
  return (
    <button
      onClick={() => onSort(sortKey)}
      className={cn(
        "flex items-center gap-2 hover:text-gray-900 transition-colors uppercase tracking-widest text-[10px] font-bold group",
        isActive ? "text-brand-blue" : "text-gray-400",
        className
      )}
    >
      {label}
      <span className="shrink-0">
        {isActive ? (
          currentSort.direction === "asc" ? (
            <ChevronUp className="w-3 h-3" />
          ) : (
            <ChevronDown className="w-3 h-3" />
          )
        ) : (
          <ChevronsUpDown className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
        )}
      </span>
    </button>
  );
}
