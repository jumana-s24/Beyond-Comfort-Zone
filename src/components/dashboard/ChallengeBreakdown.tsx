import React from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

export interface ChallengeBreakdownProps {
  data: {
    name: string;
    value: number;
  }[];
}

const ChallengeBreakdown: React.FC<ChallengeBreakdownProps> = ({ data }) => {
  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"]; // For pie chart

  return (
    <div className="mt-10 bg-white shadow-md rounded-md p-6 border border-gray-100">
      <h3 className="text-3xl text-center font-bold mb-4 animate-fadeIn">
        Challenge Breakdown
      </h3>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            outerRadius={100}
            fill="#8884d8"
            dataKey="value"
          >
            {data.map((_entry, index: number) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ChallengeBreakdown;
