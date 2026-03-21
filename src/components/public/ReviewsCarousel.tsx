"use client";

import { Star, Quote, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

interface Review {
  id: string;
  guestName: string;
  rating: number;
  comment: string;
}

export function ReviewsCarousel({ reviews, locale }: { reviews: Review[], locale: string }) {
  const isEs = locale === "es";
  const [currentIndex, setCurrentIndex] = useState(0);

  if (reviews.length === 0) return null;

  const next = () => setCurrentIndex((prev) => (prev + 1) % reviews.length);
  const prev = () => setCurrentIndex((prev) => (prev - 1 + reviews.length) % reviews.length);

  const currentReview = reviews[currentIndex];
  if (!currentReview) return null;

  return (
    <section className="relative px-4 md:px-12">
      <div className="relative overflow-hidden h-[450px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            className="absolute inset-0 flex items-center justify-center p-4"
          >
            <div className="max-w-3xl w-full bg-white p-12 md:p-16 rounded-[4rem] border border-gray-100 shadow-2xl relative overflow-hidden group">
              <Quote className="absolute -left-4 -top-4 w-32 h-32 text-brand-green/10" />
              
              <div className="flex gap-1 mb-8">
                {[...Array(5)].map((_, i) => (
                  <Star 
                    key={i} 
                    className={cn(
                      "w-5 h-5 fill-current", 
                      i < currentReview.rating ? "text-amber-400" : "text-gray-100"
                    )} 
                  />
                ))}
              </div>

              <blockquote className="text-gray-900 text-2xl md:text-3xl leading-relaxed mb-10 italic font-medium font-serif">
                "{currentReview.comment}"
              </blockquote>

              <div className="flex items-center gap-6 pt-10 border-t border-gray-50">
                <div className="w-16 h-16 rounded-3xl bg-brand-blue/10 flex items-center justify-center text-brand-blue font-bold text-2xl">
                  {currentReview.guestName.charAt(0)}
                </div>
                <div>
                  <p className="font-bold text-gray-900 text-xl">{currentReview.guestName}</p>
                  <p className="text-xs text-brand-green font-bold uppercase tracking-widest mt-1">
                    {isEs ? "Huésped Verificado" : "Verified Guest"}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>


      {/* Navigation Controls */}
      <div className="flex items-center justify-center gap-8 mt-12">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={prev}
          className="p-4 bg-white rounded-full shadow-lg hover:shadow-xl border border-gray-100 text-gray-900 transition-all"
        >
          <ChevronLeft className="w-6 h-6" />
        </motion.button>
        
        <div className="flex gap-2">
          {reviews.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentIndex(i)}
              className={cn(
                "w-2.5 h-2.5 rounded-full transition-all duration-300",
                i === currentIndex ? "bg-brand-blue w-8" : "bg-gray-200 hover:bg-gray-300"
              )}
            />
          ))}
        </div>

        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={next}
          className="p-4 bg-white rounded-full shadow-lg hover:shadow-xl border border-gray-100 text-gray-900 transition-all"
        >
          <ChevronRight className="w-6 h-6" />
        </motion.button>
      </div>
    </section>
  );
}

