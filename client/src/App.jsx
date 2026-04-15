import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'sonner';
import { queryClient } from './lib/queryClient';

// Student app providers & pages
import { AuthProvider } from './context/AuthContext';
import { GradeProvider } from './context/GradeContext';
import PrivateRoute from './components/common/PrivateRoute';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import SubjectPage from './pages/SubjectPage';
import TrackerPage from './pages/TrackerPage';
import LessonPage from './pages/LessonPage';
import StudentProfilePage from './pages/StudentProfilePage';

// Admin — layout & routing
import AdminLoginPage from './pages/AdminLoginPage';
import ProtectedRoute from './components/layout/ProtectedRoute';
import AdminLayout from './components/layout/AdminLayout';

// Admin — feature pages
import AdminDashboardPage from './features/dashboard/DashboardPage';
import StudentsPage from './features/students/StudentsPage';
import QuestionsPage from './features/questions/QuestionsPage';
import CurriculumPage from './features/curriculum/CurriculumPage';
import AdminUsersPage from './features/admin-users/AdminUsersPage';
import ProfilePage from './features/profile/ProfilePage';

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <AuthProvider>
          <GradeProvider>
            <Routes>
              {/* ======= STUDENT ROUTES ======= */}
              <Route path="/" element={<Navigate to="/student/login" replace />} />
              <Route path="/student" element={<Navigate to="/student/login" replace />} />
              <Route path="/student/login" element={<LoginPage />} />
              <Route path="/dashboard" element={<Navigate to="/student/dashboard" replace />} />

              <Route
                path="/student/dashboard"
                element={
                  <PrivateRoute>
                    <DashboardPage />
                  </PrivateRoute>
                }
              />

              <Route
                path="/subject/:id"
                element={
                  <PrivateRoute>
                    <SubjectPage />
                  </PrivateRoute>
                }
              />

              <Route
                path="/tracker"
                element={
                  <PrivateRoute>
                    <TrackerPage />
                  </PrivateRoute>
                }
              />

              <Route
                path="/student/lesson/:lessonId"
                element={
                  <PrivateRoute>
                    <LessonPage />
                  </PrivateRoute>
                }
              />

              <Route
                path="/student/profile"
                element={
                  <PrivateRoute>
                    <StudentProfilePage />
                  </PrivateRoute>
                }
              />

              {/* ======= ADMIN ROUTES ======= */}
              <Route path="/admin/login" element={<AdminLoginPage />} />

              <Route element={<ProtectedRoute />}>
                <Route element={<AdminLayout />}>
                  <Route path="/admin" element={<AdminDashboardPage />} />
                  <Route path="/admin/students" element={<StudentsPage />} />

                  {/* Curriculum Manager - Drill Down Routes */}
                  <Route path="/admin/curriculum" element={<CurriculumPage />} />
                  <Route path="/admin/curriculum/grade/:gradeId" element={<CurriculumPage />} />
                  <Route path="/admin/curriculum/grade/:gradeId/subject/:subjectId" element={<CurriculumPage />} />
                  <Route path="/admin/curriculum/grade/:gradeId/subject/:subjectId/unit/:unitId" element={<CurriculumPage />} />
                  <Route path="/admin/curriculum/grade/:gradeId/subject/:subjectId/unit/:unitId/lesson/:lessonId" element={<CurriculumPage />} />

                  <Route path="/admin/questions" element={<QuestionsPage />} />
                  <Route path="/admin/admin-users" element={<AdminUsersPage />} />
                  <Route path="/admin/profile" element={<ProfilePage />} />
                </Route>
              </Route>
            </Routes>
          </GradeProvider>
        </AuthProvider>

        {/* Global toast notifications */}
        <Toaster position="top-right" richColors closeButton />
      </Router>
    </QueryClientProvider>
  );
}

export default App;
