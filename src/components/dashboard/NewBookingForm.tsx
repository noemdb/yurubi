"use client";

import { useState, useTransition } from "react";
import { Loader2, Save, CalendarPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createManualReservation } from "@/lib/actions/reservations";
import { useToast } from "@/hooks/use-toast";
import { formatPrice } from "@/lib/utils";
import { useRouter } from "next/navigation";

interface RoomType {
  id: string;
  name: string;
  basePrice: number;
  maxOccupancy: number;
}

export function NewBookingForm({
  roomTypes,
  locale,
}: {
  roomTypes: RoomType[];
  locale: string;
}) {
  const { toast } = useToast();
  const router = useRouter();
  const isEs = locale === "es";
  const [isPending, startTransition] = useTransition();

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    idDocument: "",
    roomTypeId: "",
    checkIn: "",
    checkOut: "",
    numberOfGuests: 1,
    totalPrice: 0,
  });

  const selectedType = roomTypes.find((t) => t.id === form.roomTypeId);

  const calcNights = () => {
    if (!form.checkIn || !form.checkOut) return 0;
    const ci = new Date(form.checkIn);
    const co = new Date(form.checkOut);
    const diff = Math.ceil((co.getTime() - ci.getTime()) / (1000 * 60 * 60 * 24));
    return diff > 0 ? diff : 0;
  };

  const nights = calcNights();
  const suggestedPrice = selectedType ? selectedType.basePrice * nights : 0;

  const field = (key: keyof typeof form, value: any) =>
    setForm((f) => ({ ...f, [key]: value }));

  const handleSubmit = () => {
    if (
      !form.fullName ||
      !form.email ||
      !form.idDocument ||
      !form.roomTypeId ||
      !form.checkIn ||
      !form.checkOut
    ) {
      toast({
        title: isEs ? "Faltan campos obligatorios" : "Required fields missing",
        variant: "destructive",
      });
      return;
    }

    const checkIn = new Date(form.checkIn);
    const checkOut = new Date(form.checkOut);

    if (checkOut <= checkIn) {
      toast({
        title: isEs
          ? "El check-out debe ser posterior al check-in"
          : "Check-out must be after check-in",
        variant: "destructive",
      });
      return;
    }

    startTransition(async () => {
      try {
        const result = await createManualReservation({
          ...form,
          checkIn,
          checkOut,
          totalPrice: form.totalPrice || suggestedPrice,
        });

        toast({
          title: isEs ? "¡Reserva creada con éxito! ✅" : "Booking created! ✅",
        });
        router.push(`/${locale}/dashboard/recepcionista/reservas`);
      } catch (e: any) {
        toast({ title: "Error", description: e.message, variant: "destructive" });
      }
    });
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-gray-100 dark:border-slate-800 shadow-sm dark:shadow-none p-10">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* Guest Information */}
        <div className="space-y-6">
          <div className="pb-3 border-b border-gray-100 dark:border-slate-800">
            <h2 className="text-caption uppercase">
              {isEs ? "Información del Huésped" : "Guest Information"}
            </h2>
          </div>

          <div className="space-y-2">
            <Label className="text-label ml-1">
              {isEs ? "Nombre Completo" : "Full Name"} *
            </Label>
            <Input
              value={form.fullName}
              onChange={(e) => field("fullName", e.target.value)}
              placeholder="Juan Pérez"
              className="text-input h-12 rounded-xl border-gray-100 dark:border-slate-800 bg-gray-50 dark:bg-slate-800/50 focus:bg-white shadow-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-label ml-1">
                {isEs ? "Documento ID" : "ID Document"} *
              </Label>
              <Input
                value={form.idDocument}
                onChange={(e) => field("idDocument", e.target.value)}
                placeholder="V-12345678"
                className="h-12 rounded-xl border-gray-100 dark:border-slate-800 bg-gray-50 dark:bg-slate-800/50 focus:bg-white font-bold shadow-none"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-label ml-1">
                {isEs ? "Teléfono" : "Phone"}
              </Label>
              <Input
                value={form.phone}
                onChange={(e) => field("phone", e.target.value)}
                placeholder="+58254..."
                className="text-input h-12 rounded-xl border-gray-100 dark:border-slate-800 bg-gray-50 dark:bg-slate-800/50 focus:bg-white shadow-none"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-label ml-1">
              Email *
            </Label>
            <Input
              type="email"
              value={form.email}
              onChange={(e) => field("email", e.target.value)}
              placeholder="huesped@email.com"
              className="text-input h-12 rounded-xl border-gray-100 dark:border-slate-800 bg-gray-50 dark:bg-slate-800/50 focus:bg-white shadow-none"
            />
          </div>
        </div>

        {/* Stay Details */}
        <div className="space-y-6">
          <div className="pb-3 border-b border-gray-100 dark:border-slate-800">
            <h2 className="text-caption uppercase">
              {isEs ? "Detalles de la Estadía" : "Stay Details"}
            </h2>
          </div>

          <div className="space-y-2">
            <Label className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest ml-1">
              {isEs ? "Tipo de Habitación" : "Room Type"} *
            </Label>
            <Select
              value={form.roomTypeId}
              onValueChange={(v) => field("roomTypeId", v)}
            >
              <SelectTrigger className="text-input h-12 rounded-xl border-gray-100 dark:border-slate-800 bg-gray-50 dark:bg-slate-800/50 shadow-none">
                <SelectValue
                  placeholder={isEs ? "Seleccionar tipo..." : "Select type..."}
                />
              </SelectTrigger>
              <SelectContent className="rounded-2xl">
                {roomTypes.map((t) => (
                  <SelectItem key={t.id} value={t.id} className="font-medium">
                    {t.name} — {formatPrice(t.basePrice)}/noche
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-label ml-1">
                Check-in *
              </Label>
              <Input
                type="date"
                value={form.checkIn}
                onChange={(e) => field("checkIn", e.target.value)}
                className="text-input h-12 rounded-xl border-gray-100 dark:border-slate-800 bg-gray-50 dark:bg-slate-800/50 shadow-none"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-label ml-1">
                Check-out *
              </Label>
              <Input
                type="date"
                value={form.checkOut}
                onChange={(e) => field("checkOut", e.target.value)}
                className="text-input h-12 rounded-xl border-gray-100 dark:border-slate-800 bg-gray-50 dark:bg-slate-800/50 shadow-none"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-label ml-1">
              {isEs ? "Número de Huéspedes" : "Number of Guests"}
            </Label>
            <Input
              type="number"
              min={1}
              max={selectedType?.maxOccupancy ?? 10}
              value={form.numberOfGuests}
              onChange={(e) => field("numberOfGuests", parseInt(e.target.value) || 1)}
              className="text-input h-12 rounded-xl border-gray-100 dark:border-slate-800 bg-gray-50 dark:bg-slate-800/50 shadow-none"
            />
          </div>

          {/* Price Summary */}
          {nights > 0 && selectedType && (
            <div className="bg-brand-blue/5 dark:bg-brand-blue/10 rounded-2xl p-5 space-y-2 border border-brand-blue/10 dark:border-brand-blue/20">
              <div className="flex justify-between text-sm font-medium text-gray-600 dark:text-gray-400">
                <span>{formatPrice(selectedType.basePrice)} × {nights} {isEs ? "noches" : "nights"}</span>
                <span className="font-bold text-brand-blue">{formatPrice(suggestedPrice)}</span>
              </div>
              <div className="space-y-1.5">
                <Label className="text-caption uppercase">
                  {isEs ? "Monto Total (editable)" : "Total Amount (editable)"}
                </Label>
                <Input
                  type="number"
                  value={form.totalPrice || suggestedPrice}
                  onChange={(e) => field("totalPrice", parseFloat(e.target.value) || 0)}
                  className="h-10 rounded-xl border-brand-blue/20 bg-white dark:bg-slate-900 font-bold text-brand-blue shadow-none"
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Submit */}
      <div className="flex justify-end gap-4 mt-10 pt-8 border-t border-gray-100 dark:border-slate-800">
        <Button
          variant="ghost"
          className="h-14 px-8 rounded-2xl font-bold"
          onClick={() => router.back()}
          disabled={isPending}
        >
          {isEs ? "Cancelar" : "Cancel"}
        </Button>
        <Button
          className="text-cta h-14 px-10 bg-brand-blue hover:bg-brand-blue/90 text-white rounded-2xl shadow-xl dark:shadow-none shadow-brand-blue/20 gap-2 active:scale-95 transition-all"
          onClick={handleSubmit}
          disabled={isPending}
        >
          {isPending ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <CalendarPlus className="w-5 h-5" />
          )}
          {isEs ? "Crear y Confirmar Reserva" : "Create & Confirm Booking"}
        </Button>
      </div>
    </div>
  );
}
