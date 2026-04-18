"use client";

import { useTranslations } from "next-intl";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { HeroScene } from "@/components/public/HeroScene";
import { motion, Variants, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import Image from "next/image";
import { MessageSquare } from "lucide-react";

const images = [
  // "/images/hero/IMG-20260316-WA0024.jpg",
  // "/images/hero/IMG-20260316-WA0025.jpg",
  "/images/hero/front.jpg",
  // "/images/hero/frontSqu.jpg",
];


export function Hero({ locale }: { locale: string }) {
  const t = useTranslations("hero");
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % images.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut",
      },
    },
  };

  return (
    <section className="relative h-[95vh] min-h-[700px] flex items-center justify-center overflow-hidden bg-[#0a2a1b]">
      {/* Background Images Slideshow */}
      <div className="absolute inset-0 z-0">
        <AnimatePresence mode="wait">
          <motion.img
            key={currentImageIndex}
            src={images[currentImageIndex] || images[0]}
            alt="Hotel Río Yurubí Facade"
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 2, ease: "easeInOut" }}
            className="absolute inset-0 w-full h-full object-cover"
          />

        </AnimatePresence>
        {/* Brand Green Overlays for depth and readability */}
        <div className="absolute inset-0 bg-[#0a2a1b]/50 backdrop-blur-[1px] z-10" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a2a1b]/70 via-transparent to-[#0a2a1b]/90 z-20" />
      </div>

      {/* 3D Particle Overlay */}
      <div className="absolute inset-0 z-30 pointer-events-none opacity-40 mix-blend-screen">
        <HeroScene />
      </div>

      {/* Content */}
      <div className="container relative z-40 mx-auto px-4 text-center">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-4xl mx-auto flex flex-col items-center"
        >
          {/* Logo Integration */}
          <motion.div
            variants={itemVariants}
            className="mb-8 relative"
          >
            <div className="absolute -inset-4 bg-white/10 blur-2xl rounded-full" />
            <Image
              src="/images/logo/logo.jpg"
              alt="Hotel Río Yurubí Logo"
              width={140}
              height={140}
              className="relative rounded-lg shadow-2xl border-2 border-white/20"
              priority
              unoptimized
              sizes="140px"
            />

          </motion.div>

          <motion.h1 
            variants={itemVariants}
            className="text-hero mb-6 drop-shadow-[0_10px_10px_rgba(0,0,0,0.5)]"
          >
            {t("title")}
          </motion.h1>
          
          <motion.p 
            variants={itemVariants}
            className="text-hero-subtitle mb-12 max-w-2xl mx-auto drop-shadow-md"
          >
            {t("subtitle")}
          </motion.p>
          
          <motion.div 
            variants={itemVariants}
            className="flex flex-col sm:flex-row items-center justify-center gap-6"
          >
            {/* <Button
              asChild
              size="lg"
              className="w-full sm:w-auto text-cta h-16 px-10 bg-brand-green hover:bg-brand-green-600 text-white rounded-full shadow-[0_0_20px_rgba(69,176,114,0.3)] hover:shadow-[0_0_30px_rgba(69,176,114,0.5)] transition-all transform hover:scale-105 active:scale-95 border-none"
            >
              <Link href={`/${locale}/reservar`}>{t("cta")}</Link>
            </Button> */}
            
            <Button
              asChild
              size="lg"
              variant="ghost"
              className="w-full sm:w-auto text-cta h-16 px-10 rounded-2xl border border-white/30 text-white hover:bg-white/10 hover:border-white backdrop-blur-md transition-all transform hover:scale-105 active:scale-95"
            >
              <Link href={`/${locale}/habitaciones`}>{t("ctaSecondary")}</Link>
            </Button>

            <Button
              type="button"
              variant="ghost"
              className="w-full sm:w-auto text-cta h-16 px-10 border border-[#25D366]/50 text-white hover:bg-[#25D366]/20 hover:border-[#25D366] rounded-2xl backdrop-blur-md transition-all transform hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(37,211,102,0.15)]"
              onClick={() => window.open("https://wa.me/584267224991", "_blank")}
            >
              <MessageSquare className="mr-3 h-6 w-6 text-[#25D366] fill-[#25D366]/10" />
              {t("whatsapp")}
            </Button>
          </motion.div>
        </motion.div>
      </div>


      {/* Scroll indicator */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 z-40 hidden md:block"
      >
        <div className="flex flex-col items-center gap-3">
          <span className="text-white/40 text-xs uppercase tracking-widest font-medium"></span>
          <div className="w-[1px] h-16 bg-gradient-to-b from-brand-green to-transparent" />
        </div>
      </motion.div>
    </section>
  );
}


