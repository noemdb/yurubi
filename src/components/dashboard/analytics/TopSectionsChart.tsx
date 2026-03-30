"use client";

import dynamic from "next/dynamic";

const ApexChart = dynamic(() => import("react-apexcharts"), { ssr: false });

interface TopSectionsChartProps {
  data: { path: string; views: number }[];
  locale?: string;
}

export function TopSectionsChart({ data, locale = "es" }: TopSectionsChartProps) {
  const isEs = locale === "es";

  const options: ApexCharts.ApexOptions = {
    chart: {
      type: "bar",
      toolbar: { show: false },
      fontFamily: "inherit",
    },
    plotOptions: {
      bar: {
        horizontal: true,
        borderRadius: 4,
        barHeight: '60%',
        colors: {
          ranges: [{
            from: 0,
            to: 100000,
            color: '#8b5cf6' // Purple color for bars
          }]
        }
      }
    },
    xaxis: {
      categories: data.map((d) => d.path),
      labels: { style: { fontSize: "10px", fontWeight: "600", colors: "#9ca3af" } },
      axisBorder: { show: false },
      axisTicks: { show: false },
    },
    yaxis: {
      labels: {
        style: { fontSize: "11px", fontWeight: "600", colors: "#4b5563" },
      },
    },
    grid: { show: false },
    dataLabels: { 
      enabled: true,
      textAnchor: 'start',
      style: { colors: ['#fff'] },
      offsetX: 0,
    },
    tooltip: {
      theme: 'light',
      y: { formatter: (val) => `${val} ${isEs ? "vistas" : "views"}` }
    }
  };

  return (
    <div className="w-full">
      <ApexChart
        type="bar"
        height={280}
        options={options}
        series={[{ name: isEs ? "Vistas" : "Views", data: data.map(d => d.views) }]}
      />
    </div>
  );
}
