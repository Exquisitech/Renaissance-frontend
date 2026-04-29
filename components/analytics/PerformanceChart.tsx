'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select } from '@/components/ui/select';
import { useState } from 'react';

interface PerformanceChartProps {
  data: {
    date: string;
    value: number;
    profit: number;
  }[];
}

export default function PerformanceChart({ data }: PerformanceChartProps) {
  const [timeRange, setTimeRange] = useState<string>('30d');

  const filteredData = data.slice(-getTimeRangeDays(timeRange));

  const maxValue = Math.max(...filteredData.map(d => d.value));
  const minValue = Math.min(...filteredData.map(d => d.value));
  const range = maxValue - minValue || 1;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Performance Over Time</CardTitle>
        <Select 
          value={timeRange} 
          onValueChange={setTimeRange}
          options={[
            { value: '7d', label: 'Last 7 days' },
            { value: '30d', label: 'Last 30 days' },
            { value: '90d', label: 'Last 90 days' },
            { value: '1y', label: 'Last year' },
            { value: 'all', label: 'All time' },
          ]}
          placeholder="Select time range"
          className="w-[180px]"
        />
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full">
          <div className="relative h-full w-full">
            {/* Simple bar chart visualization */}
            <div className="flex h-full items-end gap-1">
              {filteredData.map((point, index) => {
                const height = ((point.value - minValue) / range) * 100;
                const isProfit = point.profit >= 0;
                
                return (
                  <div
                    key={index}
                    className="flex-1 group relative"
                    title={`${point.date}: $${point.value.toLocaleString()}`}
                  >
                    <div
                      className={`w-full rounded-t transition-all hover:opacity-80 ${
                        isProfit ? 'bg-green-500' : 'bg-red-500'
                      }`}
                      style={{ height: `${Math.max(height, 2)}%` }}
                    />
                    {/* Tooltip */}
                    <div className="absolute bottom-full left-1/2 mb-2 hidden -translate-x-1/2 rounded bg-black px-2 py-1 text-xs text-white whitespace-nowrap group-hover:block">
                      <p>{point.date}</p>
                      <p>Value: ${point.value.toLocaleString()}</p>
                      <p>P&L: {isProfit ? '+' : ''}${point.profit.toLocaleString()}</p>
                    </div>
                  </div>
                );
              })}
            </div>
            
            {/* Y-axis labels */}
            <div className="absolute left-0 top-0 flex h-full flex-col justify-between text-xs text-muted-foreground">
              <span>${maxValue.toLocaleString()}</span>
              <span>${((maxValue + minValue) / 2).toLocaleString()}</span>
              <span>${minValue.toLocaleString()}</span>
            </div>
          </div>
        </div>
        
        <div className="mt-4 flex justify-between text-xs text-muted-foreground">
          <span>{filteredData[0]?.date}</span>
          <span>{filteredData[filteredData.length - 1]?.date}</span>
        </div>
      </CardContent>
    </Card>
  );
}

function getTimeRangeDays(range: string): number {
  switch (range) {
    case '7d':
      return 7;
    case '30d':
      return 30;
    case '90d':
      return 90;
    case '1y':
      return 365;
    case 'all':
      return 9999;
    default:
      return 30;
  }
}
