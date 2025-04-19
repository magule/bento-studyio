import React, { useContext, useState } from 'react';
import { MoonIcon, SunIcon, PlusIcon, InformationCircleIcon, Cog6ToothIcon, CheckIcon } from '@heroicons/react/24/outline';
import { motion, AnimatePresence } from 'framer-motion';
import ThemeContext from '../contexts/ThemeContext';
import LanguageContext from '../contexts/LanguageContext';
import AboutModal from './AboutModal';
import { useTranslation } from 'react-i18next';
import { Menu } from '@headlessui/react';

function Header({ onAddClick }) {
  const { darkMode, setDarkMode } = useContext(ThemeContext);
  const { language, setLanguage } = useContext(LanguageContext);
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [gameResult, setGameResult] = useState(null);
  const [playerChoice, setPlayerChoice] = useState(null);
  const [computerChoice, setComputerChoice] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const { t } = useTranslation();

  // Available languages
  const languages = [
    { code: 'en', name: 'English' },
    { code: 'tr', name: 'Turkish' },
    { code: 'es', name: 'Spanish' }
  ];

  // Handle language change
  const handleLanguageChange = (langCode) => {
    console.log('🌐 Changing language to:', langCode);
    setLanguage(langCode);
    window.location.reload();
  };

  // Handle Rock Paper Scissors game
  const playGame = (choice) => {
    const choices = ['rock', 'paper', 'scissors'];
    const computerChoice = choices[Math.floor(Math.random() * choices.length)];
    
    if (choice === computerChoice) {
      setGameResult(t('game.draw'));
    } else if (
      (choice === 'rock' && computerChoice === 'scissors') ||
      (choice === 'paper' && computerChoice === 'rock') ||
      (choice === 'scissors' && computerChoice === 'paper')
    ) {
      setGameResult(t('game.win'));
    } else {
      setGameResult(t('game.lose'));
    }

    // Clear result after 2 seconds
    setTimeout(() => {
      setGameResult(null);
    }, 2000);
  };

  // Get emoji for choice
  const getEmoji = (choice) => {
    switch (choice) {
      case 'rock': return '🪨';
      case 'paper': return '📄';
      case 'scissors': return '✂️';
      default: return '';
    }
  };

  return (
    <>
      <header className="bg-white/70 dark:bg-dark-800/60 backdrop-blur-lg shadow-sm dark:shadow-dark-500/10 sticky top-0 z-30 transition-colors duration-300">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex flex-col">
            <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
              <span className="text-gradient">{t('Study.o')}</span>
            </h1>
            <span className="text-xs text-gray-600 dark:text-gray-400 hidden sm:block">Keep track of your habits and studies!</span>
          </div>
          
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

            {/* Theme Toggle Button */}
            <motion.button
              onClick={() => setDarkMode(!darkMode)}
              whileTap={{ scale: 0.95 }}
              className="bg-gray-100 dark:bg-dark-700 p-2 rounded-full text-gray-500 dark:text-gray-300 hover:text-gray-700 dark:hover:text-white shadow-sm hover:shadow transition-all duration-300"
              aria-label="Toggle theme"
              title={t('theme')}
            >
              {darkMode ? (
                <SunIcon className="w-5 h-5" />
              ) : (
                <MoonIcon className="w-5 h-5" />
              )}
            </motion.button>
            
            {/* Settings Button */}
            <Menu as="div" className="relative">
              <Menu.Button
                as={motion.button}
                whileTap={{ scale: 0.95 }}
                className="bg-gray-100 dark:bg-dark-700 p-2 rounded-full text-gray-500 dark:text-gray-300 hover:text-gray-700 dark:hover:text-white shadow-sm hover:shadow transition-all duration-300"
                aria-label="Settings"
                title={t('settings')}
              >
                <Cog6ToothIcon className="w-5 h-5" />
              </Menu.Button>

              <AnimatePresence>
                <Menu.Items
                  as={motion.div}
                  className="absolute right-0 mt-2 w-56 rounded-xl bg-white dark:bg-dark-700 shadow-lg ring-1 ring-black ring-opacity-5 z-50"
                  initial={{ opacity: 0, scale: 0.95, y: -10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: -10 }}
                  transition={{ duration: 0.15 }}
                >
                  <div className="p-2 space-y-1">
                    {/* Language Selection */}
                    <Menu.Item>
                      <div className="px-3 py-2">
                        <div className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">
                          {t('language')}
                        </div>
                        <div className="space-y-1">
                          {languages.map((lang) => (
                            <button
                              key={lang.code}
                              onClick={() => handleLanguageChange(lang.code)}
                              className="w-full px-3 py-2 text-sm text-left text-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-600 flex items-center justify-between group"
                            >
                              <span>{lang.name}</span>
                              {language === lang.code && (
                                <CheckIcon className="w-4 h-4 text-blue-500 dark:text-blue-400" />
                              )}
                            </button>
                          ))}
                        </div>
                      </div>
                    </Menu.Item>

                    {/* Divider */}
                    <div className="h-px bg-gray-200 dark:bg-dark-600 mx-2" />

                    {/* Rock Paper Scissors Game */}
                    <Menu.Item>
                      <div className="px-4 py-2">
                        <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                          {t('miniGame')}
                        </div>
                        <div className="mt-2 flex flex-col gap-2">
                          <div className="flex gap-2">
                            {['rock', 'paper', 'scissors'].map((choice) => (
                              <motion.button
                                key={choice}
                                onClick={(e) => {
                                  e.preventDefault(); // Prevent menu from closing
                                  playGame(choice);
                                }}
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.95 }}
                                className="px-3 py-1 text-lg rounded-md bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                              >
                                {getEmoji(choice)}
                              </motion.button>
                            ))}
                          </div>
                          {gameResult && (
                            <motion.div
                              initial={{ opacity: 0, y: -5 }}
                              animate={{ opacity: 1, y: 0 }}
                              className="text-sm text-center"
                              style={{
                                color: gameResult === t('game.win')
                                  ? '#10B981'
                                  : gameResult === t('game.lose')
                                  ? '#EF4444'
                                  : '#6B7280'
                              }}
                            >
                              {gameResult}
                            </motion.div>
                          )}
                        </div>
                      </div>
                    </Menu.Item>
                  </div>
                </Menu.Items>
              </AnimatePresence>
            </Menu>
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