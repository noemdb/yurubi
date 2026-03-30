import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import {
  Users, Activity, Globe, MousePointerClick, BarChart2
} from "lucide-react";
import {
  startOfMonth, endOfMonth, subDays, startOfDay, endOfDay, format
} from "date-fns";
import { es } from "date-fns/locale";
import { Metadata } from "next";
import { ReportFilterBar } from "@/components/dashboard/ReportFilterBar";
import { VisitorsOverviewChart } from "@/components/dashboard/analytics/VisitorsOverviewChart";
import { TopSectionsChart } from "@/components/dashboard/analytics/TopSectionsChart";
import { VisitorsTable } from "@/components/dashboard/analytics/VisitorsTable";

export const metadata: Metadata = {
  title: "Analítica de Visitantes | Admin Dashboard",
};

export default async function VisitorsPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ startDate?: string; endDate?: string }>;
}) {
  const { locale } = await params;
  const { startDate, endDate } = await searchParams;
  const session = await auth();
  if (!session || session.user?.role !== "ADMIN") {
    redirect(`/${locale}/login`);
  }

  const isEs = locale === "es";
  const today = new Date();
  const monthStart = startOfMonth(today);
  const monthEnd = endOfMonth(today);

  // Parse filters
  const dateFrom = startDate ? startOfDay(new Date(startDate)) : undefined;
  const dateTo = endDate ? endOfDay(new Date(endDate)) : undefined;

  // KPIs queries
  const wherePeriod = dateFrom || dateTo ? {
    firstSeen: { gte: dateFrom, lte: dateTo }
  } : {
    firstSeen: { gte: monthStart, lte: monthEnd }
  };

  const [
    totalVisitors,
    bouncedVisitors,
    organicVisitors,
    avgDurationAggr,
    activeSessionsToday,
    topPages,
    sessions,
  ] = await Promise.all([
    prisma.visitorSession.count({ where: wherePeriod }),
    prisma.visitorSession.count({ where: { ...wherePeriod, bounced: true } }),
    prisma.visitorSession.count({ where: { ...wherePeriod, isOrganic: true } }),
    prisma.visitorSession.aggregate({
      _avg: { duration: true },
      where: wherePeriod
    }),
    prisma.visitorSession.count({
      where: { lastSeen: { gte: subDays(today, 1) } }
    }),
    prisma.pageView.groupBy({
      by: ["path"],
      where: dateFrom || dateTo ? { createdAt: { gte: dateFrom, lte: dateTo } } : undefined,
      _count: { path: true },
      orderBy: { _count: { path: "desc" } },
      take: 10,
    }),
    prisma.visitorSession.findMany({
      where: dateFrom || dateTo ? { firstSeen: { gte: dateFrom, lte: dateTo } } : undefined,
      orderBy: { firstSeen: "desc" },
      take: 500, // Limitar a las últimas 500 para rendimiento en tabla
    })
  ]);

  const bounceRate = totalVisitors > 0 ? Math.round((bouncedVisitors / totalVisitors) * 100) : 0;
  const avgDur = avgDurationAggr._avg.duration || 0;
  const avgFormat = avgDur > 60 ? `${Math.floor(avgDur/60)}m ${Math.floor(avgDur%60)}s` : `${Math.floor(avgDur)}s`;

  // ─── Visits past 30 days (for chart) ───────────────────────────
  // Para la gráfica temporal usamos los últimos 30 días con los filtros limpios para mantener el histórico
  const overviewData: { date: string; total: number; organic: number }[] = [];
  // Aquí podríamos hacer 30 queries, o hacer una query de agrupado si es soportado.
  // Por simplicidad de lectura, usaremos un loop de 30 días, aunque es pesado si no se indexó correctamente.
  // Es mejor tirar fetch general y procesar.
  const past30DaysStart = subDays(startOfDay(today), 29);
  
  const last30DaysSessions = await prisma.visitorSession.findMany({
    where: { firstSeen: { gte: past30DaysStart } },
    select: { firstSeen: true, isOrganic: true }
  });

  const aggregateByDay = new Map();
  for (let i = 29; i >= 0; i--) {
    const day = subDays(today, i);
    const dateStr = format(day, "yyyy-MM-dd");
    aggregateByDay.set(dateStr, { total: 0, organic: 0 });
  }

  last30DaysSessions.forEach(s => {
    const dStr = format(s.firstSeen, "yyyy-MM-dd");
    if (aggregateByDay.has(dStr)) {
      const current = aggregateByDay.get(dStr);
      current.total += 1;
      if (s.isOrganic) current.organic += 1;
    }
  });

  for (let i = 29; i >= 0; i--) {
    const day = subDays(today, i);
    const dStr = format(day, "yyyy-MM-dd");
    const dAgg = aggregateByDay.get(dStr);
    overviewData.push({
      date: format(day, "dd MMM", { locale: isEs ? es : undefined }),
      total: dAgg.total,
      organic: dAgg.organic,
    });
  }

  const topSectionsData = topPages.map(p => ({
    path: p.path.split("?")[0] || "/",
    views: p._count.path,
  }));

  const kpis = [
    {
      label: "Visitas Totales",
      value: totalVisitors,
      sub: (dateFrom || dateTo) ? "En el periodo" : "Este mes",
      icon: <Users className="w-6 h-6" />,
      color: "bg-blue-500", textColor: "text-blue-600", bgColor: "bg-blue-50 dark:bg-slate-800",
    },
    {
      label: "Usuarios Orgánicos",
      value: organicVisitors,
      sub: "Sin referrer directo / redes",
      icon: <Globe className="w-6 h-6" />,
      color: "bg-green-500", textColor: "text-green-600", bgColor: "bg-green-50 dark:bg-slate-800",
    },
    {
      label: "Tasa de Rebote",
      value: `${bounceRate}%`,
      sub: "Salieron sin navegar",
      icon: <MousePointerClick className="w-6 h-6" />,
      color: "bg-amber-500", textColor: "text-amber-600", bgColor: "bg-amber-50 dark:bg-slate-800",
    },
    {
      label: "Promedio Permanencia",
      value: avgFormat,
      sub: "Tiempo activo",
      icon: <Activity className="w-6 h-6" />,
      color: "bg-purple-500", textColor: "text-purple-600", bgColor: "bg-purple-50 dark:bg-slate-800",
    },
  ];

  return (
    <div className="space-y-10 max-w-7xl mx-auto pb-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-serif font-bold text-gray-900 dark:text-gray-100 flex items-center gap-3">
            <BarChart2 className="w-8 h-8 text-brand-blue" />
            {isEs ? "Analíticas de Audiencia" : "Audience Analytics"}
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1 font-medium">
            {isEs
              ? "Tráfico del sitio web, páginas visitadas y perfil de usuarios."
              : "Website traffic, pages viewed and user profiles."}
          </p>
        </div>
        
        <ReportFilterBar locale={locale} />
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
        {kpis.map((kpi) => (
          <div
            key={kpi.label}
            className={`bg-white dark:bg-slate-900 rounded-[2rem] border border-gray-100 dark:border-slate-800 shadow-sm p-6 overflow-hidden relative group hover:shadow-lg transition-all`}
          >
            <div className={`w-12 h-12 rounded-2xl ${kpi.bgColor} flex items-center justify-center ${kpi.textColor} mb-4 group-hover:scale-110 transition-transform`}>
              {kpi.icon}
            </div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">{kpi.label}</p>
            <p className="text-4xl font-serif font-bold text-gray-900 dark:text-gray-100 mt-1">{kpi.value}</p>
            <p className="text-xs text-gray-400 font-medium mt-2">{kpi.sub}</p>
            <div className={`absolute -right-5 -bottom-5 w-24 h-24 ${kpi.color} opacity-5 rounded-full blur-2xl group-hover:scale-150 transition-all duration-700`} />
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 bg-white dark:bg-slate-900 rounded-[2rem] border border-gray-100 dark:border-slate-800 shadow-sm p-8">
          <div className="mb-6 flex justify-between items-end">
            <div>
              <h2 className="text-lg font-serif font-bold text-gray-900 dark:text-gray-100">
                Resumen de Tráfico
              </h2>
              <p className="text-xs text-gray-400 font-medium mt-1">Últimos 30 días</p>
            </div>
            <p className="text-sm font-bold text-green-500 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
              {activeSessionsToday} activas hoy
            </p>
          </div>
          <VisitorsOverviewChart data={overviewData} locale={locale} />
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-[2rem] border border-gray-100 dark:border-slate-800 shadow-sm p-8 flex flex-col">
          <div className="mb-6 flex-shrink-0">
            <h2 className="text-lg font-serif font-bold text-gray-900 dark:text-gray-100">
              Páginas Más Vistas
            </h2>
            <p className="text-xs text-gray-400 font-medium mt-1">
              Top 10 en el periodo
            </p>
          </div>
          <div className="flex-1 flex items-center justify-center min-h-[260px] w-full">
            {topSectionsData.length > 0 ? (
              <TopSectionsChart data={topSectionsData} locale={locale} />
            ) : (
              <p className="text-sm text-gray-400">Sin datos para mostrar</p>
            )}
          </div>
        </div>
      </div>

      {/* Data Table */}
      <div className="space-y-4">
        <div className="flex items-center justify-between px-2">
          <h2 className="text-xl font-serif font-bold text-gray-900 dark:text-gray-100">
            Sesiones de Audiencia
          </h2>
          <span className="text-sm font-medium text-gray-500">{sessions.length} registros cargados</span>
        </div>
        <VisitorsTable initialData={sessions as any} locale={locale} />
      </div>
    </div>
  );
}
