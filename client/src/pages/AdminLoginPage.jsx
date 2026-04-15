import React, { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Loader2, ShieldCheck } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

const AdminLoginPage = () => {
  const [login_id, setLoginId] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const {
    login,
    logout,
    user,
    isAuthenticated,
    loading: authLoading,
  } = useAuth();

  if (authLoading) return null;

  if (isAuthenticated && ['main_admin', 'sub_admin'].includes(user?.role)) {
    return <Navigate to="/admin" replace />;
  }

  if (isAuthenticated && !['main_admin', 'sub_admin'].includes(user?.role)) {
    return <Navigate to="/student/dashboard" replace />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!login_id || !password) {
      setError('Please fill in all fields');
      return;
    }

    setLoading(true);
    try {
      console.log('📝 Submitting login form with login_id:', login_id);
      const data = await login(login_id, password);
      console.log('✅ Login response received:', data);

      if (!['main_admin', 'sub_admin'].includes(data.user.role)) {
        logout();
        setError('Access denied. Admin credentials required.');
        setLoading(false);
        return;
      }

      navigate('/admin', { replace: true });
    } catch (err) {
      console.error('❌ Login catch block error:', {
        response: err.response,
        message: err.message,
        status: err.response?.status,
        data: err.response?.data
      });
      const errorMsg = err.response?.data?.message || err.message || 'Login failed. Please try again.';
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-shell flex min-h-screen items-center justify-center bg-[#f6f8fb] px-4 py-10">
      <div className="w-full max-w-md rounded-lg border border-gray-200 bg-white p-8 shadow-sm">
        <div className="mb-8 flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-gray-950 text-white">
            <ShieldCheck size={22} />
          </div>
          <div>
            <h1 className="text-xl font-semibold tracking-tight text-gray-950">Admin Login</h1>
            <p className="text-sm text-gray-500">Manage FUNNOVA content and progress.</p>
          </div>
        </div>

        {error && (
          <div className="mb-4 rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-semibold text-gray-700">Login ID</label>
            <input
              type="text"
              value={login_id}
              onChange={(e) => setLoginId(e.target.value)}
              placeholder="ADMIN-001"
              className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none transition focus:border-gray-950 focus:ring-2 focus:ring-gray-950/10"
              autoFocus
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-semibold text-gray-700">Password</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                className="w-full rounded-lg border border-gray-300 px-3 py-2.5 pr-10 text-sm outline-none transition focus:border-gray-950 focus:ring-2 focus:ring-gray-950/10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg text-gray-400 hover:text-gray-700"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-gray-950 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading && <Loader2 size={16} className="animate-spin" />}
            {loading ? 'Signing in' : 'Sign in'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLoginPage;
