'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Category } from '@/lib/types';
import { WheelOfLifeChart } from './wheel-of-life-chart';
import type { ChartSectionProps } from '@/lib/types';

export function ChartSection({
  chartData,
  comparisonChartData,
  totalScore,
  comparisonTotalScore,
  currentDate,
  compareDate,
  compareData,
  categories,
  onRemoveComparison,
}: ChartSectionProps) {
  const renderGoalsList = (categories: Category[]) => (
    <div className="mt-2">
      <ul className="space-y-2">
        {categories.map((category, index) => (
          <li key={index} className="flex items-start">
            <span className="font-medium mr-2">{category.name}:</span>
            <span>{category.goal}</span>
          </li>
        ))}
      </ul>
    </div>
  );

  return (
    <div className="flex flex-col lg:flex-row gap-6">
      <div className="w-full xl:w-full">
        <WheelOfLifeChart
          currentData={chartData.data}
          comparisonData={comparisonChartData}
          labels={chartData.labels}
          currentTotalScore={totalScore}
          comparisonTotalScore={comparisonTotalScore}
          currentDate={currentDate}
          comparisonDate={compareDate}
        />
        {compareData && (
          <div className="mt-4 text-center">
            <Button onClick={onRemoveComparison} variant="outline">
              Remove Comparison
            </Button>
          </div>
        )}
      </div>
      <div className="w-full">
        <Card>
          <CardHeader>
            <CardTitle>Goals</CardTitle>
          </CardHeader>
          <CardContent>
            <h3 className="text-lg font-semibold mb-2">Current Goals</h3>
            {renderGoalsList(categories)}
            {compareData && (
              <>
                <h3 className="text-lg font-semibold mt-6 mb-2">
                  Previous Goals
                </h3>
                {renderGoalsList(compareData)}
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
