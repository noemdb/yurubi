"use client";

import { Users, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/utils";

export function Step2RoomSelection({
  rooms,
  locale,
  onSelect,
  onBack,
}: {
  rooms: any[];
  locale: string;
  onSelect: (room: any) => void;
  onBack: () => void;
}) {
  const isEs = locale === "es";

  if (rooms.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-xl text-gray-500 dark:text-gray-400 mb-6">
          {isEs ? "No hay habitaciones disponibles." : "No rooms available."}
        </p>
        <Button variant="outline" onClick={onBack}>{isEs ? "Volver" : "Back"}</Button>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-right-8 duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-2 pb-6 border-b border-gray-100">
        <div>
          <h2 className="text-dashboard-title">
            {isEs ? "Habitaciones Disponibles" : "Available Rooms"}
          </h2>
          <p className="text-caption mt-1">
            {isEs ? "Selecciona la habitación ideal para tu estadía." : "Select the ideal room for your stay."}
          </p>
        </div>
        <Button variant="ghost" onClick={onBack} className="text-brand-blue dark:text-brand-blue-400 hover:bg-brand-blue-50 dark:hover:bg-brand-blue-900/20 rounded-xl">
          &larr; {isEs ? "Modificar Búsqueda" : "Modify Search"}
        </Button>
      </div>
      
      <div className="flex flex-col gap-4">
        {rooms.map(room => (
          <div key={room.id} className="border border-gray-100 dark:border-gray-800 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-row bg-white dark:bg-gray-900 group cursor-pointer items-stretch h-32 md:h-36" onClick={() => onSelect(room)}>
            <div className="w-[35%] md:w-1/4 bg-gray-100 dark:bg-gray-800 relative overflow-hidden shrink-0">
               {room.images?.[0] ? (
                 <img src={room.images[0]} alt={room.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"/>
               ) : (
                 <div className="w-full h-full bg-brand-blue-50 flex items-center justify-center">
                   <span className="text-brand-blue-200 font-serif text-xs md:text-sm px-2 text-center">{room.name}</span>
                 </div>
               )}
               <div className="absolute top-2 right-2 bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm px-2 py-0.5 rounded-full shadow-sm text-[10px] font-bold text-gray-700 dark:text-gray-200 flex items-center gap-1 border border-gray-100/50 dark:border-gray-700/50">
                 <span className="w-1.5 h-1.5 rounded-full bg-brand-green animate-pulse" />
                 {room.availableCount} {isEs ? "disp." : "avail."}
               </div>
               
               {room.appliedPromotion && (
                 <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-brand-blue/95 to-brand-blue/70 backdrop-blur-md p-1.5 flex items-center justify-between border-t border-white/20">
                    <span className="text-[9px] font-bold tracking-widest uppercase text-white drop-shadow-sm flex flex-col">
                      <span className="text-[8px] text-brand-green-300 opacity-90">{isEs ? "Oferta" : "Offer"}</span>
                      <span className="truncate max-w-[100px]">{isEs ? room.appliedPromotion.title : room.appliedPromotion.titleEn || room.appliedPromotion.title}</span>
                    </span>
                 </div>
               )}
            </div>
            
            <div className="p-3 md:p-5 flex flex-col flex-grow justify-between min-w-0">
               <div className="flex justify-between items-start gap-2">
                 <div className="pr-2 min-w-0 flex-1">
                    <h3 className="text-sm md:text-base font-bold text-gray-900 dark:text-white font-serif truncate">{room.name}</h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 mt-1 mb-1 hidden md:block">
                      {room.description}
                    </p>
                 </div>
                 <div className="text-right shrink-0">
                   {room.appliedPromotion && (
                     <span className="text-[10px] font-bold text-gray-400 dark:text-gray-500 line-through decoration-brand-green/30 decoration-2 -mb-0.5 block">
                       {formatPrice(room.originalPrice)}
                     </span>
                   )}
                   <span className="text-base md:text-lg font-bold text-brand-green leading-none tracking-tight">{formatPrice(room.basePrice)}</span>
                 </div>
               </div>
               
               <div className="flex justify-end items-center mt-auto">
                 <Button 
                   onClick={(e) => { e.stopPropagation(); onSelect(room); }} 
                   className="text-xs bg-brand-blue hover:bg-brand-blue-600 h-8 md:h-10 px-4 md:px-6 rounded-xl shadow-sm transition-transform active:scale-[0.98]"
                 >
                   {isEs ? "Seleccionar" : "Select"}
                 </Button>
               </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
