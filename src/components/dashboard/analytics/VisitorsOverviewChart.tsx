"use client";

import dynamic from "next/dynamic";

const ApexChart = dynamic(() => import("react-apexcharts"), { ssr: false });

interface VisitorsOverviewChartProps {
  data: { date: string; total: number; organic: number }[];
  locale?: string;
}

export function VisitorsOverviewChart({ data, locale = "es" }: VisitorsOverviewChartProps) {
  const isEs = locale === "es";

  const options: ApexCharts.ApexOptions = {
    chart: {
      type: "area",
      toolbar: { show: false },
      fontFamily: "inherit",
      animations: { enabled: true, speed: 600 },
    },
    xaxis: {
      categories: data.map((d) => d.date),
      labels: { style: { fontSize: "10px", fontWeight: "600", colors: "#9ca3af" } },
      axisBorder: { show: false },
      axisTicks: { show: false },
    },
    yaxis: {
      labels: {
        style: { fontSize: "10px", fontWeight: "600", colors: "#9ca3af" },
      },
      min: 0,
      forceNiceScale: true,
    },
    colors: ["#0c88ee", "#22c55e"], // Blue for total, Green for organic
    stroke: { curve: "smooth", width: [3, 2], dashArray: [0, 4] },
    fill: {
      type: "gradient",
      gradient: { shadeIntensity: 1, opacityFrom: 0.45, opacityTo: 0.05, stops: [0, 100] },
    },
    grid: { borderColor: "#f3f4f6", strokeDashArray: 4 },
    dataLabels: { enabled: false },
    legend: {
      position: 'top',
      horizontalAlign: 'right',
      fontSize: "12px",
      fontWeight: 600,
      labels: { colors: '#6b7280' },
      markers: { size: 4, offsetX: -2 }
    }
  };

  const series = [
    { name: isEs ? "Total Visitas" : "Total Visits", data: data.map((d) => d.total) },
    { name: isEs ? "Orgánicas" : "Organic", data: data.map((d) => d.organic) }
  ];

  return (
    <ApexChart
      type="area"
      height={260}
      options={options}
      series={series}
    />
  );
}
