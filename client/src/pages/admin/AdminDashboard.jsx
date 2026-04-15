import React, { useEffect, useState } from 'react';
import api from '../../lib/axios';
import { useAuth } from '../../context/AuthContext';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get('/admin/stats');
        setStats(res.data);
      } catch (err) {
        console.error('Failed to fetch stats:', err);
      }
    };
    fetchStats();
  }, []);

  if (!stats) return <div className="p-8">Loading stats...</div>;

  const chartData = [
    { name: 'Grade 3', students: stats.students_by_grade['3'] || 0 },
    { name: 'Grade 4', students: stats.students_by_grade['4'] || 0 },
    { name: 'Grade 5', students: stats.students_by_grade['5'] || 0 }
  ];

  return (
    <div className="space-y-6">
      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard title="Total Students" value={stats.total_students} color="bg-blue-500" />
        <StatCard title="Total Lessons" value={stats.total_lessons} color="bg-indigo-500" />
        <StatCard title="Active Games" value={stats.active_games} color="bg-green-500" />
        <StatCard title="Lessons With Questions" value={stats.lessons_with_questions} color="bg-purple-500" />
        <StatCard title="Total Completions" value={stats.total_completions} color="bg-yellow-500" />
        <StatCard title="Avg Score" value={`${stats.avg_score_pct.toFixed(1)}%`} color="bg-red-500" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold text-gray-700 mb-4">Students by Grade</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <XAxis dataKey="name" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="students" fill="#3B82F6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Most Completed Lessons */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold text-gray-700 mb-4">Most Completed Lessons</h3>
          <ul className="space-y-3">
            {stats.most_completed_lessons.length === 0 ? (
              <li className="text-gray-500">No data found.</li>
            ) : (
              stats.most_completed_lessons.map((lesson, idx) => (
                <li key={idx} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="font-medium text-gray-800">{lesson.title}</span>
                  <span className="font-bold text-blue-600 bg-blue-100 px-3 py-1 rounded-full text-sm">
                    {lesson.completions}
                  </span>
                </li>
              ))
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};

// Helper component
const StatCard = ({ title, value, color }) => (
  <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center space-x-4">
    <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white ${color}`}>
      <span className="font-bold text-xl">{value}</span>
    </div>
    <div>
      <p className="text-gray-500 text-sm font-medium">{title}</p>
      <h4 className="text-2xl font-bold text-gray-800">{value}</h4>
    </div>
  </div>
);

export default AdminDashboard;
