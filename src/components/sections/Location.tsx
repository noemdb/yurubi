"use client";

import { useTranslations } from "next-intl";
import { MapPin, Navigation, Map as MapIcon, Phone, Mail } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";


export function Location() {
  const t = useTranslations("location");
  
  // Coordenadas del Hotel Río Yurubí
  const lat = "10.4035";
  const lng = "-68.7470";
  
  // Usar el nombre del hotel para un marcador más detallado y zoom 17
  const mapUrl = `https://maps.google.com/maps?q=Hotel+Rio+Yurubi+San+Felipe&z=17&t=m&output=embed`;

  return (
    <section className="py-8 bg-background dark:bg-gray-950 relative overflow-hidden border-t border-border dark:border-gray-800 transition-colors duration-300">
      {/* Decorative background element */}
      <div className="absolute top-0 right-0 w-1/2 h-full bg-brand-blue/5 dark:bg-brand-blue/10 rounded-l-[5rem] -z-10 transition-all duration-1000" />
      
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-16 items-center">
          
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="w-full lg:w-1/2 space-y-10"
          >
            <div>
              <h2 className="text-section-title mb-6">
                {t("title")}
              </h2>
              <p className="text-section-subtitle max-w-xl mb-4">
                {t("subtitle")}
              </p>
              <p className="text-muted-foreground dark:text-gray-400 italic text-sm">
                {t("interestLocation")}
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-start gap-4 p-8 bg-card dark:bg-gray-900 rounded-2xl border border-border/60 dark:border-gray-800 shadow-sm hover:shadow-xl transition-all group">
                <div className="bg-brand-blue/10 p-4 rounded-lg text-brand-blue group-hover:bg-brand-blue group-hover:text-white transition-colors duration-500">
                  <MapPin className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-card-title mb-2">Ubicación</h3>
                  <p className="text-muted-foreground dark:text-gray-400 text-sm leading-relaxed mb-4">
                    {t("address")}
                  </p>
                  <a 
                    href={process.env.NEXT_PUBLIC_GOOGLE_MAPS_URL || `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 text-brand-blue font-bold text-sm hover:translate-x-1 transition-transform"
                  >
                    <Navigation className="h-4 w-4" />
                    {t("howToArrive")}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4 p-8 bg-card dark:bg-gray-900 rounded-2xl border border-border/60 dark:border-gray-800 shadow-sm hover:shadow-xl transition-all group">
                <div className="bg-brand-green/10 p-4 rounded-lg text-brand-green group-hover:bg-brand-green group-hover:text-white transition-colors duration-500">
                  <Phone className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-card-title mb-2">Contacto</h3>
                  <p className="text-muted-foreground dark:text-gray-400 text-sm mb-1">+58 254 231.07.98</p>
                  <p className="text-muted-foreground dark:text-gray-400 text-sm mb-4">hotelrioyurubi@gmail.com</p>
                  <div className="flex items-center gap-2 text-brand-green font-bold text-sm">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-green opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-green"></span>
                    </span>
                    En línea ahora
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.2 }}
            className="w-full lg:w-1/2 h-[600px] bg-muted dark:bg-gray-800 rounded-3xl overflow-hidden shadow-2xl border-8 border-background dark:border-gray-950 relative group"
          >
            <iframe 
              src={mapUrl}
              width="100%" 
              height="100%" 
              style={{ border: 0 }} 
              allowFullScreen={true} 
              loading="lazy" 
              referrerPolicy="no-referrer-when-downgrade"
              title="Hotel Río Yurubí Map Location"
              className="w-full h-full"
            />
            {/* Map Overlay Button */}
            <div className="absolute bottom-8 right-8 z-20">
              <Button asChild size="lg" className="rounded-xl bg-card dark:bg-gray-900 text-foreground dark:text-white hover:bg-brand-blue hover:text-white shadow-xl transition-all px-8 h-14">
                <a 
                  href={process.env.NEXT_PUBLIC_GOOGLE_MAPS_URL || `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2"
                >
                  <MapIcon className="h-5 w-5" />
                  Abrir en Google Maps
                </a>
              </Button>
            </div>
          </motion.div>


        </div>
      </div>
    </section>
  );
}

