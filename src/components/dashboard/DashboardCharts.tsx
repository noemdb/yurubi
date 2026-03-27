"use client";

import dynamic from "next/dynamic";
import { Props } from "react-apexcharts";

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

interface DashboardChartsProps {
  data: { date: string; count: number }[];
  locale: string;
}

export function DashboardCharts({ data, locale }: DashboardChartsProps) {
  const categories = data.map(d => d.date);
  const series = data.map(d => d.count);

  const options: Props["options"] = {
    chart: {
      id: "reservations-trend",
      toolbar: { show: false },
      fontFamily: "inherit",
      zoom: { enabled: false }
    },
    colors: ["#3b82f6"],
    stroke: {
      curve: "smooth",
      width: 3
    },
    fill: {
      type: "gradient",
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.45,
        opacityTo: 0.05,
        stops: [20, 100]
      }
    },
    dataLabels: { enabled: false },
    grid: {
      borderColor: "#f1f1f1",
      strokeDashArray: 4,
      xaxis: { lines: { show: false } },
      yaxis: { lines: { show: true } },
      padding: { top: 0, right: 0, bottom: 0, left: 0 }
    },
    xaxis: {
      categories,
      axisBorder: { show: false },
      axisTicks: { show: false },
      labels: {
        style: {
          colors: "#9ca3af",
          fontSize: "10px",
          fontWeight: 600
        }
      }
    },
    yaxis: {
      min: 0,
      forceNiceScale: true,
      labels: {
        style: {
          colors: "#9ca3af",
          fontSize: "10px",
          fontWeight: 600
        }
      }
    },
    tooltip: {
      x: { show: true },
      y: { title: { formatter: () => "" } }
    }
  };

  return (
    <div className="w-full h-[200px]">
      <Chart 
        options={options} 
        series={[{ name: "Reservas", data: series }]} 
        type="area" 
        height="100%" 
      />
    </div>
  );
}
