import type React from "react"
import { Line } from "react-chartjs-2"
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js"
import type { DynamicLineChartProps } from "@/lib/types"

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend)


export function DynamicLineChart({ data }: DynamicLineChartProps) {
  const chartData = {
    labels: data.map((item) => item.date),
    datasets: [
      {
        label: "Total Score",
        data: data.map((item) => item.totalScore),
        borderColor: "rgb(75, 192, 192)",
        tension: 0.1,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: false,
        text: "Your Progress Over Time",
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
      },
    },
  }

  return (
    <div className="w-full h-[400px]">
      <Line 
        data={chartData} 
        options={{
          ...options,
          maintainAspectRatio: false
        }} 
      />
    </div>
  );
}

