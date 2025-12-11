/**
 * Current Weather API Module
 * 
 * Handles weather data fetching, DOM updates, and weather icon mapping.
 * Uses centralized toast helper functions for consistent notifications.
 * 
 * @module getCurrentWeather
 * @requires jquery
 * @requires ../backend/app_backend
 * @requires ../inc/scripts/utilities
 * @requires ../utils/toastHelper
 */

import jQuery from "jquery";
import { db } from "../backend/app_backend";
import { getCurrentDate } from "../inc/scripts/utilities";
import { showError, showWarning, showInfo } from "../utils/toastHelper";

// Weather condition SVG icons - mapped to OpenWeatherMap condition codes
import Thunder from "./../assets/static/thunder.svg";
import Day from "./../assets/static/day.svg";
import Drizzle from "./../assets/static/rainy-5.svg";
import Rainy from "./../assets/static/rainy-7.svg";
import FreezingRain from "./../assets/static/freezing-rain.svg";
import Misty from "./../assets/static/mist.svg";
import BrokenClouds from "./../assets/static/broken-clouds.svg";
import OvercastClouds from "./../assets/static/overcast-clouds.svg";
import ScatteredClouds from "./../assets/static/scattered-clouds.svg";
import FewClouds from "./../assets/static/few-clouds.svg";
import Haze from "./../assets/static/haze.svg";

/**
 * Closes the utility component overlay by hiding related DOM elements.
 * Adds 'd-none' class to hide component and removes height modifier class.
 * 
 * @returns {void}
 */
export const closeUtilityComponent = () => {
	try {
		jQuery(($) => {
			try {
				$.noConflict();
				$(".cmp").addClass("d-none");
				$(".utility-component").removeClass("add-utility-component-height");
			} catch (innerError) {
				// Silently fail - UI component hide is non-critical
			}
		});
	} catch (error) {
		// Silently fail - UI component hide is non-critical
	}
};

/**
 * OpenWeatherMap API key for weather data requests.
 * @constant {string}
 */
export const API_KEY = "cd34f692e856e493bd936095b256b337";

/**
 * Current weather unit setting from database.
 * Defaults to "metric" (Celsius) if not set.
 * @constant {string}
 */
export const WEATHER_UNIT = db.get("WEATHER_UNIT") || "metric";

/**
 * Smoothly scrolls the viewport to the specified element.
 * Used for navigating to weather content after API responses.
 * 
 * @param {string} elementId - The DOM element ID to scroll to
 * @returns {void}
 */
export const scrollToElement = (elementId) => {
	try {
		const element = document.getElementById(`${elementId}`);
		if (element) {
			element.scrollIntoView({ behaviour: "smooth" });
		}
		// Silently fail if element not found - scroll is non-critical
	} catch (error) {
		// Silently fail - scroll is non-critical functionality
	}
};

/**
 * Maps weather unit database values to display abbreviations.
 * Creates default weather unit if not set in database.
 * 
 * Unit mapping:
 * - "celsius" -> "c"
 * - "farenheit" -> "f"
 * - "kelvin" -> "k"
 * 
 * @returns {string} Single character unit abbreviation (c, f, or k)
 */
export const checkWeatherUnitDeg = () => {
	try {
		let result;
		const weatherUnit = db.get("WEATHER_UNIT");
		
		if (weatherUnit) {
			switch (weatherUnit) {
				case "celsius":
					result = "c";
					break;

				case "farenheit":
					result = "f";
					break;

				case "kelvin":
					result = "k";
					break;

				default:
					result = "c";
			}
		} else {
			// Default to celsius if no unit preference is stored
			try {
				db.create("WEATHER_UNIT", "celsius");
			} catch (dbError) {
				// Silently fail on db create - use default anyway
			}
			result = "c";
		}

		return result;
	} catch (error) {
		// Fallback: return default unit 'c' if any error occurs
		return "c";
	}
};

/**
 * Handles weather search form submission.
 * Validates location tracking settings and fetches weather data.
 * 
 * @param {Event} e - Form submit event
 * @param {string} search - Optional search term (fallback if input is empty)
 * @returns {void}
 */
export const handleWeatherForm = (e, search) => {
	try {
		e.preventDefault();

		// Notify user if location tracking is disabled
		try {
			if (db.get("TRACK_SAVED_LOCATION_WEATHER") === "false") {
				showInfo("Changes settings to track default location", 1500).then((willProceed) => {
					scrollToElement("weatherContainer");
				});
			}
		} catch (dbError) {
			// Continue with form submission even if db check fails
		}

		const searchInput = jQuery("#searchWeather").val();
		const userSearch = searchInput || search || "";
		
		if (!userSearch.trim()) {
			showWarning("Please enter a location to search", 2000);
			return;
		}

		getCurrentWeather(userSearch.trim());
		scrollToElement("weatherContainer");
		
		// Clear search input after submission
		try {
			jQuery(($) => {
				$("#searchWeather").val("");
			});
		} catch (clearError) {
			// Non-critical - continue even if clearing fails
		}
	} catch (error) {
		showError("Failed to search for weather. Please try again.");
	}
};

/**
 * API key for API Ninjas city search service.
 * @constant {string}
 * @private
 */
const CITY_API_KEY = "lNhOELJHDMrwCwm40hFvwA==teZv2EboEGJfonOC";

/**
 * Searches for cities matching the given search term.
 * Uses API Ninjas city endpoint for autocomplete functionality.
 * 
 * @param {string} searchTerm - City name to search for
 * @param {Function} updateDataArray - Callback to update results array
 * @returns {void}
 */
export const findCity = (searchTerm, updateDataArray) => {
	try {
		// Validate inputs
		if (!searchTerm || typeof searchTerm !== 'string') {
			showWarning("Please enter a valid search term", 1500);
			return;
		}

		// Notify user if location tracking is disabled
		try {
			if (db.get("TRACK_SAVED_LOCATION_WEATHER") === "false") {
				showInfo("Changes settings to track default location", 1500).then((willProceed) => {
					scrollToElement("weatherContainer");
				});
			}
		} catch (dbError) {
			// Continue even if db check fails
		}

		jQuery(($) => {
			try {
				$.ajax({
					url: `https://api.api-ninjas.com/v1/city?name=${encodeURIComponent(searchTerm)}&limit=4`,
					processData: false,
					headers: {
						'X-Api-Key': CITY_API_KEY
					},
					success: (result, status, xhr) => {
						try {
							if (xhr.status !== 200) {
								showError("Something went wrong!", 1000);
							} else {
								// Pass successful results to callback
								if (typeof updateDataArray === 'function') {
									updateDataArray(result || []);
								}
							}
						} catch (successError) {
							showError("Failed to process city results.");
						}
					},
					error: (xhr, status, error) => {
						try {
							$("#searchWeather").val(" ");
							closeUtilityComponent();

							// Display appropriate error toast based on error type
							if (error === "") {
								showError("Network Error!", 1000).then((willProceed) => {
									scrollToElement("weatherContainer");
								});
							} else {
								showWarning(error || "Request failed", 1000).then((willProceed) => {
									scrollToElement("weatherContainer");
								});
							}
						} catch (errorHandlingError) {
							showError("An error occurred while searching.");
						}
					},
				});
			} catch (ajaxError) {
				showError("Failed to search for cities. Please try again.");
			}
		});
	} catch (error) {
		showError("An unexpected error occurred. Please try again.");
	}
};

/**
 * Current weather icon SVG reference.
 * Updated by checkWeatherCode based on weather condition.
 * @type {string}
 */
export let weatherSvg;

/**
 * Maps OpenWeatherMap condition codes to custom SVG weather icons.
 * Uses weather code ranges defined by OpenWeatherMap API documentation.
 * 
 * Weather code ranges:
 * - 200-299: Thunderstorm
 * - 300-399: Drizzle
 * - 500-599: Rain (511 = freezing rain)
 * - 700-799: Atmosphere (701 = mist, others = haze)
 * - 800: Clear sky
 * - 801-804: Clouds (few, scattered, broken, overcast)
 * 
 * @param {number} code - OpenWeatherMap weather condition code
 * @returns {string} SVG icon path for the weather condition
 */
export const checkWeatherCode = (code) => {
	// Thunderstorm conditions (200-299)
	if (code >= 200 && code < 300) {
		weatherSvg = Thunder;
	} 
	// Drizzle conditions (300-399)
	else if (code >= 300 && code < 400) {
		weatherSvg = Drizzle;
	} 
	// Rain conditions (500-599, except 511 freezing rain)
	else if (code >= 500 && code !== 511 && code < 600) {
		weatherSvg = Rainy;
	} 
	// Freezing rain (511)
	else if (code === 511) {
		weatherSvg = FreezingRain;
	} 
	// Mist (701)
	else if (code === 701) {
		weatherSvg = Misty;
	} 
	// Other atmosphere conditions (700-799, except 701)
	else if (code >= 700 && code !== 701 && code < 800) {
		weatherSvg = Haze;
	} 
	// Clear sky (800)
	else if (code === 800) {
		weatherSvg = Day;
	} 
	// Few clouds (801)
	else if (code === 801) {
		weatherSvg = FewClouds;
	} 
	// Scattered clouds (802)
	else if (code === 802) {
		weatherSvg = ScatteredClouds;
	} 
	// Broken clouds (803)
	else if (code === 803) {
		weatherSvg = BrokenClouds;
	} 
	// Overcast clouds (804)
	else if (code === 804) {
		weatherSvg = OvercastClouds;
	} 
	// Unknown weather code - no icon
	else {
		weatherSvg = "";
	}

	return weatherSvg;
};

/**
 * Updates the DOM with weather data from API response.
 * Handles both display updates and localStorage caching for offline support.
 * 
 * DOM elements updated:
 * - #weatherLocation: City name and country code
 * - #currentDeg: Temperature (rounded up)
 * - #weatherDes: Weather description
 * - #currentDate: Current formatted date
 * - #main-weather-icon-container: Weather condition icon
 * - #wind-value, #humidity-value, #pressure-value: Sub-weather details
 * 
 * @param {Object} result - OpenWeatherMap API response object
 * @returns {void}
 */
export const updateReactDom = (result) => {
	try {
		// Validate result object has required properties
		if (!result || !result.name || !result.sys || !result.main || !result.weather) {
			showError("Invalid weather data received.");
			return;
		}

		jQuery(($) => {
			try {
				$.noConflict();
				
				// Clear search and close utility overlay
				$("#searchWeather").val(" ");
				closeUtilityComponent();
				scrollToElement("weatherContainer");
				
				// Update main weather display with safe fallbacks
				const locationName = result.name || "Unknown";
				const countryCode = result.sys.country || "";
				const temperature = result.main.temp != null ? Math.ceil(result.main.temp) : "--";
				const description = result.weather[0]?.description || "No description";
				
				$("#weatherLocation").html(`${locationName} ${countryCode}`);
				$("#currentDeg").html(temperature);
				$("#weatherDes").html(description);
				$("#currentDate").html(getCurrentDate());
				
				// Set weather icon based on condition code
				const weatherCode = result.weather[0]?.id;
				if (weatherCode) {
					checkWeatherCode(weatherCode);
					$("#main-weather-icon-container").html(
						`<img src=${weatherSvg} alt="main-weather-icon" width="64" height="64"/>`
					);
				}
				
				// Update sub-weather detail components with safe fallbacks
				const windSpeed = result.wind?.speed != null ? result.wind.speed : "--";
				const humidity = result.main?.humidity != null ? result.main.humidity : "--";
				const pressure = result.main?.pressure != null ? result.main.pressure : "--";
				
				$("#wind-value").html(`${windSpeed} m/s`);
				$("#humidity-value").html(`${humidity} %`);
				$("#pressure-value").html(`${pressure} hPa`);
				
				// Cache weather data to localStorage for offline support
				try {
					db.create("WEATHER_LOCATION", `${locationName} ${countryCode}`);
					db.create("WEATHER_DEG", result.main.temp);
					db.create("WEATHER_DESCRIPTION", description);
					db.create("WEATHER_CODE", weatherCode);
					db.create("SUB_WEATHER_WIND_VALUE", `${windSpeed} m/s`);
					db.create("SUB_WEATHER_HUMIDITY_VALUE", `${humidity} %`);
					db.create("SUB_WEATHER_PRESSURE_VALUE", `${pressure} hPa`);
				} catch (cacheError) {
					// Non-critical - continue even if caching fails
				}
			} catch (domError) {
				showError("Failed to display weather data.");
			}
		});
	} catch (error) {
		showError("An unexpected error occurred while updating weather.");
	}
};

/**
 * Fetches current weather data for a given location.
 * Makes AJAX request to OpenWeatherMap API and updates DOM on success.
 * Displays appropriate toast notifications for success/error states.
 * 
 * @param {string} location - City name or location query string
 * @returns {void}
 */
export const getCurrentWeather = (location) => {
	try {
		// Validate location input
		if (!location || typeof location !== 'string' || !location.trim()) {
			showWarning("Please enter a valid location", 2000);
			return;
		}

		jQuery(($) => {
			try {
				const searchUrl = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(location)}&appid=${API_KEY}&units=${WEATHER_UNIT}`;

				$.ajax({
					url: searchUrl,
					processData: false,
					success: (result, status, xhr) => {
						try {
							if (xhr.status !== 200) {
								showError("Something went wrong!", 1000);
							} else {
								// Verify API returned successful response code
								if (result && result.cod === 200) {
									updateReactDom(result);
								} else {
									showError(result?.message || "Failed to get weather data", 2000);
								}
							}
						} catch (successError) {
							showError("Failed to process weather data.");
						}
					},
					error: (xhr, status, error) => {
						try {
							// Clear search field and close overlay on error
							$("#searchWeather").val(" ");
							closeUtilityComponent();

							// Display appropriate error toast based on error type
							if (error === "") {
								showError("Network Error!", 1000).then((willProceed) => {
									scrollToElement("weatherContainer");
								});
							} else {
								// Handle specific API errors
								const errorMessage = xhr.responseJSON?.message || error || "Request failed";
								showWarning(errorMessage, 1000).then((willProceed) => {
									scrollToElement("weatherContainer");
								});
							}
						} catch (errorHandlingError) {
							showError("An error occurred while fetching weather.");
						}
					},
				});
			} catch (ajaxError) {
				showError("Failed to fetch weather data. Please try again.");
			}
		});
	} catch (error) {
		showError("An unexpected error occurred. Please try again.");
	}
};
