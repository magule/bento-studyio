import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PlusIcon, ArrowPathIcon, TrashIcon, ChartBarIcon, BookOpenIcon, SparklesIcon } from '@heroicons/react/24/outline';

const TutorialOverlay = ({ onComplete }) => {
  const [step, setStep] = useState(0);
  const steps = [
    {
      title: "Welcome to Study.o!",
      description: "Your personal space to track studies, build habits, and achieve your academic goals.",
      icon: <SparklesIcon className="w-10 h-10" />,
      gradient: "from-primary-500 to-purple-600"
    },
    {
      title: "Track Your Progress",
      description: "Create and monitor your study sessions, assignments, and learning goals with beautiful cards.",
      icon: <ChartBarIcon className="w-8 h-8" />,
      gradient: "from-purple-500 to-pink-500"
    },
    {
      title: "Build Study Habits",
      description: "Set timers, track streaks, and build consistent study routines that stick.",
      icon: <BookOpenIcon className="w-8 h-8" />,
      gradient: "from-pink-500 to-rose-500"
    },
    {
      title: "Stay Organized",
      description: "Easily manage your study cards with intuitive controls and beautiful visuals.",
      icon: <PlusIcon className="w-8 h-8" />,
      gradient: "from-rose-500 to-primary-500"
    }
  ];

  const handleNext = () => {
    if (step < steps.length - 1) {
      setStep(step + 1);
    } else {
      onComplete();
    }
  };

  return (
    <motion.div
      className="fixed inset-0 bg-black/70 backdrop-blur-md z-50 flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="bg-white dark:bg-dark-800 rounded-3xl shadow-2xl overflow-hidden max-w-md mx-4 relative"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ type: "spring", damping: 25 }}
      >
        {/* Animated gradient background */}
        <motion.div
          className={`absolute inset-0 bg-gradient-to-r ${steps[step].gradient} opacity-10 dark:opacity-20`}
          animate={{
            scale: [1, 1.1, 1],
            rotate: [0, 3, 0],
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />

        <div className="relative p-8">
          <motion.div
            key={step}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="text-center"
          >
            {/* Icon with gradient background */}
            <div className="mb-8 flex justify-center">
              <motion.div 
                className={`p-4 rounded-2xl bg-gradient-to-r ${steps[step].gradient} text-white shadow-xl`}
                animate={{ 
                  scale: [1, 1.05, 1],
                }}
                transition={{ 
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                {steps[step].icon}
              </motion.div>
            </div>
            
            {/* Title with gradient text */}
            <motion.h2 
              className={`text-3xl font-bold mb-4 bg-gradient-to-r ${steps[step].gradient} bg-clip-text text-transparent`}
              animate={{ 
                scale: [1, 1.02, 1],
              }}
              transition={{ 
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              {steps[step].title}
            </motion.h2>
            
            <p className="text-gray-600 dark:text-gray-300 text-lg mb-8 leading-relaxed">
              {steps[step].description}
            </p>
            
            <div className="flex justify-between items-center">
              {/* Progress dots */}
              <div className="flex gap-2">
                {steps.map((_, i) => (
                  <motion.div
                    key={i}
                    className={`w-2.5 h-2.5 rounded-full ${
                      i === step
                        ? `bg-gradient-to-r ${steps[step].gradient}`
                        : 'bg-gray-300 dark:bg-gray-600'
                    }`}
                    animate={i === step ? { 
                      scale: [1, 1.2, 1],
                    } : {}}
                    transition={{ 
                      duration: 1.5,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  />
                ))}
              </div>
              
              {/* Next/Get Started button */}
              <motion.button
                onClick={handleNext}
                className={`px-6 py-2.5 rounded-xl font-medium text-white shadow-lg bg-gradient-to-r ${steps[step].gradient} hover:shadow-xl transition-shadow`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {step === steps.length - 1 ? "Get Started" : "Next"}
              </motion.button>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default TutorialOverlay; 