/**
 * Settings Backend Module
 * 
 * Handles user settings and preferences for the React Weather Application.
 * Manages location settings, weather unit preferences, and tracking configuration.
 * 
 * Uses centralized toast helper functions for consistent notification display.
 * 
 * @module settings
 * @requires ../backend/app_backend
 * @requires jquery
 * @requires ../utils/toastHelper
 * @requires ../inc/scripts/utilities
 */

import { db } from "../backend/app_backend";
import jQuery from "jquery";
import { showSuccess, showError, showWarning, showInfo } from "../utils/toastHelper";
import navigate from "../inc/scripts/utilities";

/**
 * Saves the user's default location preference.
 * 
 * Validates the input location and updates the database if valid.
 * Displays appropriate toast notifications for success or validation errors.
 * 
 * @param {Event} e - The form submit event
 * @returns {void}
 * 
 * @example
 * // Usage in form onSubmit handler
 * <form onSubmit={saveLocation}>
 *   <input id="defaultLocation" />
 * </form>
 */
export const saveLocation = (e) => {
	try {
		e.preventDefault();

		jQuery(($) => {
			try {
				$.noConflict();

				const $defaultLocation = $("#defaultLocation").val();
				const trimmedLocation = $defaultLocation ? $defaultLocation.trim() : "";

				// Check if the location is empty
				if (trimmedLocation === undefined || trimmedLocation === "") {
					showError("Please enter a valid location", 4000);
				} else {
					db.update("USER_DEFAULT_LOCATION", trimmedLocation);
					showSuccess("Location updated successfully!", 3000);
				}
			} catch (innerError) {
				showError("Failed to save location. Please try again.");
			}
		});
	} catch (error) {
		showError("An unexpected error occurred. Please try again.");
	}
};

/**
 * Retrieves the user's default location from the database.
 * 
 * @returns {string|null} The saved default location or null if not set
 * 
 * @example
 * const location = getDefaultLocation();
 * if (location) {
 *   fetchWeatherForLocation(location);
 * }
 */
export const getDefaultLocation = () => {
	try {
		return db.get("USER_DEFAULT_LOCATION");
	} catch (error) {
		// Fallback: return null if database access fails
		return null;
	}
};

/**
 * Restores all settings to factory defaults.
 * 
 * Destroys all stored data in the database and navigates to the home page.
 * This action is irreversible.
 * 
 * @returns {void}
 * 
 * @example
 * // Usage in reset settings button
 * <button onClick={restoreFactorySettings}>Reset All Settings</button>
 */
export const restoreFactorySettings = () => {
	try {
		db.destroy();
		navigate("/");
	} catch (error) {
		// Fallback: attempt navigation even if destroy fails
		try {
			navigate("/");
		} catch (navError) {
			// If navigation also fails, reload the page as last resort
			window.location.href = "/";
		}
	}
};

/**
 * Toggles the saved location weather tracking feature.
 * 
 * When enabled, the application will automatically fetch weather for the
 * saved default location. Displays appropriate toast notifications based
 * on the toggle state and whether it's a new setting or update.
 * 
 * @returns {void}
 * 
 * @example
 * // Usage in checkbox onChange handler
 * <input 
 *   type="checkbox" 
 *   id="flexSwitchCheckDefault" 
 *   onChange={trackSavedLocationWeather} 
 * />
 */
export const trackSavedLocationWeather = () => {
	try {
		jQuery(($) => {
			try {
				$.noConflict();
				const $toggleBtn = document.getElementById("flexSwitchCheckDefault");

				// Fallback if toggle button not found
				if (!$toggleBtn) {
					showError("Settings control not found. Please refresh the page.");
					return;
				}

				if ($toggleBtn.checked) {
					// Check if the value is in the database, then update it
					if (db.get("TRACK_SAVED_LOCATION_WEATHER")) {
						db.update("TRACK_SAVED_LOCATION_WEATHER", true);
						showSuccess("Saved location would be tracked!", 3000);
					} else {
						db.create("TRACK_SAVED_LOCATION_WEATHER", true);
						showInfo("Saved location would be tracked by default!", 3000);
					}
				} else {
					if (db.get("TRACK_SAVED_LOCATION_WEATHER")) {
						db.update("TRACK_SAVED_LOCATION_WEATHER", false);
						showWarning("Saved location would not be tracked!", 3000);
					}
				}
			} catch (innerError) {
				showError("Failed to update tracking settings.");
			}
		});
	} catch (error) {
		showError("An unexpected error occurred. Please try again.");
	}
};

/**
 * Checks if location tracking is currently enabled.
 * 
 * @returns {boolean} True if location tracking is enabled, false otherwise
 * 
 * @example
 * if (checkTrackedLocation()) {
 *   fetchWeatherForSavedLocation();
 * }
 */
export const checkTrackedLocation = () => {
	try {
		// Returns true only if tracking is explicitly enabled
		return db.get("TRACK_SAVED_LOCATION_WEATHER") === true;
	} catch (error) {
		// Fallback: return false if database access fails
		return false;
	}
};

/**
 * Changes the weather unit preference.
 * 
 * Converts the dropdown selection value to the corresponding unit string
 * and stores it in the database. Supports metric, default (Kelvin), and
 * imperial unit systems.
 * 
 * Unit mapping:
 * - "0" -> "metric" (Celsius)
 * - "1" -> "default" (Kelvin)
 * - "2" -> "imperial" (Fahrenheit)
 * 
 * @param {Event} e - The form submit or change event
 * @returns {void}
 * 
 * @example
 * // Usage in select onChange handler
 * <select id="weatherUnitContainer" onChange={changeWeatherUnit}>
 *   <option value="0">Metric (°C)</option>
 *   <option value="1">Default (K)</option>
 *   <option value="2">Imperial (°F)</option>
 * </select>
 */
export const changeWeatherUnit = (e) => {
	try {
		jQuery(($) => {
			try {
				e.preventDefault();
				const weatherUnit = $("#weatherUnitContainer").val();
				let unitToStore;
				switch (weatherUnit) {
					case "0":
						unitToStore = "metric";
						break;
					case "1":
						unitToStore = "default";
						break;
					case "2":
						unitToStore = "imperial";
						break;
					
					default:
						showWarning("Select a valid unit", 1000);
						return;
				}

				// Validate unit was set before saving
				if (!unitToStore) {
					showWarning("Please select a valid weather unit", 1500);
					return;
				}

				// Check if value exists in the DB
				if(db.get("WEATHER_UNIT")){
					db.update("WEATHER_UNIT",unitToStore);
					showSuccess("Weather unit updated successfully", 1500);
				}else{
					db.create("WEATHER_UNIT",unitToStore);
					showInfo("Weather unit stored successfully", 1500);
				}
			} catch (innerError) {
				showError("Failed to update weather unit.");
			}
		});
	} catch (error) {
		showError("An unexpected error occurred. Please try again.");
	}
};
