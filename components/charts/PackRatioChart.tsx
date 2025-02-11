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
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { PackingRecord } from "@/types/PackingRecord";

interface PackRatioChartProps {
  records: PackingRecord[];
}

const PackRatioChart: React.FC<PackRatioChartProps> = ({ records }) => {
  const calculatePackRatios = (records: PackingRecord[]) => {
    const hourMap = new Map();
    let dailyA = 0,
      dailyB = 0,
      dailyC = 0;

    records.forEach((record) => {
      if (!record.timestamp) return;

      const hour = new Date(record.timestamp).getHours().toString();

      // Per hour calculations
      if (!hourMap.has(hour)) {
        hourMap.set(hour, {
          name: hour,
          packA: 0,
          packB: 0,
          packC: 0,
        });
      }

      const hourData = hourMap.get(hour);
      hourData.packA += record.qty_pack_a;
      hourData.packB += record.qty_pack_b;
      hourData.packC += record.qty_pack_c;

      // Daily totals
      dailyA += record.qty_pack_a;
      dailyB += record.qty_pack_b;
      dailyC += record.qty_pack_c;
    });

    const dailyTotal = dailyA + dailyB + dailyC;

    // Calculate ratios
    return Array.from(hourMap.values())
      .map(({ name, packA, packB, packC }) => {
        const hourlyTotal = packA + packB + packC;
        return {
          name,
          "Pack A Hourly":
            hourlyTotal > 0
              ? parseFloat(((packA / hourlyTotal) * 100).toFixed(2))
              : 0,
          "Pack B Hourly":
            hourlyTotal > 0
              ? parseFloat(((packB / hourlyTotal) * 100).toFixed(2))
              : 0,
          "Pack C Hourly":
            hourlyTotal > 0
              ? parseFloat(((packC / hourlyTotal) * 100).toFixed(2))
              : 0,
          "Pack A Daily":
            dailyTotal > 0
              ? parseFloat(((dailyA / dailyTotal) * 100).toFixed(2))
              : 0,
          "Pack B Daily":
            dailyTotal > 0
              ? parseFloat(((dailyB / dailyTotal) * 100).toFixed(2))
              : 0,
          "Pack C Daily":
            dailyTotal > 0
              ? parseFloat(((dailyC / dailyTotal) * 100).toFixed(2))
              : 0,
        };
      })
      .sort((a, b) => parseInt(a.name) - parseInt(b.name));
  };

  const data = calculatePackRatios(records);
  const pieData = [
    { name: "Pack A", value: data.length > 0 ? data[0]["Pack A Daily"] : 0 },
    { name: "Pack B", value: data.length > 0 ? data[0]["Pack B Daily"] : 0 },
    { name: "Pack C", value: data.length > 0 ? data[0]["Pack C Daily"] : 0 },
  ];

  // Colors for the pie chart
  const COLORS = ["#8884d8", "#82ca9d", "#ffc658"];

  if (!records?.length) {
    return <div>No data available</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Hourly Ratios Chart */}
      <div className="border rounded-lg p-4 pb-10 h-[300px]">
        <h2 className="text-lg font-semibold mb-2">Pack Ratios per Hour</h2>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="name"
              tickFormatter={(value) => `${value.padStart(2, "0")}:00`}
            />
            <YAxis unit="%" />
            <Tooltip
              formatter={(value: number) => [`${value}%`, ""]}
              labelFormatter={(label) => `Hour: ${label.padStart(2, "0")}:00`}
            />
            <Legend />
            <Line type="monotone" dataKey="Pack A Hourly" stroke="#8884d8" />
            <Line type="monotone" dataKey="Pack B Hourly" stroke="#82ca9d" />
            <Line type="monotone" dataKey="Pack C Hourly" stroke="#ffc658" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Daily Ratios Card Dashboard */}
      <div className="border rounded-lg p-4 pb-10 h-[300px]">
        <h2 className="text-lg font-semibold mb-2">Daily Pack Ratios</h2>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={pieData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              fill="#8884d8"
              paddingAngle={5}
              dataKey="value"
              label={({ name, percent }) =>
                `${name}: ${(percent * 100).toFixed(2)}%`
              }
              isAnimationActive={true}>
              {pieData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip
              formatter={(value: number) => [`${value}%`, ""]}
              labelFormatter={(label) => `Pack: ${label}`}
            />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default PackRatioChart;
