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

interface ProductivityChartProps {
  records: PackingRecord[];
}

const ProductivityChart: React.FC<ProductivityChartProps> = ({ records }) => {
  const calculateProductivity = (records: PackingRecord[]) => {
    const picMap = new Map();

    records.forEach((record) => {
      if (!record.pic?.name) return;

      const picName = record.pic.name;
      const totalQty =
        record.qty_pack_a + record.qty_pack_b + record.qty_pack_c;

      if (!picMap.has(picName)) {
        picMap.set(picName, {
          name: picName,
          perHour: 0,
          perDay: 0,
          totalQty: 0,
          hours: new Set(),
        });
      }

      const picData = picMap.get(picName);
      picData.totalQty += totalQty;
      picData.hours.add(new Date(record.timestamp).getHours);
    });

    return Array.from(picMap.values()).map(({ name, totalQty, hours }) => ({
      name,
      "Per Hour (units/min)": parseFloat(
        (totalQty / (hours.size * 60)).toFixed(2)
      ),
      "Per Day (units/min)": parseFloat((totalQty / 600).toFixed(2)),
    }));
  };

  const data = calculateProductivity(records);
  console.log("data productivity", data);

  if (!records?.length) {
    return <div>No data available</div>;
  }

  return (
    <ResponsiveContainer width="100%" height="90%">
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line
          type="monotone"
          dataKey="Per Hour (units/min)"
          stroke="#8884d8"
          activeDot={{ r: 8 }}
        />
        <Line
          type="monotone"
          dataKey="Per Day (units/min)"
          stroke="#82ca9d"
          activeDot={{ r: 8 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default ProductivityChart;
