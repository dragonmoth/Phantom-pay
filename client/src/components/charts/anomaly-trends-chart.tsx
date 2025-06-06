import { useEffect, useRef } from "react";
import Chart from "chart.js/auto";

interface AnomalyTrendsChartProps {
  anomalies: any[];
}

export function AnomalyTrendsChart({ anomalies }: AnomalyTrendsChartProps) {
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstanceRef = useRef<Chart | null>(null);

  useEffect(() => {
    if (!chartRef.current) return;

    // Destroy existing chart instance
    if (chartInstanceRef.current) {
      chartInstanceRef.current.destroy();
    }

    // Process anomalies data by month
    const monthlyData = anomalies.reduce((acc, anomaly) => {
      const date = new Date(anomaly.createdAt);
      const monthKey = date.toISOString().slice(0, 7); // YYYY-MM format
      acc[monthKey] = (acc[monthKey] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Get last 6 months
    const months = [];
    const data = [];
    for (let i = 5; i >= 0; i--) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      const monthKey = date.toISOString().slice(0, 7);
      const monthLabel = date.toLocaleDateString("en-US", { month: "short" });
      months.push(monthLabel);
      data.push(monthlyData[monthKey] || 0);
    }

    const ctx = chartRef.current.getContext("2d");
    if (!ctx) return;

    chartInstanceRef.current = new Chart(ctx, {
      type: "line",
      data: {
        labels: months,
        datasets: [
          {
            label: "Detected Anomalies",
            data: data,
            borderColor: "#1565C0",
            backgroundColor: "rgba(21, 101, 192, 0.1)",
            tension: 0.4,
            fill: true,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false,
          },
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              stepSize: 1,
            },
          },
          x: {
            grid: {
              display: false,
            },
          },
        },
        elements: {
          point: {
            radius: 4,
            hoverRadius: 6,
          },
        },
      },
    });

    return () => {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
      }
    };
  }, [anomalies]);

  return (
    <div className="relative h-64">
      <canvas ref={chartRef} />
    </div>
  );
}
