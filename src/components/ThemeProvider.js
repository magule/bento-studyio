import React, { useEffect, useState } from 'react';
import ThemeContext from '../contexts/ThemeContext';

const ThemeProvider = ({ children }) => {
  const [darkMode, setDarkMode] = useState(() => {
    // Check if the user has a saved preference
    const savedTheme = localStorage.getItem('theme');
    
    // Always default to light theme (false for darkMode)
    return savedTheme === 'dark';
  });
  
  // Apply theme to document and save preference
  useEffect(() => {
    // Apply theme to document
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    
    // Save preference to localStorage
    localStorage.setItem('theme', darkMode ? 'dark' : 'light');
  }, [darkMode]);
  
  return (
    <ThemeContext.Provider value={{ darkMode, setDarkMode }}>
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeProvider; 