"use client";

import { useState } from "react";
import { Loader2, FileText, CalendarCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { es, enUS } from "date-fns/locale";
import type { BookingData } from "./BookingWizard";
import { formatPrice } from "@/lib/utils";
import { CURRENCY_SYMBOL } from "@/lib/constants";

export function Step5Summary({
  bookingData,
  locale,
  onBack,
  onSuccess,
}: {
  bookingData: BookingData;
  locale: string;
  onBack: () => void;
  onSuccess: () => void;
}) {
  const isEs = locale === "es";
  const dateLocale = isEs ? es : enUS;
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Cálculo de noches
  const nights = bookingData.checkIn && bookingData.checkOut 
    ? Math.max(1, Math.ceil((bookingData.checkOut.getTime() - bookingData.checkIn.getTime()) / (1000 * 60 * 60 * 24)))
    : 1;
    
  const total = (bookingData.price || 0) * nights;

  const handleConfirm = () => {
    setIsSubmitting(true);
    // Give react time to render loading state
    setTimeout(() => {
        onSuccess();
    }, 50);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 animate-in fade-in slide-in-from-right-8 duration-500">
      
      {/* Datos del Huésped Izquierda */}
      <div className="space-y-6">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-dashboard-title flex items-center gap-3">
            <CalendarCheck className="h-6 w-6 text-brand-green" />
            {isEs ? "Revisión Final" : "Final Review"}
          </h2>
          <Button variant="ghost" onClick={!isSubmitting ? onBack : undefined} disabled={isSubmitting} className="text-brand-blue dark:text-brand-blue-400 rounded-xl h-10 px-4 hover:bg-brand-blue-50 dark:hover:bg-brand-blue-900/20">
            &larr; {isEs ? "Atrás al Pago" : "Back to Payment"}
          </Button>
        </div>

        <div className="bg-gray-50 dark:bg-gray-800/50 p-6 rounded-xl border border-gray-100 dark:border-gray-800">
          <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4">
            {isEs ? "Datos de la Reserva" : "Booking Details"}
          </h3>
          <div className="space-y-3 text-sm text-gray-700">
            <p className="flex justify-between items-center border-b border-gray-100 dark:border-gray-800 pb-2">
                <span className="font-semibold text-gray-400 dark:text-gray-500">{isEs ? "Titular:" : "Name:"}</span> 
                <span className="font-medium text-gray-900 dark:text-white text-right">{bookingData.guest?.fullName}</span>
            </p>
            <p className="flex justify-between items-center border-b border-gray-100 dark:border-gray-800 pb-2">
                <span className="font-semibold text-gray-400 dark:text-gray-500">{isEs ? "Documento:" : "ID:"}</span> 
                <span className="font-medium text-gray-900 dark:text-white text-right">{bookingData.guest?.idDocument}</span>
            </p>
            <p className="flex justify-between items-center border-b border-gray-100 dark:border-gray-800 pb-2">
                <span className="font-semibold text-gray-400 dark:text-gray-500">Email:</span> 
                <span className="font-medium text-gray-900 dark:text-white text-right">{bookingData.guest?.email}</span>
            </p>
            <p className="flex justify-between items-start pt-2">
                <span className="font-semibold text-gray-400">{isEs ? "Método Pago:" : "Payment:"}</span> 
                <span className="font-bold text-brand-blue text-right uppercase text-xs tracking-wider bg-brand-blue/10 px-2 py-1 rounded-md">{bookingData.paymentMethod}</span>
            </p>
          </div>
        </div>

        <Button onClick={handleConfirm} disabled={isSubmitting} className="text-cta w-full h-16 bg-brand-green hover:bg-brand-green-600 text-brand-blue-900 rounded-lg shadow-xl transition-transform active:scale-[0.99] mt-4">
          {isSubmitting ? <Loader2 className="w-6 h-6 animate-spin mx-auto" /> : (isEs ? "Confirmar y Finalizar Reserva" : "Confirm & Complete Reservation")}
        </Button>
        <p className="text-center text-xs text-gray-400 dark:text-gray-500 mt-2 flex items-center justify-center gap-2">
            <FileText className="w-4 h-4" />
            {isEs ? "Al confirmar, aceptas nuestros términos de servicio." : "By confirming, you agree to our terms of service."}
        </p>
      </div>

      {/* Resumen Sidebar Derecha */}
      <div className="lg:col-span-1">
        <div className="bg-white dark:bg-gray-900 rounded-xl shadow-xl border border-gray-100 dark:border-gray-800 p-8 h-full relative overflow-hidden">
          {/* Fondo sutil decorativo */}
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-brand-green-50 rounded-full blur-3xl -z-0 pointer-events-none" />
          
          <div className="relative z-10">
            <h3 className="text-card-title border-b border-gray-100 dark:border-gray-800 pb-4 mb-6">
              {isEs ? "Resumen de tu Estadía" : "Stay Summary"}
            </h3>
            
            <div className="space-y-4 mb-6">
              <div>
                <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-1">{isEs ? "Habitación" : "Room"}</p>
                <p className="text-gray-900 font-medium">{bookingData.roomTypeName || "N/A"}</p>
              </div>
              
              <div className="flex justify-between">
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 font-bold uppercase tracking-wider mb-1">Check-in</p>
                  <p className="text-gray-900 dark:text-white font-medium">
                    {bookingData.checkIn ? format(bookingData.checkIn, "dd MMM yyyy", { locale: dateLocale }) : "-"}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-500 dark:text-gray-400 font-bold uppercase tracking-wider mb-1">Check-out</p>
                  <p className="text-gray-900 dark:text-white font-medium">
                    {bookingData.checkOut ? format(bookingData.checkOut, "dd MMM yyyy", { locale: dateLocale }) : "-"}
                  </p>
                </div>
              </div>
              
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400 font-bold uppercase tracking-wider mb-1">{isEs ? "Huéspedes" : "Guests"}</p>
                <p className="text-gray-900 dark:text-white font-medium">
                  {bookingData.guests} {bookingData.guests === 1 ? (isEs ? "Persona" : "Person") : (isEs ? "Personas" : "People")}
                </p>
              </div>
            </div>

            <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4 space-y-3 mb-6 border border-gray-100 dark:border-gray-800">
              {bookingData.promotionName && (
                <div className="flex justify-between items-center bg-brand-green/10 text-brand-green font-bold text-xs p-2 rounded-lg -mt-2 -mx-2 mb-2 uppercase tracking-wide border border-brand-green/20">
                  <span>✨ {isEs ? "Descuento Aplicado" : "Discount Applied"}</span>
                  <span className="truncate max-w-[120px]" title={bookingData.promotionName}>{bookingData.promotionName}</span>
                </div>
              )}
              <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
                <span>{isEs ? `Tarifa x noche` : `Nightly rate`} x {nights}</span>
                <div className="flex flex-col items-end">
                   {bookingData.promotionName && bookingData.originalPrice && (
                     <span className="text-[11px] font-bold text-gray-400 dark:text-gray-500 line-through">
                        {formatPrice(bookingData.originalPrice)}
                     </span>
                   )}
                   <span className="font-bold text-gray-900 dark:text-white">{formatPrice(bookingData.price || 0)}</span>
                </div>
              </div>
              <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
                <span>{isEs ? "Impuestos" : "Taxes"}</span>
                <span className="font-medium text-gray-900 dark:text-white">{CURRENCY_SYMBOL} 0.00</span>
              </div>
            </div>
            
            <div className="flex justify-between items-end pt-4 border-t border-gray-100 dark:border-gray-800">
              <span className="text-label text-gray-900 dark:text-white">{isEs ? "Total a Pagar" : "Total"}</span>
              <span className="text-card-price text-brand-green !text-3xl">{formatPrice(total)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
