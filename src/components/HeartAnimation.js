import React, { useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';

// Simple component that doesn't rely on complex state management
const HeartAnimation = ({ isActive, onComplete }) => {
  // Create the heart emojis array with useMemo to avoid ESLint warning
  const heartEmojis = useMemo(() => ['❤️', '💖', '💕', '💗', '💓', '💘', '💝', '💞'], []);
  
  // Create static hearts array (no dynamic state)
  const hearts = useMemo(() => {
    const result = [];
    const heartCount = 100; // Reduced by ~30% from 150
    
    for (let i = 0; i < heartCount; i++) {
      // Distribute hearts across the entire screen
      result.push({
        id: `heart-${i}`,
        emoji: heartEmojis[Math.floor(Math.random() * heartEmojis.length)],
        // Position hearts across the entire width and height
        startX: Math.random() * 100, // Random horizontal position (0-100%)
        startY: 80 + Math.random() * 50, // Start position from lower part of screen (80-130%)
        scale: 1.5 + Math.random() * 2.5, // Much larger random size
        rotate: -30 + Math.random() * 60, // Random rotation
        duration: 4 + Math.random() * 4, // Slightly shorter duration (4-8s)
        delay: Math.random() * 2, // Shorter delay
      });
    }
    
    return result;
  }, [heartEmojis]);
  
  // Auto cleanup after animation
  useEffect(() => {
    if (isActive) {
      const timer = setTimeout(() => {
        if (onComplete) onComplete();
      }, 8000); // Reduced timeout so animation completes faster
      
      return () => clearTimeout(timer);
    }
  }, [isActive, onComplete]);
  
  if (!isActive) return null;
  
  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {/* Semi-transparent overlay with quick transition */}
      <div className="absolute inset-0 bg-black/10 backdrop-blur-[1px] transition-opacity duration-200"></div>
      
      {/* Hearts container */}
      <div className="absolute inset-0 overflow-hidden">
        {hearts.map((heart) => (
          <motion.div
            key={heart.id}
            className="absolute text-7xl md:text-8xl lg:text-9xl" // Much larger text size
            style={{
              left: `${heart.startX}%`,
              top: `${heart.startY}%`, // Position from top instead of bottom
            }}
            initial={{ 
              opacity: 0, 
              scale: 0, 
              rotate: 0
            }}
            animate={{
              y: `-${150 + Math.random() * 50}vh`, // Move hearts up the entire screen height
              opacity: [0, 1, 1, 0],
              scale: heart.scale,
              rotate: heart.rotate,
            }}
            transition={{
              duration: heart.duration,
              delay: heart.delay,
              ease: "easeOut",
              opacity: { 
                times: [0, 0.1, 0.7, 1],
                duration: heart.duration
              },
            }}
          >
            {heart.emoji}
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default HeartAnimation; 