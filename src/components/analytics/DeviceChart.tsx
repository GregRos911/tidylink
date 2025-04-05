
import React from 'react';
import { DeviceDataPoint } from '@/services/analytics/useAnalyticsData';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import ChartCard from './ChartCard';

interface DeviceChartProps {
  data: DeviceDataPoint[];
}

const COLORS = ['#2767FF', '#8B5CF6', '#D946EF', '#10B981', '#F59E0B', '#EF4444', '#6B7280'];

const DeviceChart: React.FC<DeviceChartProps> = ({ data }) => {
  const isEmpty = !data || data.length === 0;
  
  return (
    <ChartCard 
      title="Traffic by Device" 
      description="Distribution across device types" 
      isEmpty={isEmpty}
    >
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            outerRadius={80}
            innerRadius={40}
            dataKey="count"
            nameKey="device"
            label={({device, percentage}) => `${device}: ${percentage}%`}
            animationDuration={1000}
            animationBegin={200}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip 
            formatter={(value, name, props) => [`${value} (${props.payload.percentage}%)`, props.payload.device]}
          />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </ChartCard>
  );
};

export default DeviceChart;
