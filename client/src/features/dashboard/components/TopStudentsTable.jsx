import React from 'react';
import { Trophy, Star } from 'lucide-react';
import Badge from '../../../components/ui/Badge';

const TopStudentsTable = ({ students = [] }) => {
  const safeStudents = Array.isArray(students) ? students : [];

  return (
    <div className="flex h-full min-h-[380px] flex-col rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
      <h3 className="mb-5 flex items-center gap-2 text-base font-semibold text-gray-950">
        <span className="h-5 w-1 rounded-full bg-amber-500" />
        Top Performing Students
      </h3>

      <div className="flex-1 overflow-x-auto">
        <table className="w-full text-left">
          <thead className="border-b border-gray-200 text-xs font-semibold uppercase tracking-wide text-gray-500">
            <tr>
              <th className="pb-3 px-2 text-center">Rank</th>
              <th className="pb-3 px-2">Student</th>
              <th className="pb-3 px-2">Grade</th>
              <th className="pb-3 px-2 text-right">Avg Score</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {safeStudents.length === 0 ? (
              <tr>
                <td colSpan="4" className="py-8 text-center text-gray-400 italic text-sm">
                  No participation data yet.
                </td>
              </tr>
            ) : (
              safeStudents.map((student, idx) => (
                <tr key={student.id} className="group transition-colors hover:bg-gray-50">
                  <td className="py-4 px-2 text-center">
                    {idx === 0 ? (
                      <div className="flex justify-center"><Trophy size={18} className="text-yellow-500" /></div>
                    ) : idx === 1 ? (
                      <div className="flex justify-center"><Star size={18} className="text-gray-400" /></div>
                    ) : (
                      <span className="text-sm font-bold text-gray-400">{idx + 1}</span>
                    )}
                  </td>
                  <td className="py-4 px-2">
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-100 text-lg">
                        {student.avatar_url || '👤'}
                      </div>
                      <span className="text-sm font-semibold text-gray-800 transition-colors group-hover:text-gray-950">
                        {student.name}
                      </span>
                    </div>
                  </td>
                  <td className="py-4 px-2">
                    <Badge variant="secondary">G{student.grade}</Badge>
                  </td>
                  <td className="py-4 px-2 text-right">
                    <span className="text-sm font-bold text-gray-900">
                      {parseFloat(student.avg_score || 0).toFixed(1)}%
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TopStudentsTable;
