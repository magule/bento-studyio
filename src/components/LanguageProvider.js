import React, { useState, useEffect } from 'react';
import LanguageContext from '../contexts/LanguageContext';
import translations from '../i18n/translations';

const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(() => {
    // Check if the user has a saved preference
    const savedLanguage = localStorage.getItem('language');
    
    // Default to Turkish if no preference
    return savedLanguage || 'tr';
  });
  
  // Translation function
  const t = (key) => {
    if (!translations[language]) {
      return translations.en[key] || key;
    }
    
    return translations[language][key] || translations.en[key] || key;
  };
  
  // Save language preference whenever it changes
  useEffect(() => {
    localStorage.setItem('language', language);
  }, [language]);
  
  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export default LanguageProvider; 