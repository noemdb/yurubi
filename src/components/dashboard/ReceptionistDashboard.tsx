"use client";

import { useState, useTransition } from "react";
import { 
  CheckCircle, 
  XCircle, 
  Loader2, 
  Clock, 
  User,
  CalendarDays,
  Bed,
  DollarSign,
  AlertTriangle,
  ChevronRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { confirmReservation, rejectReservation } from "@/lib/actions/reservations";
import { useToast } from "@/hooks/use-toast";
import { formatPrice } from "@/lib/utils";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import Link from "next/link";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

interface Reservation {
  id: string;
  status: string;
  checkIn: Date;
  checkOut: Date;
  numberOfNights: number;
  numberOfGuests: number;
  totalPrice: number;
  guest: { fullName: string; email: string; phone: string };
  roomType: { name: string };
}

interface KpiCard {
  label: string;
  value: number;
  icon: React.ReactNode;
  color: string;
  description?: string;
}

interface ReceptionistDashboardProps {
  pendingReservations: Reservation[];
  checkInsToday: Reservation[];
  checkOutsToday: Reservation[];
  kpis: KpiCard[];
  locale: string;
}

export function ReceptionistDashboard({
  pendingReservations,
  checkInsToday,
  checkOutsToday,
  kpis,
  locale,
}: ReceptionistDashboardProps) {
  const { toast } = useToast();
  const isEs = locale === "es";
  const [isPending, startTransition] = useTransition();
  const [rejectTarget, setRejectTarget] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState("");
  const [selectedRes, setSelectedRes] = useState<Reservation | null>(null);

  const handleConfirm = (id: string) => {
    startTransition(async () => {
      try {
        await confirmReservation(id);
        toast({ title: isEs ? "Reserva confirmada ✅" : "Reservation confirmed ✅" });
      } catch (e: any) {
        toast({ title: "Error", description: e.message, variant: "destructive" });
      }
    });
  };

  const handleReject = async () => {
    if (!rejectTarget) return;
    startTransition(async () => {
      try {
        await rejectReservation(rejectTarget, rejectReason);
        toast({ title: isEs ? "Reserva rechazada" : "Reservation rejected", variant: "destructive" });
        setRejectTarget(null);
        setRejectReason("");
      } catch (e: any) {
        toast({ title: "Error", description: e.message, variant: "destructive" });
      }
    });
  };

  const statusBadge = (status: string) => {
    const map: Record<string, string> = {
      PENDING: "bg-amber-100 text-amber-700",
      CONFIRMED: "bg-green-100 text-green-700",
      REJECTED: "bg-red-100 text-red-700",
      CANCELLED: "bg-gray-100 dark:bg-slate-800 text-gray-500 dark:text-gray-400",
      COMPLETED: "bg-blue-100 text-blue-700",
    };
    return map[status] ?? "bg-gray-100 dark:bg-slate-800 text-gray-500 dark:text-gray-400";
  };

  return (
    <div className="space-y-10">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
        {kpis.map((kpi) => (
          <div
            key={kpi.label}
            className="bg-white dark:bg-slate-900 rounded-[2rem] border border-gray-100 dark:border-slate-800 shadow-sm dark:shadow-none p-6 flex flex-col gap-4 overflow-hidden relative group hover:shadow-lg transition-all"
          >
            <div className={`w-12 h-12 rounded-2xl ${kpi.color} flex items-center justify-center text-white group-hover:scale-110 transition-transform`}>
              {kpi.icon}
            </div>
            <div>
              <p className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">{kpi.label}</p>
              <p className="text-4xl font-serif font-bold text-gray-900 dark:text-gray-100 mt-1">{kpi.value}</p>
              {kpi.description && (
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">{kpi.description}</p>
              )}
            </div>
            <div className={`absolute -right-4 -bottom-4 w-24 h-24 ${kpi.color} opacity-5 rounded-full blur-2xl group-hover:scale-150 transition-all duration-700`} />
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Pending Reservations */}
        <div className="xl:col-span-2 bg-white dark:bg-slate-900 rounded-[2rem] border border-gray-100 dark:border-slate-800 shadow-sm dark:shadow-none p-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-serif font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
              <Clock className="w-5 h-5 text-amber-500" />
              {isEs ? "Pendientes de Acción" : "Pending Action"}
            </h2>
            <Link href={`/${locale}/dashboard/recepcionista/reservas?status=PENDING`} className="text-brand-blue text-xs font-bold flex items-center gap-1 hover:underline">
              {isEs ? "Ver todas" : "View all"} <ChevronRight className="w-3 h-3" />
            </Link>
          </div>

          {pendingReservations.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <CheckCircle className="w-12 h-12 text-green-300 mb-4" />
              <p className="font-bold text-gray-400 dark:text-gray-500">{isEs ? "¡Sin pendientes! Todo al día." : "No pending reservations!"}</p>
            </div>
          ) : (
            <div className="space-y-3">
              {pendingReservations.map((res) => (
                <div
                  key={res.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-amber-50/60 border border-amber-100 hover:border-amber-200 transition-all"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <User className="w-4 h-4 text-amber-500 shrink-0" />
                      <p className="font-bold text-gray-900 dark:text-gray-100 truncate">{res.guest.fullName}</p>
                    </div>
                    <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-500 dark:text-gray-400 font-medium">
                      <span className="flex items-center gap-1">
                        <Bed className="w-3 h-3" />
                        {res.roomType.name}
                      </span>
                      <span className="flex items-center gap-1">
                        <CalendarDays className="w-3 h-3" />
                        {format(new Date(res.checkIn), "dd MMM", { locale: isEs ? es : undefined })} →{" "}
                        {format(new Date(res.checkOut), "dd MMM yyyy", { locale: isEs ? es : undefined })}
                      </span>
                      <span className="flex items-center gap-1 text-brand-blue font-bold">
                        <DollarSign className="w-3 h-3" />
                        {formatPrice(res.totalPrice)}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-2 shrink-0">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-brand-blue hover:bg-brand-blue/5 rounded-xl h-9 px-4 font-bold text-[10px] uppercase tracking-wider"
                      onClick={() => setSelectedRes(res)}
                    >
                      {isEs ? "Detalles" : "Details"}
                    </Button>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        className="bg-green-500 hover:bg-green-600 text-white rounded-xl h-9 px-4 font-bold gap-1.5 shadow-sm dark:shadow-none shadow-green-200"
                        onClick={() => handleConfirm(res.id)}
                        disabled={isPending}
                      >
                        {isPending ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <CheckCircle className="w-3.5 h-3.5" />}
                        {isEs ? "Confirmar" : "Confirm"}
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-red-200 text-red-500 hover:bg-red-50 rounded-xl h-9 px-4 font-bold gap-1.5"
                        onClick={() => setRejectTarget(res.id)}
                        disabled={isPending}
                      >
                        <XCircle className="w-3.5 h-3.5" />
                        {isEs ? "Rechazar" : "Reject"}
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Check-ins Today */}
        <div className="space-y-5">
          <div className="bg-white dark:bg-slate-900 rounded-[2rem] border border-gray-100 dark:border-slate-800 shadow-sm dark:shadow-none p-8">
            <h2 className="text-lg font-serif font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2 mb-5">
              <CalendarDays className="w-5 h-5 text-green-500" />
              {isEs ? "Check-ins Hoy" : "Today's Check-ins"}
              <span className="ml-auto bg-green-100 text-green-700 text-xs font-bold px-2.5 py-1 rounded-full">
                {checkInsToday.length}
              </span>
            </h2>

            {checkInsToday.length === 0 ? (
              <p className="text-sm text-gray-400 dark:text-gray-500 font-medium text-center py-6">{isEs ? "Sin check-ins hoy" : "No check-ins today"}</p>
            ) : (
              <div className="space-y-3">
                {checkInsToday.map((res) => (
                  <Link
                    key={res.id}
                    href={`/${locale}/dashboard/reservas/${res.id}`}
                    className="flex items-center justify-between p-3.5 rounded-2xl bg-green-50/50 border border-green-100 hover:border-green-200 transition-all group"
                  >
                    <div>
                      <p className="font-bold text-gray-900 dark:text-gray-100 text-sm">{res.guest.fullName}</p>
                      <p className="text-xs text-gray-400 dark:text-gray-500 font-medium">{res.roomType.name} · {res.numberOfGuests}p</p>
                    </div>
                    <span className={`text-[10px] font-bold uppercase px-2 py-1 rounded-lg ${statusBadge(res.status)}`}>
                      {res.status}
                    </span>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Check-outs Today */}
          <div className="bg-white dark:bg-slate-900 rounded-[2rem] border border-gray-100 dark:border-slate-800 shadow-sm dark:shadow-none p-8">
            <h2 className="text-lg font-serif font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2 mb-5">
              <CalendarDays className="w-5 h-5 text-blue-500" />
              {isEs ? "Check-outs Hoy" : "Today's Check-outs"}
              <span className="ml-auto bg-blue-100 text-blue-700 text-xs font-bold px-2.5 py-1 rounded-full">
                {checkOutsToday.length}
              </span>
            </h2>

            {checkOutsToday.length === 0 ? (
              <p className="text-sm text-gray-400 dark:text-gray-500 font-medium text-center py-6">{isEs ? "Sin check-outs hoy" : "No check-outs today"}</p>
            ) : (
              <div className="space-y-3">
                {checkOutsToday.map((res) => (
                  <Link
                    key={res.id}
                    href={`/${locale}/dashboard/reservas/${res.id}`}
                    className="flex items-center justify-between p-3.5 rounded-2xl bg-blue-50/50 border border-blue-100 hover:border-blue-200 transition-all group"
                  >
                    <div>
                      <p className="font-bold text-gray-900 dark:text-gray-100 text-sm">{res.guest.fullName}</p>
                      <p className="text-xs text-gray-400 dark:text-gray-500 font-medium">{res.roomType.name}</p>
                    </div>
                    <span className={`text-[10px] font-bold uppercase px-2 py-1 rounded-lg ${statusBadge(res.status)}`}>
                      {res.status}
                    </span>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Reject Dialog */}
      <Dialog open={!!rejectTarget} onOpenChange={(open) => !open && setRejectTarget(null)}>
        <DialogContent className="rounded-[2.5rem] max-w-sm p-10 border-none shadow-2xl dark:shadow-none">
          <div className="mx-auto w-16 h-16 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center mb-4">
            <AlertTriangle className="w-8 h-8" />
          </div>
          <DialogHeader>
            <DialogTitle className="text-xl font-serif font-bold text-center text-gray-900 dark:text-gray-100">
              {isEs ? "¿Rechazar Reserva?" : "Reject Reservation?"}
            </DialogTitle>
            <DialogDescription className="text-center text-gray-500 dark:text-gray-400 text-sm">
              {isEs ? "Indica el motivo del rechazo (obligatorio)." : "Please state the reason for rejection (required)."}
            </DialogDescription>
          </DialogHeader>
          <div className="mt-4 space-y-2">
            <Label className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">
              {isEs ? "Motivo" : "Reason"}
            </Label>
            <Textarea
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder={isEs ? "Ej. No hay disponibilidad para esas fechas." : "e.g. No availability for those dates."}
              className="rounded-xl border-gray-100 dark:border-slate-800 bg-gray-50 dark:bg-slate-800/50 resize-none font-medium"
              rows={3}
            />
          </div>
          <DialogFooter className="flex-col gap-3 mt-6">
            <Button
              variant="destructive"
              className="h-12 rounded-2xl font-bold w-full"
              onClick={handleReject}
              disabled={isPending || !rejectReason.trim()}
            >
              {isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              {isEs ? "Rechazar Reserva" : "Reject Reservation"}
            </Button>
            <Button variant="ghost" className="h-10 rounded-xl text-gray-400 dark:text-gray-500 font-bold w-full" onClick={() => setRejectTarget(null)}>
              {isEs ? "Cancelar" : "Cancel"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Details Dialog */}
      <Dialog open={!!selectedRes} onOpenChange={(open) => !open && setSelectedRes(null)}>
        <DialogContent className="rounded-[2rem] max-w-lg p-0 border-none overflow-hidden shadow-2xl dark:shadow-none">
          <DialogHeader className="sr-only">
            <DialogTitle>{isEs ? "Detalles de la Reserva" : "Reservation Details"}</DialogTitle>
          </DialogHeader>
          <div className="bg-brand-blue p-8 text-white relative overflow-hidden">
            <div className="relative z-10">
              <p className="text-[10px] font-bold uppercase tracking-widest text-blue-200 mb-1">
                {isEs ? "Detalles de la Reserva" : "Reservation Details"}
              </p>
              <h3 className="text-2xl font-serif font-bold">{selectedRes?.guest.fullName}</h3>
              <div className="flex items-center gap-2 mt-4">
                <span className={`text-[10px] font-bold uppercase px-3 py-1 rounded-full bg-white dark:bg-slate-900/20 text-white backdrop-blur-sm border border-white dark:border-slate-900/10`}>
                   {selectedRes?.status}
                </span>
                <span className="text-xs font-bold text-blue-100 italic">
                  ID: #{selectedRes?.id.slice(-6).toUpperCase()}
                </span>
              </div>
            </div>
            <div className="absolute -right-10 -top-10 w-40 h-40 bg-white dark:bg-slate-900/5 rounded-full" />
            <div className="absolute -left-5 -bottom-10 w-24 h-24 bg-white dark:bg-slate-900/5 rounded-full" />
          </div>

          <div className="p-8 space-y-8">
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-1">
                <p className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">{isEs ? "Habitación" : "Room Type"}</p>
                <p className="text-sm font-bold text-slate-950 dark:text-slate-50 flex items-center gap-2">
                  < Bed className="w-4 h-4 text-brand-blue" />
                  {selectedRes?.roomType.name}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">{isEs ? "Huéspedes" : "Guests"}</p>
                <p className="text-sm font-bold text-slate-950 dark:text-slate-50 flex items-center gap-2">
                  <User className="w-4 h-4 text-brand-blue" />
                  {selectedRes?.numberOfGuests} {isEs ? "Personas" : "People"}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-1">
                <p className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">{isEs ? "Entrada" : "Check-in"}</p>
                <p className="text-sm font-bold text-slate-950 dark:text-slate-50 flex items-center gap-2">
                  <CalendarDays className="w-4 h-4 text-brand-blue" />
                  {selectedRes && format(new Date(selectedRes.checkIn), "PPP", { locale: isEs ? es : undefined })}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">{isEs ? "Salida" : "Check-out"}</p>
                <p className="text-sm font-bold text-slate-950 dark:text-slate-50 flex items-center gap-2">
                  <CalendarDays className="w-4 h-4 text-brand-blue" />
                  {selectedRes && format(new Date(selectedRes.checkOut), "PPP", { locale: isEs ? es : undefined })}
                </p>
              </div>
            </div>

            <div className="pt-6 border-t border-gray-100 dark:border-slate-800 flex items-center justify-between">
              <div>
                <p className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">{isEs ? "Total a Pagar" : "Total Price"}</p>
                <p className="text-2xl font-bold text-brand-blue">{selectedRes && formatPrice(selectedRes.totalPrice)}</p>
              </div>
              <div className="flex gap-3">
                 <Button 
                   variant="outline" 
                   className="rounded-xl font-bold h-11 px-6 border-gray-100 dark:border-slate-800 hover:bg-gray-50 dark:hover:bg-slate-800/50"
                   onClick={() => setSelectedRes(null)}
                 >
                   {isEs ? "Cerrar" : "Close"}
                 </Button>
                 <Button 
                   className="bg-brand-blue hover:bg-brand-blue/90 text-white rounded-xl font-bold h-11 px-6 shadow-lg dark:shadow-none shadow-brand-blue/20"
                   onClick={() => {
                     if (selectedRes) handleConfirm(selectedRes.id);
                     setSelectedRes(null);
                   }}
                 >
                   {isEs ? "Confirmar Ahora" : "Confirm Now"}
                 </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
