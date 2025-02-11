'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table';
import dynamic from 'next/dynamic';
import  { ChartData } from '@/lib/types';
import type {  ProductivityChartProps } from '@/lib/types';

const DynamicPieChart = dynamic(
  () => import('./dynamic-pie-chart').then((mod) => mod.DynamicPieChart),
  {
    loading: () => <p>Loading chart...</p>,
    ssr: false,
  }
);

export function ProductivityChart({ data }: ProductivityChartProps) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const productivityChartData: ChartData[] = [
    { name: 'HLV', value: data.HLV, color: '#16a34a' },
    { name: 'HDV', value: data.HDV, color: '#2563eb' },
    { name: 'LDV', value: data.LDV, color: '#38bdf8' },
    { name: 'ZV', value: data.ZV, color: '#f97316' },
  ];

  const totalHours  = (Object.values(data) as number[]).reduce((sum, value) => sum + value, 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Week Productivity</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[250x] mb-3">
          {isMounted && <DynamicPieChart data={productivityChartData} />}
        </div>
        <Table>
          <TableBody>
            {productivityChartData.map((item) => (
              <TableRow key={item.name}>
                <TableCell
                  className="font-medium"
                  style={{ color: item.color }}
                >
                  {item.name === 'HLV' && 'HIGH LIFE TIME'}
                  {item.name === 'HDV' && 'HIGH DOLLAR'}
                  {item.name === 'LDV' && 'LOW DOLLAR'}
                  {item.name === 'ZV' && 'ZERO DOLLAR'}
                </TableCell>
                <TableCell className="text-right">
                  {Math.round(item.value)} hours (
                  {Math.round((item.value / totalHours ) * 100)}%)
                </TableCell>
              </TableRow>
            ))}
            <TableRow>
              <TableCell className="font-bold">Total Hours</TableCell>
              <TableCell className="text-right font-bold">
                {totalHours }
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
