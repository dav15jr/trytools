import { Pie } from "react-chartjs-2"
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js"
import type { ChartData } from "@/types"

ChartJS.register(ArcElement, Tooltip, Legend)

interface DynamicPieChartProps {
  data: ChartData[]
}

export function DynamicPieChart({ data }: DynamicPieChartProps) {
  const chartData = {
    labels: data.map((item) => item.name),
    datasets: [
      {
        data: data.map((item) => item.value),
        backgroundColor: data.map((item) => item.color),
        borderColor: data.map((item) => item.color),
        borderWidth: 1,
      },
    ],
  }

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: (context: any) => {
            const label = context.label || ""
            const value = context.parsed || 0
            const total = context.dataset.data.reduce((a: number, b: number) => a + b, 0)
            const percentage = ((value / total) * 100).toFixed(0)
            return `${label}: ${value} (${percentage}%)`
          },
        },
      },
    },
  }

  return <Pie data={chartData} options={options} />
}

