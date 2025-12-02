/**
 * getCurrentWeather.js
 * Primary weather API integration module.
 *
 * @module getCurrentWeather
 * @description Handles all current weather data fetching, processing,
 * and DOM updates. Uses OpenWeatherMap API for weather data and
 * API Ninjas for city search functionality.
 *
 * This module provides:
 * - Weather data fetching from OpenWeatherMap API
 * - City search/autocomplete via API Ninjas
 * - Weather condition code to icon mapping
 * - DOM manipulation for weather display updates
 * - LocalStorage caching for offline access
 *
 * External APIs:
 * - OpenWeatherMap: https://api.openweathermap.org/data/2.5/weather
 * - API Ninjas: https://api.api-ninjas.com/v1/city
 *
 * WARNING: API keys are hard-coded for development convenience.
 * For production, move to environment variables.
 *
 * @see ../backend/app_backend - Database singleton for persistence
 * @see ../inc/scripts/utilities - Date formatting utilities
 */

import jQuery from "jquery";
import { db } from "../backend/app_backend";
import { getCurrentDate } from "../inc/scripts/utilities";
import Swal from "sweetalert2";
import Thunder from "./../assets/static/thunder.svg";
import Day from "./../assets/static/day.svg";
import Drizzle from "./../assets/static/rainy-5.svg";
import Rainy from "./../assets/static/rainy-7.svg";
import Snowy from "./../assets/static/snowy-6.svg";
import FreezingRain from "./../assets/static/freezing-rain.svg";
import Misty from "./../assets/static/mist.svg";
import BrokenClouds from "./../assets/static/broken-clouds.svg";
import OvercastClouds from "./../assets/static/overcast-clouds.svg";
import ScatteredClouds from "./../assets/static/scattered-clouds.svg";
import FewClouds from "./../assets/static/few-clouds.svg";
import Haze from "./../assets/static/haze.svg";

/**
 * Closes the utility component panel by hiding UI elements.
 * Uses jQuery to add/remove Bootstrap display classes.
 *
 * @returns {void}
 *
 * @example
 * closeUtilityComponent(); // Hides the search/utility panel
 */
export const closeUtilityComponent = () => {
	jQuery(($) => {
		$.noConflict();
		// Add d-none class to hide the component panel
		$(".cmp").addClass("d-none");
		// Remove height class to collapse utility component
		$(".utility-component").removeClass("add-utility-component-height");
	});
};

/**
 * OpenWeatherMap API key.
 *
 * WARNING: This API key is hard-coded for development convenience.
 * For production deployment, move this to environment variables:
 * - Create .env file with REACT_APP_OPENWEATHER_API_KEY=your_key
 * - Access via process.env.REACT_APP_OPENWEATHER_API_KEY
 * - Never commit API keys to version control
 *
 * @constant {string}
 */
export const API_KEY = "cd34f692e856e493bd936095b256b337";

/**
 * Temperature unit setting.
 * Retrieved from localStorage or defaults to "metric" (Celsius).
 * Valid values: "metric" (°C), "imperial" (°F), "default" (K)
 *
 * @constant {string}
 */
export const WEATHER_UNIT = db.get("WEATHER_UNIT") || "metric";

/**
 * Smoothly scrolls the page to bring the specified element into view.
 *
 * @param {string} elementId - The DOM element ID to scroll to (without #)
 * @returns {void}
 *
 * @example
 * scrollToElement('weatherContainer'); // Scrolls to weather display
 *
 * @note The 'behaviour' spelling is intentional for browser compatibility
 */
export const scrollToElement = (elementId) => {
	document
		.getElementById(`${elementId}`)
		.scrollIntoView({ behaviour: "smooth" });
};

/**
 * Gets the temperature unit symbol based on current settings.
 * Maps WEATHER_UNIT setting to display symbol.
 *
 * @returns {string} Temperature unit symbol: 'c' (Celsius), 'f' (Fahrenheit), or 'k' (Kelvin)
 *
 * @example
 * const unit = checkWeatherUnitDeg(); // Returns 'c', 'f', or 'k'
 */
export const checkWeatherUnitDeg = () => {
	let result;
	if (db.get("WEATHER_UNIT")) {
		switch (db.get("WEATHER_UNIT")) {
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
		// The weather unit is celsius if not defined in localStorage
		db.create("WEATHER_UNIT", "celsius");
		result = "c";
	}

	return result;
};

/**
 * Handles the weather search form submission.
 * Validates tracking settings and triggers weather fetch.
 *
 * @param {Event} e - Form submit event (preventDefault is called)
 * @param {string} [search] - Optional search term to use instead of input value
 * @returns {void}
 *
 * @example
 * <form onSubmit={(e) => handleWeatherForm(e)}>
 *   <input id="searchWeather" />
 * </form>
 */
export const handleWeatherForm = (e, search) => {
	e.preventDefault();

	// Check if tracking is disabled and notify user
	if (db.get("TRACK_SAVED_LOCATION_WEATHER") == "false") {
		Swal.fire({
			text: "Changes settings to track default location",
			icon: "info",
			timer: 1500,
			toast: true,
			showConfirmButton: false,
			position: "top",
		}).then((willProceed) => {
			scrollToElement("weatherContainer");
		});
	}

	// Get search value from input or use provided search parameter
	let userSearch = jQuery("#searchWeather").val() || search;

	// Fetch weather data for the searched location
	getCurrentWeather(userSearch.trim());

	// Navigate to weather display and clear search input
	scrollToElement("weatherContainer");
	jQuery(($) => {
		$("#searchWeather").val("");
	});
};

/**
 * Searches for cities matching the given search term using API Ninjas.
 * Returns up to 4 matching cities via callback.
 *
 * @param {string} searchTerm - City name or partial name to search
 * @param {Function} updateDataArray - Callback function receiving array of city results
 *   Each result object contains: name, country, latitude, longitude, population
 * @returns {void}
 *
 * @example
 * findCity('London', (cities) => {
 *   console.log(cities); // [{name: 'London', country: 'GB', ...}, ...]
 * });
 */
export const findCity = (searchTerm, updateDataArray) => {
	// Check if tracking is disabled and notify user
	if (db.get("TRACK_SAVED_LOCATION_WEATHER") == "false") {
		Swal.fire({
			text: "Changes settings to track default location",
			icon: "info",
			timer: 1500,
			toast: true,
			showConfirmButton: false,
			position: "top",
		}).then((willProceed) => {
			scrollToElement("weatherContainer");
		});
	}

	// API Ninjas API key - Used for city search/autocomplete functionality
	// WARNING: Should be moved to environment variables for production
	const XAPIKEY = "lNhOELJHDMrwCwm40hFvwA==teZv2EboEGJfonOC";

	jQuery(($) => {
		console.log("Ajax sent");
		$.ajax({
			// API Ninjas city search endpoint - limited to 4 results
			url: `https://api.api-ninjas.com/v1/city?name=${searchTerm}&limit=4`,
			processData: false,

			headers: {
				"X-Api-Key": XAPIKEY,
			},
			success: (result, status, xhr) => {
				if (xhr.status != 200) {
					// Handle non-200 response with error toast
					Swal.fire({
						toast: true,
						position: "top",
						text: "Something went wrong!",
						icon: "info",
						showConfirmButton: false,
						timer: 1000,
					});
				} else {
					// Check if the API returned a legit response
					console.log(result);
					// Pass city results to callback function
					updateDataArray(result);
				}
			},
			error: (xhr, status, error) => {
				// Clear search input and close utility panel on error
				$("#searchWeather").val(" ");
				closeUtilityComponent();
				console.log("Error");

				// Check if the error is empty (network error)
				if (error == "") {
					Swal.fire({
						toast: true,
						text: "Network Error!",
						icon: "info",
						timer: 1000,
						position: "top",
						showConfirmButton: false,
					}).then((willProceed) => {
						// Scroll to top when the promise is resolved!
						scrollToElement("weatherContainer");
					});
				} else {
					// Display API error message
					Swal.fire({
						toast: true,
						text: error,
						icon: "warning",
						timer: 1000,
						position: "top",
						showConfirmButton: false,
					}).then((willProceed) => {
						// Scroll to top when the promise is resolved!
						scrollToElement("weatherContainer");
					});
				}
			},
		});
	});
};

/**
 * Module-level variable storing the current weather icon SVG.
 * Set by checkWeatherCode() based on weather condition code.
 *
 * @type {string}
 */
export let weatherSvg;

/**
 * Maps OpenWeatherMap weather condition codes to SVG icon assets.
 * Sets the module-level weatherSvg variable with the appropriate icon.
 *
 * Weather Code Ranges (OpenWeatherMap API):
 * - 200-232: Thunderstorm → thunder.svg
 * - 300-321: Drizzle → rainy-5.svg (Drizzle icon)
 * - 500-504: Rain → rainy-7.svg (Rainy icon)
 * - 511: Freezing Rain → freezing-rain.svg
 * - 520-531: Shower Rain → rainy-7.svg
 * - 600-622: Snow → snowy-6.svg
 * - 701: Mist → mist.svg (Misty icon)
 * - 702-781: Atmosphere (haze, smoke, dust) → haze.svg
 * - 800: Clear Sky → day.svg
 * - 801: Few Clouds (11-25%) → few-clouds.svg
 * - 802: Scattered Clouds (25-50%) → scattered-clouds.svg
 * - 803: Broken Clouds (51-84%) → broken-clouds.svg
 * - 804: Overcast Clouds (85-100%) → overcast-clouds.svg
 *
 * @param {number} code - OpenWeatherMap weather condition code
 * @returns {string} Path to the corresponding SVG icon asset
 *
 * @see https://openweathermap.org/weather-conditions - Full weather code list
 *
 * @example
 * const iconPath = checkWeatherCode(800); // Returns day.svg path
 */
export const checkWeatherCode = (code) => {
	// Check the result code states and allocate different icon svg depending on the weather code
	if (code >= 200 && !(code >= 300)) {
		// 200-232: Thunderstorm conditions (thunder, lightning)
		weatherSvg = Thunder;
	} else if (code >= 300 && !(code != 400)) {
		// 300-321: Drizzle conditions (light rain)
		weatherSvg = Drizzle;
	} else if (code >= 500 && code != 511 && !(code >= 600)) {
		// 500-504, 520-531: Rain conditions (moderate to heavy)
		weatherSvg = Rainy;
	} else if (code >= 700 && code != 701 && !(code >= 800)) {
		// 700-781 (except 701): Atmosphere conditions (haze, smoke, dust, sand, fog)
		weatherSvg = Haze;
	} else if (code == 701) {
		// 701: Mist specifically uses different icon
		weatherSvg = Misty;
	} else if (code == 511) {
		// 511: Freezing rain (special case)
		weatherSvg = FreezingRain;
	} else if (code == 800) {
		// 800: Clear sky (day icon)
		weatherSvg = Day;
	} else if (code == 803) {
		// 803: Broken clouds (51-84% coverage)
		weatherSvg = BrokenClouds;
	} else if (code == 804) {
		// 804: Overcast clouds (85-100% coverage)
		weatherSvg = OvercastClouds;
	} else if (code == 801) {
		// 801: Few clouds (11-25% coverage)
		weatherSvg = FewClouds;
	} else if (code == 802) {
		// 802: Scattered clouds (25-50% coverage)
		weatherSvg = ScatteredClouds;
	} else {
		// Weather code doesn't exist or is not recognized
		weatherSvg = "";
	}

	return weatherSvg;
};

/**
 * Updates the DOM with weather data from API response.
 * Also caches weather data in localStorage for offline access.
 *
 * DOM elements updated:
 * - #weatherLocation: City name and country code
 * - #currentDeg: Temperature (rounded up)
 * - #weatherDes: Weather description text
 * - #currentDate: Current date string
 * - #main-weather-icon-container: Weather icon image
 * - #wind-value: Wind speed in m/s
 * - #humidity-value: Humidity percentage
 * - #pressure-value: Atmospheric pressure in hPa
 *
 * localStorage keys created:
 * - WEATHER_LOCATION, WEATHER_DEG, WEATHER_DESCRIPTION
 * - WEATHER_CODE, SUB_WEATHER_WIND_VALUE
 * - SUB_WEATHER_HUMIDITY_VALUE, SUB_WEATHER_PRESSURE_VALUE
 *
 * @param {Object} result - OpenWeatherMap API response object
 * @param {Object} result.main - Main weather data (temp, humidity, pressure)
 * @param {Object} result.sys - System data (country code)
 * @param {Object[]} result.weather - Weather condition array
 * @param {Object} result.wind - Wind data (speed)
 * @param {string} result.name - City name
 * @returns {void}
 *
 * @example
 * // Called after successful API response
 * updateReactDom(apiResponse);
 */
export const updateReactDom = (result) => {
	jQuery(($) => {
		$.noConflict();
		// Clear search input and close utility panel
		$("#searchWeather").val(" ");
		closeUtilityComponent();
		scrollToElement("weatherContainer");

		// Update location display with city name and country code
		$("#weatherLocation").html(`${result.name} ${result.sys.country}`);
		// Display temperature rounded up (Math.ceil)
		$("#currentDeg").html(Math.ceil(result.main.temp));
		// Show weather description (e.g., "clear sky", "light rain")
		$("#weatherDes").html(result.weather[0].description);
		// Show current formatted date
		$("#currentDate").html(getCurrentDate());

		// Determine weather icon based on condition code
		checkWeatherCode(result.weather[0].id);
		// Inject weather icon SVG image into container
		$("#main-weather-icon-container").html(
			`<img src=${weatherSvg} alt="main-weather-icon" width="64" height="64"/>`
		);

		// Update sub-weather component values (wind, humidity, pressure)
		$("#wind-value").html(`${result.wind.speed} m/s`);
		$("#humidity-value").html(`${result.main.humidity} %`);
		$("#pressure-value").html(`${result.main.pressure} hPa`);

		// Cache all weather data in localStorage for offline access
		db.create("WEATHER_LOCATION", `${result.name} ${result.sys.country}`);
		db.create("WEATHER_DEG", result.main.temp);
		db.create("WEATHER_DESCRIPTION", result.weather[0].description);
		db.create("WEATHER_CODE", result.weather[0].id);
		db.create("SUB_WEATHER_WIND_VALUE", `${result.wind.speed} m/s`);
		db.create("SUB_WEATHER_HUMIDITY_VALUE", `${result.main.humidity} %`);
		db.create("SUB_WEATHER_PRESSURE_VALUE", `${result.main.pressure} hPa`);
	});
};

/**
 * Fetches current weather data for the specified location.
 * Uses OpenWeatherMap Current Weather API.
 *
 * @param {string} location - City name to fetch weather for
 * @returns {void} Weather data is passed to updateReactDom on success
 *
 * @example
 * getCurrentWeather('London'); // Fetches and displays London weather
 * getCurrentWeather('New York,US'); // Fetches with country code
 */
export const getCurrentWeather = (location) => {
	jQuery(($) => {
		let userSearch = location;

		// Construct OpenWeatherMap API URL with city, API key, and units
		const SEARCH_URL = `https://api.openweathermap.org/data/2.5/weather?q=${userSearch}&appid=${API_KEY}&units=${WEATHER_UNIT}`;

		$.ajax({
			url: SEARCH_URL,
			processData: false,
			success: (result, status, xhr) => {
				if (xhr.status != 200) {
					// Handle non-200 response with error toast
					Swal.fire({
						toast: true,
						position: "top",
						text: "Something went wrong!",
						icon: "info",
						showConfirmButton: false,
						timer: 1000,
					});
				} else {
					// Check if the API returned a legit response
					if (result.cod === 200) {
						// Update DOM with weather data
						updateReactDom(result);
					}
				}
			},
			// Error handling: Show toast for network or API errors
			error: (xhr, status, error) => {
				// Clear search input and close utility panel on error
				$("#searchWeather").val(" ");
				closeUtilityComponent();

				// Check if the error is empty (network error)
				if (error == "") {
					Swal.fire({
						toast: true,
						text: "Network Error!",
						icon: "info",
						timer: 1000,
						position: "top",
						showConfirmButton: false,
					}).then((willProceed) => {
						// Scroll to top when the promise is resolved!
						scrollToElement("weatherContainer");
					});
				} else {
					// Display API error message
					Swal.fire({
						toast: true,
						text: error,
						icon: "warning",
						timer: 1000,
						position: "top",
						showConfirmButton: false,
					}).then((willProceed) => {
						// Scroll to top when the promise is resolved!
						scrollToElement("weatherContainer");
					});
				}
			},
		});
	});
};
