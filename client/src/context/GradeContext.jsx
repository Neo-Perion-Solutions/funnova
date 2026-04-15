import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuthContext } from './AuthContext';

const GradeContext = createContext();

export const GradeProvider = ({ children }) => {
  const { student } = useAuthContext();
  const [activeGrade, setActiveGrade] = useState(3); // Default
  const [isLocked, setIsLocked] = useState(false); // Grade is locked for students

  useEffect(() => {
    if (student && student.grade) {
      // Parse grade from "Grade 3" or just "3"
      const gradeNumber = String(student.grade).replace('Grade ', '');
      setActiveGrade(gradeNumber);

      // Lock grade for students so they can't switch
      setIsLocked(true);
    }
  }, [student]);

  // Function to set active grade - respects the lock
  const updateGrade = (newGrade) => {
    // If grade is locked (student view), prevent changes
    if (isLocked) {
      console.warn('Grade is locked. Students can only view their assigned grade.');
      return;
    }
    setActiveGrade(newGrade);
  };

  return (
    <GradeContext.Provider value={{
      activeGrade,
      setActiveGrade: updateGrade,
      isGradeLocked: isLocked
    }}>
      {children}
    </GradeContext.Provider>
  );
};

export const useGradeContext = () => useContext(GradeContext);
