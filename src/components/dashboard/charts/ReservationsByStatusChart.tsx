"use client";

import dynamic from "next/dynamic";

const ApexChart = dynamic(() => import("react-apexcharts"), { ssr: false });

interface ReservationsByStatusChartProps {
  data: { status: string; count: number }[];
  locale?: string;
}

const STATUS_COLORS: Record<string, string> = {
  CONFIRMED: "#22c55e",
  PENDING: "#f59e0b",
  CANCELLED: "#6b7280",
  REJECTED: "#ef4444",
  COMPLETED: "#0c88ee",
};

const STATUS_LABELS_ES: Record<string, string> = {
  CONFIRMED: "Confirmadas",
  PENDING: "Pendientes",
  CANCELLED: "Canceladas",
  REJECTED: "Rechazadas",
  COMPLETED: "Completadas",
};

export function ReservationsByStatusChart({ data, locale = "es" }: ReservationsByStatusChartProps) {
  const isEs = locale === "es";
  const filtered = data.filter((d) => d.count > 0);

  const options: ApexCharts.ApexOptions = {
    chart: {
      type: "donut",
      fontFamily: "inherit",
      animations: { enabled: true, speed: 600 },
    },
    labels: filtered.map((d) =>
      isEs ? (STATUS_LABELS_ES[d.status] ?? d.status) : d.status
    ),
    colors: filtered.map((d) => STATUS_COLORS[d.status] ?? "#9ca3af"),
    legend: {
      position: "bottom",
      fontSize: "11px",
      fontWeight: "600",
      labels: { colors: "#6b7280" },
    },
    dataLabels: {
      enabled: true,
      formatter: (val: number) => `${val.toFixed(0)}%`,
      style: { fontSize: "11px", fontWeight: "700" },
    },
    stroke: { show: false },
    plotOptions: {
      pie: {
        donut: {
          size: "65%",
          labels: {
            show: true,
            total: {
              show: true,
              label: isEs ? "Total" : "Total",
              fontSize: "12px",
              fontWeight: "700",
              color: "#111827",
              formatter: (w: any) =>
                w.globals.seriesTotals.reduce((a: number, b: number) => a + b, 0).toString(),
            },
          },
        },
      },
    },
    tooltip: { y: { formatter: (v: number) => `${v} ${isEs ? "reservas" : "reservations"}` } },
  };

  return (
    <ApexChart
      type="donut"
      height={260}
      options={options}
      series={filtered.map((d) => d.count)}
    />
  );
}
