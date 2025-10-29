'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from '@/components/ui/chart';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';
import type { ChartConfig } from '@/components/ui/chart';

// Mock data for demonstration
const chartData = [
  { date: '2024-01-01', weight: 80, mood: 7 },
  { date: '2024-01-15', weight: 79, mood: 8 },
  { date: '2024-02-01', weight: 78.5, mood: 6 },
  { date: '2024-02-15', weight: 78, mood: 7 },
  { date: '2024-03-01', weight: 77, mood: 9 },
  { date: '2024-03-15', weight: 76.5, mood: 8 },
];

const chartConfig = {
  weight: {
    label: 'Weight (kg)',
    color: 'hsl(var(--chart-1))',
  },
  mood: {
    label: 'Mood (1-10)',
    color: 'hsl(var(--chart-2))',
  }
} satisfies ChartConfig;

export default function ProgressChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Weight & Mood Trend</CardTitle>
        <CardDescription>Your weight and mood progression over time (mock data).</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={chartData}
              margin={{
                top: 5,
                right: 10,
                left: -20, // Adjusted for YAxis labels
                bottom: 0,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border)/0.5)" />
              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              />
              <YAxis 
                yAxisId="left"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                domain={['dataMin - 2', 'dataMax + 2']}
                tickFormatter={(value) => `${value}kg`}
              />
               <YAxis 
                yAxisId="right"
                orientation="right"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                domain={[0, 10]}
              />
              <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="line" />} />
              <ChartLegend content={<ChartLegendContent />} />
              <Line
                yAxisId="left"
                dataKey="weight"
                type="monotone"
                stroke="var(--color-weight)"
                strokeWidth={2}
                dot={{
                  fill: "var(--color-weight)",
                  r: 4,
                }}
                activeDot={{
                  r: 6,
                }}
              />
              <Line
                yAxisId="right"
                dataKey="mood"
                type="monotone"
                stroke="var(--color-mood)"
                strokeWidth={2}
                dot={{
                  fill: "var(--color-mood)",
                  r: 4,
                }}
                activeDot={{
                  r: 6,
                }}
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
