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
import { ReportFilterBar } from "@/components/dashboard/ReportFilterBar";

export const metadata: Metadata = {
  title: "Reportes & KPIs | Hotel Río Yurubí",
};

export default async function ReportesPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ startDate?: string; endDate?: string }>;
}) {
  const { locale } = await params;
  const { startDate, endDate } = await searchParams;
  const session = await auth();
  if (!session) redirect(`/${locale}/login`);

  const isEs = locale === "es";
  const today = new Date();
  const monthStart = startOfMonth(today);
  const monthEnd = endOfMonth(today);

  // Parse filters
  const dateFrom = startDate ? startOfDay(new Date(startDate)) : undefined;
  const dateTo = endDate ? endOfDay(new Date(endDate)) : undefined;

  // ─── KPI queries ────────────────────────────────────────────
  const [
    activeReservations,
    monthReservations,
    totalReservations,
    cancelledReservations,
    totalRooms,
    occupiedToday,
    filteredReservationStatuses,
    confirmedInPeriod,
    upcomingCheckins,
    latestCheckouts,
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
    // Canceladas en periodo o histórico
    prisma.reservation.count({
      where: { 
        status: { in: ["CANCELLED", "REJECTED"] },
        createdAt: dateFrom || dateTo ? { gte: dateFrom, lte: dateTo } : undefined
      },
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
    // Reservas por estado (para donut) filtrado por periodo
    prisma.reservation.groupBy({
      by: ["status"],
      where: dateFrom || dateTo ? { createdAt: { gte: dateFrom, lte: dateTo } } : undefined,
      _count: { _all: true },
    }),
    // Confirmadas en periodo para ADR y Estadía Promedio
    prisma.reservation.findMany({
      where: { 
        status: "CONFIRMED", 
        createdAt: dateFrom || dateTo ? { gte: dateFrom, lte: dateTo } : { gte: monthStart, lte: monthEnd } 
      },
      select: { totalPrice: true, checkIn: true, checkOut: true },
    }),
    // Próximos check-ins
    prisma.reservation.findMany({
      where: { status: "CONFIRMED", checkIn: { gte: startOfDay(today) } },
      orderBy: { checkIn: "asc" },
      take: 5,
      include: { guest: { select: { fullName: true } }, roomType: { select: { name: true } } },
    }),
    // Últimas Salidas (Check-outs)
    prisma.reservation.findMany({
      where: { 
        status: "COMPLETED", 
        checkOut: { lte: endOfDay(today) } 
      },
      orderBy: { checkOut: "desc" },
      take: 5,
      include: { 
        guest: { select: { fullName: true } }, 
        roomType: { select: { name: true } } 
      },
    }),
  ]);

  const cancellationRate = totalReservations > 0
    ? ((cancelledReservations / totalReservations) * 100).toFixed(1)
    : "0";
  const occupancyPct = totalRooms > 0
    ? ((occupiedToday / totalRooms) * 100).toFixed(1)
    : "0";

  // Calcular ADR (Tarifa Media Diaria) y Estadía Promedio
  let totalRevenueInPeriod = 0;
  let totalNightsInPeriod = 0;
  confirmedInPeriod.forEach(r => {
    totalRevenueInPeriod += Number(r.totalPrice);
    const nights = Math.ceil((new Date(r.checkOut).getTime() - new Date(r.checkIn).getTime()) / (1000 * 60 * 60 * 24));
    totalNightsInPeriod += nights > 0 ? nights : 0;
  });

  const adr = totalNightsInPeriod > 0 ? (totalRevenueInPeriod / totalNightsInPeriod) : 0;
  const avgStay = confirmedInPeriod.length > 0 ? (totalNightsInPeriod / confirmedInPeriod.length).toFixed(1) : "0";

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

  const statusData = filteredReservationStatuses.map((s) => ({
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
      bgColor: "bg-brand-blue/5 dark:bg-brand-blue/10",
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
      sub: isEs ? (dateFrom || dateTo ? "En el periodo" : "Este mes") : (dateFrom || dateTo ? "In period" : "This month"),
      icon: <DollarSign className="w-5 h-5" />,
    },
    {
      label: isEs ? "Estadía Promedio" : "Avg Length of Stay",
      value: `${avgStay} ${isEs ? "noches" : "nights"}`,
      sub: isEs ? "Basado en reservas confirmadas" : "Based on confirmed bookings",
      icon: <Clock className="w-5 h-5" />,
    },
  ];

  return (
    <div className="space-y-10 max-w-7xl mx-auto pb-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-serif font-bold text-gray-900 dark:text-gray-100">
            {isEs ? "Reportes & KPIs" : "Reports & KPIs"}
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1 font-medium">
            {isEs
              ? "Vista analítica del desempeño mensual e histórico del Hotel."
              : "Analytical view of monthly and historical Hotel performance."}
          </p>
        </div>
        
        <ReportFilterBar locale={locale} />
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
        {kpis.map((kpi) => (
          <div
            key={kpi.label}
            className="bg-white dark:bg-slate-900 rounded-[2rem] border border-gray-100 dark:border-slate-800 shadow-sm dark:shadow-none p-6 overflow-hidden relative group hover:shadow-lg transition-all"
          >
            <div className={`w-12 h-12 rounded-2xl ${kpi.bgColor} flex items-center justify-center ${kpi.textColor} mb-4 group-hover:scale-110 transition-transform`}>
              {kpi.icon}
            </div>
            <p className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">{kpi.label}</p>
            <p className="text-4xl font-serif font-bold text-gray-900 dark:text-gray-100 mt-1 leading-none">{kpi.value}</p>
            <p className="text-xs text-gray-400 dark:text-gray-500 font-medium mt-2">{kpi.sub}</p>
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
                <span className="bg-white dark:bg-slate-900/20 px-2 py-1 rounded-lg text-xs font-bold">
                  +{formatPrice(totalRevenueInPeriod)}
                </span>
                {isEs ? "Recaudado en periodo" : "Collected in period"}
              </p>
            </div>
            <div className="absolute -right-10 -top-10 w-64 h-64 bg-white dark:bg-slate-900/5 rounded-full" />
            <div className="absolute -right-5 -bottom-10 w-40 h-40 bg-white dark:bg-slate-900/5 rounded-full" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {secondaryKpis.map((kpi) => (
              <div key={kpi.label} className="bg-white dark:bg-slate-900 rounded-[2rem] border border-gray-100 dark:border-slate-800 shadow-sm dark:shadow-none p-6 flex flex-col justify-center">
                 <div className="flex items-center gap-3 mb-2">
                   <div className="w-8 h-8 rounded-xl bg-gray-50 dark:bg-slate-800/50 flex items-center justify-center text-gray-600 dark:text-gray-400">
                     {kpi.icon}
                   </div>
                   <p className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">{kpi.label}</p>
                 </div>
                 <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{kpi.value}</p>
                 <p className="text-[10px] text-gray-400 dark:text-gray-500 font-medium uppercase mt-2">{kpi.sub}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Últimas Salidas */}
        <div className="bg-white dark:bg-slate-900 rounded-[2rem] border border-gray-100 dark:border-slate-800 shadow-sm dark:shadow-none p-6 flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-serif font-bold text-gray-900 dark:text-gray-100">
                {isEs ? "Últimas Salidas" : "Latest Check-outs"}
              </h2>
              <p className="text-xs text-gray-400 dark:text-gray-500 font-medium mt-1">
                {isEs ? "Huéspedes que ya se retiraron" : "Guests who have already checked out"}
              </p>
            </div>
            <Link href="/dashboard/reservas" className="w-8 h-8 rounded-full bg-gray-50 dark:bg-slate-800/50 hover:bg-gray-100 dark:hover:bg-slate-800 flex items-center justify-center text-gray-400 dark:text-gray-500 transition-colors">
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          
          <div className="flex-1 space-y-4">
            {latestCheckouts.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-gray-400 dark:text-gray-500 py-10">
                <Clock className="w-8 h-8 mb-2 opacity-50" />
                <p className="text-sm font-medium">{isEs ? "No hay salidas registradas." : "No check-outs recorded."}</p>
              </div>
            ) : (
              latestCheckouts.map((res) => (
                <div key={res.id} className="flex items-center justify-between p-4 rounded-xl border border-gray-50 dark:border-slate-800/50 bg-gray-50 dark:bg-slate-800/50/50 dark:bg-slate-800/30 hover:bg-gray-50 dark:hover:bg-slate-800/50 transition-colors">
                  <div className="min-w-0 pr-4">
                    <p className="text-sm font-bold text-gray-900 dark:text-gray-100 truncate">{res.guest.fullName}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{res.roomType.name}</p>
                  </div>
                  <div className="shrink-0 text-right">
                    <p className="text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded-lg inline-block">
                      {format(new Date(res.checkOut), "dd MMM", { locale: isEs ? es : undefined })}
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
        <div className="xl:col-span-2 bg-white dark:bg-slate-900 rounded-[2rem] border border-gray-100 dark:border-slate-800 shadow-sm dark:shadow-none p-8">
          <div className="mb-6">
            <h2 className="text-lg font-serif font-bold text-gray-900 dark:text-gray-100">
              {isEs ? "Ocupación Últimos 30 días" : "Occupancy — Last 30 Days"}
            </h2>
            <p className="text-xs text-gray-400 dark:text-gray-500 font-medium mt-1">
              {isEs ? "% de habitaciones ocupadas por día" : "% of rooms occupied per day"}
            </p>
          </div>
          <OccupancyChart data={occupancyData} locale={locale} />
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-[2rem] border border-gray-100 dark:border-slate-800 shadow-sm dark:shadow-none p-8 flex flex-col">
          <div className="mb-6 flex-shrink-0">
            <h2 className="text-lg font-serif font-bold text-gray-900 dark:text-gray-100">
              {isEs ? "Reservas por Estado" : "Reservations by Status"}
            </h2>
            <p className="text-xs text-gray-400 dark:text-gray-500 font-medium mt-1">
              {dateFrom || dateTo 
                ? (isEs ? "Distribución en el periodo seleccionado" : "Distribution in selected period")
                : (isEs ? "Distribución histórica total" : "Total historical distribution")}
            </p>
          </div>
          <div className="flex-1 flex items-center justify-center min-h-[260px]">
            <ReservationsByStatusChart data={statusData} locale={locale} />
          </div>
        </div>
      </div>

      {/* Charts ROW 2 */}
      <div className="bg-white dark:bg-slate-900 rounded-[2rem] border border-gray-100 dark:border-slate-800 shadow-sm dark:shadow-none p-8">
        <div className="mb-6">
          <h2 className="text-lg font-serif font-bold text-gray-900 dark:text-gray-100">
            {isEs ? "Ingresos Mensuales" : "Monthly Revenue"}
          </h2>
          <p className="text-xs text-gray-400 dark:text-gray-500 font-medium mt-1">
            {isEs ? "Últimos 6 meses (solo reservas confirmadas)" : "Last 6 months (confirmed reservations only)"}
          </p>
        </div>
        <RevenueChart data={revenueData} locale={locale} />
      </div>
    </div>
  );
}
