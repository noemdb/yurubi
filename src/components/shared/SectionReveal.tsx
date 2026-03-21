"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

interface SectionRevealProps {
  children: ReactNode;
  delay?: number;
  width?: "full" | "auto";
}

export function SectionReveal({ children, delay = 0, width = "full" }: SectionRevealProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ 
        duration: 0.8, 
        delay,
        ease: [0.21, 0.47, 0.32, 0.98] 
      }}
      style={{ width: width === "full" ? "100%" : "auto" }}
    >
      {children}
    </motion.div>
  );
}
