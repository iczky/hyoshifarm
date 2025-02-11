import React from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { PackingRecord } from "@/types/PackingRecord";

interface QtyPerPackChartProps {
  records: PackingRecord[];
}

const QtyPerPackChart: React.FC<QtyPerPackChartProps> = ({ records }) => {
  const calculateQtyPerPackPerHour = (records: PackingRecord[]) => {
    const hourMap = new Map();

    records.forEach((record) => {
      if (!record.timestamp) return;

      const hour = new Date(record.timestamp).getHours().toString();

      if (!hourMap.has(hour)) {
        hourMap.set(hour, {
          name: hour,
          "Pack A": 0,
          "Pack B": 0,
          "Pack C": 0,
        });
      }

      const hourData = hourMap.get(hour);
      hourData["Pack A"] += record.qty_pack_a;
      hourData["Pack B"] += record.qty_pack_b;
      hourData["Pack C"] += record.qty_pack_c;
    });

    return Array.from(hourMap.values()).sort(
      (a, b) => parseInt(a.name) - parseInt(b.name)
    );
  };

  const data = calculateQtyPerPackPerHour(records);

  if (!records?.length) {
    return <div>No data available</div>;
  }

  return (
    <ResponsiveContainer width="100%" height="90%">
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis
          dataKey="name"
          tickFormatter={(value) => `${value.padStart(2, "0")}:00`}
        />
        <YAxis />
        <Tooltip
          formatter={(value: number) => [`${value} units`, ""]}
          labelFormatter={(label) => `Hour: ${label.padStart(2, "0")}:00`}
        />
        <Legend />
        <Bar dataKey="Pack A" fill="#8884d8" />
        <Bar dataKey="Pack B" fill="#82ca9d" />
        <Bar dataKey="Pack C" fill="#ffc658" />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default QtyPerPackChart;
