// src/components/dashboard/SettingsForm.tsx
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { 
  Save, 
  Phone, 
  Mail, 
  MapPin, 
  Instagram, 
  Facebook, 
  Waves,
  Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form";
import { updateSystemSetting } from "@/lib/actions/settings";
import { useToast } from "@/hooks/use-toast";

const settingsSchema = z.object({
  phone: z.string().min(1),
  email: z.string().email(),
  address: z.string().min(1),
  instagram: z.string().optional(),
  facebook: z.string().optional(),
  poolPrice: z.coerce.number().min(0),
});

export function SettingsForm({ initialData, locale }: { initialData: any, locale: string }) {
  const { toast } = useToast();
  const isEs = locale === "es";

  const form = useForm<z.infer<typeof settingsSchema>>({
    resolver: zodResolver(settingsSchema),
    defaultValues: {
      phone: initialData.contact?.phone || "+58 254-231-0798",
      email: initialData.contact?.email || "hotelrioyurubi@gmail.com",
      address: initialData.contact?.address || "Final Avenida La Fuente, San Felipe, Yaracuy",
      instagram: initialData.social?.instagram || "",
      facebook: initialData.social?.facebook || "",
      poolPrice: initialData.services?.poolPrice || 10,
    },
  });

  const onSubmit = async (values: z.infer<typeof settingsSchema>) => {
    try {
      await Promise.all([
        updateSystemSetting("contact_info", { 
          phone: values.phone, 
          email: values.email, 
          address: values.address 
        }),
        updateSystemSetting("social_links", { 
          instagram: values.instagram, 
          facebook: values.facebook 
        }),
        updateSystemSetting("service_prices", { 
          pool_price: values.poolPrice 
        }),
      ]);
      toast({ title: isEs ? "Ajustes guardados" : "Settings saved" });
    } catch (e) {
      toast({ title: "Error", variant: "destructive" });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-10">
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-10">
          
          {/* Contact Info Section */}
          <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm space-y-6">
            <h3 className="text-xl font-serif font-bold text-gray-900 flex items-center gap-3">
              <Mail className="w-5 h-5 text-brand-blue" />
              {isEs ? "Información de Contacto" : "Contact Information"}
            </h3>
            
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2"><Phone className="w-3.5 h-3.5" />{isEs ? "Teléfono" : "Phone"}</FormLabel>
                  <FormControl><Input {...field} className="rounded-xl" /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2"><Mail className="w-3.5 h-3.5" />Email</FormLabel>
                  <FormControl><Input {...field} className="rounded-xl" /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2"><MapPin className="w-3.5 h-3.5" />{isEs ? "Dirección" : "Address"}</FormLabel>
                  <FormControl><Input {...field} className="rounded-xl" /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Social & Services Section */}
          <div className="space-y-10">
            <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm space-y-6">
              <h3 className="text-xl font-serif font-bold text-gray-900 flex items-center gap-3">
                <Instagram className="w-5 h-5 text-pink-500" />
                {isEs ? "Redes Sociales" : "Social Presence"}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="instagram"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Instagram</FormLabel>
                      <FormControl><Input {...field} placeholder="@hotelrioyurubi" className="rounded-xl" /></FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="facebook"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Facebook</FormLabel>
                      <FormControl><Input {...field} placeholder="Hotel Río Yurubí" className="rounded-xl" /></FormControl>
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm space-y-6">
              <h3 className="text-xl font-serif font-bold text-gray-900 flex items-center gap-3">
                <Waves className="w-5 h-5 text-brand-blue" />
                {isEs ? "Precios de Servicios" : "Service Prices"}
              </h3>
              <FormField
                control={form.control}
                name="poolPrice"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{isEs ? "Precio Entrada Piscina ($)" : "Pool Entrance Price ($)"}</FormLabel>
                    <FormControl><Input type="number" {...field} className="rounded-xl" /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
        </div>

        <Button 
          type="submit" 
          disabled={form.formState.isSubmitting}
          className="bg-brand-blue hover:bg-brand-blue/90 text-white rounded-2xl h-16 px-12 shadow-lg shadow-brand-blue/20 gap-3 font-bold transition-all active:scale-95"
        >
          {form.formState.isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
          {isEs ? "Guardar Todos los Cambios" : "Save All Changes"}
        </Button>
      </form>
    </Form>
  );
}
