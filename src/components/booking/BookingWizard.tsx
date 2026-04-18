"use client";

import { useState } from "react";
import { Step1Search } from "./Step1Search";
import { Step2RoomSelection } from "./Step2RoomSelection";
import { Step3Guest, type GuestFormData } from "./Step3Guest";
import { Step4Payment, type PaymentFormData } from "./Step4Payment";
import { Step5Summary } from "./Step5Summary";
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
  originalPrice?: number;
  promotionName?: string;
  guest?: GuestFormData;
  paymentMethod?: "TRANSFERENCIA" | "ZELLE" | "EFECTIVO";
  notes?: string;
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

  const handleCheckoutSuccess = async () => {
    try {
      if (!data.checkIn || !data.checkOut || !data.guests || !data.roomTypeId || !data.guest || !data.paymentMethod) {
        throw new Error("Missing reservation data");
      }
      
      const res = await processReservation({
        roomTypeId: data.roomTypeId,
        checkIn: data.checkIn,
        checkOut: data.checkOut,
        numberOfGuests: data.guests,
        guest: data.guest,
        paymentMethod: data.paymentMethod,
        notes: data.notes,
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
    <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 p-6 md:p-10 relative">
      {/* Stepper Header */}
      <div className="flex items-center justify-between mx-auto max-w-4xl mb-8 pb-8 border-b border-gray-100 dark:border-gray-800">
        {[1, 2, 3, 4, 5].map((s) => (
          <div key={s} className="flex flex-col items-center flex-1 relative">
            <div className={`w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center text-ui-bold mb-3 transition-colors z-10 ${
              step === s ? "bg-brand-blue text-white ring-4 ring-brand-blue/20 shadow-lg" : 
              step > s ? "bg-brand-green text-white" : "bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-500"
            }`}>
              {s}
            </div>
            <span className={`text-[10px] md:text-badge text-center uppercase ${step === s ? "text-brand-blue font-bold" : "text-gray-400 dark:text-gray-500"}`}>
              {s === 1 ? (isEs ? "Búsqueda" : "Search") : 
               s === 2 ? (isEs ? "Habitación" : "Room") : 
               s === 3 ? (isEs ? "Huésped" : "Guest") : 
               s === 4 ? (isEs ? "Pago" : "Payment") : 
               (isEs ? "Resumen" : "Summary")}
            </span>
            {s < 5 && (
              <div className={`absolute top-5 md:top-6 left-[60%] w-[80%] h-[2px] -z-0 hidden md:block ${step > s ? "bg-brand-green" : "bg-gray-100 dark:bg-gray-800"}`} />
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
              setData({ 
                ...data, 
                roomTypeId: room.id, 
                price: room.basePrice, 
                roomTypeName: room.name,
                originalPrice: room.originalPrice,
                promotionName: room.appliedPromotion 
                  ? (locale === 'es' ? room.appliedPromotion.title : room.appliedPromotion.titleEn || room.appliedPromotion.title) 
                  : undefined
              });
              setStep(3);
            }} 
            onBack={() => setStep(1)} 
          />
        )}
        {step === 3 && (
          <Step3Guest 
            initialData={data.guest}
            locale={locale} 
            onNext={(guest) => {
              setData({ ...data, guest });
              setStep(4);
            }} 
            onBack={() => setStep(2)} 
          />
        )}
        {step === 4 && (
          <Step4Payment 
            initialData={data.paymentMethod ? { paymentMethod: data.paymentMethod as any, notes: data.notes } : undefined}
            locale={locale} 
            onNext={(paymentData) => {
              setData({ ...data, ...paymentData });
              setStep(5);
            }} 
            onBack={() => setStep(3)} 
          />
        )}
        {step === 5 && (
          <Step5Summary 
            bookingData={data} 
            locale={locale} 
            onBack={() => setStep(4)} 
            onSuccess={() => handleCheckoutSuccess()} 
          />
        )}
      </div>
    </div>
  );
}
