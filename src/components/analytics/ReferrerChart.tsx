
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

export interface ReferrerDataPoint {
  referrer: string;
  count: number;
  name?: string;
  value?: number;
}

interface ReferrerChartProps {
  data: ReferrerDataPoint[];
  loading?: boolean;
}

const ReferrerChart: React.FC<ReferrerChartProps> = ({ data, loading }) => {
  const isEmpty = !data || data.length === 0;
  
  if (isEmpty) {
    return (
      <div className="flex items-center justify-center h-full text-gray-500">
        <p>No data available for this chart</p>
      </div>
    );
  }
  
  // Transform data to ensure it has the correct format
  const transformedData = data.map(item => ({
    referrer: item.referrer || item.name || 'Unknown',
    count: item.count || item.value || 0
  }));
  
  // Sort and limit data to the top 5-7 referrers for clarity
  const processedData = [...transformedData]
    .sort((a, b) => b.count - a.count)
    .slice(0, 7);
  
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        data={processedData}
        layout="vertical"
        margin={{ top: 5, right: 30, left: 60, bottom: 5 }}
      >
        <XAxis type="number" />
        <YAxis 
          dataKey="referrer" 
          type="category" 
          width={70}
          tickFormatter={(value) => value.length > 10 ? `${value.substring(0, 10)}...` : value}
        />
        <Tooltip 
          formatter={(value) => [`${value} visits`, 'Visits']}
          labelFormatter={(label) => `Referrer: ${label}`}
        />
        <Bar 
          dataKey="count" 
          name="Visits"
          fill="#8B5CF6" 
          radius={[0, 4, 4, 0]}
          animationDuration={1500}
        />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default ReferrerChart;
