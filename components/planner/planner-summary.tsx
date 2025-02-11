import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { PlannerSummaryProps } from "@/lib/types"

export function PlannerSummary({ data, activities }: PlannerSummaryProps) {
  const totalHours = Object.values(data).reduce((sum, value) => sum + value, 0)
  const mostFrequentCategory = Object.entries(data).reduce((a, b) => (a[1] > b[1] ? a : b))[0]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Planner Summary</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <p>
            <strong>Total Planned Hours:</strong> {totalHours}
          </p>
          <p>
            <strong>Most Frequent Category:</strong> {mostFrequentCategory}
          </p>
          <p>
            <strong>Total Activities:</strong>{" "}
            {Object.values(activities).reduce((sum, category) => sum + category.length, 0)}
          </p>
          <p>
            <strong>Productivity Score:</strong>{" "}
            {((data.HLV * 4 + data.HDV * 3 + data.LDV * 2 + data.ZV * 1) / totalHours).toFixed(2)} / 4
          </p>
        </div>
      </CardContent>
    </Card>
  )
}

