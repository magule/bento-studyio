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
    console.log('💬 Setting language preference:', language);
    localStorage.setItem('language', language);
    
    // Important: When language changes, we need to update default habit names
    // but we don't want to lose user's habits or reset them
    // This is a safer approach that doesn't interfere with habit storage
  }, [language]);
  
  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export default LanguageProvider; 