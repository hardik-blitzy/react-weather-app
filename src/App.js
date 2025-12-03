/**
 * App.js
 * 
 * Main application component that sets up React Router routing and integrates
 * the splash screen functionality for navigation transitions.
 * 
 * Architecture:
 * - BrowserRouter wraps NavigationProvider for useLocation access
 * - NavigationProvider manages splash screen visibility state
 * - AppContent contains route logic and renders SplashScreen + Routes
 * 
 * Navigation Flow:
 * 1. User triggers navigation (click, back button, etc.)
 * 2. NavigationContext detects route change via useLocation
 * 3. SplashScreen becomes visible with entry animation
 * 4. After SPLASH_DURATION (800ms), splash auto-hides with exit animation
 * 5. New route content is displayed
 */

import Home from "./pages/Home";
import Support from "./pages/Support";
import { Routes, Route, BrowserRouter } from "react-router-dom";
import WeatherApp from "./pages/Weather";
import WeatherMain from "./pages/WeatherMain";
import NotFound from "./pages/404";
import ForecastWeather from "./pages/ForecastWeather";
import Settings from "./pages/Settings";
import { db } from "./backend/app_backend";
import "./autoload";

// Splash screen component and navigation context for route transition effects
import SplashScreen from "./components/SplashScreen";
import { NavigationProvider } from "./context/NavigationContext";

/**
 * AppContent Component
 * 
 * Contains the main routing logic and splash screen integration.
 * Handles the HOME_PAGE_SEEN check to determine the default landing page.
 * Must be rendered inside NavigationProvider for splash screen to work.
 * 
 * Route Configuration:
 * - index ("/") → Weather or Home (based on HOME_PAGE_SEEN flag)
 * - /support → Support page
 * - /weather → Weather main page
 * - /weathermain → Weather main alternate
 * - /forecast → Forecast weather view
 * - /settings → Settings page
 * - * → 404 Not Found
 * 
 * @returns {JSX.Element} Fragment containing SplashScreen and Routes
 */
function AppContent() {
  // Check if user has seen the home page before
  // If true, skip Home and go directly to Weather page
  let homePageSeen = db.get("HOME_PAGE_SEEN");
  let DEFAULT_ROUTE_PAGE;
  homePageSeen
    ? (DEFAULT_ROUTE_PAGE = <WeatherApp />)
    : (DEFAULT_ROUTE_PAGE = <Home />);

  return (
    <>
      {/* Splash screen overlay - appears during navigation transitions */}
      <SplashScreen />
      
      {/* Main application routes */}
      <Routes>
        <Route index element={DEFAULT_ROUTE_PAGE} />
        <Route path="support" element={<Support />} />
        <Route path="weather" element={<WeatherApp />} />
        <Route path="weathermain" element={<WeatherMain />} />
        <Route path="forecast" element={<ForecastWeather />} />
        <Route path="settings" element={<Settings />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}

/**
 * App Component (Root)
 * 
 * The main application entry point that sets up the provider hierarchy.
 * 
 * Provider Structure (outer to inner):
 * 1. BrowserRouter - Provides routing context (required for useLocation)
 * 2. NavigationProvider - Provides splash screen visibility state
 * 3. AppContent - Application content with routes and splash screen
 * 
 * Note: BrowserRouter must wrap NavigationProvider because NavigationProvider
 * uses the useLocation hook internally to detect route changes.
 * 
 * @returns {JSX.Element} Application with routing and splash screen providers
 */
function App() {
  return (
    <BrowserRouter>
      <NavigationProvider>
        <AppContent />
      </NavigationProvider>
    </BrowserRouter>
  );
}

export default App;
