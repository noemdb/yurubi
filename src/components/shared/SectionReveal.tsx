"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

interface SectionRevealProps {
  children: ReactNode;
  delay?: number;
  width?: "full" | "auto";
  className?: string;
}

export function SectionReveal({ children, delay = 0, width = "full", className }: SectionRevealProps) {
  return (
    <motion.div
      className={className}
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
