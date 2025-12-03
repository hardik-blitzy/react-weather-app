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
// Splash screen imports
import SplashScreen from "./components/SplashScreen";
import { NavigationProvider } from "./context/NavigationContext";

/**
 * AppContent Component
 * 
 * Inner component containing the main application routes.
 * Separated to enable useLocation hook usage inside NavigationProvider.
 * 
 * @returns {JSX.Element} Application routes with splash screen
 */
function AppContent() {
  let homePageSeen = db.get("HOME_PAGE_SEEN");
  let DEFAULT_ROUTE_PAGE;
  homePageSeen
    ? (DEFAULT_ROUTE_PAGE = <WeatherApp />)
    : (DEFAULT_ROUTE_PAGE = <Home />);

  return (
    <>
      <SplashScreen />
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
 * App Component
 * 
 * Root application component with routing and splash screen integration.
 * Wraps the application with BrowserRouter and NavigationProvider.
 * 
 * @returns {JSX.Element} Complete application structure
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
