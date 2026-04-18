"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export const paymentSchema = z.object({
  paymentMethod: z.enum(["TRANSFERENCIA", "ZELLE", "EFECTIVO"]),
  notes: z.string().max(500).optional(),
});

export type PaymentFormData = z.infer<typeof paymentSchema>;

export function Step4Payment({
  initialData,
  locale,
  onBack,
  onNext,
}: {
  initialData?: PaymentFormData;
  locale: string;
  onBack: () => void;
  onNext: (data: PaymentFormData) => void;
}) {
  const isEs = locale === "es";

  const form = useForm<PaymentFormData>({
    resolver: zodResolver(paymentSchema),
    defaultValues: initialData || {
      paymentMethod: "TRANSFERENCIA",
      notes: "",
    },
  });

  const onSubmit = (values: PaymentFormData) => {
    onNext(values);
  };

  return (
    <div className="animate-in fade-in slide-in-from-right-8 duration-500 max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-6 border-b border-gray-100 dark:border-gray-800 pb-4">
        <h2 className="text-dashboard-title flex items-center gap-3">
          <ShieldCheck className="h-6 w-6 text-brand-green" />
          {isEs ? "Método de Pago Preferido" : "Preferred Payment Method"}
        </h2>
        <Button variant="ghost" onClick={onBack} className="text-brand-blue dark:text-brand-blue-400 rounded-xl h-10 px-4 hover:bg-brand-blue-50 dark:hover:bg-brand-blue-900/20">
          &larr; {isEs ? "Atrás" : "Back"}
        </Button>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div className="bg-gray-50 dark:bg-gray-800/50 p-6 md:p-8 rounded-3xl border border-gray-100 dark:border-gray-800 space-y-6">
             <FormField control={form.control} name="paymentMethod" render={({ field }) => (
                <FormItem>
                  <FormLabel>{isEs ? "Seleccione un Método" : "Select a Method"}</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="h-12 rounded-xl bg-white dark:bg-gray-900 text-slate-950 dark:text-white font-bold border-gray-200 dark:border-gray-700">
                        <SelectValue placeholder={isEs ? "Selecciona..." : "Select..."} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="rounded-xl border-gray-100 dark:border-gray-800">
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
                      className="resize-none h-24 rounded-xl bg-white dark:bg-gray-900 text-slate-950 dark:text-white font-bold border-gray-200 dark:border-gray-700" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />
          </div>

          <Button type="submit" className="text-cta w-full h-16 bg-brand-blue hover:bg-brand-blue-600 rounded-2xl shadow-md transition-transform active:scale-[0.99] mt-8">
            {isEs ? "Ver Resumen Final" : "View Final Summary"}
          </Button>
        </form>
      </Form>
    </div>
  );
}
