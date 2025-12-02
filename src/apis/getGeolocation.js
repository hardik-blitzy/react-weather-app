/**
 * getGeolocation.js
 * Browser geolocation API integration.
 *
 * @module getGeolocation
 * @description Handles browser geolocation tracking using
 * navigator.geolocation.watchPosition(). Automatically triggers
 * weather updates when user location changes.
 *
 * This module implements continuous location monitoring:
 * 1. Requests user permission for location access
 * 2. Stores initial coordinates in localStorage
 * 3. Fetches weather for user's coordinates on position updates
 * 4. Updates the UI via weatherAPI.updateReactDom()
 *
 * Security: Requires user permission for location access.
 * The browser will prompt the user before sharing location.
 * Works only in secure contexts (HTTPS or localhost).
 *
 * Note: This module registers a persistent watcher with no stop API.
 * The watcher continues running until the page is closed.
 *
 * localStorage keys used:
 * - USER_LONGITUDE: User's saved longitude coordinate
 * - USER_LATITUDE: User's saved latitude coordinate
 *
 * @see ./getCurrentWeather.js - weatherAPI namespace for DOM updates
 * @see https://developer.mozilla.org/en-US/docs/Web/API/Geolocation_API
 */

import jQuery from "jquery";
import { db } from "../backend/app_backend";
import Swal from "sweetalert2";
import * as weatherAPI from "./getCurrentWeather";

/**
 * Starts watching user's geolocation and triggers weather updates.
 * Uses navigator.geolocation.watchPosition for continuous tracking.
 *
 * Flow:
 * 1. Checks for Geolocation API support in browser
 * 2. Sets up position watcher with high accuracy options
 * 3. On first position: stores coordinates in localStorage
 * 4. On subsequent positions: fetches weather for current coordinates
 *
 * @returns {void}
 * @throws {GeolocationPositionError} Displays SweetAlert2 toast on location errors:
 *   - PERMISSION_DENIED: User denied location access
 *   - POSITION_UNAVAILABLE: Location info unavailable
 *   - TIMEOUT: Location request timed out
 *
 * @example
 * // Start tracking user location and auto-fetch weather
 * import getGeolocation from './getGeolocation';
 * getGeolocation();
 */
const getGeolocation = () => {
	//check if the user's device supports Geolocation API
	if (navigator.geolocation) {
		// Geolocation watcher options:
		// - enableHighAccuracy: Use GPS if available for precise location
		// - maximumAge: 0 = always get fresh position, no caching
		// - timeout: Infinity = wait indefinitely for position
		const OPTIONS = {
			enableHighAccuracy: true,
			maximumAge: 0,
			timeout: Infinity,
		};

		// Error callback displays user-friendly toast message
		// Common errors: permission denied, position unavailable, timeout
		const error = (error) => {
			Swal.fire({
				toast: true,
				text: error.message,
				icon: "warning",
				timer: 1000,
				position: "top",
				showConfirmButton: false,
			}).then((willProceed)=>{
				// @see line 52
				weatherAPI.scrollToElement("weatherContainer");
				
			});
		};

		// Register persistent location watcher
		// NOTE: No unwatch mechanism exposed - runs until page closes
		navigator.geolocation.watchPosition(
			(position) => {
				// First-time users: Store initial coordinates for future reference
				// db keys: USER_LONGITUDE, USER_LATITUDE
				if (!db.get("USER_LONGITUDE") && !db.get("USER_LATITUDE")) {
					db.create("USER_LONGITUDE", position.coords.longitude);
					db.create("USER_LATITUDE", position.coords.latitude);
				} else {
					//if saved, then get the current weather using their coordinates

					jQuery(($) => {
						$.noConflict();

						// Build OpenWeatherMap API URL with coordinates
						// Uses weatherAPI.API_KEY and weatherAPI.WEATHER_UNIT from getCurrentWeather module
						// Falls back to stored coordinates if current position unavailable
						const longitude = position.coords.longitude || db.get("USER_LONGITUDE"),
							  latitude = position.coords.latitude || db.get("USER_LATITUDE");
						const URL = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${weatherAPI.API_KEY}&units=${weatherAPI.WEATHER_UNIT}`;

						$.ajax({
							url: URL,
							processData: false,
							success: (result, status, xhr) => {
								if (xhr.status != 200) {
									Swal.fire({
										toast: true,
										position: "top",
										text: "Something went wrong!",
										icon: "info",
										showConfirmButton: false,
										timer: 3000,
									}).then((willProceed)=>{
										//scroll to top after notification
										weatherAPI.scrollToElement("weatherContainer");

									})
								} else {
									// Update UI with weather data and scroll to weather container
									if (result.cod == 200) {
										weatherAPI.updateReactDom(result);
										weatherAPI.scrollToElement("weatherContainer");
									}
								}
							},
							error: (xhr, status, error) => {
								Swal.fire({
									toast: true,
									text: error,
									icon: "warning",
									timer: 2000,
									position: "top",
									showConfirmButton: false,
								}).then((willProceed)=>{
									// @see line 52
									weatherAPI.scrollToElement("weatherContainer");
									
								})
							},
						});
					});
				}
			},
			error,
			OPTIONS
		);
	} else {
		Swal.fire({
			toast: true,
			text: "Geolocation not supported!",
			icon: "error",
			position: "top",
			showConfirmButton: false,
			timer: 3000,
		});
	}
};

export default getGeolocation;
