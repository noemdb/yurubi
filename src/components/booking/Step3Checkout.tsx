"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Loader2, ShieldCheck, FileText, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { format } from "date-fns";
import { es, enUS } from "date-fns/locale";
import type { BookingData } from "./BookingWizard";
import { guestSchema } from "@/lib/validators/guest";
import { formatPrice } from "@/lib/utils";

const checkoutSchema = z.object({
  guest: guestSchema,
  paymentMethod: z.enum(["TRANSFERENCIA", "ZELLE", "EFECTIVO"]),
  notes: z.string().max(500).optional(),
});

export type CheckoutFormData = z.infer<typeof checkoutSchema>;

export function Step3Checkout({
  bookingData,
  locale,
  onBack,
  onSuccess,
}: {
  bookingData: BookingData;
  locale: string;
  onBack: () => void;
  onSuccess: (formData: CheckoutFormData) => void;
}) {
  const isEs = locale === "es";
  const dateLocale = isEs ? es : enUS;
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      guest: {
        fullName: "",
        email: "",
        phone: "",
        idDocument: "",
        origin: "",
      },
      paymentMethod: "TRANSFERENCIA",
      notes: "",
    },
  });

  const onSubmit = async (values: CheckoutFormData) => {
    setIsSubmitting(true);
    // Acá llamaríamos al Server Action final de reserva
    setTimeout(() => {
      setIsSubmitting(false);
      onSuccess(values);
    }, 1500); // Simulando red
  };

  // Cálculo de noches
  const nights = bookingData.checkIn && bookingData.checkOut 
    ? Math.max(1, Math.ceil((bookingData.checkOut.getTime() - bookingData.checkIn.getTime()) / (1000 * 60 * 60 * 24)))
    : 1;
    
  const total = (bookingData.price || 0) * nights;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 animate-in fade-in slide-in-from-right-8 duration-500">
      
      {/* Formulario Izquierda (2/3) */}
      <div className="lg:col-span-2 space-y-8">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-2xl font-serif font-bold text-gray-900 flex items-center gap-3">
            <User className="h-6 w-6 text-brand-blue" />
            {isEs ? "Datos del Huésped Principal" : "Main Guest Details"}
          </h2>
          <Button variant="ghost" onClick={onBack} className="text-brand-blue rounded-xl h-10 px-4 hover:bg-brand-blue-50">
            &larr; {isEs ? "Volver" : "Back"}
          </Button>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="bg-gray-50 p-6 md:p-8 rounded-3xl border border-gray-100 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField control={form.control} name="guest.fullName" render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel>{isEs ? "Nombre Completo" : "Full Name"}</FormLabel>
                    <FormControl><Input placeholder="Juan Pérez" className="h-12 rounded-xl bg-white" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField control={form.control} name="guest.email" render={({ field }) => (
                  <FormItem>
                    <FormLabel>{isEs ? "Correo Electrónico" : "Email Address"}</FormLabel>
                    <FormControl><Input type="email" placeholder="correo@ejemplo.com" className="h-12 rounded-xl bg-white" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="guest.phone" render={({ field }) => (
                  <FormItem>
                    <FormLabel>{isEs ? "Teléfono Móvil" : "Phone Number"}</FormLabel>
                    <FormControl><Input placeholder="+58 412 0000000" className="h-12 rounded-xl bg-white" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField control={form.control} name="guest.idDocument" render={({ field }) => (
                  <FormItem>
                    <FormLabel>{isEs ? "Cédula / Pasaporte" : "ID Document / Passport"}</FormLabel>
                    <FormControl><Input placeholder="V-12345678" className="h-12 rounded-xl bg-white" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="guest.origin" render={({ field }) => (
                  <FormItem>
                    <FormLabel>{isEs ? "Ciudad / País de Origen" : "City / Country of Origin"}</FormLabel>
                    <FormControl><Input placeholder="Caracas, Venezuela" className="h-12 rounded-xl bg-white" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
              </div>
            </div>

            {/* Payment & Extras */}
            <div className="bg-gray-50 p-6 md:p-8 rounded-3xl border border-gray-100 space-y-6">
               <h3 className="text-xl font-serif font-bold text-gray-900 flex items-center gap-2 mb-4">
                 <ShieldCheck className="h-5 w-5 text-brand-green" />
                 {isEs ? "Pago y Detalles Finales" : "Payment & Final Details"}
               </h3>
               
               <FormField control={form.control} name="paymentMethod" render={({ field }) => (
                  <FormItem>
                    <FormLabel>{isEs ? "Método de Pago Preferido" : "Preferred Payment Method"}</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="h-12 rounded-xl bg-white">
                          <SelectValue placeholder={isEs ? "Selecciona..." : "Select..."} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="rounded-xl">
                        <SelectItem value="TRANSFERENCIA">Transferencia Bancaria Nacional</SelectItem>
                        <SelectItem value="ZELLE">Zelle (USD)</SelectItem>
                        <SelectItem value="EFECTIVO">Efectivo (Pago en Recepción)</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )} />

                <FormField control={form.control} name="notes" render={({ field }) => (
                  <FormItem>
                    <FormLabel>{isEs ? "Nota Adicional (Opcional)" : "Additional Note (Optional)"}</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder={isEs ? "¿Alguna petición especial, alergia o requerimiento?" : "Any special requests?"} 
                        className="resize-none h-24 rounded-xl bg-white" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
            </div>

            <Button type="submit" disabled={isSubmitting} className="w-full h-16 bg-brand-blue hover:bg-brand-blue-600 text-lg font-bold rounded-2xl shadow-md transition-transform active:scale-[0.99] mt-8">
              {isSubmitting ? <Loader2 className="w-6 h-6 animate-spin mx-auto" /> : (isEs ? "Confirmar Reserva" : "Confirm Reservation")}
            </Button>

            <p className="text-center text-xs text-gray-400 mt-4 flex items-center justify-center gap-2">
               <FileText className="w-4 h-4" />
               {isEs ? "Al confirmar, aceptas nuestros términos de servicio y políticas de cancelación." : "By confirming, you agree to our terms of service and cancellation policies."}
            </p>
          </form>
        </Form>
      </div>

      {/* Resumen Sidebar Derecha (1/3) */}
      <div className="lg:col-span-1">
        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8 sticky top-28 overflow-hidden relative">
          {/* Fondo sutil decorativo */}
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-brand-green-50 rounded-full blur-3xl -z-0" />
          
          <div className="relative z-10">
            <h3 className="font-serif text-xl font-bold text-gray-900 border-b border-gray-100 pb-4 mb-6">
              {isEs ? "Resumen de tu Estadía" : "Stay Summary"}
            </h3>
            
            <div className="space-y-4 mb-6">
              <div>
                <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-1">{isEs ? "Habitación" : "Room"}</p>
                <p className="text-gray-900 font-medium">{bookingData.roomTypeName || "N/A"}</p>
              </div>
              
              <div className="flex justify-between">
                <div>
                  <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-1">Check-in</p>
                  <p className="text-gray-900 font-medium">
                    {bookingData.checkIn ? format(bookingData.checkIn, "dd MMM yyyy", { locale: dateLocale }) : "-"}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-1">Check-out</p>
                  <p className="text-gray-900 font-medium">
                    {bookingData.checkOut ? format(bookingData.checkOut, "dd MMM yyyy", { locale: dateLocale }) : "-"}
                  </p>
                </div>
              </div>
              
              <div>
                <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-1">{isEs ? "Huéspedes" : "Guests"}</p>
                <p className="text-gray-900 font-medium">
                  {bookingData.guests} {bookingData.guests === 1 ? (isEs ? "Persona" : "Person") : (isEs ? "Personas" : "People")}
                </p>
              </div>
            </div>

            <div className="bg-gray-50 rounded-2xl p-4 space-y-3 mb-6 border border-gray-100">
              <div className="flex justify-between text-sm text-gray-600">
                <span>{isEs ? `Tarifa por noche` : `Nightly rate`} x {nights}</span>
                <span>{formatPrice(bookingData.price || 0)}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-600">
                <span>{isEs ? "Impuestos (Incluidos)" : "Taxes (Included)"}</span>
                <span>$0.00</span>
              </div>
            </div>
            
            <div className="flex justify-between items-end pt-4 border-t border-gray-100">
              <span className="text-gray-900 font-bold">{isEs ? "Total a Pagar" : "Total to Pay"}</span>
              <span className="text-3xl font-bold text-brand-green">{formatPrice(total)}</span>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
