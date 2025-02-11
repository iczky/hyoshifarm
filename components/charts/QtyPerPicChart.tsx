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

interface QtyPerPicChartProps {
  records: PackingRecord[];
}

const QtyPerPicChart: React.FC<QtyPerPicChartProps> = ({ records }) => {
  const calculateQtyPerPicPerHour = (records: PackingRecord[]) => {
    const hourMap = new Map();

    records.forEach((record) => {
      if (!record.timestamp || !record.pic?.name) {
        return;
      }

      const hour = new Date(record.timestamp).getHours().toString();
      const totalQty =
        record.qty_pack_a + record.qty_pack_b + record.qty_pack_c;
      const picName = record.pic.name;

      if (!hourMap.has(hour)) {
        hourMap.set(hour, {
          name: hour,
          Andri: 0,
          Indra: 0,
          Indri: 0,
        });
      }

      const hourData = hourMap.get(hour);
      if (picName in hourData) {
        hourData[picName] += totalQty;
      }
    });

    return Array.from(hourMap.values()).sort(
      (a, b) => parseInt(a.name) - parseInt(b.name)
    );
  };

  const data = calculateQtyPerPicPerHour(records);

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
        <Bar dataKey="Andri" fill="#8884d8" />
        <Bar dataKey="Indra" fill="#82ca9d" />
        <Bar dataKey="Indri" fill="#ffc658" />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default QtyPerPicChart;
