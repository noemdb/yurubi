"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { guestSchema } from "@/lib/validators/guest";

export type GuestFormData = z.infer<typeof guestSchema>;

export function Step3Guest({
  initialData,
  locale,
  onBack,
  onNext,
}: {
  initialData?: GuestFormData;
  locale: string;
  onBack: () => void;
  onNext: (data: GuestFormData) => void;
}) {
  const isEs = locale === "es";

  const form = useForm<GuestFormData>({
    resolver: zodResolver(guestSchema),
    defaultValues: initialData || {
      fullName: "",
      email: "",
      phone: "",
      idDocument: "",
      address: "",
      origin: "",
    },
  });

  const onSubmit = (values: GuestFormData) => {
    onNext(values);
  };

  return (
    <div className="animate-in fade-in slide-in-from-right-8 duration-500 max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-6 border-b border-gray-100 dark:border-gray-800 pb-4">
        <h2 className="text-dashboard-title flex items-center gap-3">
          <User className="h-6 w-6 text-brand-blue" />
          {isEs ? "Datos del Huésped Principal" : "Main Guest Details"}
        </h2>
        <Button variant="ghost" onClick={onBack} className="text-brand-blue dark:text-brand-blue-400 rounded-xl h-10 px-4 hover:bg-brand-blue-50 dark:hover:bg-brand-blue-900/20">
          &larr; {isEs ? "Atrás" : "Back"}
        </Button>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div className="bg-gray-50 dark:bg-gray-800/50 p-6 md:p-8 rounded-3xl border border-gray-100 dark:border-gray-800 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField control={form.control} name="fullName" render={({ field }) => (
                <FormItem className="md:col-span-2">
                  <FormLabel className="text-label">{isEs ? "Nombre Completo" : "Full Name"}</FormLabel>
                  <FormControl><Input placeholder="Juan Pérez" className="h-12 rounded-xl bg-white dark:bg-gray-900 text-slate-950 dark:text-white focus:bg-white dark:focus:bg-gray-800/50 font-bold" {...field} /></FormControl>
                  <FormMessage className="text-error" />
                </FormItem>
              )} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField control={form.control} name="email" render={({ field }) => (
                <FormItem>
                  <FormLabel>{isEs ? "Correo Electrónico" : "Email Address"}</FormLabel>
                  <FormControl><Input type="email" placeholder="correo@ejemplo.com" className="h-12 rounded-xl bg-white dark:bg-gray-900 text-slate-950 dark:text-white focus:bg-white dark:focus:bg-gray-800/50 font-bold" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="phone" render={({ field }) => (
                <FormItem>
                  <FormLabel>{isEs ? "Teléfono Móvil" : "Phone Number"}</FormLabel>
                  <FormControl><Input placeholder="+58 412 0000000" className="h-12 rounded-xl bg-white dark:bg-gray-900 text-slate-950 dark:text-white focus:bg-white dark:focus:bg-gray-800/50 font-bold" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField control={form.control} name="idDocument" render={({ field }) => (
                <FormItem>
                  <FormLabel>{isEs ? "Cédula / Pasaporte" : "ID Document / Passport"}</FormLabel>
                  <FormControl><Input placeholder="V-12345678" className="h-12 rounded-xl bg-white dark:bg-gray-900 text-slate-950 dark:text-white focus:bg-white dark:focus:bg-gray-800/50 font-bold" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="origin" render={({ field }) => (
                <FormItem>
                  <FormLabel>{isEs ? "Ciudad / País de Origen" : "City / Country of Origin"}</FormLabel>
                  <FormControl><Input placeholder="Caracas, Venezuela" className="h-12 rounded-xl bg-white dark:bg-gray-900 text-slate-950 dark:text-white focus:bg-white dark:focus:bg-gray-800/50 font-bold" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
            </div>

            <div className="grid grid-cols-1 gap-6">
              <FormField control={form.control} name="address" render={({ field }) => (
                <FormItem>
                  <FormLabel>{isEs ? "Dirección de Domicilio" : "Home Address"}</FormLabel>
                  <FormControl><Input placeholder="Av. Principal, Edif. Rio, Apto 4" className="h-12 rounded-xl bg-white dark:bg-gray-900 text-slate-950 dark:text-white focus:bg-white dark:focus:bg-gray-800/50 font-bold" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
            </div>
          </div>

          <Button type="submit" className="text-cta w-full h-16 bg-brand-blue hover:bg-brand-blue-600 rounded-2xl shadow-md transition-transform active:scale-[0.99] mt-8">
            {isEs ? "Continuar al Pago" : "Continue to Payment"}
          </Button>
        </form>
      </Form>
    </div>
  );
}
