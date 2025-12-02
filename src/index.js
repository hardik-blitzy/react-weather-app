/**
 * index.js
 * Application entry point and bootstrap configuration.
 *
 * @module index
 * @description The main entry point for the React application. This file:
 *
 * 1. Creates the React root and mounts the App component
 * 2. Enables React.StrictMode for development warnings
 * 3. Configures and registers the service worker for PWA functionality
 * 4. Initializes web vitals performance monitoring
 *
 * Service Worker Configuration:
 * - scope: "/" - SW controls all routes from root
 * - updateViaCache: "none" - Always fetch fresh SW script
 * - onSuccess: Logs successful registration
 * - onUpdate: Logs when new SW version is available
 *
 * The service worker enables:
 * - Offline functionality via cached assets
 * - Faster subsequent page loads
 * - PWA installability
 *
 * @see ./App - Root application component
 * @see ./serviceWorkerRegistration - SW registration logic
 * @see ./reportWebVitals - Performance monitoring
 */

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import reportWebVitals from './reportWebVitals';

import * as serviceWorkerRegistration from './serviceWorkerRegistration';

// Create React root and render app with StrictMode for development checks
// StrictMode helps detect potential problems in the application
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Service worker configuration
// onSuccess: Called when SW is installed for the first time
// onUpdate: Called when a new SW version is available in the background
const config = {
  scope: "/",
  registerOptions: {
    updateViaCache: "none"
  },
  onSuccess: (registration) => {
    console.log("Service worker registration successful:", registration);
  },
  onUpdate: (registration) => {
    console.log("Service worker update available:", registration);
  },
};


serviceWorkerRegistration.register(config);

// Initialize optional performance monitoring
// Pass a callback function to log or send metrics to analytics
reportWebVitals();
