/**
 * autoload.js
 * Side-effect import aggregator for global styles and scripts.
 *
 * @module autoload
 * @description This module serves as a central import point for all global
 * assets that need to be loaded once at application startup. It imports:
 *
 * External Dependencies:
 * - Bootstrap CSS framework (bootstrap.min.css)
 * - Bootstrap JavaScript bundle (bootstrap.js)
 *
 * Internal Assets:
 * - Global custom styles (inc/styles/style.css)
 * - DOM initialization script (inc/scripts/script.js)
 * - Loading animation styles (inc/styles/three-dots.css)
 *
 * Usage: Import this module once in App.js to ensure all global assets
 * are bundled and loaded. The imports are side-effect-only (no exports).
 *
 * @example
 * // In App.js
 * import './autoload';
 */

// Bootstrap CSS framework - provides responsive grid, components, and utilities.
// Source map files (.map) are included for development tooling and debugging support.
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/css/bootstrap.min.css.map";
import "bootstrap/dist/js/bootstrap.js";
import "bootstrap/dist/js/bootstrap.min.js.map";

// Application-specific styling and DOM-ready initialization.
// style.css: Custom CSS properties, font definitions (Poppins), and global theming.
// script.js: jQuery-based DOM initialization that hides the loading spinner on page load.
import "./inc/styles/style.css";
import "./inc/scripts/script.js";

// CSS loading spinner animation (three-dots pattern).
// Third-party library providing animated loading indicators using pure CSS.
import "./inc/styles/three-dots.css";

// Database scripts placeholder.
// Note: Database imports (e.g., src/backend/database.js) are imported directly
// where needed in the application rather than globally through this autoloader.
