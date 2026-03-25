"use client";

import dynamic from "next/dynamic";

const ApexChart = dynamic(() => import("react-apexcharts"), { ssr: false });

interface RevenueChartProps {
  data: { month: string; revenue: number }[];
  locale?: string;
}

export function RevenueChart({ data, locale = "es" }: RevenueChartProps) {
  const isEs = locale === "es";

  const options: ApexCharts.ApexOptions = {
    chart: {
      type: "bar",
      toolbar: { show: false },
      fontFamily: "inherit",
      animations: { enabled: true, speed: 600 },
    },
    xaxis: {
      categories: data.map((d) => d.month),
      labels: { style: { fontSize: "10px", fontWeight: "600", colors: "#9ca3af" } },
      axisBorder: { show: false },
      axisTicks: { show: false },
    },
    yaxis: {
      labels: {
        formatter: (v: number) => `$${v >= 1000 ? `${(v / 1000).toFixed(1)}k` : v}`,
        style: { fontSize: "10px", fontWeight: "600", colors: "#9ca3af" },
      },
    },
    colors: ["#22c55e"],
    plotOptions: {
      bar: {
        borderRadius: 8,
        columnWidth: "50%",
        dataLabels: { position: "top" },
      },
    },
    grid: { borderColor: "#f3f4f6", strokeDashArray: 4 },
    dataLabels: { enabled: false },
    tooltip: {
      y: {
        formatter: (v: number) =>
          `$${v.toLocaleString(isEs ? "es-VE" : "en-US")} USD`,
      },
    },
  };

  return (
    <ApexChart
      type="bar"
      height={260}
      options={options}
      series={[{ name: isEs ? "Ingresos" : "Revenue", data: data.map((d) => d.revenue) }]}
    />
  );
}
