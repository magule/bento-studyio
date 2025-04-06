import { createContext } from 'react';

const LanguageContext = createContext({
  language: 'tr', // Default language is Turkish
  setLanguage: () => {},
  t: (key) => key, // Translation function
});

export default LanguageContext; 