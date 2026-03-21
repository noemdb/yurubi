// src/app/[locale]/(public)/reservar/confirmacion/[id]/page.tsx
import { notFound } from "next/navigation";
import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { CheckCircle2, Calendar, Users, Home, Printer, Share2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { prisma } from "@/lib/prisma";
import { formatPrice, formatDate } from "@/lib/utils";

interface PageProps {
  params: Promise<{ locale: string; id: string }>;
}

export default async function ConfirmationPage({ params }: PageProps) {
  const { locale, id } = await params;
  const t = await getTranslations({ locale, namespace: "booking" });
  const isEs = locale === "es";

  const reservation = await prisma.reservation.findUnique({
    where: { id },
    include: {
      roomType: true,
      guest: true,
    },
  });

  if (!reservation) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gray-50 py-16 md:py-24">
      <div className="container mx-auto px-4 max-w-3xl">
        <div className="bg-white rounded-[2.5rem] shadow-xl border border-gray-100 overflow-hidden">
          {/* Header Success */}
          <div className="bg-brand-green p-10 text-center text-white relative">
            <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
              <div className="absolute top-10 left-10 w-20 h-20 bg-white rounded-full blur-2xl" />
              <div className="absolute bottom-10 right-10 w-32 h-32 bg-white rounded-full blur-3xl" />
            </div>
            
            <CheckCircle2 className="w-20 h-20 mx-auto mb-6 drop-shadow-lg" />
            <h1 className="text-3xl md:text-4xl font-serif font-bold mb-3">
              {isEs ? "¡Reserva Confirmada!" : "Booking Confirmed!"}
            </h1>
            <p className="text-brand-green-50 text-lg font-medium opacity-90">
              {isEs 
                ? "Tu estancia en Río Yurubí está asegurada." 
                : "Your stay at Río Yurubí is secured."}
            </p>
          </div>

          <div className="p-8 md:p-12">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10 pb-8 border-b border-gray-100">
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">
                  {isEs ? "Código de Reserva" : "Booking Reference"}
                </p>
                <p className="text-2xl font-mono font-bold text-gray-900">
                  #{reservation.id.slice(-8).toUpperCase()}
                </p>
              </div>
              <div className="flex gap-3">
                <Button variant="outline" size="sm" className="rounded-xl border-gray-200 text-gray-600">
                  <Printer className="w-4 h-4 mr-2" /> {isEs ? "Imprimir" : "Print"}
                </Button>
                <Button variant="outline" size="sm" className="rounded-xl border-gray-200 text-gray-600">
                  <Share2 className="w-4 h-4 mr-2" /> {isEs ? "Compartir" : "Share"}
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-10">
              {/* Detalles Estancia */}
              <div className="space-y-6">
                <h3 className="font-serif text-xl font-bold text-gray-900 border-l-4 border-brand-blue pl-4">
                  {isEs ? "Detalles de la Estancia" : "Stay Details"}
                </h3>
                
                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <div className="bg-brand-blue-50 p-2 rounded-lg text-brand-blue">
                      <Home className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-gray-400 uppercase">{isEs ? "Tipo de Habitación" : "Room Type"}</p>
                      <p className="font-semibold text-gray-900">{reservation.roomType.name}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="bg-brand-blue-50 p-2 rounded-lg text-brand-blue">
                      <Calendar className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-gray-400 uppercase">Check-in / Check-out</p>
                      <p className="font-semibold text-gray-900">
                        {formatDate(reservation.checkIn, locale)} - {formatDate(reservation.checkOut, locale)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="bg-brand-blue-50 p-2 rounded-lg text-brand-blue">
                      <Users className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-gray-400 uppercase">{isEs ? "Huéspedes" : "Guests"}</p>
                      <p className="font-semibold text-gray-900">
                        {reservation.numberOfGuests} {reservation.numberOfGuests === 1 ? (isEs ? "Persona" : "Person") : (isEs ? "Personas" : "People")}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Información de Pago */}
              <div className="space-y-6">
                <h3 className="font-serif text-xl font-bold text-gray-900 border-l-4 border-brand-green pl-4">
                  {isEs ? "Resumen de Pago" : "Payment Summary"}
                </h3>

                <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
                  <div className="space-y-3 mb-6">
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>{isEs ? "Método de Pago" : "Payment Method"}</span>
                      <span className="font-bold text-gray-900">{reservation.paymentMethod}</span>
                    </div>
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>Status</span>
                      <span className="bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider">
                        {isEs ? "Pendiente Verificación" : "Pending Verification"}
                      </span>
                    </div>
                  </div>
                  
                  <div className="pt-4 border-t border-gray-200">
                    <div className="flex justify-between items-end">
                      <span className="text-gray-900 font-bold">{isEs ? "Total Pagado" : "Total Paid"}</span>
                      <span className="text-3xl font-bold text-brand-green">
                        {formatPrice(Number(reservation.totalPrice))}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-brand-blue-50 rounded-2xl p-6 border border-brand-blue-100 mb-10">
              <p className="text-sm text-brand-blue-700 leading-relaxed">
                <span className="font-bold">{isEs ? "¡Importante!" : "Important!"}</span> {isEs 
                  ? "Hemos enviado un correo electrónico con los detalles de tu reserva e instrucciones para completar el pago si seleccionaste Transferencia o Zelle. Tu reserva quedará confirmada definitivamente una vez verificado el comprobante."
                  : "We have sent an email with your booking details and instructions to complete the payment if you selected Transfer or Zelle. Your booking will be definitively confirmed once the receipt is verified."}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button asChild className="flex-1 h-14 rounded-2xl bg-brand-blue hover:bg-brand-blue-600 text-lg font-bold shadow-md shadow-brand-blue/20">
                <Link href={`/${locale}`}>
                  {isEs ? "Volver al Inicio" : "Back to Home"} <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
        
        <p className="text-center text-gray-400 text-xs mt-10">
          Hotel Río Yurubí © {new Date().getFullYear()} — San Felipe, Yaracuy, Venezuela
        </p>
      </div>
    </div>
  );
}
