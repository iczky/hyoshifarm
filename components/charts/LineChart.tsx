import {
  LineChart as ReLineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface LineChartProps {
  data: {
    pic: string;
    productivityPerHour: number;
    productivityPerDay: number;
  }[];
}

export const LineChart = ({ data }: LineChartProps) => {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <ReLineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="pic" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="productivityPerHour" stroke="#8884d8" />
        <Line type="monotone" dataKey="productivityPerDay" stroke="#82ca9d" />
      </ReLineChart>
    </ResponsiveContainer>
  );
};
