import React, { useState, useEffect } from 'react';
import LanguageContext from '../contexts/LanguageContext';
import translations from '../i18n/translations';

const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(() => {
    // Check if the user has a saved preference
    const savedLanguage = localStorage.getItem('language');
    
    // Default to English if no preference
    return savedLanguage || 'en';
  });
  
  // Enhanced translation function that handles nested keys
  const t = (key) => {
    if (!translations[language]) {
      return getNestedTranslation(translations.en, key) || key;
    }
    
    return getNestedTranslation(translations[language], key) || 
           getNestedTranslation(translations.en, key) || 
           key;
  };
  
  // Helper function to get nested translations
  const getNestedTranslation = (obj, path) => {
    // Handle dot notation for nested keys (e.g., 'timeUnits.minute')
    const keys = path.split('.');
    let result = obj;
    
    for (const key of keys) {
      if (result && typeof result === 'object' && key in result) {
        result = result[key];
      } else {
        return undefined;
      }
    }
    
    return result;
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