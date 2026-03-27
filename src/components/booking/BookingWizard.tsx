"use client";

import { useState } from "react";
import { Step1Search } from "./Step1Search";
import { Step2RoomSelection } from "./Step2RoomSelection";
import { Step3Checkout, type CheckoutFormData } from "./Step3Checkout";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { processReservation } from "@/lib/actions/booking";
import { useToast } from "@/hooks/use-toast";

export type BookingData = {
  checkIn?: Date;
  checkOut?: Date;
  guests?: number;
  roomTypeId?: string;
  roomTypeName?: string;
  price?: number;
};

export function BookingWizard({ 
  locale, 
  initialRoomType,
  onSuccess 
}: { 
  locale: string; 
  initialRoomType?: string;
  onSuccess?: (details: any) => void;
}) {
  const [step, setStep] = useState(1);
  const [data, setData] = useState<BookingData>({ roomTypeId: initialRoomType });
  const [availableRooms, setAvailableRooms] = useState<any[]>([]);
  const router = useRouter();
  const { toast } = useToast();

  const isEs = locale === "es";

  const handleCheckoutSuccess = async (formData: CheckoutFormData) => {
    try {
      if (!data.checkIn || !data.checkOut || !data.guests || !data.roomTypeId) {
        throw new Error("Missing reservation data");
      }
      
      const res = await processReservation({
        roomTypeId: data.roomTypeId,
        checkIn: data.checkIn,
        checkOut: data.checkOut,
        numberOfGuests: data.guests,
        guest: formData.guest,
        paymentMethod: formData.paymentMethod,
        notes: formData.notes,
        language: locale as "es" | "en",
      });
      
      if (onSuccess) {
        onSuccess({
          ...res,
          roomTypeName: data.roomTypeName,
          checkIn: data.checkIn,
          checkOut: data.checkOut,
          guests: data.guests,
          total: (data.price || 0) * Math.max(1, Math.ceil((data.checkOut.getTime() - data.checkIn.getTime()) / (1000 * 60 * 60 * 24)))
        });
      } else {
        router.push(`/${locale}/reservar/confirmacion/${res.id}`);
      }
    } catch (e: any) {
      toast({ 
        title: isEs ? "Error al procesar reserva" : "Error processing reservation", 
        description: e.message || "Unknown error", 
        variant: "destructive" 
      });
    }
  };

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 md:p-10 relative">
      {/* Stepper Header */}
      <div className="flex items-center justify-between mx-auto max-w-2xl mb-8 pb-8 border-b border-gray-100">
        {[1, 2, 3].map((s) => (
          <div key={s} className="flex flex-col items-center flex-1 relative">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center text-ui-bold mb-3 transition-colors z-10 ${
              step === s ? "bg-brand-blue text-white ring-4 ring-brand-blue/20" : 
              step > s ? "bg-brand-green text-white" : "bg-gray-100 text-gray-400"
            }`}>
              {s}
            </div>
            <span className={`text-badge text-center uppercase ${step === s ? "text-brand-blue" : "text-gray-400"}`}>
              {s === 1 ? (isEs ? "Búsqueda" : "Search") : 
               s === 2 ? (isEs ? "Habitación" : "Room") : 
               (isEs ? "Huésped y Pago" : "Checkout")}
            </span>
            {s < 3 && (
              <div className={`absolute top-6 left-[60%] w-[80%] h-[2px] -z-0 ${step > s ? "bg-brand-green" : "bg-gray-100"}`} />
            )}
          </div>
        ))}
      </div>

      <div className="min-h-[400px]">
        {step === 1 && (
          <Step1Search 
            initialData={data} 
            locale={locale}
            onNext={(newData, rooms) => {
              setData({ ...data, ...newData });
              setAvailableRooms(rooms);
              setStep(2);
            }}
          />
        )}
        {step === 2 && (
          <Step2RoomSelection 
            rooms={availableRooms} 
            locale={locale} 
            onSelect={(room) => {
              setData({ ...data, roomTypeId: room.id, price: room.basePrice, roomTypeName: room.name });
              setStep(3);
            }} 
            onBack={() => setStep(1)} 
          />
        )}
        {step === 3 && (
          <Step3Checkout 
            bookingData={data} 
            locale={locale} 
            onBack={() => setStep(2)} 
            onSuccess={(formData) => handleCheckoutSuccess(formData)} 
          />
        )}
      </div>
    </div>
  );
}
