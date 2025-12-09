import jQuery from "jquery";
import { db } from "../backend/app_backend";
import { showError, showWarning } from "../utils/toastHelper";
import * as weatherAPI from "./getCurrentWeather";

/**
 * Geolocation API Module
 * 
 * Handles browser geolocation functionality for automatic weather detection.
 * Uses the browser's Geolocation API to get user coordinates and fetch
 * weather data for their current location.
 * 
 * @module getGeolocation
 * @requires jquery
 * @requires ../backend/app_backend
 * @requires ../utils/toastHelper
 * @requires ./getCurrentWeather
 */

/**
 * Initializes geolocation tracking and weather fetching.
 * 
 * This function:
 * 1. Checks if the browser supports the Geolocation API
 * 2. Sets up a position watcher with high accuracy
 * 3. Stores user coordinates in the database
 * 4. Fetches weather data using the coordinates
 * 
 * Toast notifications are displayed for:
 * - Geolocation errors (permission denied, timeout, etc.)
 * - API request failures
 * - Unsupported browser geolocation
 * 
 * @function getGeolocation
 * @returns {void}
 * 
 * @example
 * // Initialize geolocation tracking
 * getGeolocation();
 */
const getGeolocation = () => {
	//check if the user's device supports Geolocation API
	if (navigator.geolocation) {
		const OPTIONS = {
			enableHighAccuracy: true,
			maximumAge: 0,
			timeout: Infinity,
		};

		/**
		 * Error handler for geolocation failures.
		 * Displays a warning toast and scrolls to weather container.
		 * 
		 * @param {GeolocationPositionError} error - The geolocation error object
		 */
		const error = (error) => {
			showWarning(error.message, 1000).then((willProceed) => {
				// Scroll to weather container after notification
				weatherAPI.scrollToElement("weatherContainer");
			});
		};

		navigator.geolocation.watchPosition(
			(position) => {
				//check if the user's position was saved before
				if (!db.get("USER_LONGITUDE") && !db.get("USER_LATITUDE")) {
					db.create("USER_LONGITUDE", position.coords.longitude);
					db.create("USER_LATITUDE", position.coords.latitude);
				} else {
					//if saved, then get the current weather using their coordinates

					jQuery(($) => {
						$.noConflict();

						const longitude = position.coords.longitude || db.get("USER_LONGITUDE"),
							  latitude = position.coords.latitude || db.get("USER_LATITUDE");
						const URL = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${weatherAPI.API_KEY}&units=${weatherAPI.WEATHER_UNIT}`;

						$.ajax({
							url: URL,
							processData: false,
							success: (result, status, xhr) => {
								if (xhr.status !== 200) {
									// Use showError for API failures to indicate a problem
									showError("Something went wrong!", 3000).then((willProceed) => {
										//scroll to top after notification
										weatherAPI.scrollToElement("weatherContainer");
									});
								} else {
									//if API call was successful
									if (result.cod === 200) {
										weatherAPI.updateReactDom(result);
										weatherAPI.scrollToElement("weatherContainer");
									}
								}
							},
							error: (xhr, status, error) => {
								showWarning(error, 2000).then((willProceed) => {
									// Scroll to weather container after notification
									weatherAPI.scrollToElement("weatherContainer");
								});
							},
						});
					});
				}
			},
			error,
			OPTIONS
		);
	} else {
		// Geolocation not supported by the browser
		showWarning("Geolocation not supported!", 3000);
	}
};

export default getGeolocation;
