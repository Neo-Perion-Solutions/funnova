import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const StudentsByGradeChart = ({ data = {} }) => {
  const safeData = data || {};
  const chartData = [
    { name: 'Grade 3', count: safeData['3'] || 0, color: '#0EA5E9' },
    { name: 'Grade 4', count: safeData['4'] || 0, color: '#14B8A6' },
    { name: 'Grade 5', count: safeData['5'] || 0, color: '#F43F5E' },
  ];

  return (
    <div className="flex h-full min-h-[380px] flex-col rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
      <h3 className="mb-5 flex items-center gap-2 text-base font-semibold text-gray-950">
        <span className="h-5 w-1 rounded-full bg-sky-500" />
        Students by Grade
      </h3>
      
      <div className="min-h-[300px] w-full flex-1">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
            <XAxis 
              dataKey="name" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#9CA3AF', fontSize: 12, fontWeight: 500 }}
              dy={10}
            />
            <YAxis 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#9CA3AF', fontSize: 11 }}
              allowDecimals={false}
            />
            <Tooltip 
              cursor={{ fill: '#F9FAFB' }}
              contentStyle={{ 
                borderRadius: '8px', 
                border: '1px solid #E5E7EB', 
                boxShadow: '0 8px 18px rgba(15, 23, 42, 0.08)',
                padding: '12px'
              }}
            />
            <Bar 
              dataKey="count" 
              radius={[6, 6, 0, 0]} 
              barSize={40}
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default StudentsByGradeChart;
