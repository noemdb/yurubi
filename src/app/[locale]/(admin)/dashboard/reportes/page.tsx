// src/app/[locale]/(admin)/dashboard/reportes/page.tsx
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import {
  TrendingUp, BarChart2, CalendarCheck, Percent, DollarSign, Clock, ArrowRight, BedDouble
} from "lucide-react";
import {
  startOfMonth, endOfMonth, subDays, format, subMonths, startOfDay, endOfDay
} from "date-fns";
import { es } from "date-fns/locale";
import { OccupancyChart } from "@/components/dashboard/charts/OccupancyChart";
import { ReservationsByStatusChart } from "@/components/dashboard/charts/ReservationsByStatusChart";
import { RevenueChart } from "@/components/dashboard/charts/RevenueChart";
import { formatPrice } from "@/lib/utils";
import { Metadata } from "next";
import { Link } from "@/routing";

export const metadata: Metadata = {
  title: "Reportes & KPIs | Hotel Río Yurubí",
};

export default async function ReportesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const session = await auth();
  if (!session) redirect(`/${locale}/login`);

  const isEs = locale === "es";
  const today = new Date();
  const monthStart = startOfMonth(today);
  const monthEnd = endOfMonth(today);

  // ─── KPI queries ────────────────────────────────────────────
  const [
    activeReservations,
    monthReservations,
    totalReservations,
    cancelledReservations,
    totalRooms,
    occupiedToday,
    allReservationStatuses,
    confirmedThisMonth,
    upcomingCheckins,
  ] = await Promise.all([
    // Activas (confirmadas con checkIn >= hoy)
    prisma.reservation.count({
      where: { status: "CONFIRMED", checkIn: { gte: startOfDay(today) } },
    }),
    // Del mes actual
    prisma.reservation.count({
      where: { createdAt: { gte: monthStart, lte: monthEnd } },
    }),
    // Total histórico
    prisma.reservation.count(),
    // Canceladas históricas
    prisma.reservation.count({
      where: { status: { in: ["CANCELLED", "REJECTED"] } },
    }),
    // Habitaciones físicas
    prisma.room.count(),
    // Ocupadas hoy
    prisma.reservation.count({
      where: {
        status: "CONFIRMED",
        checkIn: { lte: today },
        checkOut: { gte: today },
      },
    }),
    // Todas las reservas por estado (para donut)
    prisma.reservation.groupBy({
      by: ["status"],
      _count: { _all: true },
    }),
    // Confirmadas creadas este mes para ADR y Estadía Promedio
    prisma.reservation.findMany({
      where: { status: "CONFIRMED", createdAt: { gte: monthStart, lte: monthEnd } },
      select: { totalPrice: true, checkIn: true, checkOut: true },
    }),
    // Próximos check-ins
    prisma.reservation.findMany({
      where: { status: "CONFIRMED", checkIn: { gte: startOfDay(today) } },
      orderBy: { checkIn: "asc" },
      take: 5,
      include: { guest: { select: { fullName: true } }, roomType: { select: { name: true } } },
    }),
  ]);

  const cancellationRate = totalReservations > 0
    ? ((cancelledReservations / totalReservations) * 100).toFixed(1)
    : "0";
  const occupancyPct = totalRooms > 0
    ? ((occupiedToday / totalRooms) * 100).toFixed(1)
    : "0";

  // Calcular ADR (Tarifa Media Diaria) y Estadía Promedio
  let totalRevenueThisMonth = 0;
  let totalNightsThisMonth = 0;
  confirmedThisMonth.forEach(r => {
    totalRevenueThisMonth += Number(r.totalPrice);
    const nights = Math.ceil((new Date(r.checkOut).getTime() - new Date(r.checkIn).getTime()) / (1000 * 60 * 60 * 24));
    totalNightsThisMonth += nights > 0 ? nights : 0;
  });

  const adr = totalNightsThisMonth > 0 ? (totalRevenueThisMonth / totalNightsThisMonth) : 0;
  const avgStay = confirmedThisMonth.length > 0 ? (totalNightsThisMonth / confirmedThisMonth.length).toFixed(1) : "0";

  // ─── Ocupación últimos 30 días ───────────────────────────
  const occupancyData: { date: string; occupancy: number }[] = [];
  if (totalRooms > 0) {
    for (let i = 29; i >= 0; i--) {
      const day = subDays(today, i);
      const count = await prisma.reservation.count({
        where: {
          status: "CONFIRMED",
          checkIn: { lte: endOfDay(day) },
          checkOut: { gte: startOfDay(day) },
        },
      });
      occupancyData.push({
        date: format(day, "dd MMM", { locale: isEs ? es : undefined }),
        occupancy: totalRooms > 0 ? Math.round((count / totalRooms) * 100) : 0,
      });
    }
  }

  // ─── Ingresos últimos 6 meses ────────────────────────────
  const revenueData: { month: string; revenue: number }[] = [];
  for (let i = 5; i >= 0; i--) {
    const m = subMonths(today, i);
    const mStart = startOfMonth(m);
    const mEnd = endOfMonth(m);
    const agg = await prisma.reservation.aggregate({
      where: {
        status: "CONFIRMED",
        createdAt: { gte: mStart, lte: mEnd },
      },
      _sum: { totalPrice: true },
    });
    revenueData.push({
      month: format(m, "MMM yy", { locale: isEs ? es : undefined }),
      revenue: Number(agg._sum.totalPrice ?? 0),
    });
  }

  const statusData = allReservationStatuses.map((s) => ({
    status: s.status,
    count: s._count._all,
  }));

  // ─── Total revenue confirmed ever ───────────────────────
  const totalRevenueAgg = await prisma.reservation.aggregate({
    where: { status: "CONFIRMED" },
    _sum: { totalPrice: true },
  });
  const totalRevenue = Number(totalRevenueAgg._sum.totalPrice ?? 0);

  const kpis = [
    {
      label: isEs ? "Reservas Activas" : "Active Reservations",
      value: activeReservations,
      sub: isEs ? "Confirmadas con check-in futuro" : "Confirmed with future check-in",
      icon: <CalendarCheck className="w-6 h-6" />,
      color: "bg-brand-blue",
      textColor: "text-brand-blue",
      bgColor: "bg-brand-blue/5",
    },
    {
      label: isEs ? "Reservas del Mes" : "This Month's Bookings",
      value: monthReservations,
      sub: format(today, isEs ? "MMMM yyyy" : "MMMM yyyy", { locale: isEs ? es : undefined }),
      icon: <TrendingUp className="w-6 h-6" />,
      color: "bg-green-500",
      textColor: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      label: isEs ? "Tasa de Cancelación" : "Cancellation Rate",
      value: `${cancellationRate}%`,
      sub: isEs ? `${cancelledReservations} de ${totalReservations} total` : `${cancelledReservations} of ${totalReservations} total`,
      icon: <Percent className="w-6 h-6" />,
      color: "bg-amber-500",
      textColor: "text-amber-600",
      bgColor: "bg-amber-50",
    },
    {
      label: isEs ? "Ocupación Hoy" : "Today's Occupancy",
      value: `${occupancyPct}%`,
      sub: isEs ? `${occupiedToday} de ${totalRooms} hab.` : `${occupiedToday} of ${totalRooms} rooms`,
      icon: <BarChart2 className="w-6 h-6" />,
      color: "bg-purple-500",
      textColor: "text-purple-600",
      bgColor: "bg-purple-50",
    },
  ];

  const secondaryKpis = [
    {
      label: isEs ? "ADR (Tarifa Media Diaria)" : "ADR (Avg Daily Rate)",
      value: formatPrice(adr),
      sub: isEs ? "Este mes" : "This month",
      icon: <DollarSign className="w-5 h-5" />,
    },
    {
      label: isEs ? "Estadía Promedio" : "Avg Length of Stay",
      value: `${avgStay} ${isEs ? "noches" : "nights"}`,
      sub: isEs ? "Basado en reservas confirmadas este mes" : "Based on confirmed bookings this month",
      icon: <Clock className="w-5 h-5" />,
    },
  ];

  return (
    <div className="space-y-10 max-w-7xl mx-auto pb-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-serif font-bold text-gray-900">
          {isEs ? "Reportes & KPIs" : "Reports & KPIs"}
        </h1>
        <p className="text-gray-500 mt-1 font-medium">
          {isEs
            ? "Vista analítica del desempeño mensual e histórico del Hotel."
            : "Analytical view of monthly and historical Hotel performance."}
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
        {kpis.map((kpi) => (
          <div
            key={kpi.label}
            className="bg-white rounded-[2rem] border border-gray-100 shadow-sm p-6 overflow-hidden relative group hover:shadow-lg transition-all"
          >
            <div className={`w-12 h-12 rounded-2xl ${kpi.bgColor} flex items-center justify-center ${kpi.textColor} mb-4 group-hover:scale-110 transition-transform`}>
              {kpi.icon}
            </div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">{kpi.label}</p>
            <p className="text-4xl font-serif font-bold text-gray-900 mt-1 leading-none">{kpi.value}</p>
            <p className="text-xs text-gray-400 font-medium mt-2">{kpi.sub}</p>
            <div className={`absolute -right-5 -bottom-5 w-24 h-24 ${kpi.color} opacity-5 rounded-full blur-2xl group-hover:scale-150 transition-all duration-700`} />
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Banner de Ingresos Históricos & KPIs Secundarios */}
        <div className="xl:col-span-2 space-y-6 flex flex-col justify-between">
          <div className="bg-gradient-to-r from-brand-blue to-brand-blue/80 rounded-[2rem] p-8 text-white relative overflow-hidden flex-1 flex flex-col justify-center">
            <div className="relative z-10">
              <p className="text-[10px] font-bold uppercase tracking-widest text-blue-200 mb-1">
                {isEs ? "Ingresos Totales (Histórico)" : "Total Revenue (Historical)"}
              </p>
              <p className="text-5xl lg:text-6xl font-serif font-bold">{formatPrice(totalRevenue)}</p>
              <p className="text-blue-200 text-sm font-medium mt-3 flex items-center gap-2">
                <span className="bg-white/20 px-2 py-1 rounded-lg text-xs font-bold">
                  +{formatPrice(totalRevenueThisMonth)}
                </span>
                {isEs ? "Recaudado este mes" : "Collected this month"}
              </p>
            </div>
            <div className="absolute -right-10 -top-10 w-64 h-64 bg-white/5 rounded-full" />
            <div className="absolute -right-5 -bottom-10 w-40 h-40 bg-white/5 rounded-full" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {secondaryKpis.map((kpi) => (
              <div key={kpi.label} className="bg-white rounded-[2rem] border border-gray-100 shadow-sm p-6 flex flex-col justify-center">
                 <div className="flex items-center gap-3 mb-2">
                   <div className="w-8 h-8 rounded-xl bg-gray-50 flex items-center justify-center text-gray-600">
                     {kpi.icon}
                   </div>
                   <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">{kpi.label}</p>
                 </div>
                 <p className="text-2xl font-bold text-gray-900">{kpi.value}</p>
                 <p className="text-[10px] text-gray-400 font-medium uppercase mt-2">{kpi.sub}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Próximos Check-ins */}
        <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm p-6 flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-serif font-bold text-gray-900">
                {isEs ? "Próximas Llegadas" : "Upcoming Arrivals"}
              </h2>
              <p className="text-xs text-gray-400 font-medium mt-1">
                {isEs ? "Check-ins confirmados recientes" : "Recent confirmed check-ins"}
              </p>
            </div>
            <Link href="/dashboard/reservas" className="w-8 h-8 rounded-full bg-gray-50 hover:bg-gray-100 flex items-center justify-center text-gray-400 transition-colors">
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          
          <div className="flex-1 space-y-4">
            {upcomingCheckins.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-gray-400">
                <BedDouble className="w-8 h-8 mb-2 opacity-50" />
                <p className="text-sm font-medium">{isEs ? "No hay llegadas programadas." : "No upcoming arrivals."}</p>
              </div>
            ) : (
              upcomingCheckins.map((res) => (
                <div key={res.id} className="flex items-center justify-between p-4 rounded-xl border border-gray-50 bg-gray-50/50 hover:bg-gray-50 transition-colors">
                  <div className="min-w-0 pr-4">
                    <p className="text-sm font-bold text-gray-900 truncate">{res.guest.fullName}</p>
                    <p className="text-xs text-gray-500 truncate">{res.roomType.name}</p>
                  </div>
                  <div className="shrink-0 text-right">
                    <p className="text-xs font-bold text-brand-blue bg-brand-blue/10 px-2 py-1 rounded-lg inline-block">
                      {format(new Date(res.checkIn), "dd MMM", { locale: isEs ? es : undefined })}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Charts ROW 1 */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 bg-white rounded-[2rem] border border-gray-100 shadow-sm p-8">
          <div className="mb-6">
            <h2 className="text-lg font-serif font-bold text-gray-900">
              {isEs ? "Ocupación Últimos 30 días" : "Occupancy — Last 30 Days"}
            </h2>
            <p className="text-xs text-gray-400 font-medium mt-1">
              {isEs ? "% de habitaciones ocupadas por día" : "% of rooms occupied per day"}
            </p>
          </div>
          <OccupancyChart data={occupancyData} locale={locale} />
        </div>

        <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm p-8 flex flex-col">
          <div className="mb-6 flex-shrink-0">
            <h2 className="text-lg font-serif font-bold text-gray-900">
              {isEs ? "Reservas por Estado" : "Reservations by Status"}
            </h2>
            <p className="text-xs text-gray-400 font-medium mt-1">
              {isEs ? "Distribución histórica total" : "Total historical distribution"}
            </p>
          </div>
          <div className="flex-1 flex items-center justify-center min-h-[260px]">
            <ReservationsByStatusChart data={statusData} locale={locale} />
          </div>
        </div>
      </div>

      {/* Charts ROW 2 */}
      <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm p-8">
        <div className="mb-6">
          <h2 className="text-lg font-serif font-bold text-gray-900">
            {isEs ? "Ingresos Mensuales" : "Monthly Revenue"}
          </h2>
          <p className="text-xs text-gray-400 font-medium mt-1">
            {isEs ? "Últimos 6 meses (solo reservas confirmadas)" : "Last 6 months (confirmed reservations only)"}
          </p>
        </div>
        <RevenueChart data={revenueData} locale={locale} />
      </div>
    </div>
  );
}
