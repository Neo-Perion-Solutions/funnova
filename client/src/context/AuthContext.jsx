import React, { createContext, useContext, useState, useEffect } from 'react';
import * as authService from '../services/auth.service';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [student, setStudent] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('funnova_token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      if (token) {
        try {
          const user = await authService.getMe();
          setStudent(user);
        } catch (err) {
          console.error(err);
          logout();
        }
      }
      setLoading(false);
    };
    fetchUser();
  }, [token]);

  const loginUser = async (student_id, password) => {
    const data = await authService.login(student_id, password);
    setToken(data.token);
    setStudent(data.user);
    localStorage.setItem('funnova_token', data.token);
    return data;
  };

  const logout = () => {
    setToken(null);
    setStudent(null);
    localStorage.removeItem('funnova_token');
  };

  const value = {
    student,
    token,
    isAuthenticated: !!token,
    login: loginUser,
    logout,
    loading
  };

  return <AuthContext.Provider value={value}>{!loading && children}</AuthContext.Provider>;
};

export const useAuthContext = () => useContext(AuthContext);
