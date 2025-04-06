import React, { useState, useEffect, useCallback, useRef, useContext } from 'react';
import { motion } from 'framer-motion';
import { XMarkIcon, PlayIcon, PauseIcon, ArrowPathIcon, SwatchIcon } from '@heroicons/react/24/outline';
import { FireIcon } from '@heroicons/react/24/solid';
import useHabitStore from '../store/habitStore';
import LanguageContext from '../contexts/LanguageContext';

const BentoBox = ({ habit, onClick, onDelete, onReset }) => {
  const { t } = useContext(LanguageContext);
  const [timeLeft, setTimeLeft] = useState(habit.timerDuration ? habit.timerDuration * 60 : 0);
  const [timerActive, setTimerActive] = useState(false);
  const [timerCompleted, setTimerCompleted] = useState(false);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const colorPickerRef = useRef(null);
  const updateHabit = useHabitStore(state => state.updateHabit);

  // Predefined pastel colors from tailwind.config.js
  const colorOptions = [
    { value: '', label: 'Default' },
    { value: '#94A3B8', label: 'Slate' },
    { value: '#A5B4FC', label: 'Lavender' },
    { value: '#C7D2FE', label: 'Periwinkle' },
    { value: '#FCA5A5', label: 'Coral' },
    { value: '#FDBA74', label: 'Peach' },
    { value: '#FCD34D', label: 'Canary' },
    { value: '#86EFAC', label: 'Mint' },
    { value: '#67E8F9', label: 'Sky' },
    { value: '#F9A8D4', label: 'Pink' },
    { value: '#C4B5FD', label: 'Lilac' },
  ];

  // Format time as MM:SS
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Close color picker when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (colorPickerRef.current && !colorPickerRef.current.contains(event.target)) {
        setShowColorPicker(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Memoize event handlers to prevent unnecessary re-renders
  const handleTimerClick = useCallback((e) => {
    e.stopPropagation();
    if (habit.timerDuration) {
      if (timerCompleted) {
        // Reset timer if it was completed
        setTimeLeft(habit.timerDuration * 60);
        setTimerCompleted(false);
        setTimerActive(true);
      } else {
        // Toggle timer
        setTimerActive(prev => !prev);
      }
    }
  }, [habit.timerDuration, timerCompleted]);
  
  const handleResetClick = useCallback((e) => {
    e.stopPropagation();
    if (onReset) {
      onReset(habit.id);
      if (habit.timerDuration) {
        setTimeLeft(habit.timerDuration * 60);
        setTimerActive(false);
        setTimerCompleted(false);
      }
    }
  }, [habit.id, habit.timerDuration, onReset]);
  
  const handleDeleteClick = useCallback((e) => {
    e.stopPropagation();
    onDelete();
  }, [onDelete]);

  const handleColorClick = useCallback((e) => {
    e.stopPropagation();
    setShowColorPicker(prev => !prev);
  }, []);

  const handleColorChange = useCallback((color) => {
    updateHabit(habit.id, { ...habit, bgColor: color });
    setShowColorPicker(false);
  }, [habit, updateHabit]);

  const handleCustomColorChange = useCallback((e) => {
    updateHabit(habit.id, { ...habit, bgColor: e.target.value });
  }, [habit, updateHabit]);

  // Reset timer when timerDuration changes
  useEffect(() => {
    if (habit.timerDuration) {
      setTimeLeft(habit.timerDuration * 60);
    }
  }, [habit.timerDuration]);

  // Handle timer functionality
  useEffect(() => {
    let interval = null;
    
    if (timerActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(prevTime => prevTime - 1);
      }, 1000);
    } else if (timerActive && timeLeft === 0) {
      setTimerActive(false);
      setTimerCompleted(true);
      
      // Increment count when timer finishes
      onClick();
      
      // Quick flash effect to indicate completion
      const flashElement = document.getElementById(`box-${habit.id}`);
      if (flashElement) {
        flashElement.classList.add('flash-effect');
        setTimeout(() => {
          flashElement.classList.remove('flash-effect');
        }, 700);
      }
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [timerActive, timeLeft, onClick, habit.id]);

  // Define box style
  const boxStyle = {
    backgroundColor: habit.bgColor || undefined,
    borderColor: habit.borderColor || undefined,
  };
  
  // Calculate progress percentage for timer
  const progressPercentage = habit.timerDuration 
    ? (1 - timeLeft / (habit.timerDuration * 60)) * 100 
    : 0;

  // Determine text color based on background color darkness
  const textColorClass = habit.bgColor
    ? isLightColor(habit.bgColor) ? 'text-gray-800' : 'text-white'
    : 'text-gray-800 dark:text-white';

  // Function to check if a color is light (for text contrast)
  function isLightColor(hexColor) {
    // Default to dark if no color
    if (!hexColor) return false;
    
    // Convert hex to RGB
    const r = parseInt(hexColor.slice(1, 3), 16);
    const g = parseInt(hexColor.slice(3, 5), 16);
    const b = parseInt(hexColor.slice(5, 7), 16);
    
    // Calculate luminance
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    
    // Return true if light, false if dark
    return luminance > 0.6;
  }

  return (
    <motion.div 
      id={`box-${habit.id}`}
      className="aspect-square rounded-2xl overflow-hidden shadow-xl dark:shadow-gray-900/30 relative"
      style={boxStyle}
      whileHover={{ 
        y: -8,
        boxShadow: "0 15px 30px -8px rgba(0, 0, 0, 0.15), 0 10px 15px -6px rgba(0, 0, 0, 0.1)"
      }}
      whileTap={{ scale: 0.97 }}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      onClick={habit.timerDuration ? undefined : onClick}
      layout
    >
      {/* Background glass panel */}
      <div className={`absolute inset-0 ${!habit.bgColor ? 'glass-card' : ''} p-0`}>
        {/* Progress bar for timer */}
        {habit.timerDuration && !timerCompleted && (
          <motion.div 
            className="absolute bottom-0 left-0 h-2 bg-primary-500/80 dark:bg-primary-400/80" 
            style={{ width: `${progressPercentage}%` }}
            animate={{ 
              width: `${progressPercentage}%`,
              transition: { duration: 0.3 }
            }}
            layoutId={`progress-${habit.id}`}
          />
        )}
      </div>
      
      {/* Box Content */}
      <div className="relative z-10 p-6 h-full flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-start mb-3">
          <h3 className={`text-lg font-semibold ${textColorClass}`}>
            {habit.name}
          </h3>
          
          <div className="flex gap-1.5">
            <motion.button
              whileHover={{ scale: 1.15 }}
              whileTap={{ scale: 0.9 }}
              className={`p-1.5 rounded-full ${habit.bgColor && !isLightColor(habit.bgColor) 
                ? 'bg-white/20 text-white hover:bg-white/30' 
                : 'bg-gray-100 dark:bg-white/20 text-gray-500 dark:text-white hover:text-primary-500 dark:hover:bg-white/30'}`}
              onClick={handleColorClick}
              title={t('changeColor')}
            >
              <SwatchIcon className="h-4 w-4" />
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.15 }}
              whileTap={{ scale: 0.9 }}
              className={`p-1.5 rounded-full ${habit.bgColor && !isLightColor(habit.bgColor) 
                ? 'bg-white/20 text-white hover:bg-white/30' 
                : 'bg-gray-100 dark:bg-white/20 text-gray-500 dark:text-white hover:text-accent-500 dark:hover:bg-white/30'}`}
              onClick={handleResetClick}
              title={t('reset')}
            >
              <ArrowPathIcon className="h-4 w-4" />
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.15 }}
              whileTap={{ scale: 0.9 }}
              className={`p-1.5 rounded-full ${habit.bgColor && !isLightColor(habit.bgColor) 
                ? 'bg-white/20 text-white hover:bg-white/30' 
                : 'bg-gray-100 dark:bg-white/20 text-gray-500 dark:text-white hover:text-red-500 dark:hover:bg-white/30'}`}
              onClick={handleDeleteClick}
              title={t('delete')}
            >
              <XMarkIcon className="h-4 w-4" />
            </motion.button>
          </div>
        </div>
        
        {/* Color Picker */}
        {showColorPicker && (
          <div 
            ref={colorPickerRef}
            className="absolute top-16 right-4 z-30 bg-white dark:bg-dark-600 rounded-lg shadow-lg p-3 w-48"
          >
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{t('changeColor')}</h4>
            <div className="flex flex-wrap gap-2 mb-2">
              {colorOptions.map((color) => (
                <motion.div 
                  key={color.value}
                  onClick={() => handleColorChange(color.value)}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className={`h-8 w-8 rounded-full cursor-pointer flex items-center justify-center
                           ${habit.bgColor === color.value ? 'ring-2 ring-offset-2 ring-primary-500' : ''}
                           ${color.value ? '' : 'bg-white dark:bg-dark-600 border border-gray-300 dark:border-dark-500'}`}
                  style={color.value ? { backgroundColor: color.value } : {}}
                  title={color.label}
                >
                  {habit.bgColor === color.value && (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-800" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  )}
                </motion.div>
              ))}
              <input
                type="color"
                value={habit.bgColor || '#FFFFFF'}
                onChange={handleCustomColorChange}
                className="h-8 w-8 rounded-full cursor-pointer overflow-hidden p-0 border-0"
                title="Custom Color"
              />
            </div>
          </div>
        )}
        
        {/* Streak if exists */}
        {habit.streak > 0 && (
          <motion.div 
            className={`flex items-center gap-1.5 ${habit.bgColor ? isLightColor(habit.bgColor) ? 'text-accent-600' : 'text-white' : 'text-accent-500'} text-sm mb-3`}
            initial={{ x: -10, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <FireIcon className="h-4 w-4" />
            <span>{habit.streak} {t('dayStreak')}</span>
          </motion.div>
        )}
      
        {/* Timer Card Content */}
        {habit.timerDuration ? (
          <div className="h-full flex flex-col">
            {/* Display count on completion or timer when active */}
            {timerCompleted ? (
              <div className="flex-1 flex items-center justify-center">
                <motion.div 
                  className={`text-6xl font-bold ${textColorClass} ${!habit.bgColor ? 'gradient-text' : ''}`}
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  key={habit.count}
                >
                  {habit.count}
                </motion.div>
              </div>
            ) : (
              <div className={`flex-1 flex flex-col items-center justify-center`}>
                <div className={`font-mono text-4xl font-bold tracking-wider mb-2 ${habit.bgColor ? textColorClass : 'text-primary-600 dark:text-primary-400'}`}>
                  {formatTime(timeLeft)}
                </div>
                <div className={`text-sm opacity-70 ${textColorClass}`}>
                  {t('habitCount')}: {habit.count}
                </div>
              </div>
            )}
            
            {/* Timer Button */}
            <motion.button 
              whileHover={{ scale: 1.03, y: -2 }}
              whileTap={{ scale: 0.97 }}
              className={`w-full py-2.5 px-4 rounded-xl font-medium border-2 shadow-sm
                         ${habit.bgColor && !isLightColor(habit.bgColor) 
                           ? `bg-transparent border-white/70 hover:border-white ${textColorClass}`
                           : `bg-transparent border-gray-700/70 hover:border-gray-700 ${textColorClass}`}`}
              onClick={handleTimerClick}
            >
              <div className="flex items-center justify-center gap-2">
                {timerCompleted ? (
                  <>
                    <PlayIcon className="h-5 w-5" />
                    <span>{t('startAgain')}</span>
                  </>
                ) : timerActive ? (
                  <>
                    <PauseIcon className="h-5 w-5" />
                    <span>{t('pause')}</span>
                  </>
                ) : (
                  <>
                    <PlayIcon className="h-5 w-5" />
                    <span>{timeLeft < habit.timerDuration * 60 ? t('resume') : t('start')}</span>
                  </>
                )}
              </div>
            </motion.button>
          </div>
        ) : (
          // For non-timer habits, show count in the center
          <div className="flex flex-col items-center justify-center h-full -mt-8">
            <motion.div 
              className={`text-6xl font-bold ${textColorClass} ${!habit.bgColor ? 'gradient-text' : ''}`}
              initial={{ scale: 1 }}
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 0.3, times: [0, 0.1, 1] }}
              key={habit.count} // This makes the animation trigger on count change
            >
              {habit.count}
            </motion.div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

// Use React.memo to prevent unnecessary re-renders
export default React.memo(BentoBox); 