
import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import ChartCard from './ChartCard';

// Update the interface to support both formats
export interface DeviceDataPoint {
  device: string;
  count: number;
  percentage?: number;
  device_type?: string; // Support for backward compatibility
}

interface DeviceChartProps {
  data: DeviceDataPoint[];
  loading?: boolean;
}

const COLORS = ['#2767FF', '#8B5CF6', '#D946EF', '#10B981', '#F59E0B', '#EF4444', '#6B7280'];

const DeviceChart: React.FC<DeviceChartProps> = ({ data, loading }) => {
  const isEmpty = !data || data.length === 0;
  
  // Transform data to ensure it has the correct format
  const transformedData = data.map(item => ({
    device: item.device || item.device_type || 'Unknown',
    count: item.count || 0,
    percentage: item.percentage || 0
  }));
  
  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie
          data={transformedData}
          cx="50%"
          cy="50%"
          outerRadius={80}
          innerRadius={40}
          dataKey="count"
          nameKey="device"
          label={({device, count}) => `${device}: ${count}`}
          animationDuration={1000}
          animationBegin={200}
        >
          {transformedData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip 
          formatter={(value, name, props) => [`${value} (${props.payload.percentage || 0}%)`, props.payload.device]}
        />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
};

export default DeviceChart;
