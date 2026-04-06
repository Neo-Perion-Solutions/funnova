import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuthContext } from './AuthContext';

const GradeContext = createContext();

export const GradeProvider = ({ children }) => {
  const { student } = useAuthContext();
  const [activeGrade, setActiveGrade] = useState(4); // Default

  useEffect(() => {
    if (student && student.grade) {
      setActiveGrade(student.grade);
    }
  }, [student]);

  return (
    <GradeContext.Provider value={{ activeGrade, setActiveGrade }}>
      {children}
    </GradeContext.Provider>
  );
};

export const useGradeContext = () => useContext(GradeContext);
