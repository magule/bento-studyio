import React from 'react';
import { motion } from 'framer-motion';
import { XMarkIcon } from '@heroicons/react/24/outline';

const AboutModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;
  
  return (
    <motion.div 
      className="fixed inset-0 bg-black/50 backdrop-blur-md z-50 flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="w-full max-w-md bg-white dark:bg-dark-700 rounded-2xl shadow-xl overflow-hidden"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ type: "spring", damping: 25 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative">
          {/* Close button */}
          <button 
            className="absolute top-4 right-4 p-1.5 rounded-full bg-gray-100 dark:bg-dark-600 text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-dark-500"
            onClick={onClose}
          >
            <XMarkIcon className="w-5 h-5" />
          </button>
          
          {/* Header with gradient background */}
          <div className="bg-gradient-to-r from-primary-500 to-secondary-500 px-6 py-8 text-white">
            <h2 className="text-2xl font-bold mb-1">Studyio!</h2>
          </div>
          
          {/* Content */}
          <div className="p-6">
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-2 text-gray-800 dark:text-gray-200">About</h3>
             
              <p className="text-gray-600 dark:text-gray-400">
                It's a fun daily project lol
              </p>
            </div>
            
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-2 text-gray-800 dark:text-gray-200">Contact</h3>
              <p className="text-gray-600 dark:text-gray-400">
                For questions, feedback, or support, please email:
              </p>
              <a 
                href="mailto:furkankal@proton.me" 
                className="inline-block mt-1 text-primary-600 dark:text-primary-400 hover:underline"
              >
                temproture@proton.me
              </a>
            </div>
            
            <div className="mt-8 pt-4 border-t border-gray-200 dark:border-dark-500 text-center text-sm text-gray-500 dark:text-gray-400">
              <p>© {new Date().getFullYear()} FK-BÇ</p>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default AboutModal; 