"use client";

import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { ChartConfig, ChartContainer } from "@/components/ui/chart";

const chartConfig = {
  engagement: {
    label: "Engagement",
    color: "hsl(var(--primary))",
  },
} satisfies ChartConfig;

export function SparklineChart({ data }: { data: number[] }) {
  const chartData = data.map((value, index) => ({
    time: index,
    engagement: value,
  }));

  return (
    <ChartContainer config={chartConfig} className="h-full w-full">
      <ResponsiveContainer>
        <AreaChart
          data={chartData}
          margin={{
            top: 0,
            right: 0,
            left: 0,
            bottom: 0,
          }}
        >
          <defs>
            <linearGradient id="fillEngagement" x1="0" y1="0" x2="0" y2="1">
              <stop
                offset="5%"
                stopColor="var(--color-engagement)"
                stopOpacity={0.8}
              />
              <stop
                offset="95%"
                stopColor="var(--color-engagement)"
                stopOpacity={0.1}
              />
            </linearGradient>
          </defs>
          <Tooltip
            cursor={false}
            contentStyle={{
              display: "none",
            }}
          />
          <XAxis dataKey="time" hide />
          <YAxis domain={["dataMin", "dataMax"]} hide />
          <Area
            dataKey="engagement"
            type="natural"
            fill="url(#fillEngagement)"
            stroke="var(--color-engagement)"
            strokeWidth={2}
            dot={false}
          />
        </AreaChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
}
