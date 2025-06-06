import { useEffect, useRef } from "react";
import Chart from "chart.js/auto";

interface RiskDistributionChartProps {
  anomalies: any[];
}

export function RiskDistributionChart({ anomalies }: RiskDistributionChartProps) {
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstanceRef = useRef<Chart | null>(null);

  useEffect(() => {
    if (!chartRef.current) return;

    // Destroy existing chart instance
    if (chartInstanceRef.current) {
      chartInstanceRef.current.destroy();
    }

    // Categorize anomalies by risk score
    const riskCategories = anomalies.reduce(
      (acc, anomaly) => {
        const score = anomaly.riskScore;
        if (score >= 80) {
          acc.high++;
        } else if (score >= 60) {
          acc.medium++;
        } else {
          acc.low++;
        }
        return acc;
      },
      { high: 0, medium: 0, low: 0 }
    );

    const ctx = chartRef.current.getContext("2d");
    if (!ctx) return;

    chartInstanceRef.current = new Chart(ctx, {
      type: "doughnut",
      data: {
        labels: ["High Risk", "Medium Risk", "Low Risk"],
        datasets: [
          {
            data: [riskCategories.high, riskCategories.medium, riskCategories.low],
            backgroundColor: ["#E53935", "#FB8C00", "#43A047"],
            borderWidth: 0,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: "bottom",
            labels: {
              padding: 20,
              usePointStyle: true,
            },
          },
        },
        cutout: "60%",
      },
    });

    return () => {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
      }
    };
  }, [anomalies]);

  if (anomalies.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center text-gray-500">
        <div className="text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full mx-auto mb-4 flex items-center justify-center">
            <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3zm11.707 4.707a1 1 0 00-1.414-1.414L10 9.586 8.707 8.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
          </div>
          <p className="text-sm">No risk data available</p>
          <p className="text-xs mt-1">Upload anomaly data to see distribution</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative h-64">
      <canvas ref={chartRef} />
    </div>
  );
}
