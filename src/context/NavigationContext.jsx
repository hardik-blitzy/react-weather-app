/**
 * NavigationContext.jsx
 * 
 * React Context provider for managing splash screen visibility state and
 * navigation detection. This context enables the splash screen to appear
 * during route transitions (both forward and backward navigation).
 * 
 * Features:
 * - Detects route changes using useLocation hook from react-router-dom
 * - Provides isVisible boolean state for splash screen visibility
 * - Includes showSplash/hideSplash functions for manual control
 * - Auto-hides splash after SPLASH_DURATION milliseconds
 * - Includes cleanup to prevent memory leaks on rapid navigation
 * 
 * Usage:
 * - Wrap your app with NavigationProvider inside BrowserRouter
 * - Use useNavigation hook in components to access splash state
 */

import { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Duration in milliseconds that the splash screen remains visible
 * @constant {number}
 */
const SPLASH_DURATION = 800;

/**
 * NavigationContext
 * React Context for managing splash screen navigation state.
 * Default value is null - will be provided by NavigationProvider.
 */
const NavigationContext = createContext(null);

/**
 * NavigationProvider Component
 * 
 * Context provider that wraps the application to provide splash screen
 * visibility state and navigation detection capabilities.
 * 
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components to wrap
 * @returns {JSX.Element} Provider component wrapping children
 * 
 * @example
 * <BrowserRouter>
 *   <NavigationProvider>
 *     <App />
 *   </NavigationProvider>
 * </BrowserRouter>
 */
const NavigationProvider = ({ children }) => {
  // State for splash screen visibility
  const [isVisible, setIsVisible] = useState(false);
  
  // Track the previous pathname to detect actual route changes
  const [previousPath, setPreviousPath] = useState('');
  
  // Ref to store timeout ID for cleanup on rapid navigation
  const timeoutRef = useRef(null);
  
  // Track if this is the initial mount to skip first splash
  const isInitialMount = useRef(true);
  
  // Get current location from react-router-dom
  const location = useLocation();

  /**
   * Manually show the splash screen
   * Clears any existing hide timeout before showing
   */
  const showSplash = useCallback(() => {
    // Clear any existing timeout to prevent conflicts
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setIsVisible(true);
  }, []);

  /**
   * Manually hide the splash screen
   * Clears any existing hide timeout before hiding
   */
  const hideSplash = useCallback(() => {
    // Clear any existing timeout to prevent conflicts
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setIsVisible(false);
  }, []);

  /**
   * Effect to detect route changes and trigger splash screen
   * 
   * - Monitors location.pathname for changes
   * - Shows splash screen when route changes (forward or backward)
   * - Auto-hides splash after SPLASH_DURATION
   * - Includes cleanup to prevent memory leaks on rapid navigation
   */
  useEffect(() => {
    // Skip splash screen on initial app load - only show during navigation
    if (isInitialMount.current) {
      isInitialMount.current = false;
      setPreviousPath(location.pathname);
      return;
    }

    // Check if the route has actually changed
    if (location.pathname !== previousPath) {
      // Update the previous path to current
      setPreviousPath(location.pathname);
      
      // Show the splash screen
      setIsVisible(true);
      
      // Clear any existing timeout before setting a new one
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      
      // Set timeout to auto-hide splash after duration
      timeoutRef.current = setTimeout(() => {
        setIsVisible(false);
        timeoutRef.current = null;
      }, SPLASH_DURATION);
    }

    // Cleanup function to prevent memory leaks on rapid navigation
    // or component unmount
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    };
  }, [location.pathname, previousPath]);

  /**
   * Context value object containing all splash screen state and controls
   * @type {Object}
   * @property {boolean} isVisible - Current visibility state of splash screen
   * @property {Function} showSplash - Function to manually show splash screen
   * @property {Function} hideSplash - Function to manually hide splash screen
   * @property {number} SPLASH_DURATION - Duration splash remains visible (ms)
   */
  const contextValue = {
    isVisible,
    showSplash,
    hideSplash,
    SPLASH_DURATION
  };

  return (
    <NavigationContext.Provider value={contextValue}>
      {children}
    </NavigationContext.Provider>
  );
};

/**
 * useNavigation Custom Hook
 * 
 * Provides access to the NavigationContext for controlling
 * splash screen visibility from any component.
 * 
 * @returns {Object} Navigation context value with isVisible, showSplash, hideSplash, SPLASH_DURATION
 * @throws {Error} If used outside of NavigationProvider
 * 
 * @example
 * const { isVisible, showSplash, hideSplash, SPLASH_DURATION } = useNavigation();
 */
const useNavigation = () => {
  const context = useContext(NavigationContext);
  
  // Error handling for usage outside provider
  if (context === null) {
    throw new Error(
      'useNavigation must be used within a NavigationProvider. ' +
      'Make sure your component is wrapped with <NavigationProvider>.'
    );
  }
  
  return context;
};

// Named exports for NavigationProvider and useNavigation hook
export { NavigationProvider, useNavigation };

// Default export for NavigationContext (exposes Provider and Consumer)
export default NavigationContext;
