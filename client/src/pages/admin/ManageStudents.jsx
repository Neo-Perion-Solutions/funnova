import React, { useEffect, useState } from 'react';
import api from '../../lib/axios';
import { useAuth } from '../../context/AuthContext';
import { FiEdit, FiTrash2, FiEye } from 'react-icons/fi';

const ManageStudents = () => {
  const [students, setStudents] = useState([]);
  const { user } = useAuth();
  
  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const res = await api.get('/admin/students');
      setStudents(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this student?')) return;
    try {
      await api.delete(`/admin/students/${id}`);
      fetchStudents();
    } catch (err) {
      alert(err.response?.data?.message || 'Error deleting student');
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-800">Manage Students</h2>
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition">
          + Add Student
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 text-gray-600 text-sm border-b">
              <th className="p-4 font-semibold">Name</th>
              <th className="p-4 font-semibold">Email</th>
              <th className="p-4 font-semibold">Grade</th>
              <th className="p-4 font-semibold">Section</th>
              <th className="p-4 font-semibold">Avg Score</th>
              <th className="p-4 font-semibold text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {students.map(student => (
              <tr key={student.id} className="hover:bg-gray-50 transition">
                <td className="p-4 flex items-center space-x-3">
                  <span className="text-xl">{student.avatar_url || '👤'}</span>
                  <span className="font-medium text-gray-800">{student.name}</span>
                </td>
                <td className="p-4 text-gray-600">{student.email}</td>
                <td className="p-4">
                  <span className="bg-blue-100 text-blue-700 px-2.5 py-0.5 rounded-full text-sm font-medium">
                    Grade {student.grade}
                  </span>
                </td>
                <td className="p-4 text-gray-600">{student.section || '-'}</td>
                <td className="p-4 font-medium text-gray-800">{student.avg_score}%</td>
                <td className="p-4 flex justify-center space-x-2">
                  <button className="text-gray-400 hover:text-blue-600 p-2"><FiEye size={18} /></button>
                  <button className="text-gray-400 hover:text-yellow-600 p-2"><FiEdit size={18} /></button>
                  <button className="text-gray-400 hover:text-red-600 p-2" onClick={() => handleDelete(student.id)}><FiTrash2 size={18} /></button>
                </td>
              </tr>
            ))}
            {students.length === 0 && (
              <tr>
                <td colSpan="6" className="p-8 text-center text-gray-500">No students found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageStudents;
