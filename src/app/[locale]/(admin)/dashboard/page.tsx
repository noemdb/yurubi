// src/app/[locale]/(admin)/dashboard/page.tsx
import { 
  TrendingUp, 
  Users, 
  Calendar, 
  BedDouble, 
  AlertCircle,
  ArrowRight,
  Hotel
} from "lucide-react";
import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/utils";
import { getTranslations } from "next-intl/server";
import { Link } from "@/routing";

export default async function DashboardPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const isEs = locale === "es";
  const t = await getTranslations({ locale, namespace: "dashboard" });

  // 1. Estadísticas rápidas
  const totalReservations = await prisma.reservation.count();
  const pendingReservations = await prisma.reservation.count({ where: { status: "PENDING" } });
  const activePromotions = await prisma.promotion.count({ where: { isActive: true } });
  
  // 2. Últimas reservas
  const recentReservations = await prisma.reservation.findMany({
    take: 5,
    orderBy: { createdAt: "desc" },
    include: {
      guest: true,
      roomType: true,
    }
  });

  const stats = [
    { 
      label: isEs ? "Reservas Totales" : "Total Bookings", 
      value: totalReservations, 
      icon: <Calendar className="w-6 h-6" />, 
      color: "bg-blue-500",
      link: "/dashboard/reservas"
    },
    { 
      label: isEs ? "Pendientes de Pago" : "Pending Payment", 
      value: pendingReservations, 
      icon: <AlertCircle className="w-6 h-6" />, 
      color: "bg-amber-500",
      link: "/dashboard/reservas?status=PENDING"
    },
    { 
      label: isEs ? "Huéspedes Registrados" : "Guest Database", 
      value: await prisma.guest.count(), 
      icon: <Users className="w-6 h-6" />, 
      color: "bg-green-500",
      link: "/dashboard/huespedes"
    },
    { 
      label: isEs ? "Tipos de Habitación" : "Room Types", 
      value: await prisma.roomType.count(), 
      icon: <BedDouble className="w-6 h-6" />, 
      color: "bg-purple-500",
      link: "/dashboard/habitaciones"
    },
  ];

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div>
        <h1 className="text-3xl font-serif font-bold text-gray-900 mb-2">
          {isEs ? "Bienvenido al Panel" : "Welcome back"}
        </h1>
        <p className="text-gray-500">
          {isEs ? "Aquí tienes un resumen de la actividad reciente del Hotel Río Yurubí." : "Here is a summary of recent activity at Hotel Río Yurubí."}
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <Link key={stat.label} href={stat.link} className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100 hover:shadow-md transition-all group overflow-hidden relative">
            <div className={`p-3 rounded-2xl ${stat.color} text-white w-fit mb-4 group-hover:scale-110 transition-transform`}>
              {stat.icon}
            </div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">{stat.label}</p>
            <p className="text-3xl font-serif font-bold text-gray-900 mt-1">{stat.value}</p>
            
            {/* Decoración fondo */}
            <div className={`absolute -right-4 -bottom-4 w-24 h-24 ${stat.color} opacity-5 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700`} />
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Recent Bookings Table */}
        <div className="xl:col-span-2 bg-white rounded-[2rem] shadow-sm border border-gray-100 p-8">
           <div className="flex items-center justify-between mb-8">
             <h3 className="text-xl font-serif font-bold text-gray-900">
               {isEs ? "Reservas Recientes" : "Recent Bookings"}
             </h3>
             <Link href="/dashboard/reservas" className="text-brand-blue text-sm font-bold flex items-center gap-1 hover:underline">
               {isEs ? "Ver todas" : "View all"} <ArrowRight className="w-4 h-4" />
             </Link>
           </div>
           
           <div className="overflow-x-auto">
             <table className="w-full text-left">
               <thead>
                 <tr className="border-b border-gray-50 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                   <th className="pb-4 px-4">{isEs ? "Huésped" : "Guest"}</th>
                   <th className="pb-4 px-4">{isEs ? "Habitación" : "Room"}</th>
                   <th className="pb-4 px-4">Check-in</th>
                   <th className="pb-4 px-4">Total</th>
                   <th className="pb-4 px-4">Status</th>
                 </tr>
               </thead>
               <tbody className="divide-y divide-gray-50">
                 {recentReservations.map((res) => (
                   <tr key={res.id} className="hover:bg-gray-50/50 transition-colors group">
                     <td className="py-4 px-4">
                       <p className="font-bold text-gray-900 text-sm">{res.guest.fullName}</p>
                       <p className="text-xs text-gray-400">{res.guest.email}</p>
                     </td>
                     <td className="py-4 px-4 text-sm text-gray-600 font-medium">{res.roomType.name}</td>
                     <td className="py-4 px-4 text-sm text-gray-500 font-medium">{res.checkIn.toLocaleDateString(locale)}</td>
                     <td className="py-4 px-4 text-sm font-bold text-brand-green">{formatPrice(Number(res.totalPrice))}</td>
                     <td className="py-4 px-4">
                        <span className={`px-2 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider ${
                          res.status === 'PENDING' ? 'bg-amber-100 text-amber-700' : 
                          res.status === 'CONFIRMED' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
                        }`}>
                          {res.status}
                        </span>
                     </td>
                   </tr>
                 ))}
                 {recentReservations.length === 0 && (
                   <tr>
                     <td colSpan={5} className="py-12 text-center text-gray-400 font-medium">
                       {isEs ? "No hay reservas recientes." : "No recent bookings."}
                     </td>
                   </tr>
                 )}
               </tbody>
             </table>
           </div>
        </div>

        {/* Quick Actions / Internal News Sidebar */}
        <div className="space-y-6">
           <div className="bg-brand-blue rounded-[2rem] p-8 text-white relative overflow-hidden shadow-lg shadow-brand-blue/20">
              <h3 className="text-xl font-serif font-bold mb-4 relative z-10">{isEs ? "Acceso Rápido" : "Quick Actions"}</h3>
              <div className="space-y-3 relative z-10">
                <Link href="/reservar" className="block w-full py-3 px-4 bg-white/10 hover:bg-white/20 rounded-xl text-sm font-bold transition-all text-center border border-white/20">
                  {isEs ? "Nueva Reserva Manual" : "New Manual Booking"}
                </Link>
                <Link href="/dashboard/configuracion" className="block w-full py-3 px-4 bg-white/10 hover:bg-white/20 rounded-xl text-sm font-bold transition-all text-center border border-white/20">
                  {isEs ? "Ajustar Tarifas" : "Adjust Rates"}
                </Link>
              </div>
              <Hotel className="absolute -right-8 -bottom-8 w-40 h-40 opacity-10 rotate-12" />
           </div>

           <div className="bg-white rounded-[2rem] p-8 border border-gray-100 shadow-sm">
              <h3 className="text-lg font-serif font-bold text-gray-900 mb-6 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-brand-green" />
                {isEs ? "Promociones Activas" : "Active Promos"}
              </h3>
              <div className="space-y-4">
                 <p className="text-3xl font-serif font-bold text-brand-green">{activePromotions}</p>
                 <p className="text-xs text-gray-500 leading-relaxed">
                   {isEs ? "Considera crear nuevas promociones para la temporada baja." : "Consider creating new promos for the low season."}
                 </p>
                 <Link href="/dashboard/promociones" className="inline-flex items-center gap-2 text-brand-blue text-xs font-bold uppercase tracking-wider mt-2 group">
                   {isEs ? "Gestionar Promos" : "Manage Promos"} 
                   <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                 </Link>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
