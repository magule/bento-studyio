import React, { useCallback, useState, useEffect, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Analytics } from "@vercel/analytics/react";
import BentoBox from './components/BentoBox';
import AddBoxForm from './components/AddBoxForm';
import Header from './components/Header';
import ThemeProvider from './components/ThemeProvider';
import LanguageProvider from './components/LanguageProvider';
import LanguageContext from './contexts/LanguageContext';
import HeartAnimation from './components/HeartAnimation';
import TutorialOverlay from './components/TutorialOverlay';
import useHabitStore from './store/habitStore';
import { isLocalStorageAvailable, getStoredHabits } from './utils/storageHelper';
import { PlusIcon } from '@heroicons/react/24/outline';

// Check if localStorage is available
const hasLocalStorage = isLocalStorageAvailable();
console.log('🔌 App: localStorage available:', hasLocalStorage);

// Wrap content with translation context
const AppContent = () => {
  const { t } = useContext(LanguageContext);
  // State for the add habit modal
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  // State for footer click counter
  const [footerClicks, setFooterClicks] = useState(0);
  // State for heart animation
  const [showHeartAnimation, setShowHeartAnimation] = useState(false);
  // State for tutorial
  const [showTutorial, setShowTutorial] = useState(false);
  // Storage status for debugging
  const [storageStatus, setStorageStatus] = useState({ checked: false, working: false, habitCount: 0 });
  
  // Check storage status on mount
  useEffect(() => {
    if (hasLocalStorage) {
      try {
        const habits = getStoredHabits();
        setStorageStatus({
          checked: true,
          working: true,
          habitCount: habits ? habits.length : 0
        });
        console.log("✅ Storage check complete:", habits ? habits.length : 0, "habits found");
      } catch (err) {
        console.error("❌ Storage check failed:", err);
        setStorageStatus({ checked: true, working: false, habitCount: 0 });
      }
    } else {
      console.warn("⚠️ localStorage is not available");
      setStorageStatus({ checked: true, working: false, habitCount: 0 });
    }
  }, []);
  
  // Check if it's first time visit
  useEffect(() => {
    const hasSeenTutorial = localStorage.getItem('has-seen-tutorial');
    if (!hasSeenTutorial) {
      setShowTutorial(true);
    }
  }, []);
  
  // Use separate selectors to prevent unnecessary re-renders
  const habits = useHabitStore(state => state.habits);
  const addHabit = useHabitStore(state => state.addHabit);
  const updateCount = useHabitStore(state => state.updateCount);
  const deleteHabit = useHabitStore(state => state.deleteHabit);
  const resetHabit = useHabitStore(state => state.resetHabit);
  
  // Log habits from store
  useEffect(() => {
    console.log("📊 Current habits in store:", habits.length);
  }, [habits]);
  
  // Add blur effect to main content when modal is open
  useEffect(() => {
    const appContent = document.getElementById('app-content');
    const headerContent = document.getElementById('header-content');
    
    if (appContent && headerContent) {
      if (isAddModalOpen) {
        appContent.classList.add('blur-sm', 'transition-all');
        headerContent.classList.add('blur-sm', 'transition-all');
      } else {
        appContent.classList.remove('blur-sm');
        headerContent.classList.remove('blur-sm');
      }
    }
    
    // Prevent scrolling when modal is open
    if (isAddModalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    
    return () => {
      document.body.style.overflow = '';
    };
  }, [isAddModalOpen]);
  
  // Memoize handlers
  const handleUpdateCount = useCallback((id) => {
    updateCount(id);
  }, [updateCount]);
  
  const handleDeleteHabit = useCallback((id) => {
    deleteHabit(id);
  }, [deleteHabit]);
  
  const handleResetHabit = useCallback((id) => {
    resetHabit(id);
  }, [resetHabit]);
  
  const handleOpenAddModal = useCallback(() => {
    setIsAddModalOpen(true);
  }, []);
  
  const handleCloseAddModal = useCallback(() => {
    setIsAddModalOpen(false);
  }, []);
  
  const handleAddHabit = useCallback((habitData) => {
    addHabit(habitData);
    setIsAddModalOpen(false);
  }, [addHabit]);

  // Handle footer click
  const handleFooterClick = useCallback(() => {
    setFooterClicks(prev => {
      const newCount = prev + 1;
      console.log(`Footer click: ${newCount}/3`);
      
      // Trigger animation on third click
      if (newCount >= 3) {
        // Force setting to true to ensure animation triggers
        setShowHeartAnimation(true);
        console.log('Hearts animation triggered!');
        return 0; // Reset counter
      }
      return newCount;
    });
  }, []);
  
  // Handle animation complete
  const handleAnimationComplete = useCallback(() => {
    // Force immediate cleanup
    setTimeout(() => {
      setShowHeartAnimation(false);
    }, 100); // Very short timeout for quick cleanup
  }, []);

  const handleTutorialComplete = () => {
    setShowTutorial(false);
    localStorage.setItem('has-seen-tutorial', 'true');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-dark-700 dark:to-dark-800 transition-colors duration-300 flex flex-col">
      {/* Tutorial overlay */}
      <AnimatePresence>
        {showTutorial && <TutorialOverlay onComplete={handleTutorialComplete} />}
      </AnimatePresence>

      {/* Heart animation overlay */}
      <HeartAnimation 
        isActive={showHeartAnimation} 
        onComplete={handleAnimationComplete}
      />
      
      {/* Background decoration - only visible in light mode */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-pastel-gradient opacity-20 rounded-full blur-3xl" />
        <div className="absolute top-1/4 -left-24 w-72 h-72 bg-warm-gradient opacity-10 rounded-full blur-3xl" />
      </div>
      
      <div id="header-content">
        <Header onAddClick={handleOpenAddModal} />
      </div>
      
      <div id="app-content" className="flex-1 flex flex-col">
        {/* Debug indicator - only visible in development */}
        {/* Removing debug panel as requested */}
        
        <main className="container mx-auto px-4 py-8 flex-1 relative z-10 transition-all duration-300">
          <AnimatePresence mode="wait">
            {habits.length === 0 ? (
              <motion.div 
                key="empty-state"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="text-center py-16 relative"
              >
                {/* Decorative background elements */}
                <motion.div 
                  className="absolute -top-10 -right-10 w-40 h-40 bg-gradient-to-br from-purple-200 to-purple-400 dark:from-purple-900 dark:to-purple-700 rounded-full opacity-20 blur-2xl"
                  animate={{ 
                    scale: [1, 1.2, 1],
                    rotate: [0, 90, 0]
                  }}
                  transition={{ 
                    duration: 8,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                />
                <motion.div 
                  className="absolute -bottom-10 -left-10 w-32 h-32 bg-gradient-to-tr from-primary-200 to-primary-400 dark:from-primary-900 dark:to-primary-700 rounded-full opacity-20 blur-2xl"
                  animate={{ 
                    scale: [1, 1.3, 1],
                    rotate: [0, -90, 0]
                  }}
                  transition={{ 
                    duration: 7,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 0.5
                  }}
                />

                {/* Content */}
                <div className="glass-card p-12 backdrop-blur-sm bg-white/30 dark:bg-dark-800/30 rounded-3xl shadow-xl relative overflow-hidden border border-white/20 dark:border-white/5">
                  <motion.div
                    className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary-500 via-purple-500 to-pink-500"
                    animate={{
                      backgroundPosition: ["0% 0%", "100% 0%"],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      repeatType: "reverse",
                    }}
                  />
                  
                  <motion.div 
                    className="mb-8 mx-auto w-24 h-24 bg-gradient-to-br from-primary-500 to-purple-600 dark:from-primary-400 dark:to-purple-500 rounded-2xl flex items-center justify-center shadow-lg"
                    animate={{ 
                      rotate: [0, 5, -5, 0],
                      scale: [1, 1.02, 0.98, 1]
                    }}
                    transition={{ 
                      duration: 4,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  >
                    <PlusIcon className="w-12 h-12 text-white" />
                  </motion.div>

                  <motion.h2 
                    className="text-2xl font-bold mb-4 bg-gradient-to-r from-primary-600 to-purple-600 dark:from-primary-400 dark:to-purple-400 bg-clip-text text-transparent"
                    animate={{ 
                      scale: [1, 1.02, 1],
                    }}
                    transition={{ 
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  >
                    {t('noHabitsYet')}
                  </motion.h2>
                  
                  <p className="text-gray-600 dark:text-gray-300 max-w-md mx-auto mb-8 leading-relaxed">
                    {t('addFirstHabit')}
                  </p>

                  <motion.button
                    onClick={handleOpenAddModal}
                    className="px-6 py-3 bg-gradient-to-r from-primary-500 to-purple-600 dark:from-primary-400 dark:to-purple-500 text-white rounded-xl font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {t('addHabit')}
                  </motion.button>
                </div>
              </motion.div>
            ) : (
              <motion.div 
                key="habit-grid"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                layout
                className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-8"
              >
                {habits.map(habit => (
                  <BentoBox 
                    key={habit.id}
                    habit={habit}
                    onClick={() => handleUpdateCount(habit.id)}
                    onDelete={() => handleDeleteHabit(habit.id)}
                    onReset={() => handleResetHabit(habit.id)}
                  />
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </main>
        
        <footer className="w-full py-6 text-center text-gray-400 dark:text-gray-600 text-sm relative z-10">
          <div className="flex items-center justify-center">
            <span 
              className={`font-medium tracking-wider hover:opacity-100 transition-all duration-300 cursor-pointer px-4 py-2 rounded-full pulse-hover ${
                footerClicks > 0 ? 'opacity-100 scale-105 text-primary-500 dark:text-primary-400' : 'opacity-60'
              } ${footerClicks === 2 ? 'pulse-animation font-bold' : ''}`}
              onClick={handleFooterClick}
            >
              B-F{footerClicks > 0 ? ` (${footerClicks}/3)` : ''}
            </span>
          </div>
        </footer>
      </div>
      
      {/* Add modal dialog - OUTSIDE of the blurred content */}
      <AnimatePresence>
        {isAddModalOpen && (
          <motion.div 
            className="fixed inset-0 bg-black/50 backdrop-blur-md z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleCloseAddModal}
          >
            <motion.div
              className="w-full max-w-3xl"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", damping: 25 }}
              onClick={(e) => e.stopPropagation()}
            >
              <AddBoxForm addHabit={handleAddHabit} onCancel={handleCloseAddModal} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <AppContent />
        <Analytics />
      </LanguageProvider>
    </ThemeProvider>
  );
}

export default App;
