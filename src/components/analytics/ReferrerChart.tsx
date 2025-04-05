
import React from 'react';
import { ReferrerDataPoint } from '@/services/analytics/useAnalyticsData';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import ChartCard from './ChartCard';

interface ReferrerChartProps {
  data: ReferrerDataPoint[];
}

const ReferrerChart: React.FC<ReferrerChartProps> = ({ data }) => {
  const isEmpty = !data || data.length === 0;
  
  // Sort and limit data to the top 5-7 referrers for clarity
  const processedData = [...data]
    .sort((a, b) => b.count - a.count)
    .slice(0, 7);
  
  return (
    <ChartCard 
      title="Traffic by Referrer" 
      description="Where your traffic is coming from" 
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
    </ChartCard>
  );
};

export default ReferrerChart;
