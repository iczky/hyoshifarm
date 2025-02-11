import {
  RadialBarChart,
  RadialBar,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface GaugeChartProps {
  value: number; // Now ensures it's a number
}

export const GaugeChart = ({ value }: GaugeChartProps) => {
  const data = [{ name: "Reject Ratio", uv: value }];
  return (
    <ResponsiveContainer width="100%" height={300}>
      <RadialBarChart
        cx="50%"
        cy="50%"
        innerRadius="40%"
        outerRadius="80%"
        data={data}>
        <RadialBar label background dataKey="uv" />
        <Tooltip />
      </RadialBarChart>
    </ResponsiveContainer>
  );
};
