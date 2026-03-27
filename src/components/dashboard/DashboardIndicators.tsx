"use client";

import { 
  Bed, 
  Tags, 
  MessageSquare, 
  CheckCircle2, 
  XCircle, 
  Clock,
  ArrowRight,
  LayoutGrid
} from "lucide-react";
import { Link } from "@/routing";
import { cn } from "@/lib/utils";

interface DashboardIndicatorsProps {
  locale: string;
  rooms: { assigned: number; available: number };
  categories: { name: string; total: number; available: number; assigned: number }[];
  promotions: { active: number; list: any[] };
  reviews: { PENDING: number; APPROVED: number; REJECTED: number };
}

export function DashboardIndicators({ 
  locale, 
  rooms, 
  categories, 
  promotions, 
  reviews 
}: DashboardIndicatorsProps) {
  const isEs = locale === "es";

  return (
    <div className="space-y-6">
      {/* 1. Habitaciones: Asignadas vs Disponibles */}
      <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-gray-100 dark:border-slate-800 shadow-sm dark:shadow-none">
        <h3 className="text-sm font-serif font-bold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
          <Bed className="w-4 h-4 text-brand-blue" />
          {isEs ? "Estado de Habitaciones" : "Room Status"}
        </h3>
        
        <div className="flex items-center gap-4">
          <div className="flex-1 text-center p-3 bg-brand-blue/5 dark:bg-brand-blue/10 rounded-xl border border-brand-blue/10 dark:border-brand-blue/20">
            <p className="text-xl font-serif font-bold text-brand-blue">{rooms.assigned}</p>
            <p className="text-[9px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest mt-0.5">{isEs ? "Asignadas" : "Assigned"}</p>
          </div>
          <div className="flex-1 text-center p-3 bg-brand-green/5 rounded-xl border border-brand-green/10">
            <p className="text-xl font-serif font-bold text-brand-green">{rooms.available}</p>
            <p className="text-[9px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest mt-0.5">{isEs ? "Disponibles" : "Available"}</p>
          </div>
        </div>
      </div>

      {/* 2. Categorías Section */}
      <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-gray-100 dark:border-slate-800 shadow-sm dark:shadow-none">
        <h3 className="text-sm font-serif font-bold text-gray-900 dark:text-gray-100 mb-3 flex items-center gap-2">
          <LayoutGrid className="w-4 h-4 text-purple-500" />
          {isEs ? "Categorías y Totales" : "Categories & Totals"}
        </h3>
        
        <div className="space-y-2.5">
          {categories.slice(0, 4).map((cat) => (
            <div key={cat.name} className="flex items-center justify-between text-xs py-1.5 border-b border-gray-50 dark:border-slate-800/50 last:border-0">
               <span className="font-medium text-gray-700 dark:text-gray-300 truncate max-w-[120px]">{cat.name}</span>
               <div className="flex items-center gap-3">
                 <span className="text-gray-400 dark:text-gray-500 font-bold" title="Total">{cat.total}</span>
                 <span className="text-brand-green font-bold" title="Disponibles">{cat.available}</span>
                 <span className="text-amber-500 font-bold" title="Asignadas">{cat.assigned}</span>
               </div>
            </div>
          ))}
          {categories.length > 4 && (
            <Link href="/dashboard/habitaciones/categorias" className="text-[10px] text-brand-blue font-bold uppercase hover:underline block text-center mt-2">
              {isEs ? "Ver todas" : "View all"}
            </Link>
          )}
        </div>
      </div>

      {/* 3. Promociones Indicator */}
      <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-gray-100 dark:border-slate-800 shadow-sm dark:shadow-none relative overflow-hidden group">
        <div className="flex items-center justify-between mb-2">
           <h3 className="text-sm font-serif font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
             <Tags className="w-4 h-4 text-brand-green" />
             {isEs ? "Promociones" : "Promotions"}
           </h3>
           <span className="bg-brand-green/10 text-brand-green text-[10px] font-bold px-2 py-0.5 rounded-full">
             {promotions.active} {isEs ? "Activas" : "Active"}
           </span>
        </div>
        
        <p className="text-[11px] text-gray-500 dark:text-gray-400 mb-3">
          {isEs ? "Impulsa tus ventas con ofertas especiales." : "Boost your sales with special offers."}
        </p>

        <Link href="/dashboard/promociones" className="flex items-center gap-1 text-[10px] font-bold text-brand-blue uppercase group-hover:underline">
          {isEs ? "Gestionar promociones" : "Manage promotions"} <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
        </Link>

        <div className="absolute -right-2 -bottom-2 w-12 h-12 bg-brand-green opacity-5 rounded-full blur-lg group-hover:scale-150 transition-transform" />
      </div>

      {/* 4. Reseñas Indicador */}
      <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-gray-100 dark:border-slate-800 shadow-sm dark:shadow-none">
        <h3 className="text-sm font-serif font-bold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
          <MessageSquare className="w-4 h-4 text-amber-500" />
          {isEs ? "Resumen de Reseñas" : "Reviews Summary"}
        </h3>
        
        <div className="grid grid-cols-3 gap-2">
          <div className="flex flex-col items-center">
            <Clock className="w-3.5 h-3.5 text-amber-500 mb-1" />
            <span className="text-sm font-bold text-gray-900 dark:text-gray-100">{reviews.PENDING}</span>
            <span className="text-[8px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-tighter text-center">{isEs ? "Pendientes" : "Pending"}</span>
          </div>
          <div className="flex flex-col items-center">
            <CheckCircle2 className="w-3.5 h-3.5 text-brand-green mb-1" />
            <span className="text-sm font-bold text-gray-900 dark:text-gray-100">{reviews.APPROVED}</span>
            <span className="text-[8px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-tighter text-center">{isEs ? "Aprobadas" : "Approved"}</span>
          </div>
          <div className="flex flex-col items-center">
            <XCircle className="w-3.5 h-3.5 text-red-500 mb-1" />
            <span className="text-sm font-bold text-gray-900 dark:text-gray-100">{reviews.REJECTED}</span>
            <span className="text-[8px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-tighter text-center">{isEs ? "Rechazadas" : "Rejected"}</span>
          </div>
        </div>

        <Link href="/dashboard/resenas" className="block text-center text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase hover:text-brand-blue transition-colors mt-4">
          {isEs ? "Ver todas las reseñas" : "View all reviews"}
        </Link>
      </div>
    </div>
  );
}
