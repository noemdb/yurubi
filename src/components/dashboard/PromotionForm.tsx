"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage,
  FormDescription
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { 
  Popover, 
  PopoverContent, 
  PopoverTrigger 
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { CalendarIcon, Loader2, Check } from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";

const promotionSchema = z.object({
  title: z.string().min(2, { message: "Título requerido" }),
  titleEn: z.string().optional(),
  description: z.string().min(10, { message: "Descripción requerida (mín. 10 caracteres)" }),
  descriptionEn: z.string().optional(),
  discountType: z.enum(["PERCENT", "FIXED"]),
  value: z.coerce.number().positive({ message: "El valor debe ser positivo" }),
  startDate: z.date({ required_error: "Fecha de inicio requerida" }),
  endDate: z.date({ required_error: "Fecha de fin requerida" }),
  conditions: z.string().optional(),
  conditionsEn: z.string().optional(),
  roomTypeIds: z.array(z.string()).min(1, { message: "Selecciona al menos una categoría" }),
});

type PromotionFormValues = z.infer<typeof promotionSchema>;

interface PromotionFormProps {
  initialData?: any;
  roomTypes: any[];
  locale: string;
  onSubmit: (data: PromotionFormValues) => Promise<void>;
  onCancel: () => void;
}

export function PromotionForm({ initialData, roomTypes, locale, onSubmit, onCancel }: PromotionFormProps) {
  const [loading, setLoading] = useState(false);
  const isEs = locale === "es";

  const form = useForm<PromotionFormValues>({
    resolver: zodResolver(promotionSchema),
    defaultValues: initialData ? {
      ...initialData,
      startDate: new Date(initialData.startDate),
      endDate: new Date(initialData.endDate),
      roomTypeIds: initialData.applicableRooms?.map((r: any) => r.id) || [],
    } : {
      title: "",
      titleEn: "",
      description: "",
      descriptionEn: "",
      discountType: "PERCENT",
      value: 0,
      roomTypeIds: [],
    },
  });

  const handleSubmit = async (values: PromotionFormValues) => {
    setLoading(true);
    try {
      await onSubmit(values);
    } finally {
      setLoading(false);
    }
  };

  const toggleRoom = (id: string) => {
    const current = form.getValues("roomTypeIds");
    if (current.includes(id)) {
      form.setValue("roomTypeIds", current.filter(i => i !== id), { shouldValidate: true });
    } else {
      form.setValue("roomTypeIds", [...current, id], { shouldValidate: true });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8 bg-white dark:bg-slate-900 p-8 md:p-12 rounded-3xl border border-gray-100 dark:border-slate-800 shadow-2xl dark:shadow-none">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          
          {/* Left Column - General Info */}
          <div className="space-y-8">
            <div className="space-y-4">
               <h3 className="text-sm font-bold uppercase tracking-widest text-brand-blue border-b border-brand-blue/10 dark:border-brand-blue/20 pb-2">
                 {isEs ? "Información General" : "General Information"}
               </h3>
               
               <FormField
                 control={form.control}
                 name="title"
                 render={({ field }) => (
                   <FormItem>
                     <FormLabel className="text-slate-950 dark:text-slate-50 font-bold">{isEs ? "Título (Español)" : "Title (Spanish)"}</FormLabel>
                     <FormControl>
                       <Input placeholder="Ej: Oferta de Carnaval" className="text-slate-950 dark:text-slate-50 font-bold h-12 rounded-xl" {...field} />
                     </FormControl>
                     <FormMessage />
                   </FormItem>
                 )}
               />

               <FormField
                 control={form.control}
                 name="titleEn"
                 render={({ field }) => (
                   <FormItem>
                     <FormLabel className="text-slate-950 dark:text-slate-50 font-bold">{isEs ? "Título (Inglés)" : "Title (English)"}</FormLabel>
                     <FormControl>
                       <Input placeholder="e.g. Carnival Special" className="text-slate-950 dark:text-slate-50 font-bold h-12 rounded-xl" {...field} />
                     </FormControl>
                     <FormMessage />
                   </FormItem>
                 )}
               />

               <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="discountType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-slate-950 dark:text-slate-50 font-bold">{isEs ? "Tipo" : "Type"}</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className="text-slate-950 dark:text-slate-50 font-bold h-12 rounded-xl">
                              <SelectValue />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="PERCENT">{isEs ? "Porcentaje" : "Percentage"}</SelectItem>
                            <SelectItem value="FIXED">{isEs ? "Monto Fijo" : "Fixed Amount"}</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="value"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-slate-950 dark:text-slate-50 font-bold">{isEs ? "Valor" : "Value"}</FormLabel>
                        <FormControl>
                          <Input type="number" className="text-slate-950 dark:text-slate-50 font-bold h-12 rounded-xl" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
               </div>
            </div>

            <div className="space-y-4">
               <h3 className="text-sm font-bold uppercase tracking-widest text-brand-blue border-b border-brand-blue/10 dark:border-brand-blue/20 pb-2">
                 {isEs ? "Fechas de Validez" : "Validity Dates"}
               </h3>
               
               <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="startDate"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel className="text-slate-950 dark:text-slate-50 font-bold">{isEs ? "Desde" : "From"}</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant={"outline"}
                                className={cn(
                                  "w-full pl-3 text-left font-bold text-slate-950 dark:text-slate-50 h-12 rounded-xl border-gray-200 dark:border-slate-700",
                                  !field.value && "text-muted-foreground"
                                )}
                              >
                                {field.value ? (
                                  format(field.value, "PPP", { locale: es })
                                ) : (
                                  <span>{isEs ? "Seleccionar" : "Select date"}</span>
                                )}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={field.value}
                              onSelect={field.onChange}
                              disabled={(date) => date < new Date("1900-01-01")}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="endDate"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel className="text-slate-950 dark:text-slate-50 font-bold">{isEs ? "Hasta" : "Until"}</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant={"outline"}
                                className={cn(
                                  "w-full pl-3 text-left font-bold text-slate-950 dark:text-slate-50 h-12 rounded-xl border-gray-200 dark:border-slate-700",
                                  !field.value && "text-muted-foreground"
                                )}
                              >
                                {field.value ? (
                                  format(field.value, "PPP", { locale: es })
                                ) : (
                                  <span>{isEs ? "Seleccionar" : "Select date"}</span>
                                )}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={field.value}
                              onSelect={field.onChange}
                              disabled={(date) => date < form.getValues("startDate")}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
               </div>
            </div>
          </div>

          {/* Right Column - Descriptions and Rooms */}
          <div className="space-y-8">
            <div className="space-y-4">
               <h3 className="text-sm font-bold uppercase tracking-widest text-brand-blue border-b border-brand-blue/10 dark:border-brand-blue/20 pb-2">
                 {isEs ? "Descripciones" : "Descriptions"}
               </h3>
               
               <FormField
                 control={form.control}
                 name="description"
                 render={({ field }) => (
                   <FormItem>
                     <FormLabel className="text-slate-950 dark:text-slate-50 font-bold font-bold">{isEs ? "Descripción (Español)" : "Description (Spanish)"}</FormLabel>
                     <FormControl>
                       <Textarea 
                         placeholder="Describe los beneficios de esta promoción..." 
                         className="text-slate-950 dark:text-slate-50 font-bold min-h-[100px] rounded-xl" 
                         {...field} 
                       />
                     </FormControl>
                     <FormMessage />
                   </FormItem>
                 )}
               />

               <FormField
                 control={form.control}
                 name="descriptionEn"
                 render={({ field }) => (
                   <FormItem>
                     <FormLabel className="text-slate-950 dark:text-slate-50 font-bold">{isEs ? "Descripción (Inglés)" : "Description (English)"}</FormLabel>
                     <FormControl>
                       <Textarea 
                         placeholder="Describe the benefits in English..." 
                         className="text-slate-950 dark:text-slate-50 font-bold min-h-[100px] rounded-xl" 
                         {...field} 
                       />
                     </FormControl>
                     <FormMessage />
                   </FormItem>
                 )}
               />
            </div>

            <div className="space-y-4">
               <h3 className="text-sm font-bold uppercase tracking-widest text-brand-blue border-b border-brand-blue/10 dark:border-brand-blue/20 pb-2">
                 {isEs ? "Categorías Aplicables" : "Applicable Room Categories"}
               </h3>
               
               <div className="flex flex-wrap gap-2">
                 {roomTypes.map((room) => {
                   const isSelected = form.watch("roomTypeIds").includes(room.id);
                   return (
                     <button
                       key={room.id}
                       type="button"
                       onClick={() => toggleRoom(room.id)}
                       className={cn(
                         "px-4 py-2 rounded-xl text-xs font-bold transition-all border",
                         isSelected 
                          ? "bg-brand-blue text-white border-brand-blue shadow-md dark:shadow-none" 
                          : "bg-gray-50 dark:bg-slate-800/50 text-gray-500 dark:text-gray-400 border-gray-100 dark:border-slate-800 hover:border-brand-blue/30"
                       )}
                     >
                       <div className="flex items-center gap-2">
                         {isSelected && <Check className="w-3 h-3" />}
                         {room.name}
                       </div>
                     </button>
                   );
                 })}
               </div>
               {form.formState.errors.roomTypeIds && (
                 <p className="text-xs text-red-500 font-bold">{form.formState.errors.roomTypeIds.message}</p>
               )}
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-4 pt-8 border-t border-gray-100 dark:border-slate-800">
           <Button type="button" variant="ghost" className="rounded-2xl font-bold px-8 h-12 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300" onClick={onCancel}>
             {isEs ? "Cancelar" : "Cancel"}
           </Button>
           <Button type="submit" disabled={loading} className="bg-brand-blue hover:bg-brand-blue/90 text-white rounded-2xl font-bold px-12 h-12 shadow-lg dark:shadow-none shadow-brand-blue/20">
             {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
             {initialData ? (isEs ? "Actualizar Promoción" : "Update Promotion") : (isEs ? "Crear Promoción" : "Create Promotion")}
           </Button>
        </div>
      </form>
    </Form>
  );
}
