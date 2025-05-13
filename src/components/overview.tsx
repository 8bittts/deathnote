"use client";

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts";

const data = [
  {
    name: "Jan",
    total: 4,
  },
  {
    name: "Feb",
    total: 3,
  },
  {
    name: "Mar",
    total: 2,
  },
  {
    name: "Apr",
    total: 4,
  },
  {
    name: "May",
    total: 3,
  },
  {
    name: "Jun",
    total: 2,
  },
  {
    name: "Jul",
    total: 4,
  },
  {
    name: "Aug",
    total: 3,
  },
  {
    name: "Sep",
    total: 2,
  },
  {
    name: "Oct",
    total: 4,
  },
  {
    name: "Nov",
    total: 3,
  },
  {
    name: "Dec",
    total: 5,
  },
];

export function Overview() {
  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={data}>
        <XAxis
          dataKey="name"
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value: number) => `${value}`}
        />
        <Bar
          dataKey="total"
          fill="currentColor"
          radius={[4, 4, 0, 0]}
          className="fill-primary"
        />
      </BarChart>
    </ResponsiveContainer>
  );
} 