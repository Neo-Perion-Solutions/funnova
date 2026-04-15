import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from '../../../lib/axios';
import { useImpersonation } from '../../../context/ImpersonationContext';
import { toast } from 'sonner';
import { Search, Play, Loader } from 'lucide-react';

export const StudentImpersonationPanel = () => {
  const [search, setSearch] = useState('');
  const [gradeFilter, setGradeFilter] = useState('');
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const { isImpersonating, startImpersonation } = useImpersonation();

  // Fetch students list
  const { data: studentsData } = useQuery({
    queryKey: ['students', search, gradeFilter],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      if (gradeFilter) params.append('grade', gradeFilter);

      const res = await axios.get(`/admin/students?${params.toString()}`);
      return res.data.data || [];
    },
  });

  const students = studentsData || [];

  const handleImpersonate = async (studentId) => {
    try {
      setIsLoading(true);
      const res = await axios.post(`/admin/impersonate/${studentId}`);

      if (res.data.success) {
        const { token, impersonatedStudent } = res.data.data;
        startImpersonation(token, impersonatedStudent);
        toast.success(`Now viewing as ${impersonatedStudent.name}`);
        // Navigate to student dashboard
        window.location.href = '/student/dashboard';
      }
    } catch (error) {
      console.error('Impersonation error:', error);
      toast.error(error.response?.data?.message || 'Failed to impersonate student');
    } finally {
      setIsLoading(false);
    }
  };

  if (isImpersonating) {
    return null; // Don't show panel if already impersonating
  }

  return (
    <div className="absolute top-4 right-4 z-50">
      <details className="group">
        <summary className="cursor-pointer p-2 hover:bg-primary/10 rounded-lg transition">
          <Search className="w-5 h-5 text-primary" />
        </summary>
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl border border-border p-4">
          <h3 className="font-semibold text-lg mb-3">Impersonate Student</h3>

          {/* Search Input */}
          <input
            type="text"
            placeholder="Search by name or ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full px-3 py-2 border border-border rounded-lg mb-3 focus:outline-none focus:ring-2 focus:ring-primary"
          />

          {/* Grade Filter */}
          <select
            value={gradeFilter}
            onChange={(e) => setGradeFilter(e.target.value)}
            className="w-full px-3 py-2 border border-border rounded-lg mb-3 focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="">All Grades</option>
            <option value="Grade 1">Grade 1</option>
            <option value="Grade 2">Grade 2</option>
            <option value="Grade 3">Grade 3</option>
            <option value="Grade 4">Grade 4</option>
            <option value="Grade 5">Grade 5</option>
            <option value="Grade 6">Grade 6</option>
          </select>

          {/* Students List */}
          <div className="max-h-96 overflow-y-auto">
            {students.length > 0 ? (
              students.map((student) => (
                <div
                  key={student.id}
                  className="p-3 border border-border rounded-lg mb-2 hover:bg-surface-light transition cursor-pointer"
                  onClick={() => setSelectedStudent(selectedStudent?.id === student.id ? null : student)}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold">{student.name}</p>
                      <p className="text-sm text-gray-600">
                        {student.login_id} • {student.grade}
                      </p>
                      {student.lessons_completed > 0 && (
                        <p className="text-xs text-primary mt-1">
                          ✓ {student.lessons_completed} lessons completed
                        </p>
                      )}
                    </div>
                    {selectedStudent?.id === student.id && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleImpersonate(student.id);
                        }}
                        disabled={isLoading}
                        className="p-2 bg-primary text-white rounded-lg hover:bg-primary-hover disabled:opacity-50"
                      >
                        {isLoading ? (
                          <Loader className="w-4 h-4 animate-spin" />
                        ) : (
                          <Play className="w-4 h-4" />
                        )}
                      </button>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-500 py-4">No students found</p>
            )}
          </div>
        </div>
      </details>
    </div>
  );
};

export default StudentImpersonationPanel;
