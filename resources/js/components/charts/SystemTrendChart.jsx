import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

export default function SystemTrendChart() {
  const data = [
    { year: "2021", score: 74 },
    { year: "2022", score: 76 },
    { year: "2023", score: 79 },
    { year: "2024", score: 82 },
    { year: "2025", score: 85 },
  ];

  return (
    <ResponsiveContainer width="100%" height={260}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
        <XAxis dataKey="year" stroke="#64748B" />
        <YAxis stroke="#64748B" />
        <Tooltip />
        <Line
          type="monotone"
          dataKey="score"
          stroke="#1E40AF"
          strokeWidth={3}
          dot={{ r: 5 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
