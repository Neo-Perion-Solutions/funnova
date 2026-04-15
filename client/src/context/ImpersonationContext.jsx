import React, { createContext, useContext, useState, useEffect } from 'react';

const ImpersonationContext = createContext();

export const ImpersonationProvider = ({ children }) => {
  const [isImpersonating, setIsImpersonating] = useState(false);
  const [impersonatedStudent, setImpersonatedStudent] = useState(null);
  const [impersonationToken, setImpersonationToken] = useState(null);
  const [adminToken, setAdminToken] = useState(null);

  // Load impersonation state on mount
  useEffect(() => {
    const savedAdminToken = localStorage.getItem('funnova_token');
    const savedImpersonationToken = localStorage.getItem('funnova_impersonate_token');
    const savedStudent = localStorage.getItem('funnova_impersonated_student');

    if (savedImpersonationToken && savedStudent) {
      setIsImpersonating(true);
      setImpersonationToken(savedImpersonationToken);
      setImpersonatedStudent(JSON.parse(savedStudent));
      setAdminToken(savedAdminToken);
    }
  }, []);

  const startImpersonation = (token, studentData) => {
    // Save current admin token
    const currentAdminToken = localStorage.getItem('funnova_token');
    setAdminToken(currentAdminToken);

    // Store impersonation data
    localStorage.setItem('funnova_impersonate_token', token);
    localStorage.setItem('funnova_impersonated_student', JSON.stringify(studentData));

    // Switch to impersonation token
    localStorage.setItem('funnova_token', token);

    setIsImpersonating(true);
    setImpersonationToken(token);
    setImpersonatedStudent(studentData);
  };

  const endImpersonation = () => {
    // Clear impersonation data
    localStorage.removeItem('funnova_impersonate_token');
    localStorage.removeItem('funnova_impersonated_student');

    // Restore admin token
    if (adminToken) {
      localStorage.setItem('funnova_token', adminToken);
    } else {
      localStorage.removeItem('funnova_token');
    }

    setIsImpersonating(false);
    setImpersonatedStudent(null);
    setImpersonationToken(null);
    setAdminToken(null);

    // Reload page to reset UI to admin state
    window.location.href = '/admin';
  };

  return (
    <ImpersonationContext.Provider
      value={{
        isImpersonating,
        impersonatedStudent,
        impersonationToken,
        startImpersonation,
        endImpersonation,
      }}
    >
      {children}
    </ImpersonationContext.Provider>
  );
};

export const useImpersonation = () => {
  const context = useContext(ImpersonationContext);
  if (!context) {
    throw new Error('useImpersonation must be used within ImpersonationProvider');
  }
  return context;
};
