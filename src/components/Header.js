import React, { useContext, useState } from 'react';
import { MoonIcon, SunIcon, PlusIcon, InformationCircleIcon } from '@heroicons/react/24/outline';
import { motion, AnimatePresence } from 'framer-motion';
import ThemeContext from '../contexts/ThemeContext';
import LanguageContext from '../contexts/LanguageContext';
import AboutModal from './AboutModal';

function Header({ onAddClick }) {
  const { darkMode, setDarkMode } = useContext(ThemeContext);
  const { language, setLanguage, t } = useContext(LanguageContext);
  const [isAboutOpen, setIsAboutOpen] = useState(false);

  // Toggle language between English and Turkish
  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'tr' : 'en');
    
    // Force reload default habits with new language
    // Remove habit data but keep theme preference
    const data = localStorage.getItem('habit-storage');
    if (data) {
      try {
        const parsedData = JSON.parse(data);
        // Reset habits to let defaults load with new language
        parsedData.state.habits = [];
        localStorage.setItem('habit-storage', JSON.stringify(parsedData));
        // Reload the page to apply changes
        window.location.reload();
      } catch (e) {
        console.error('Error updating habits with new language', e);
      }
    }
  };

  return (
    <>
      <header className="bg-white/70 dark:bg-dark-800/60 backdrop-blur-lg shadow-sm dark:shadow-dark-500/10 sticky top-0 z-30 transition-colors duration-300">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
            <span className="text-gradient mr-1">{t('appName')}</span>
            <span className="text-sm font-normal text-gray-600 dark:text-gray-400">{t('appTagline')}</span>
          </h1>
          
          <div className="flex items-center space-x-3">
            {/* Add Habit Button */}
            <motion.button
              onClick={onAddClick}
              whileTap={{ scale: 0.95 }}
              className="p-2 rounded-full bg-gradient-to-r from-blue-400 to-teal-400 text-white shadow-lg hover:shadow-teal-300/50 dark:hover:shadow-teal-500/30 transition-all duration-300"
              aria-label="Add new habit"
            >
              <PlusIcon className="w-5 h-5" />
            </motion.button>
            
            {/* Info Button */}
            <motion.button
              onClick={() => setIsAboutOpen(true)}
              whileTap={{ scale: 0.95 }}
              className="bg-gray-100 dark:bg-dark-700 p-2 rounded-full text-gray-500 dark:text-gray-300 hover:text-gray-700 dark:hover:text-white shadow-sm hover:shadow transition-all duration-300"
              aria-label="About"
              title={t('about')}
            >
              <InformationCircleIcon className="w-5 h-5" />
            </motion.button>
            
            {/* Language Toggle Button */}
            <motion.button
              onClick={toggleLanguage}
              whileTap={{ scale: 0.95 }}
              className="bg-gray-100 dark:bg-dark-700 p-2 rounded-full text-gray-500 dark:text-gray-300 hover:text-gray-700 dark:hover:text-white shadow-sm hover:shadow transition-all duration-300"
              aria-label="Toggle language"
              title={language === 'en' ? 'Türkçe\'ye geç' : 'Switch to English'}
            >
              <div className="w-5 h-5 flex items-center justify-center font-medium">
                {language === 'en' ? 'TR' : 'EN'}
              </div>
            </motion.button>
            
            {/* Theme Toggle Button */}
            <motion.button
              onClick={() => setDarkMode(!darkMode)}
              whileTap={{ scale: 0.95 }}
              className="bg-gray-100 dark:bg-dark-700 p-2 rounded-full text-gray-500 dark:text-gray-300 hover:text-gray-700 dark:hover:text-white shadow-sm hover:shadow transition-all duration-300"
              aria-label="Toggle theme"
            >
              {darkMode ? (
                <SunIcon className="w-5 h-5" />
              ) : (
                <MoonIcon className="w-5 h-5" />
              )}
            </motion.button>
          </div>
        </div>
      </header>
      
      {/* About Modal */}
      <AnimatePresence>
        {isAboutOpen && (
          <AboutModal 
            isOpen={isAboutOpen} 
            onClose={() => setIsAboutOpen(false)} 
          />
        )}
      </AnimatePresence>
    </>
  );
}

export default Header; 