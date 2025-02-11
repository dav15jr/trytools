'use client';

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { DynamicLineChart } from './dynamic-line-chart';
import { ProgressData } from '@/types';

interface ProgressSectionProps {
  progressData: ProgressData[];
}

export function ProgressSection({ progressData }: ProgressSectionProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Progress</CardTitle>
      </CardHeader>
      <CardContent className="w-full">
        <div className="w-full">
          <DynamicLineChart data={progressData} />
        </div>
      </CardContent>
    </Card>
  );
}
