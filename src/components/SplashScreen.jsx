/**
 * SplashScreen.jsx
 * 
 * Main splash screen presentational component that displays during navigation
 * transitions between screens. Renders a full-viewport fixed overlay with 
 * centered logo (pic_1.png) and app title "Weather App".
 * 
 * Uses framer-motion AnimatePresence for smooth entry/exit animations:
 * - Entry: opacity 0→1, scale 0.9→1 over 300ms with easeOut
 * - Exit: opacity 1→0, scale 1→1.1 over 200ms with easeIn
 * 
 * Consumes NavigationContext via useNavigation hook to determine visibility state.
 * 
 * @component
 */

import { motion, AnimatePresence } from 'framer-motion';
import { useNavigation } from '../context/NavigationContext';
import Logo from '../assets/pic_1.png';

/**
 * SplashScreen Component
 * 
 * Renders a full-viewport overlay with the application logo and name.
 * Appears during route transitions based on NavigationContext visibility state.
 * Provides visual feedback during navigation - both forward and backward.
 * 
 * CSS Classes Used:
 * - .splash-screen: Fixed full-viewport overlay with gradient background (z-index: 10001)
 * - .splash-logo: Logo sizing (150px width, auto height)
 * - .splash-title: White text, bold, 1.8rem font size
 * 
 * @returns {JSX.Element} AnimatePresence wrapper with conditional splash screen overlay
 * 
 * @example
 * // Usage in App.js (must be inside NavigationProvider)
 * <NavigationProvider>
 *   <SplashScreen />
 *   <Routes>...</Routes>
 * </NavigationProvider>
 */
const SplashScreen = () => {
  // Get visibility state from navigation context
  // isVisible is true when route change is detected, false after SPLASH_DURATION
  const { isVisible } = useNavigation();

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          key="splash-screen"
          className="splash-screen"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1.1 }}
          transition={{ 
            duration: 0.3,
            ease: 'easeOut',
            exit: { 
              duration: 0.2, 
              ease: 'easeIn' 
            }
          }}
          data-testid="splash-screen"
        >
          {/* Application logo */}
          <img 
            src={Logo} 
            alt="Weather App Logo" 
            className="splash-logo"
            data-testid="splash-logo"
          />
          
          {/* Application title */}
          <h1 className="splash-title" data-testid="splash-title">
            Weather App
          </h1>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SplashScreen;
