"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

interface SmartImageProps {
  src: string;
  alt: string;
  className?: string;
  fallbackText?: string;
  fallbackClassName?: string;
  textClassName?: string;
}

export function SmartImage({ 
  src, 
  alt, 
  className, 
  fallbackText,
  fallbackClassName = "bg-gradient-to-br from-gray-100 to-gray-200",
  textClassName = "text-gray-400 font-serif text-xl border-b border-gray-300 pb-1"
}: SmartImageProps) {
  const [error, setError] = useState(false);

  if (error) {
    return (
      <div className={cn("w-full h-full flex items-center justify-center", fallbackClassName)}>
        {fallbackText && (
          <span className={textClassName}>
            {fallbackText}
          </span>
        )}
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      onError={() => setError(true)}
    />
  );
}
