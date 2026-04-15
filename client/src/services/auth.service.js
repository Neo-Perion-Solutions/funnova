import api from '../lib/axios';

export const login = async (login_id, password) => {
  console.log('🔐 Attempting login with login_id:', login_id);
  try {
    const response = await api.post('/auth/login', { login_id, password });
    console.log('✅ Login successful:', response);
    // NOTE: axios interceptor already unwraps response, so response is { success: true, data: { token, user } }
    return response.data; // Return the data object (token, user) - NOT response.data.data!
  } catch (error) {
    console.error('❌ Login error:', {
      status: error.response?.status,
      message: error.response?.data?.message,
      data: error.response?.data,
      errorMsg: error.message
    });
    throw error;
  }
};

export const logout = async () => {
  await api.post('/auth/logout');
};

export const getMe = async () => {
  const response = await api.get('/auth/me');
  return response; // Already unwrapped by axios interceptor
};
