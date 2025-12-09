/**
 * Toast Helper Utility Module
 * 
 * Centralized toast notification utility for the React Weather Application.
 * Provides pre-configured SweetAlert2 toast functions for consistent notifications.
 * 
 * This module replaces inline Swal.fire() calls throughout the application with
 * standardized, reusable one-liner function calls that maintain visual consistency.
 * 
 * @module toastHelper
 * @requires sweetalert2
 */

import Swal from "sweetalert2";

/**
 * Pre-configured Toast mixin using SweetAlert2.
 * 
 * Configuration follows existing patterns in the codebase:
 * - toast: true - Enables toast mode (non-blocking)
 * - position: "top" - Displays at top center of viewport
 * - showConfirmButton: false - No user interaction required
 * - timerProgressBar: true - Visual timer indicator for user feedback
 * 
 * @private
 */
const Toast = Swal.mixin({
  toast: true,
  position: "top",
  showConfirmButton: false,
  timerProgressBar: true,
});

/**
 * Displays a success toast notification.
 * 
 * Used for successful operations like:
 * - Location saved/updated successfully
 * - Weather unit updated successfully
 * - Settings saved successfully
 * 
 * @param {string} message - The text message to display in the toast
 * @param {number} [timer=2000] - Auto-dismiss duration in milliseconds
 * @returns {Promise} SweetAlert2 promise for optional chaining with .then()
 * 
 * @example
 * // Basic usage
 * showSuccess("Location saved successfully!");
 * 
 * @example
 * // With custom timer
 * showSuccess("Settings updated!", 3000);
 * 
 * @example
 * // With promise chaining
 * showSuccess("Data saved!").then(() => {
 *   navigate("/next-page");
 * });
 */
export const showSuccess = (message, timer = 2000) => {
  return Toast.fire({
    text: message,
    icon: "success",
    timer: timer,
  });
};

/**
 * Displays an error toast notification.
 * 
 * Used for error conditions like:
 * - Network errors
 * - Geolocation not supported
 * - API request failures
 * - Invalid operations
 * 
 * Has a longer default timer (3000ms) to ensure users notice error messages.
 * 
 * @param {string} message - The text message to display in the toast
 * @param {number} [timer=3000] - Auto-dismiss duration in milliseconds
 * @returns {Promise} SweetAlert2 promise for optional chaining with .then()
 * 
 * @example
 * // Basic usage
 * showError("Network error occurred");
 * 
 * @example
 * // With custom timer
 * showError("Connection failed", 5000);
 * 
 * @example
 * // With promise chaining for scroll behavior
 * showError("Unable to fetch data").then(() => {
 *   scrollToElement("weatherContainer");
 * });
 */
export const showError = (message, timer = 3000) => {
  return Toast.fire({
    text: message,
    icon: "error",
    timer: timer,
  });
};

/**
 * Displays a warning toast notification.
 * 
 * Used for warning conditions like:
 * - Geolocation permission denied
 * - Tracking disabled warnings
 * - Non-critical errors that don't block functionality
 * - Validation warnings
 * 
 * @param {string} message - The text message to display in the toast
 * @param {number} [timer=2500] - Auto-dismiss duration in milliseconds
 * @returns {Promise} SweetAlert2 promise for optional chaining with .then()
 * 
 * @example
 * // Basic usage
 * showWarning("Saved location would not be tracked!");
 * 
 * @example
 * // With custom timer
 * showWarning("Check your input", 2000);
 * 
 * @example
 * // With promise chaining
 * showWarning("Invalid selection").then(() => {
 *   resetForm();
 * });
 */
export const showWarning = (message, timer = 2500) => {
  return Toast.fire({
    text: message,
    icon: "warning",
    timer: timer,
  });
};

/**
 * Displays an informational toast notification.
 * 
 * Used for informational messages like:
 * - Settings hints
 * - Status updates
 * - Non-critical notifications
 * - User guidance messages
 * 
 * @param {string} message - The text message to display in the toast
 * @param {number} [timer=2000] - Auto-dismiss duration in milliseconds
 * @returns {Promise} SweetAlert2 promise for optional chaining with .then()
 * 
 * @example
 * // Basic usage
 * showInfo("Weather unit stored successfully");
 * 
 * @example
 * // With custom timer
 * showInfo("Loading weather data...", 1500);
 * 
 * @example
 * // With promise chaining for navigation
 * showInfo("Change settings to track default location").then(() => {
 *   scrollToElement("weatherContainer");
 * });
 */
export const showInfo = (message, timer = 2000) => {
  return Toast.fire({
    text: message,
    icon: "info",
    timer: timer,
  });
};
