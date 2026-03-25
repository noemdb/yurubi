"use client";

import { useTransition } from "react";
import { 
  Calendar, 
  User, 
  CreditCard, 
  FileText, 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  ArrowLeft,
  Printer,
  Hash
} from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Link } from "@/routing";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  confirmReservation, 
  rejectReservation, 
  cancelReservation,
  updatePaymentStatus 
} from "@/lib/actions/reservations";
import { useToast } from "@/hooks/use-toast";
import { formatPrice } from "@/lib/utils";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

export function ReservationDetail({ 
  reservation, 
  locale 
}: { 
  reservation: any; 
  locale: string 
}) {
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();
  const isEs = locale === "es";

  const handleAction = (action: any, ...args: any[]) => {
    startTransition(async () => {
      try {
        await action(reservation.id, ...args);
        toast({ title: isEs ? "Reserva actualizada" : "Reservation updated" });
      } catch (e) {
        toast({ title: "Error", variant: "destructive" });
      }
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "CONFIRMED":
        return <Badge className="bg-green-100 text-green-700 hover:bg-green-100 border-none px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider">{isEs ? "Confirmada" : "Confirmed"}</Badge>;
      case "PENDING":
        return <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-100 border-none px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider">{isEs ? "Pendiente" : "Pending"}</Badge>;
      case "REJECTED":
        return <Badge className="bg-red-100 text-red-700 hover:bg-red-100 border-none px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider">{isEs ? "Rechazada" : "Rejected"}</Badge>;
      case "CANCELLED":
        return <Badge className="bg-gray-100 text-gray-500 hover:bg-gray-100 border-none px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider">{isEs ? "Cancelada" : "Cancelled"}</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-20 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <Link 
          href="/dashboard/reservas" 
          className="flex items-center text-sm text-gray-500 hover:text-brand-blue transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
          {isEs ? "Volver a Reservas" : "Back to Reservations"}
        </Link>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="rounded-2xl gap-2 font-bold h-11 px-6 border-gray-200" onClick={() => window.print()}>
            <Printer className="w-4 h-4" />
            {isEs ? "Imprimir" : "Print"}
          </Button>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Details */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Reservation Status Card */}
          <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm overflow-hidden p-8 sm:p-10">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-10">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-brand-blue/5 flex items-center justify-center text-brand-blue font-bold text-xl">
                  <Hash className="w-6 h-6" />
                </div>
                <div>
                  <h1 className="text-2xl font-serif font-bold text-gray-900 leading-none">
                    Reserva #{reservation.id.slice(-6).toUpperCase()}
                  </h1>
                  <p className="text-gray-400 text-sm mt-2">
                    {isEs ? "Realizada el " : "Created on "} 
                    {format(new Date(reservation.createdAt), "PPP", { locale: isEs ? es : undefined })}
                  </p>
                </div>
              </div>
              {getStatusBadge(reservation.status)}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              {/* Check-in / Check-out */}
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="mt-1 p-2 bg-gray-50 rounded-lg">
                    <Calendar className="w-4 h-4 text-gray-400" />
                  </div>
                  <div>
                    <Label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1 block">Check-in</Label>
                    <p className="font-bold text-lg text-gray-900">
                      {format(new Date(reservation.checkIn), "EEEE, d 'de' MMMM", { locale: isEs ? es : undefined })}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="mt-1 p-2 bg-gray-50 rounded-lg">
                    <Calendar className="w-4 h-4 text-gray-400" />
                  </div>
                  <div>
                    <Label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1 block">Check-out</Label>
                    <p className="font-bold text-lg text-gray-900">
                      {format(new Date(reservation.checkOut), "EEEE, d 'de' MMMM", { locale: isEs ? es : undefined })}
                    </p>
                  </div>
                </div>
              </div>

              {/* Guest / Room Info */}
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="mt-1 p-2 bg-gray-50 rounded-lg">
                    <User className="w-4 h-4 text-gray-400" />
                  </div>
                  <div>
                    <Label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1 block">{isEs ? "Huéspedes" : "Guests"}</Label>
                    <p className="font-bold text-lg text-gray-900">
                      {reservation.numberOfGuests} {isEs ? (reservation.numberOfGuests === 1 ? "Huésped" : "Huéspedes") : "Person(s)"}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="mt-1 p-2 bg-gray-50 rounded-lg text-brand-blue">
                    <FileText className="w-4 h-4" />
                  </div>
                  <div>
                    <Label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1 block">{isEs ? "Habitación" : "Room"}</Label>
                    <p className="font-bold text-lg text-brand-blue">
                      {reservation.roomType.name}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Financial Card */}
          <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm p-8 sm:p-10">
            <h2 className="text-xl font-serif font-bold text-gray-900 mb-8 flex items-center gap-3">
              <CreditCard className="w-5 h-5 text-gray-400" />
              {isEs ? "Detalles Financieros" : "Financial Details"}
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div className="space-y-6">
                <div>
                  <Label className="text-sm font-medium text-gray-500 mb-2 block">{isEs ? "Precio Total" : "Total Price"}</Label>
                  <p className="text-4xl font-serif font-bold text-brand-green">
                    {formatPrice(reservation.totalPrice)}
                  </p>
                </div>
              </div>

              <div className="space-y-6">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100">
                  <div className="space-y-1">
                    <Label className="font-bold text-gray-900">{isEs ? "Pago por Adelantado" : "Advance Paid"}</Label>
                    <p className="text-xs text-gray-400">{isEs ? "Confirmar recepción del pago" : "Confirm payment receipt"}</p>
                  </div>
                  <Switch 
                    checked={reservation.advancePaymentPaid} 
                    onCheckedChange={(val) => handleAction(updatePaymentStatus, val)}
                    disabled={isPending}
                  />
                </div>

                {reservation.paymentMethod && (
                  <div className="p-4 rounded-2xl border border-gray-100">
                     <Label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1 block">{isEs ? "Método / Referencia" : "Method / Reference"}</Label>
                     <p className="font-bold text-gray-900 uppercase">
                       {reservation.paymentMethod} {reservation.paymentReference && ` - ${reservation.paymentReference}`}
                     </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Notes Section */}
          {reservation.notes && (
            <div className="bg-amber-50 rounded-[2rem] border border-amber-100 p-8">
              <h3 className="text-sm font-bold text-amber-800 uppercase tracking-widest mb-4 flex items-center gap-2">
                <AlertCircle className="w-4 h-4" />
                {isEs ? "Observaciones del Huésped" : "Guest Notes"}
              </h3>
              <p className="text-amber-900 leading-relaxed font-medium italic">
                "{reservation.notes}"
              </p>
            </div>
          )}
        </div>

        {/* Right Column: Actions & Sidebar Details */}
        <div className="space-y-8">
          
          {/* Status Actions Card */}
          <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm p-8 space-y-4">
            <h3 className="text-md font-bold text-gray-900 mb-4">{isEs ? "Acciones de Estado" : "Status Actions"}</h3>
            
            {reservation.status === 'PENDING' && (
              <>
                <Button 
                  className="w-full bg-brand-green hover:bg-brand-green-700 text-white rounded-xl h-12 font-bold gap-2"
                  onClick={() => handleAction(confirmReservation)}
                  disabled={isPending}
                >
                  <CheckCircle className="w-5 h-5" />
                  {isEs ? "Confirmar Reserva" : "Confirm Booking"}
                </Button>
                <Button 
                  variant="outline"
                  className="w-full border-red-100 text-red-600 hover:bg-red-50 rounded-xl h-12 font-bold gap-2"
                  onClick={() => {
                    const reason = window.prompt(isEs ? "Motivo del rechazo:" : "Rejection reason:");
                    if (reason !== null) handleAction(rejectReservation, reason);
                  }}
                  disabled={isPending}
                >
                  <XCircle className="w-5 h-5" />
                  {isEs ? "Rechazar" : "Reject"}
                </Button>
              </>
            )}

            {reservation.status === 'CONFIRMED' && (
              <Button 
                variant="outline"
                className="w-full border-gray-100 text-gray-500 hover:bg-gray-50 rounded-xl h-12 font-bold gap-2"
                onClick={() => {
                  const reason = window.prompt(isEs ? "Motivo de la cancelación:" : "Cancellation reason:");
                  if (reason !== null) handleAction(cancelReservation, reason);
                }}
                disabled={isPending}
              >
                <XCircle className="w-5 h-5" />
                {isEs ? "Cancelar Reserva" : "Cancel Reservation"}
              </Button>
            )}

            {(reservation.status === 'REJECTED' || reservation.status === 'CANCELLED') && (
              <p className="text-xs text-center text-gray-400 font-medium p-4 bg-gray-50 rounded-xl">
                {isEs ? "Esta reserva no puede ser alterada." : "This booking cannot be modified."}
              </p>
            )}
          </div>

          {/* Guest Sidebar Card */}
          <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm p-8">
            <h3 className="text-md font-bold text-gray-900 mb-6">{isEs ? "Información del Huésped" : "Guest info"}</h3>
            <div className="space-y-6">
              <div>
                <Label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1">Nombre</Label>
                <p className="font-bold text-gray-900">{reservation.guest.fullName}</p>
              </div>
              <div>
                <Label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1">Email</Label>
                <p className="text-sm text-gray-600 break-all">{reservation.guest.email}</p>
              </div>
              <div>
                <Label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1">Teléfono</Label>
                <p className="text-sm text-gray-600">{reservation.guest.phone}</p>
              </div>
              <div>
                <Label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1">Documento</Label>
                <p className="text-sm text-gray-600 font-mono tracking-tighter">{reservation.guest.idDocument}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
