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
	try {
		//check if the user's device supports Geolocation API
		if (navigator.geolocation) {
			const OPTIONS = {
				enableHighAccuracy: true,
				maximumAge: 0,
				timeout: 30000, // 30 second timeout instead of Infinity for better UX
			};

			/**
			 * Error handler for geolocation failures.
			 * Displays a warning toast and scrolls to weather container.
			 * 
			 * @param {GeolocationPositionError} error - The geolocation error object
			 */
			const handleGeolocationError = (error) => {
				try {
					const errorMessage = error?.message || "Unable to get your location";
					showWarning(errorMessage, 1000).then((willProceed) => {
						// Scroll to weather container after notification
						weatherAPI.scrollToElement("weatherContainer");
					});
				} catch (handlerError) {
					showWarning("Location access failed.", 2000);
				}
			};

			try {
				navigator.geolocation.watchPosition(
					(position) => {
						try {
							// Validate position data
							if (!position || !position.coords) {
								showWarning("Invalid position data received.", 2000);
								return;
							}

							const longitude = position.coords.longitude;
							const latitude = position.coords.latitude;

							// Validate coordinates
							if (longitude == null || latitude == null) {
								showWarning("Unable to get accurate coordinates.", 2000);
								return;
							}

							//check if the user's position was saved before
							try {
								if (!db.get("USER_LONGITUDE") && !db.get("USER_LATITUDE")) {
									db.create("USER_LONGITUDE", longitude);
									db.create("USER_LATITUDE", latitude);
								}
							} catch (dbError) {
								// Continue even if db operations fail
							}

							// Get weather using coordinates
							jQuery(($) => {
								try {
									$.noConflict();

									const savedLongitude = db.get("USER_LONGITUDE") || longitude;
									const savedLatitude = db.get("USER_LATITUDE") || latitude;
									const URL = `https://api.openweathermap.org/data/2.5/weather?lat=${savedLatitude}&lon=${savedLongitude}&appid=${weatherAPI.API_KEY}&units=${weatherAPI.WEATHER_UNIT}`;

									$.ajax({
										url: URL,
										processData: false,
										success: (result, status, xhr) => {
											try {
												if (xhr.status !== 200) {
													// Use showError for API failures to indicate a problem
													showError("Something went wrong!", 3000).then((willProceed) => {
														//scroll to top after notification
														weatherAPI.scrollToElement("weatherContainer");
													});
												} else {
													//if API call was successful
													if (result && result.cod === 200) {
														weatherAPI.updateReactDom(result);
														weatherAPI.scrollToElement("weatherContainer");
													} else {
														showError(result?.message || "Failed to get weather.", 2000);
													}
												}
											} catch (successError) {
												showError("Failed to process weather data.");
											}
										},
										error: (xhr, status, error) => {
											try {
												const errorMessage = xhr.responseJSON?.message || error || "Network error";
												showWarning(errorMessage, 2000).then((willProceed) => {
													// Scroll to weather container after notification
													weatherAPI.scrollToElement("weatherContainer");
												});
											} catch (errorHandlerError) {
												showWarning("Failed to fetch weather data.", 2000);
											}
										},
									});
								} catch (ajaxError) {
									showError("Failed to connect to weather service.");
								}
							});
						} catch (positionError) {
							showWarning("Error processing location data.", 2000);
						}
					},
					handleGeolocationError,
					OPTIONS
				);
			} catch (watchError) {
				showWarning("Failed to start location tracking.", 2000);
			}
		} else {
			// Geolocation not supported by the browser
			showWarning("Geolocation not supported!", 3000);
		}
	} catch (error) {
		showWarning("An unexpected error occurred with location services.", 2000);
	}
};

export default getGeolocation;
