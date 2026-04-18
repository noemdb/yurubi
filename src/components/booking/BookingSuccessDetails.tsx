"use client";

import { 
  CheckCircle2, 
  Calendar, 
  MapPin, 
  User, 
  CreditCard, 
  FileText, 
  ChevronRight, 
  Printer, 
  X
} from "lucide-react";
import { format } from "date-fns";
import { es, enUS } from "date-fns/locale";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/utils";

export function BookingSuccessDetails({ 
  details, 
  locale, 
  onClose 
}: { 
  details: any; 
  locale: string; 
  onClose: () => void;
}) {
  const isEs = locale === "es";
  const dateLocale = isEs ? es : enUS;

  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300">
      <div className="bg-brand-green p-8 text-white relative">
        <div className="absolute top-4 right-4">
           <Button variant="ghost" onClick={onClose} className="text-white hover:bg-white/20 rounded-full h-10 w-10 p-0">
             <X className="w-6 h-6" />
           </Button>
        </div>
        
        <div className="flex items-center gap-4 mb-4">
           <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
             <CheckCircle2 className="w-10 h-10 text-white" />
           </div>
           <div>
             <h2 className="text-2xl font-serif font-bold leading-tight">
               {isEs ? "¡Reserva Exitosa!" : "Booking Successful!"}
             </h2>
             <p className="text-white/80 font-medium text-sm">
                ID: <span className="font-bold text-white uppercase">{details.id.slice(0, 8)}</span>
             </p>
           </div>
        </div>
      </div>

      <div className="p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Guest Info */}
          <div className="space-y-6">
            <div className="space-y-1">
               <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{isEs ? "Huésped Principal" : "Main Guest"}</p>
               <div className="flex items-center gap-3">
                 <div className="w-8 h-8 rounded-md bg-gray-50 flex items-center justify-center text-gray-400">
                   <User className="w-4 h-4" />
                 </div>
                 <p className="text-sm font-bold text-gray-900">{details.guestName || (isEs ? "Cargando..." : "Loading...")}</p>
               </div>
            </div>

            <div className="space-y-1">
               <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{isEs ? "Fechas de Estadía" : "Stay Dates"}</p>
               <div className="flex items-center gap-3">
                 <div className="w-8 h-8 rounded-md bg-gray-50 flex items-center justify-center text-gray-400">
                   <Calendar className="w-4 h-4" />
                 </div>
                 <p className="text-sm font-bold text-gray-900">
                    {format(details.checkIn, "dd MMM", { locale: dateLocale })} - {format(details.checkOut, "dd MMM, yyyy", { locale: dateLocale })}
                 </p>
               </div>
            </div>

            <div className="space-y-1">
               <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{isEs ? "Categoría Reservada" : "Room Category"}</p>
               <div className="flex items-center gap-3">
                 <div className="w-8 h-8 rounded-md bg-gray-50 flex items-center justify-center text-gray-400">
                   <MapPin className="w-4 h-4" />
                 </div>
                 <p className="text-sm font-bold text-gray-900">{details.roomTypeName}</p>
               </div>
            </div>
          </div>

          {/* Payment Info */}
          <div className="bg-gray-50 rounded-lg p-6 border border-gray-100 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex justify-between items-center text-xs uppercase tracking-wider font-bold text-gray-400">
                 <span>{isEs ? "Método" : "Method"}</span>
                 <span className="text-gray-900">{details.paymentMethod}</span>
              </div>
              <div className="w-full h-px bg-gray-200" />
              <div className="flex justify-between items-center text-xs uppercase tracking-wider font-bold text-gray-400">
                 <span>{isEs ? "Estado" : "Status"}</span>
                 <span className="px-2 py-0.5 bg-brand-green/10 text-brand-green rounded-md text-[10px]">CONFIRMADA</span>
              </div>
            </div>

            <div className="mt-8 pt-4 border-t border-gray-200">
               <div className="flex justify-between items-baseline">
                 <span className="text-xs font-bold text-gray-400 uppercase">{isEs ? "Total Pagado" : "Total Paid"}</span>
                 <span className="text-2xl font-serif font-bold text-brand-blue">{formatPrice(details.total)}</span>
               </div>
            </div>
          </div>
        </div>

        <div className="mt-10 flex gap-4">
          <Button 
            className="flex-1 bg-brand-blue hover:bg-brand-blue/90 text-white rounded-lg h-14 font-bold gap-2 text-sm shadow-lg shadow-brand-blue/20"
            onClick={onClose}
          >
            {isEs ? "Finalizar y Cerrar" : "Finish & Close"}
          </Button>
          <Button 
            variant="outline" 
            className="rounded-lg h-14 w-14 p-0 border-gray-100 text-gray-400 hover:text-brand-blue transition-all"
            onClick={() => window.print()}
          >
            <Printer className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </div>
  );
}
