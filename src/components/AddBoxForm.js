import React, { useState, useContext } from 'react';
import { motion } from 'framer-motion';
import { ChevronUpIcon, ChevronDownIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { Disclosure } from '@headlessui/react';
import LanguageContext from '../contexts/LanguageContext';

// Map of color class names to hex values
const COLOR_MAP = {
  'bg-pastel-pink': '#F9A8D4',
  'bg-pastel-blue': '#A5B4FC',
  'bg-pastel-green': '#86EFAC',
  'bg-pastel-yellow': '#FCD34D',
  'bg-pastel-purple': '#C4B5FD',
  'bg-pastel-orange': '#FDBA74',
  'bg-pastel-teal': '#5EEAD4',
  'bg-pastel-coral': '#FCA5A5',
  'bg-lime-200': '#CFF08A'
};

const PASTEL_COLORS = [
  'bg-pastel-pink',
  'bg-pastel-blue',
  'bg-pastel-green',
  'bg-pastel-yellow',
  'bg-pastel-purple',
  'bg-pastel-orange',
  'bg-pastel-teal',
  'bg-pastel-coral',
  'bg-lime-200'
];

function AddBoxForm({ addHabit, onCancel }) {
  const { t } = useContext(LanguageContext);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [bgColor, setBgColor] = useState('bg-pastel-blue');
  const [count, setCount] = useState(0);
  const [timerDuration, setTimerDuration] = useState(0);
  const [showCustomTimer, setShowCustomTimer] = useState(false);
  const [showAdvancedOptions, setShowAdvancedOptions] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!title.trim()) return;
    
    const newHabit = {
      name: title.trim(),
      description: description.trim(),
      bgColor: COLOR_MAP[bgColor] || '', // Convert class name to hex value
      count,
      timerDuration: parseInt(timerDuration, 10) || 0
    };
    
    console.log('🆕 Submitting new habit:', newHabit);
    
    addHabit(newHabit);
    
    // Log localStorage after adding
    setTimeout(() => {
      console.log('🧾 Form localStorage check:', localStorage.getItem('habit-storage'));
    }, 300);
    
    // Reset form
    setTitle('');
    setDescription('');
    setBgColor('bg-pastel-blue');
    setCount(0);
    setTimerDuration(0);
  };

  return (
    <motion.div
      className="rounded-xl bg-white dark:bg-dark-800 shadow-xl overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      <div className="flex justify-between items-center p-4 bg-gradient-to-r from-blue-400/20 to-teal-400/20 dark:from-blue-500/30 dark:to-teal-500/30">
        <div>
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white">{t('addNewHabit')}</h2>
          <p className="text-sm text-gray-600 dark:text-gray-300 mt-0.5">Keep track of your habits and studies</p>
        </div>
        <button 
          onClick={onCancel}
          className="p-1 rounded-full bg-white/80 dark:bg-dark-700/80 hover:bg-white dark:hover:bg-dark-600 transition-colors"
        >
          <XMarkIcon className="w-5 h-5 text-gray-600 dark:text-gray-300" />
        </button>
      </div>
      
      <form onSubmit={handleSubmit} className="p-6">
        <div className="mb-6">
          <label className="block text-gray-700 dark:text-gray-200 mb-2 font-medium" htmlFor="title">
            {t('habitTitle')}
          </label>
          <input 
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-3 border border-gray-200 dark:border-dark-500 rounded-lg bg-white dark:bg-dark-700 text-gray-800 dark:text-gray-100 focus:ring focus:ring-blue-300 dark:focus:ring-blue-500 focus:border-blue-400 dark:focus:border-blue-500 outline-none transition-all"
            placeholder={t('habitTitlePlaceholder')}
            required
          />
        </div>
        
        <div className="mb-6">
          <label className="block text-gray-700 dark:text-gray-200 mb-2 font-medium" htmlFor="description">
            {t('description')}
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-3 border border-gray-200 dark:border-dark-500 rounded-lg bg-white dark:bg-dark-700 text-gray-800 dark:text-gray-100 focus:ring focus:ring-blue-300 dark:focus:ring-blue-500 focus:border-blue-400 dark:focus:border-blue-500 outline-none transition-all"
            placeholder={t('descriptionPlaceholder')}
            rows="2"
          />
        </div>

        {/* Timer Duration - Moved out of advanced options */}
        <div className="mb-6 bg-gray-50 dark:bg-dark-700 rounded-xl p-4 border border-gray-100 dark:border-dark-600">
          <label className="block text-gray-700 dark:text-gray-200 mb-3 font-medium flex items-center justify-between" htmlFor="timer">
            <div className="flex items-center gap-2">
              <span>{t('timerDuration')}</span>
              <label className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400 cursor-pointer bg-gray-100 dark:bg-dark-600 px-2 py-0.5 rounded-full">
                <input
                  type="checkbox"
                  checked={showCustomTimer}
                  onChange={() => setShowCustomTimer(!showCustomTimer)}
                  className="rounded text-blue-500 focus:ring-0 h-3 w-3 cursor-pointer"
                />
                <span>Custom</span>
              </label>
            </div>
            <span className="text-sm font-normal text-gray-600 dark:text-gray-400">
              {timerDuration ? `${timerDuration}${t('timerMinutes')}` : t('timerOff')}
            </span>
          </label>
          
          {/* Timer Range Slider */}
          <input
            type="range"
            id="timer"
            min="0"
            max="240"
            step="5"
            value={timerDuration}
            onChange={(e) => setTimerDuration(parseInt(e.target.value, 10))}
            className="w-full h-2 bg-gray-200 dark:bg-dark-500 rounded-lg appearance-none cursor-pointer accent-blue-500 mb-2"
          />
          <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mb-3">
            <span>0{t('timerMinutes')}</span>
            <span>120{t('timerMinutes')}</span>
            <span>240{t('timerMinutes')}</span>
          </div>
          
          {/* Custom Timer Input - Simplified */}
          {showCustomTimer && (
            <div className="flex items-center justify-center mb-3">
              <div className="flex items-center gap-2 px-3 py-1.5 bg-white dark:bg-dark-600 rounded-lg border border-gray-200 dark:border-dark-500 w-fit">
                <input
                  type="number"
                  min="0"
                  max="240"
                  value={timerDuration}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (value === '') {
                      setTimerDuration(0);
                    } else {
                      const numValue = parseInt(value, 10);
                      if (numValue >= 0 && numValue <= 240) {
                        setTimerDuration(numValue);
                      }
                    }
                  }}
                  className="w-16 bg-transparent border-none focus:ring-0 p-0 text-center text-gray-800 dark:text-gray-100"
                />
                <span className="text-sm text-gray-600 dark:text-gray-400">{t('timerMinutes')}</span>
              </div>
            </div>
          )}
        </div>
        
        <div className="mb-6">
          <label className="block text-gray-700 dark:text-gray-200 mb-2 font-medium">
            {t('backgroundColor')}
          </label>
          <div className="flex flex-wrap items-center gap-3">
            {PASTEL_COLORS.map((colorClass) => (
              <motion.button
                key={colorClass}
                type="button"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setBgColor(colorClass)}
                style={{ backgroundColor: COLOR_MAP[colorClass] }}
                className={`w-9 h-9 rounded-full p-0.5 transition-transform ${bgColor === colorClass ? 'ring-2 ring-offset-2 ring-blue-500' : ''}`}
                aria-label={`Select ${colorClass} color`}
              >
                {bgColor === colorClass && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-white/40 w-full h-full rounded-full flex items-center justify-center"
                  >
                    <div className="w-1.5 h-1.5 rounded-full bg-white"></div>
                  </motion.div>
                )}
              </motion.button>
            ))}
          </div>
        </div>

        <div className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <label className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400 cursor-pointer bg-gray-100 dark:bg-dark-600 px-2 py-0.5 rounded-full">
              <input
                type="checkbox"
                checked={showAdvancedOptions}
                onChange={() => setShowAdvancedOptions(!showAdvancedOptions)}
                className="rounded text-blue-500 focus:ring-0 h-3 w-3 cursor-pointer"
              />
              <span>{t('advancedOptions')}</span>
            </label>
          </div>
          
          {showAdvancedOptions && (
            <div className="p-4 bg-gray-50 dark:bg-dark-700 rounded-lg">
              <div>
                <label className="block text-gray-700 dark:text-gray-200 mb-2 font-medium" htmlFor="count">
                  {t('initialCount')}
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="range"
                    id="count"
                    min="0"
                    max="100"
                    value={count}
                    onChange={(e) => setCount(parseInt(e.target.value, 10))}
                    className="w-full h-2 bg-gray-200 dark:bg-dark-500 rounded-lg appearance-none cursor-pointer accent-blue-500"
                  />
                  <span className="text-gray-700 dark:text-gray-300 min-w-[2.5rem] text-center">
                    {count}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="flex gap-3 justify-end">
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-3 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-dark-600 hover:bg-gray-200 dark:hover:bg-dark-500 rounded-lg transition-colors"
          >
            {t('cancel')}
          </button>
          <button
            type="submit"
            className="px-6 py-3 bg-gradient-to-r from-blue-500 to-teal-500 text-white rounded-lg hover:shadow-lg hover:shadow-blue-300/50 dark:hover:shadow-blue-700/30 disabled:opacity-70 disabled:cursor-not-allowed transition-all"
            disabled={!title.trim()}
          >
            {t('addHabit')}
          </button>
        </div>
      </form>
    </motion.div>
  );
}

export default AddBoxForm; 