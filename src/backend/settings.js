/**
 * settings.js
 * User settings and preferences management.
 *
 * @module settings
 * @description Provides functions for managing user preferences
 * including default location, weather units, and app reset.
 * Uses the Database class for persistence via localStorage.
 *
 * localStorage keys used:
 * - USER_DEFAULT_LOCATION: User's preferred location
 * - TRACK_SAVED_LOCATION_WEATHER: Auto-fetch weather toggle
 * - WEATHER_UNIT: Temperature unit (metric/imperial)
 */

import { db } from "../backend/app_backend";
import jQuery from "jquery";
import Swal from "sweetalert2";
import navigate from "../inc/scripts/utilities";

/**
 * Saves the user's default location preference.
 * Validates input and displays appropriate feedback via SweetAlert2 toast.
 * 
 * @param {Event} e - Form submit event from the location input form
 * @returns {void}
 * @throws {void} Shows SweetAlert modal for invalid/empty location input
 */
export const saveLocation = (e) => {
	e.preventDefault();

	jQuery(($) => {
		$.noConflict();

		const $defaultLocation = $("#defaultLocation").val().trim();

		//check if the location is empty
		if ($defaultLocation === undefined || $defaultLocation == "") {
			Swal.fire({
				title: "Invalid Location!",
				html: "<p class=' text-center text-danger'>Please enter a valid location</p>",
				confirmButtonColor: "rgb(83, 166, 250)",
				allowOutsideClick: false,
				allowEscapeKey: false,
				allowEnterKey: false,
				timer: 4000,
			});
		} else {
			db.update("USER_DEFAULT_LOCATION", $defaultLocation);
			Swal.fire({
				text: "Location updated successfully!",
				icon: "success",
				toast: true,
				position: "top",
				showConfirmButton: false,
				timer: 3000,
			});
		}
	});
};

/**
 * Retrieves the user's saved default location.
 * 
 * @returns {string|null} The saved location string or null if not set
 */
export const getDefaultLocation = () => {
	return db.get("USER_DEFAULT_LOCATION");
};

/**
 * Resets all application settings to factory defaults.
 * Clears all localStorage data and redirects to home page.
 * WARNING: This action cannot be undone.
 * 
 * @returns {void}
 */
export const restoreFactorySettings = () => {
	db.destroy();
	navigate("/");
};

/**
 * Toggles automatic weather tracking for the saved location.
 * Reads checkbox state from '#flexSwitchCheckDefault' DOM element
 * and persists the preference with appropriate user feedback.
 * 
 * @returns {void}
 */
export const trackSavedLocationWeather = () => {
	jQuery(($) => {
		$.noConflict();
		const $toggleBtn = document.getElementById("flexSwitchCheckDefault");

		if ($toggleBtn.checked) {
			//check if the value is in the database, then update it
			if (db.get("TRACK_SAVED_LOCATION_WEATHER")) {
				db.update("TRACK_SAVED_LOCATION_WEATHER", true);
				Swal.fire({
					text: "Saved location would be tracked!",
					icon: "success",
					toast: true,
					position: "top",
					showConfirmButton: false,
					timer: 3000,
				});
			} else {
				db.create("TRACK_SAVED_LOCATION_WEATHER", true);
				Swal.fire({
					text: "Saved location would be tracked by default!",
					icon: "info",
					toast: true,
					position: "top",
					showConfirmButton: false,
					timer: 3000,
				});
			}
		} else {
			if (db.get("TRACK_SAVED_LOCATION_WEATHER")) {
				db.update("TRACK_SAVED_LOCATION_WEATHER", false);
				Swal.fire({
					text: "Saved location would not be tracked!",
					icon: "warning",
					toast: true,
					position: "top",
					showConfirmButton: false,
					timer: 3000,
				});
			}
		}
	});
};

/**
 * Checks if location tracking is enabled.
 * 
 * @returns {boolean} True if tracking is enabled, false otherwise
 */
export const checkTrackedLocation = () => {
	let value = db.get("TRACK_SAVED_LOCATION_WEATHER");
	if (value === true) {
		return true;
	} else {
		return false;
	}
};

/**
 * Updates the temperature unit preference.
 * Maps selection values to unit strings:
 * - "0" → "metric" (Celsius)
 * - "1" → "default" (Kelvin)
 * - "2" → "imperial" (Fahrenheit)
 * 
 * @param {Event} e - Change event from unit selector dropdown
 * @returns {void}
 */
export const changeWeatherUnit = (e) => {
	jQuery(($) => {
		e.preventDefault();
		const weatherUnit = $("#weatherUnitContainer").val();
		let unitToStore;
		// Map selection index to OpenWeatherMap unit parameter
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
				Swal.fire({
					toast:true,
					text:"Select a valid unit",
					icon:"warning",
					timer:1000,
					position:"top",
					showConfirmButton:false,
					
				})
				break;
		}
		//check if valuex exists in the DB
		if(db.get("WEATHER_UNIT")){
			db.update("WEATHER_UNIT",unitToStore);
			Swal.fire({
				toast:true,
				text:"Weather unit updated successfully",
				icon:"success",
				timer:1500,
				position:"top",
				showConfirmButton:false
			})
		}else{
			db.create("WEATHER_UNIT",unitToStore);
			Swal.fire({
				toast:true,
				text:"Weather unit stored successfully",
				icon:"info",
				timer:1500,
				position:"top",
				showConfirmButton:false
			})
		}
	});
};
