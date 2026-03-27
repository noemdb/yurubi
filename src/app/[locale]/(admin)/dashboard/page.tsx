// src/app/[locale]/(admin)/dashboard/page.tsx
import { 
  Users, 
  Calendar, 
  BedDouble, 
  AlertCircle,
  ArrowRight,
} from "lucide-react";
import { prisma } from "@/lib/prisma";
import { getTranslations } from "next-intl/server";
import { Link } from "@/routing";
import { QuickActions } from "@/components/dashboard/QuickActions";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { getRoleHomeUrl } from "@/lib/rbac";
import { DashboardCharts } from "@/components/dashboard/DashboardCharts";
import { DashboardIndicators } from "@/components/dashboard/DashboardIndicators";

export default async function DashboardPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const session = await auth();

  // Redirect non-admin roles to their own dashboard
  const role = session?.user?.role ?? "ADMIN";
  if (role !== "ADMIN") {
    redirect(getRoleHomeUrl(role, locale));
  }

  const isEs = locale === "es";
  const t = await getTranslations({ locale, namespace: "dashboard" });

  // 1. Estadísticas básicas
  const totalReservations = await prisma.reservation.count();
  const pendingReservations = await prisma.reservation.count({ where: { status: "PENDING" } });
  const guestCount = await prisma.guest.count();
  const roomTypesCount = await prisma.roomType.count();
  
  // 2. Habitaciones: Asignadas vs Disponibles
  const totalRooms = await prisma.room.count();
  const availableRoomsCount = await prisma.room.count({ where: { isAvailable: true } });
  const assignedRoomsCount = totalRooms - availableRoomsCount;

  // 3. Categorías: Total, Asignadas, Disponibles
  const categoriesData = await prisma.roomType.findMany({
    include: {
      _count: {
        select: { rooms: true }
      },
      rooms: {
        select: { isAvailable: true }
      }
    }
  });

  const categoriesStats = categoriesData.map(cat => ({
    name: cat.name,
    total: cat._count.rooms,
    available: cat.rooms.filter(r => r.isAvailable).length,
    assigned: cat.rooms.filter(r => !r.isAvailable).length
  }));

  // 4. Promociones
  const activePromotions = await prisma.promotion.findMany({
    where: { isActive: true },
    take: 3
  });
  const totalActivePromos = await prisma.promotion.count({ where: { isActive: true } });

  // 5. Reseñas
  const reviewsCount = await prisma.review.groupBy({
    by: ['status'],
    _count: { _all: true }
  });

  const reviewsStats = {
    PENDING: reviewsCount.find(r => r.status === 'PENDING')?._count._all || 0,
    APPROVED: reviewsCount.find(r => r.status === 'APPROVED')?._count._all || 0,
    REJECTED: reviewsCount.find(r => r.status === 'REJECTED')?._count._all || 0,
  };

  // 6. Datos para la gráfica (últimos 7 días)
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - i);
    d.setHours(0, 0, 0, 0);
    return d;
  }).reverse();

  const chartData = await Promise.all(last7Days.map(async (date) => {
    const nextDay = new Date(date);
    nextDay.setDate(date.getDate() + 1);
    
    const count = await prisma.reservation.count({
      where: {
        createdAt: {
          gte: date,
          lt: nextDay
        }
      }
    });
    
    return {
      date: date.toLocaleDateString(locale, { day: '2-digit', month: 'short' }),
      count
    };
  }));

  // 7. Últimas reservas (simplificado para usar componente compartido si existe)
  const recentReservations = await prisma.reservation.findMany({
    take: 5,
    orderBy: { createdAt: "desc" },
    include: {
      guest: true,
      roomType: true,
    }
  });

  const roomTypes = await prisma.roomType.findMany({
    where: { isActive: true },
    select: { id: true, name: true, basePrice: true }
  });

  const stats = [
    { label: isEs ? "Reservas Totales" : "Total Bookings", value: totalReservations, icon: <Calendar className="w-5 h-5" />, color: "bg-blue-500", link: "/dashboard/reservas" },
    { label: isEs ? "Pendientes de Pago" : "Pending Payment", value: pendingReservations, icon: <AlertCircle className="w-5 h-5" />, color: "bg-amber-500", link: "/dashboard/reservas?status=PENDING" },
    { label: isEs ? "Huéspedes" : "Guests", value: guestCount, icon: <Users className="w-5 h-5" />, color: "bg-green-500", link: "/dashboard/huespedes" },
    { label: isEs ? "Categorías" : "Categories", value: roomTypesCount, icon: <BedDouble className="w-5 h-5" />, color: "bg-purple-500", link: "/dashboard/habitaciones/categorias" },
  ];

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-serif font-bold text-gray-900 dark:text-gray-100">
            {isEs ? "Panel de Administración" : "Administration Panel"}
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {isEs ? "Resumen operativo del Hotel Río Yurubí" : "Operational summary of Hotel Río Yurubí"}
          </p>
        </div>
        <div className="flex items-center gap-2">
           <span className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest bg-white dark:bg-slate-900 px-3 py-1.5 rounded-lg border border-gray-100 dark:border-slate-800 shadow-sm dark:shadow-none">
             {new Date().toLocaleDateString(locale, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
           </span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Link key={stat.label} href={stat.link} className="bg-white dark:bg-slate-900 p-4 rounded-2xl shadow-sm dark:shadow-none border border-gray-100 dark:border-slate-800 hover:shadow-md transition-all group relative overflow-hidden">
            <div className="flex items-center gap-4">
              <div className={`p-2.5 rounded-xl ${stat.color} text-white shrink-0 group-hover:scale-110 transition-transform`}>
                {stat.icon}
              </div>
              <div>
                <p className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">{stat.label}</p>
                <p className="text-xl font-serif font-bold text-gray-900 dark:text-gray-100">{stat.value}</p>
              </div>
            </div>
            <div className={`absolute -right-2 -bottom-2 w-16 h-16 ${stat.color} opacity-5 rounded-full blur-xl group-hover:scale-125 transition-transform`} />
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Column: Charts and Tables */}
        <div className="lg:col-span-2 space-y-6">
          {/* Chart Section */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm dark:shadow-none border border-gray-100 dark:border-slate-800">
            <h3 className="text-base font-serif font-bold text-gray-900 dark:text-gray-100 mb-4 flex items-center justify-between">
              {isEs ? "Tendencia de Reservas" : "Reservations Trend"}
              <span className="text-[10px] text-gray-400 dark:text-gray-500 font-bold uppercase tracking-widest">{isEs ? "Últimos 7 días" : "Last 7 days"}</span>
            </h3>
            <DashboardCharts data={chartData} locale={locale} />
          </div>

          {/* Recent Reservations Table (Simplified) */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm dark:shadow-none border border-gray-100 dark:border-slate-800">
             <div className="flex items-center justify-between mb-6">
               <h3 className="text-base font-serif font-bold text-gray-900 dark:text-gray-100">
                 {isEs ? "Últimas Reservas" : "Recent Bookings"}
               </h3>
               <Link href="/dashboard/reservas" className="text-brand-blue text-[11px] font-bold flex items-center gap-1 hover:underline uppercase tracking-wider">
                 {isEs ? "Ver todas" : "View all"} <ArrowRight className="w-3 h-3" />
               </Link>
             </div>
             
             <div className="overflow-x-auto">
               <table className="w-full text-left">
                 <thead>
                   <tr className="border-b border-gray-50 dark:border-slate-800/50 text-[9px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">
                     <th className="pb-3 px-2">{isEs ? "Huésped" : "Guest"}</th>
                     <th className="pb-3 px-2">{isEs ? "Categoría" : "Category"}</th>
                     <th className="pb-3 px-2">Check-in</th>
                     <th className="pb-3 px-2">Status</th>
                   </tr>
                 </thead>
                 <tbody className="divide-y divide-gray-50">
                   {recentReservations.map((res) => (
                     <tr key={res.id} className="hover:bg-gray-50 dark:hover:bg-slate-800/50/50 transition-colors">
                       <td className="py-3 px-2">
                         <p className="font-bold text-gray-900 dark:text-gray-100 text-xs truncate max-w-[120px]">{res.guest.fullName}</p>
                       </td>
                       <td className="py-3 px-2 text-xs text-gray-600 dark:text-gray-400 font-medium">{res.roomType.name}</td>
                       <td className="py-3 px-2 text-[11px] text-gray-500 dark:text-gray-400 font-medium">{res.checkIn.toLocaleDateString(locale)}</td>
                       <td className="py-3 px-2">
                          <span className={`px-1.5 py-0.5 rounded-md text-[9px] font-bold uppercase tracking-wider ${
                            res.status === 'PENDING' ? 'bg-amber-100 text-amber-700' : 
                            res.status === 'CONFIRMED' ? 'bg-green-100 text-green-700' : 'bg-gray-100 dark:bg-slate-800 text-gray-500 dark:text-gray-400'
                          }`}>
                            {res.status}
                          </span>
                       </td>
                     </tr>
                   ))}
                 </tbody>
               </table>
             </div>
          </div>
        </div>

        {/* Sidebar Column: Indicators and Quick Actions */}
        <div className="space-y-6">
           <DashboardIndicators 
              locale={locale} 
              rooms={{ assigned: assignedRoomsCount, available: availableRoomsCount }}
              categories={categoriesStats}
              promotions={{ active: totalActivePromos, list: activePromotions }}
              reviews={reviewsStats}
           />
           
           <QuickActions roomTypes={roomTypes} locale={locale} />
        </div>
      </div>
    </div>
  );
}
