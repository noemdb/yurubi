// src/components/sections/Services.tsx
"use client";

import { useTranslations } from "next-intl";
import { Coffee, Map, Umbrella, Wifi } from "lucide-react";
import { motion, Variants } from "framer-motion";

export function Services() {
  const t = useTranslations("services");

  const services = [
    {
      id: "restaurant",
      icon: <Coffee className="h-8 w-8 text-brand-blue" />,
      title: t("restaurant"),
      description: t("restaurantDesc"),
    },
    {
      id: "pool",
      icon: <Umbrella className="h-8 w-8 text-brand-blue" />,
      title: t("pool"),
      description: t("poolDesc"),
    },
    {
      id: "meetingRoom",
      icon: <Map className="h-8 w-8 text-brand-green" />,
      title: t("meetingRoom"),
      description: t("meetingRoomDesc"),
    },
    {
      id: "bar",
      icon: <Wifi className="h-8 w-8 text-brand-green" />,
      title: t("bar"),
      description: t("barDesc"),
    },
  ];

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  };


  return (
    <section className="py-32 bg-white relative overflow-hidden">
      {/* Decorative background element */}
      <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-96 h-96 bg-brand-green/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/2 w-96 h-96 bg-brand-blue/5 rounded-full blur-3xl pointer-events-none" />

      <div className="container mx-auto px-4 lg:px-8 text-center max-w-7xl relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-section-title mb-6">
            {t("title")}
          </h2>
          <p className="text-section-subtitle mb-20 max-w-2xl mx-auto">
            {t("subtitle")}
          </p>
        </motion.div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
        >
          {services.map((service) => (
            <motion.div
              key={service.id}
              variants={itemVariants}
              whileHover={{ y: -10, transition: { duration: 0.2 } }}
              className="p-10 rounded-3xl bg-white border border-gray-100 shadow-sm hover:shadow-xl transition-all group cursor-default"
            >
              <div className="mb-8 inline-flex p-5 bg-gray-50 rounded-2xl shadow-inner group-hover:scale-110 group-hover:bg-brand-green/10 transition-all duration-300">
                {service.icon}
              </div>
              <h3 className="text-card-title mb-4">
                {service.title}
              </h3>
              <p className="text-card-body">
                {service.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

