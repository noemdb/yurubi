// src/components/public/WhatsAppBookingButton.tsx
"use client";

import { Button } from "@/components/ui/button";
import { MessageSquare } from "lucide-react";

interface WhatsAppBookingButtonProps {
  roomName: string;
  roomId: string;
  locale: string;
  className?: string;
}

export function WhatsAppBookingButton({ 
  roomName, 
  roomId, 
  locale,
  className 
}: WhatsAppBookingButtonProps) {
  const handleClick = () => {
    const message = encodeURIComponent(
      `Hola, estoy interesado en reservar: ${roomName} (ID: ${roomId}). ¿Podrían brindarme más información?`
    );
    window.open(`https://wa.me/584267224991?text=${message}`, "_blank");
  };

  return (
    <Button
      type="button"
      variant="ghost"
      className={className}
      onClick={handleClick}
    >
      <MessageSquare className="mr-2 h-4 w-4 text-[#25D366] fill-[#25D366]/10" />
      {locale === 'es' ? 'Reservar por WhatsApp' : 'Book via WhatsApp'}
    </Button>
  );
}
