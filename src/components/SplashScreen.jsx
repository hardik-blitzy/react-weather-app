/**
 * SplashScreen.jsx
 * 
 * A simple splash screen component that displays during navigation transitions.
 * Features the application logo and name with smooth fade-in/out animations.
 * 
 * Uses:
 * - framer-motion for entry/exit animations
 * - NavigationContext for visibility state management
 * - Existing CSS custom properties for consistent branding
 * 
 * @component
 */

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigation } from '../context/NavigationContext';
import Logo from '../assets/pic_1.png';

/**
 * Animation configuration for splash screen transitions
 * @constant {Object}
 */
const splashAnimationConfig = {
  initial: {
    opacity: 0,
    scale: 0.9
  },
  animate: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.3,
      ease: 'easeOut'
    }
  },
  exit: {
    opacity: 0,
    scale: 1.05,
    transition: {
      duration: 0.2,
      ease: 'easeIn'
    }
  }
};

/**
 * SplashScreen Component
 * 
 * Renders a full-viewport overlay with the application logo and name.
 * Appears during route transitions based on NavigationContext visibility state.
 * 
 * @returns {JSX.Element|null} Splash screen overlay or null when not visible
 * 
 * @example
 * // Usage in App.js
 * <NavigationProvider>
 *   <SplashScreen />
 *   <Routes>...</Routes>
 * </NavigationProvider>
 */
const SplashScreen = () => {
  // Get visibility state from navigation context
  const { isVisible } = useNavigation();

  return (
    <AnimatePresence mode="wait">
      {isVisible && (
        <motion.div
          key="splash-screen"
          className="splash-screen"
          initial={splashAnimationConfig.initial}
          animate={splashAnimationConfig.animate}
          exit={splashAnimationConfig.exit}
          data-testid="splash-screen"
        >
          {/* Logo container with animation */}
          <motion.div
            className="splash-logo-container"
            initial={{ y: -20, opacity: 0 }}
            animate={{ 
              y: 0, 
              opacity: 1,
              transition: { delay: 0.1, duration: 0.3 }
            }}
          >
            <img 
              src={Logo} 
              alt="Weather App Logo" 
              className="splash-logo"
              data-testid="splash-logo"
            />
          </motion.div>

          {/* Application title with animation */}
          <motion.h1
            className="splash-title"
            initial={{ y: 20, opacity: 0 }}
            animate={{ 
              y: 0, 
              opacity: 1,
              transition: { delay: 0.15, duration: 0.3 }
            }}
            data-testid="splash-title"
          >
            Weather App
          </motion.h1>

          {/* Optional subtitle for additional branding */}
          <motion.p
            className="splash-subtitle"
            initial={{ opacity: 0 }}
            animate={{ 
              opacity: 0.8,
              transition: { delay: 0.2, duration: 0.3 }
            }}
            data-testid="splash-subtitle"
          >
            Your daily forecast
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SplashScreen;
