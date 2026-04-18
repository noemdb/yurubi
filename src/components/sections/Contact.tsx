// src/components/sections/Contact.tsx
"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Loader2, Mail, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { sendContactEmail } from "@/actions/contact";

const contactSchema = z.object({
  name: z.string().min(2, "Nombre requerido"),
  email: z.string().email("Email inválido"),
  message: z.string().min(10, "Mensaje demasiado corto"),
});

export function Contact() {
  const t = useTranslations("contact");
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof contactSchema>>({
    resolver: zodResolver(contactSchema),
    defaultValues: { name: "", email: "", message: "" },
  });

  async function onSubmit(values: z.infer<typeof contactSchema>) {
    setIsSubmitting(true);
    try {
      const result = await sendContactEmail(values);
      if (result.success) {
        toast({
          title: t("successMessage"),
          variant: "default",
        });
        form.reset();
      } else {
        toast({
          title: "Error al enviar el mensaje",
          description: result.error ?? "Por favor intenta de nuevo.",
          variant: "destructive",
        });
      }
    } catch {
      toast({
        title: "Error inesperado",
        description: "No se pudo enviar el mensaje. Intenta de nuevo.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section className="py-8 bg-muted/50 dark:bg-gray-950 border-t border-border dark:border-gray-800 transition-colors duration-300">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-foreground dark:text-white mb-6">
              {t("title")}
            </h2>
            <p className="text-xl text-muted-foreground dark:text-gray-300 mb-8 leading-relaxed">
              {t("subtitle")}
            </p>
            <div className="space-y-6">
              <p className="text-muted-foreground/80 dark:text-gray-400 text-lg leading-relaxed">
                {t("motivatingText")}
              </p>
              
              <div className="flex flex-col gap-4 pt-4">
                <div className="flex items-center gap-4 text-muted-foreground dark:text-gray-400">
                  <div className="bg-brand-blue/10 p-3 rounded-md text-brand-blue">
                    <Mail className="w-5 h-5" />
                  </div>
                  <span>hotelrioyurubi@gmail.com</span>
                </div>
                <div className="flex items-center gap-4 text-muted-foreground dark:text-gray-400">
                  <div className="bg-brand-green/10 p-3 rounded-md text-brand-green">
                    <MessageSquare className="w-5 h-5" />
                  </div>
                  <span>+58 254 231.07.98</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-card dark:bg-gray-900 p-8 md:p-12 rounded-2xl shadow-xl shadow-brand-blue/5 dark:shadow-brand-blue/10 border border-border/60 dark:border-gray-800">
            {/* Formulario de contacto deshabilitado temporalmente:
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("name")}</FormLabel>
                        <FormControl>
                          <Input placeholder="Juan Pérez" {...field} className="rounded-xl h-12" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("email")}</FormLabel>
                        <FormControl>
                          <Input placeholder="juan@ejemplo.com" {...field} className="rounded-xl h-12" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="message"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("message")}</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Escribe tu mensaje aquí..."
                          className="h-32 resize-none rounded-xl"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex flex-col sm:flex-row gap-4 pt-4">
                  <Button 
                    type="submit" 
                    className="text-cta w-full sm:w-auto bg-brand-blue hover:bg-brand-blue-600 h-14 px-8 rounded-full"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <Mail className="mr-2 h-4 w-4" />
                    )}
                    {t("sendDirect")}
                  </Button>
                  
                  <Button 
                    type="button" 
                    variant="outline" 
                    className="text-cta w-full sm:w-auto h-14 px-8 border-[#25D366] text-[#25D366] hover:bg-[#25D366]/10 rounded-full"
                    onClick={() => window.open("https://wa.me/584267224991", "_blank")}
                  >
                    <MessageSquare className="mr-2 h-4 w-4" />
                    {t("whatsapp")}
                  </Button>
                </div>
              </form>
            </Form>
            */}

            <div className="flex flex-col items-center justify-center text-center py-4 md:py-8 space-y-6">
              <div className="bg-[#25D366]/10 p-5 rounded-2xl text-[#25D366] mb-2 animate-pulse">
                <MessageSquare className="w-12 h-12" />
              </div>
              <h3 className="text-2xl md:text-3xl font-bold text-foreground dark:text-white">
                Asistencia Directa
              </h3>
              <p className="text-muted-foreground dark:text-gray-400 max-w-md text-lg">
                Para brindarte una atención más rápida y personalizada, estamos gestionando todas las consultas directamente a través de WhatsApp.
              </p>
              <Button 
                type="button" 
                className="text-cta w-full sm:w-auto h-14 px-10 mt-6 bg-[#25D366] hover:bg-[#25D366]/90 text-white shadow-lg shadow-[#25D366]/20 transition-all hover:-translate-y-1 hover:scale-105 rounded-xl"
                onClick={() => window.open("https://wa.me/584267224991", "_blank")}
              >
                <MessageSquare className="mr-2 h-5 w-5 fill-current" />
                {t("whatsapp")}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
