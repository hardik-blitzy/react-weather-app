/**
 * App.js
 * Root application component with routing configuration.
 *
 * @module App
 * @description The main application component that configures React Router
 * and determines the initial landing page based on user state.
 *
 * Route Configuration:
 * - / (index): Home page (first visit) or Weather page (returning user)
 * - /support: Support and about page
 * - /weather: Main weather display page
 * - /weathermain: Detailed weather information page
 * - /forecast: 5-day weather forecast page
 * - /settings: Application settings page
 * - /* (catch-all): 404 Not Found page
 *
 * Landing Page Logic:
 * Uses localStorage key 'HOME_PAGE_SEEN' via the database module to
 * determine if user is a first-time visitor (shows Home/onboarding)
 * or returning user (shows Weather page directly).
 *
 * @see ./pages/ - Page components for each route
 * @see ./backend/app_backend - Database singleton for persistence
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

function App() {
  // Check if user has completed onboarding (seen home page)
  // First-time visitors see Home component; returning users go directly to Weather
  let homePageSeen = db.get("HOME_PAGE_SEEN");
  let DEFAULT_ROUTE_PAGE;
  homePageSeen
    ? (DEFAULT_ROUTE_PAGE = <WeatherApp />)
    : (DEFAULT_ROUTE_PAGE = <Home />);

  return (
    // BrowserRouter enables client-side routing for the SPA
    // Routes are matched in order; index route uses conditional landing page
    <BrowserRouter>
      <Routes>
        <Route index element={DEFAULT_ROUTE_PAGE} />
        <Route path="support" element={<Support />} />
        <Route path="weather" element={<WeatherApp />} />
        <Route path="weathermain" element={<WeatherMain />} />
        <Route path="forecast" element={<ForecastWeather />} />
        <Route path="settings" element={<Settings />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
