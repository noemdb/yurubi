"use client";

import dynamic from "next/dynamic";

const ApexChart = dynamic(() => import("react-apexcharts"), { ssr: false });

interface OccupancyChartProps {
  data: { date: string; occupancy: number }[];
  locale?: string;
}

export function OccupancyChart({ data, locale = "es" }: OccupancyChartProps) {
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
      min: 0,
      max: 100,
      labels: {
        formatter: (v: number) => `${v}%`,
        style: { fontSize: "10px", fontWeight: "600", colors: "#9ca3af" },
      },
    },
    colors: ["#0c88ee"],
    stroke: { curve: "smooth", width: 3 },
    fill: {
      type: "gradient",
      gradient: { shadeIntensity: 1, opacityFrom: 0.45, opacityTo: 0.05, stops: [0, 100] },
    },
    grid: { borderColor: "#f3f4f6", strokeDashArray: 4 },
    tooltip: {
      y: { formatter: (v: number) => `${v.toFixed(1)}% ${isEs ? "ocupación" : "occupancy"}` },
    },
    dataLabels: { enabled: false },
  };

  return (
    <ApexChart
      type="area"
      height={260}
      options={options}
      series={[{ name: isEs ? "Ocupación" : "Occupancy", data: data.map((d) => d.occupancy) }]}
    />
  );
}
