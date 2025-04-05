
import React from 'react';
import { LocationDataPoint } from '@/services/analytics/useAnalyticsData';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import ChartCard from './ChartCard';

interface LocationChartProps {
  data: LocationDataPoint[];
}

const LocationChart: React.FC<LocationChartProps> = ({ data }) => {
  const isEmpty = !data || data.length === 0;
  
  // Sort and limit data to top locations
  const processedData = [...data]
    .sort((a, b) => b.count - a.count)
    .slice(0, 7);
  
  return (
    <ChartCard 
      title="Traffic by Location" 
      description="Where your visitors are from"
      isEmpty={isEmpty}
    >
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={processedData}
          layout="vertical"
          margin={{ top: 5, right: 30, left: 60, bottom: 5 }}
        >
          <XAxis type="number" />
          <YAxis 
            dataKey="location" 
            type="category" 
            width={70}
            tickFormatter={(value) => value.length > 10 ? `${value.substring(0, 10)}...` : value}
          />
          <Tooltip 
            formatter={(value) => [`${value} visits`, 'Visits']}
            labelFormatter={(label) => `Location: ${label}`}
          />
          <Bar 
            dataKey="count" 
            fill="#2767FF" 
            radius={[0, 4, 4, 0]}
            animationDuration={1500}
          />
        </BarChart>
      </ResponsiveContainer>
    </ChartCard>
  );
};

export default LocationChart;
