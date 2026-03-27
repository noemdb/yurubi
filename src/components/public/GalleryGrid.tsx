// src/components/public/GalleryGrid.tsx
"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import Image from "next/image";

const categories = [
  { id: "all", label: "Todas" },
  { id: "rooms", label: "Habitaciones" },
  { id: "pool", label: "Piscina" },
  { id: "areas", label: "Áreas Comunes" },
];

import { motion, AnimatePresence } from "framer-motion";

interface GalleryImage {
  id: number;
  src: string;
  category: string;
  title: string;
}

export function GalleryGrid({ 
  locale, 
  images = [] 
}: { 
  locale: string;
  images?: GalleryImage[];
}) {
  const [activeCategory, setActiveCategory] = useState("all");
  const isEs = locale === "es";

  const filteredImages = images.filter(
    (img) => activeCategory === "all" || img.category === activeCategory
  );

  return (
    <section className="space-y-12">
      <div className="flex flex-wrap items-center justify-center gap-4">
        {categories.map((cat) => (
          <motion.button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={cn(
              "px-8 py-3 rounded-full text-xs font-bold uppercase tracking-widest transition-all duration-300",
              activeCategory === cat.id 
                ? "bg-brand-blue text-white shadow-xl shadow-brand-blue/30" 
                : "bg-gray-100 text-gray-500 hover:bg-gray-200"
            )}
          >
            {isEs ? cat.label : cat.id.charAt(0).toUpperCase() + cat.id.slice(1)}
          </motion.button>
        ))}
      </div>

      <motion.div 
        layout
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
      >
        <AnimatePresence mode="popLayout">
          {filteredImages.map((img) => (
            <motion.div 
              layout
              key={img.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.4 }}
              className="group relative h-96 rounded-[3rem] overflow-hidden cursor-pointer bg-gray-100 shadow-sm hover:shadow-2xl transition-all duration-500"
            >
              <Image
                src={img.src}
                alt={img.title}
                fill
                unoptimized
                className="object-cover transition-transform duration-700 group-hover:scale-110"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />

              {/* Overlay */}
              <motion.div 
                initial={{ opacity: 0 }}
                whileHover={{ opacity: 1 }}
                className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent flex flex-col justify-end p-10"
              >
                <motion.p 
                  initial={{ y: 20, opacity: 0 }}
                  whileHover={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.1 }}
                  className="text-white font-serif font-bold text-2xl"
                >
                  {img.title}
                </motion.p>
                <motion.p 
                  initial={{ y: 20, opacity: 0 }}
                  whileHover={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="text-brand-green text-xs font-bold uppercase tracking-widest mt-2"
                >
                  {categories.find(c => c.id === img.category)?.label}
                </motion.p>
              </motion.div>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
    </section>
  );
}

