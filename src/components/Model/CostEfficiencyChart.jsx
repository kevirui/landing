import React, { useState } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

const data = [
  {
    name: '2025',
    fondos: 2000,
    ongs: 500,
    fee: 300,
  },
  {
    name: '2026',
    fondos: 4000,
    ongs: 800,
    fee: 250,
  },
  {
    name: '2027',
    fondos: 8000,
    ongs: 1500,
    fee: 200,
  },
];

const CostEfficiencyChart = ({ labels }) => {
  // Check if we're in the browser (client-side) during initialization
  // This avoids the cascading render issue from using useEffect + setState
  const [isMounted] = useState(() => typeof window !== 'undefined');

  if (!isMounted) {
    return <div style={{ width: '100%', height: '100%' }} />;
  }

  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart
        data={data}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid
          strokeDasharray="3 3"
          vertical={false}
          stroke="#ffffff30"
        />
        <XAxis
          dataKey="name"
          axisLine={false}
          tickLine={false}
          tick={{ fill: 'white', fontSize: 16 }}
          dy={10}
        />
        <YAxis hide={true} />
        <Tooltip
          contentStyle={{
            backgroundColor: '#1E1E1E',
            border: 'none',
            borderRadius: '8px',
            color: 'white',
          }}
          itemStyle={{ color: 'white' }}
        />
        {/* Fondos - Green */}
        <Line
          type="monotone"
          dataKey="fondos"
          stroke="#90EE90"
          strokeWidth={3}
          dot={false}
          activeDot={{ r: 8 }}
        />
        {/* ONGs - Orange */}
        <Line
          type="monotone"
          dataKey="ongs"
          stroke="#FFA500"
          strokeWidth={3}
          dot={false}
        />
        {/* Fee - Red/Pink */}
        <Line
          type="monotone"
          dataKey="fee"
          stroke="#FF69B4"
          strokeWidth={3}
          dot={false}
        />

        {/* Custom Labels at the end of lines */}
        <text x="95%" y="25%" fill="#90EE90" fontSize="16" textAnchor="start">
          {labels.fondos}
        </text>
        <text x="95%" y="65%" fill="#FFA500" fontSize="16" textAnchor="start">
          {labels.ongs}
        </text>
        <text x="95%" y="80%" fill="#FF69B4" fontSize="16" textAnchor="start">
          {labels.fee}
        </text>
      </LineChart>
    </ResponsiveContainer>
  );
};

export default CostEfficiencyChart;
