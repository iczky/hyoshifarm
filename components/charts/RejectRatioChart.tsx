import React from "react";
import {
  Line,
  LineChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { PackingRecord } from "@/types/PackingRecord";

interface RejectRatioChartProps {
  records: PackingRecord[];
}

const RejectRatioChart: React.FC<RejectRatioChartProps> = ({ records }) => {
  const calculateRejectRatios = (records: PackingRecord[]) => {
    const hourMap = new Map();
    let dailyReject = 0;
    let dailyBerat = 0;

    records.forEach((record) => {
      if (!record.timestamp) return;

      const hour = new Date(record.timestamp).getHours().toString();

      // Per hour calculations
      if (!hourMap.has(hour)) {
        hourMap.set(hour, {
          name: hour,
          rejectKg: 0,
          beratKg: 0,
        });
      }

      const hourData = hourMap.get(hour);
      hourData.rejectKg += record.reject_kg;
      hourData.beratKg += record.berat_kotor;

      // Daily totals
      dailyReject += record.reject_kg;
      dailyBerat += record.berat_kotor;
    });

    // Calculate ratios
    const hourlyData = Array.from(hourMap.values())
      .map(({ name, rejectKg, beratKg }) => ({
        name,
        "Hourly Ratio":
          beratKg > 0 ? parseFloat(((rejectKg / beratKg) * 100).toFixed(2)) : 0,
        "Daily Ratio":
          dailyBerat > 0
            ? parseFloat(((dailyReject / dailyBerat) * 100).toFixed(2))
            : 0,
      }))
      .sort((a, b) => parseInt(a.name) - parseInt(b.name));

    return hourlyData;
  };

  const data = calculateRejectRatios(records);

  if (!records?.length) {
    return <div>No data available</div>;
  }

  return (
    <ResponsiveContainer width="100%" height="90%">
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis
          dataKey="name"
          tickFormatter={(value) => `${value.padStart(2, "0")}:00`}
        />
        <YAxis unit="%" />
        <Tooltip
          formatter={(value: number, name: string) => [`${value}%`, name]}
          labelFormatter={(label) => `Hour: ${label.padStart(2, "0")}:00`}
        />
        <Legend />
        <Line
          type="monotone"
          dataKey="Hourly Ratio"
          stroke="#8884d8"
          activeDot={{ r: 8 }}
        />
        <Line
          type="monotone"
          dataKey="Daily Ratio"
          stroke="#82ca9d"
          activeDot={{ r: 8 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default RejectRatioChart;
