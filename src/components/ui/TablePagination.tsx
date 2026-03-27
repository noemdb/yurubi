"use client";

import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";
import { Button } from "./button";
import { cn } from "@/lib/utils";

interface TablePaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  pageSize: number;
  onPageSizeChange: (size: number) => void;
  totalItems: number;
  locale: string;
}

export function TablePagination({
  currentPage,
  totalPages,
  onPageChange,
  pageSize,
  onPageSizeChange,
  totalItems,
  locale
}: TablePaginationProps) {
  const isEs = locale === "es";

  if (totalItems === 0) return null;

  const startIdx = (currentPage - 1) * pageSize + 1;
  const endIdx = Math.min(currentPage * pageSize, totalItems);

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-6 py-4 bg-gray-50/50 dark:bg-slate-800/30 border-t border-gray-50 dark:border-slate-800/50">
      <div className="text-xs font-medium text-gray-500 dark:text-gray-400">
        {isEs 
          ? `Mostrando ${startIdx}-${endIdx} de ${totalItems} resultados` 
          : `Showing ${startIdx}-${endIdx} of ${totalItems} results`}
      </div>

      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-gray-400 dark:text-gray-500 uppercase tracking-widest">{isEs ? "Filas" : "Rows"}</span>
          <select 
            value={pageSize}
            onChange={(e) => onPageSizeChange(Number(e.target.value))}
            className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-lg text-xs font-bold p-1 focus:ring-1 focus:ring-brand-blue outline-none text-gray-900 dark:text-gray-100"
          >
            {[5, 10, 20, 50].map(size => (
              <option key={size} value={size}>{size}</option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-1">
          <Button 
            variant="ghost" 
            size="icon" 
            disabled={currentPage === 1}
            onClick={() => onPageChange(currentPage - 1)}
            className="h-8 w-8 rounded-lg text-gray-600 dark:text-gray-400 hover:bg-white dark:hover:bg-slate-800 hover:text-gray-900 dark:hover:text-gray-100 hover:shadow-sm dark:hover:shadow-none transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
          
          <div className="flex items-center gap-1">
            {Array.from({ length: Math.min(3, totalPages) }, (_, i) => {
              const page = i + 1;
              return (
                <Button
                  key={page}
                  variant={currentPage === page ? "default" : "ghost"}
                  size="icon"
                  onClick={() => onPageChange(page)}
                  className={cn(
                    "h-8 w-8 rounded-lg text-xs font-bold transition-colors",
                    currentPage === page 
                      ? "bg-brand-blue text-white shadow-md dark:shadow-none shadow-brand-blue/20" 
                      : "text-gray-600 dark:text-gray-400 hover:bg-white dark:hover:bg-slate-800 hover:text-gray-900 dark:hover:text-gray-100 hover:shadow-sm dark:hover:shadow-none"
                  )}
                >
                  {page}
                </Button>
              );
            })}
            {totalPages > 3 && <MoreHorizontal className="w-3 h-3 text-gray-300 dark:text-gray-600 mx-1" />}
            {totalPages > 3 && (
              <Button
                variant={currentPage === totalPages ? "default" : "ghost"}
                size="icon"
                onClick={() => onPageChange(totalPages)}
                className={cn(
                  "h-8 w-8 rounded-lg text-xs font-bold transition-colors",
                  currentPage === totalPages 
                    ? "bg-brand-blue text-white shadow-md dark:shadow-none shadow-brand-blue/20" 
                    : "text-gray-600 dark:text-gray-400 hover:bg-white dark:hover:bg-slate-800 hover:text-gray-900 dark:hover:text-gray-100 hover:shadow-sm dark:hover:shadow-none"
                )}
              >
                {totalPages}
              </Button>
            )}
          </div>

          <Button 
            variant="ghost" 
            size="icon" 
            disabled={currentPage === totalPages}
            onClick={() => onPageChange(currentPage + 1)}
            className="h-8 w-8 rounded-lg text-gray-600 dark:text-gray-400 hover:bg-white dark:hover:bg-slate-800 hover:text-gray-900 dark:hover:text-gray-100 hover:shadow-sm dark:hover:shadow-none transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
