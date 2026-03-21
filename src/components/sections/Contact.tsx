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

// Schema local de contacto (solo UI, sin server action requerido por ahora)
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
    // Simular envío de email o Server Action call
    await new Promise((resolve) => setTimeout(resolve, 1500));
    
    toast({
      title: t("successMessage"),
      variant: "default",
    });
    
    form.reset();
    setIsSubmitting(false);
  }

  return (
    <section className="py-24 bg-gray-50 border-t border-gray-100">
      <div className="container mx-auto px-4 lg:px-8 max-w-4xl">
        <div className="text-center mb-12">
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {t("title")}
          </h2>
          <p className="text-gray-600 text-lg">{t("subtitle")}</p>
        </div>

        <div className="bg-white p-8 md:p-12 rounded-3xl shadow-sm border border-gray-100">
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
                        <Input placeholder="Juan Pérez" {...field} />
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
                        <Input placeholder="juan@ejemplo.com" {...field} />
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
                        className="h-32 resize-none"
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
                  className="w-full sm:w-auto bg-brand-blue hover:bg-brand-blue-600 h-12 px-8"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Mail className="mr-2 h-4 w-4" />
                  )}
                  {t("send")}
                </Button>
                
                <Button 
                  type="button" 
                  variant="outline" 
                  className="w-full sm:w-auto h-12 px-8 border-[#25D366] text-[#25D366] hover:bg-[#25D366]/10"
                  onClick={() => window.open("https://wa.me/582542310798", "_blank")}
                >
                  <MessageSquare className="mr-2 h-4 w-4" />
                  {t("whatsapp")}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </section>
  );
}
