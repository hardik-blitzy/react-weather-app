/**
 * Forecast Weather Page Component
 * 
 * Displays 5-day weather forecast with 3-hour intervals.
 * Fetches data from OpenWeatherMap API and caches forecast values.
 * Uses centralized toast helper for consistent error/info notifications.
 * 
 * @component ForecastWeather
 */

import React, { useState, useEffect } from "react";
import Footer from "../components/footer";
import navigate from "../inc/scripts/utilities";
import Button from "./../components/button";
import jQuery from "jquery";
import { db } from "../backend/app_backend";
import * as currentWeather from "./../apis/getCurrentWeather";
import ForecastDailyWeatherComponent from "./../components/forecastWeatherComponent";
import { showError, showInfo } from "../utils/toastHelper";
import * as utilis from "./../inc/scripts/utilities";

/**
 * OpenWeatherMap API configuration
 * @constant {string} API_KEY - API key for OpenWeatherMap services
 */
const API_KEY = "cd34f692e856e493bd936095b256b337";

/**
 * Weather data template class for structuring forecast information
 * Encapsulates weather data for a single time interval
 */
class WeatherTemplate {
	constructor(id, time, icon, unit, title) {
		this.id = id;
		this.time = time;
		this.icon = icon;
		this.unit = unit;
		this.title = title;
	}
}

const ForecastWeather = () => {
	// Redirect to home if user hasn't completed initial setup
	if (!db.get("HOME_PAGE_SEEN")) {
		navigate("/");
	}

	// State for utility footer component insertion
	const [componentToInsert, setComponentToInsert] = useState("");
	// State for forecast API response data
	const [forecastData, setForecastData] = useState(null);

	/**
	 * Fetches forecast data from OpenWeatherMap API on component mount.
	 * Constructs URL based on available user location data (city name or coordinates).
	 */
	useEffect(() => {
		try {
			jQuery(($) => {
				try {
					$.noConflict();
					
					// Get location data with safe fallbacks
					let weatherUnit, userCity, userLatitude, userLongitude;
					try {
						weatherUnit = db.get("WEATHER_UNIT") || "metric";
						userCity = db.get("USER_DEFAULT_LOCATION");
						userLatitude = db.get("USER_LATITUDE");
						userLongitude = db.get("USER_LONGITUDE");
					} catch (dbError) {
						weatherUnit = "metric";
						userCity = null;
						userLatitude = null;
						userLongitude = null;
					}
					
					// Build forecast URL based on available location data
					let forecastUrl;
					if (userCity === null && userLatitude === null && userLongitude === null) {
						// No location data available - display error toast
						showError("No saved location found!");
						return;
					} else if (userCity === null && userLatitude !== null && userLongitude !== null) {
						// Use coordinates when city name is not available
						forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${userLatitude}&lon=${userLongitude}&appid=${API_KEY}&units=${weatherUnit}`;
					} else {
						// Prefer city name for location query
						forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(userCity)}&appid=${API_KEY}&units=${weatherUnit}`;
					}

					$.ajax({
						url: forecastUrl,
						success: (result, status, xhr) => {
							try {
								if (result && (result.cod === "200" || result.cod === 200)) {
									setForecastData(result);
								} else {
									showError(result?.message || "Failed to load forecast data.", 2000);
								}
							} catch (successError) {
								showError("Failed to process forecast data.");
							}
						},
						error: (xhr, status, error) => {
							try {
								// Handle network errors vs API errors differently
								if (error === "") {
									showInfo("Network Error!", 1000).then(() => {
										currentWeather.scrollToElement("forecastPage");
									});
								} else {
									const errorMessage = xhr.responseJSON?.message || error || "Request failed";
									showError(errorMessage, 1000).then(() => {
										currentWeather.scrollToElement("forecastPage");
									});
								}
							} catch (errorHandlerError) {
								showError("Failed to load forecast data.");
							}
						},
					});
				} catch (jqueryError) {
					showError("Failed to initialize forecast page.");
				}
			});
		} catch (error) {
			showError("An unexpected error occurred loading forecasts.");
		}
	}, []);

	/**
	 * Toggles visibility of the utility component overlay
	 */
	const addUtilityComponentHeight = () => {
		try {
			jQuery(($) => {
				try {
					$.noConflict();
					$(".cmp").removeClass("d-none");
					$(".utility-component").toggleClass("add-utility-component-height");
				} catch (innerError) {
					// Silently fail - UI toggle is non-critical
				}
			});
		} catch (error) {
			// Silently fail - UI toggle is non-critical
		}
	};

	/**
	 * Generic function to map forecast data for a specific day range.
	 * Follows DRY principle by consolidating duplicate mapping logic.
	 * 
	 * @param {Object} result - API response containing forecast list
	 * @param {number} startIndex - Start index in the forecast list array
	 * @param {number} endIndex - End index in the forecast list array (exclusive)
	 * @param {boolean} [shouldCache=false] - Whether to cache values to database (only for day 1)
	 * @returns {JSX.Element[]} Array of ForecastDailyWeatherComponent elements
	 */
	const mapDayData = (result, startIndex, endIndex, shouldCache = false) => {
		try {
			// Validate result structure
			if (!result || !result.list || !Array.isArray(result.list)) {
				return [];
			}

			const outputArray = [];
			// Ensure we don't go past the array bounds
			const safeEndIndex = Math.min(endIndex, result.list.length);

			for (let i = startIndex; i < safeEndIndex; i++) {
				try {
					const forecastItem = result.list[i];
					
					// Validate forecast item
					if (!forecastItem || !forecastItem.weather || !forecastItem.main) {
						continue;
					}

					const time = utilis.convertTo12Hour(utilis.getTimeFromDateString(forecastItem.dt_txt || ""));
					const weatherCode = forecastItem.weather[0]?.id || 800;
					const temp = forecastItem.main.temp != null ? Math.ceil(forecastItem.main.temp) : "--";
					const description = forecastItem.weather[0]?.description || "No description";

					outputArray.push(
						new WeatherTemplate(
							i,
							time,
							currentWeather.checkWeatherCode(weatherCode),
							temp,
							description
						)
					);

					// Cache first day values for home screen reference
					if (shouldCache) {
						try {
							const cacheIndex = i - startIndex;
							db.create(`WEATHER_FORECAST_TIME_${cacheIndex}`, time);
							db.create(`WEATHER_FORECAST_ICON_${cacheIndex}`, `${weatherCode}`);
							db.create(`WEATHER_FORECAST_UNIT_${cacheIndex}`, `${temp}`);
							db.create(`WEATHER_FORECAST_TITLE_${cacheIndex}`, description);
						} catch (cacheError) {
							// Non-critical - continue even if caching fails
						}
					}
				} catch (itemError) {
					// Skip this item and continue with next
					continue;
				}
			}

			// Map weather data to UI components
			return outputArray.map((data) => {
				const giveMoreDetails = () => {
					try {
						showInfo(data.title, 3000);
					} catch (toastError) {
						// Silently fail - toast is non-critical
					}
				};
				return (
					<ForecastDailyWeatherComponent
						key={data.id}
						time={data.time}
						icon={data.icon}
						weatherUnit={data.unit}
						onClick={giveMoreDetails}
					/>
				);
			});
		} catch (error) {
			// Return empty array on any error
			return [];
		}
	};

	/**
	 * Convenience wrapper functions for each day's forecast mapping.
	 * Day 1 includes caching for home screen display.
	 */
	const mapFirstDayData = (result) => mapDayData(result, 0, 8, true);
	const mapSecondDayData = (result) => mapDayData(result, 8, 16);
	const mapThirdDayData = (result) => mapDayData(result, 16, 24);
	const mapFourthDayData = (result) => mapDayData(result, 24, 32);
	const mapFifthDayData = (result) => mapDayData(result, 32, 40);

	/**
	 * Navigates user back to the main weather view
	 */
	const navigateToWeather = () => {
		navigate("/weather");
	};

	/**
	 * Main Weather Component - displays navigation button to current weather
	 * Used in the utility footer overlay
	 */
	const MainWeatherComponent = () => (
		<section className="d-flex align-items-center justify-content-center">
			<Button
				text="current weather forecast"
				className="shadow brand-btn-2 toggle-width-3 my-5"
				onClick={navigateToWeather}
			/>
		</section>
	);

	/**
	 * Shows the main weather component in the utility footer overlay
	 */
	const showMainWeatherComponent = () => {
		addUtilityComponentHeight();
		setComponentToInsert(<MainWeatherComponent />);
	};

	/**
	 * Reusable component for displaying a single day's forecast section.
	 * Follows DRY principle by eliminating duplicate JSX for each day.
	 * 
	 * @param {Object} props - Component props
	 * @param {number} props.dayNumber - Day number (1-5)
	 * @param {Function} props.mapFunction - Function to map forecast data for this day
	 * @returns {JSX.Element} Day forecast section with header and hourly data
	 */
	const DayForecastSection = ({ dayNumber, mapFunction }) => (
		<>
			<section className={`day-${dayNumber}-container future-weather-days d-flex align-items-center justify-content-start`}>
				<section className="today-section d-flex mx-2 flex-column align-items-center justify-content-center">
					<p className="brand-small-text text-capitalize fw-bold">Day {dayNumber}</p>
					<div className="future-weather-notch-active"></div>
				</section>
			</section>
			<section
				className={`day-${dayNumber}-weather future-weather-forecast my-4 d-flex align-items-center justify-content-between`}
				style={{ overflowX: "scroll" }}>
				{forecastData !== null ? mapFunction(forecastData) : "loading.."}
			</section>
			<br />
		</>
	);

	return (
		<React.Fragment>
			
			<section className="container-fluid width-toggle-5 m-auto" id="forecastPage">
				<section className="app-header d-flex justify-content-between">
					{/* Back navigation button - returns to main weather view */}
					<div className="toggle-btn my-3">
						<svg
							height={"30"}
							id="Layer_1"
							version="1.1"
							onClick={navigateToWeather}
							viewBox="0 0 512 512"
							width={"30"}
							xmlns="http://www.w3.org/2000/svg">
							<polygon points="352,128.4 319.7,96 160,256 160,256 160,256 319.7,416 352,383.6 224.7,256 " />
						</svg>
					</div>
					<section className="city-locaton">
						<h5 className="fw-bold fs-5 my-3">{`${db.get(
							"WEATHER_LOCATION"
						)}`}</h5>
					</section>
					<div className="toggle-btn my-3">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width={"30px"}
							height={"30px"}
							viewBox="0 0 24 24"
							className="d-block"
							onClick={showMainWeatherComponent}>
							<path fill="white" d="M0 0h24v24H0V0z" />
							<path
								fill="lightskyblue"
								d="M4 13h6c.55 0 1-.45 1-1V4c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v8c0 .55.45 1 1 1zm0 8h6c.55 0 1-.45 1-1v-4c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v4c0 .55.45 1 1 1zm10 0h6c.55 0 1-.45 1-1v-8c0-.55-.45-1-1-1h-6c-.55 0-1 .45-1 1v8c0 .55.45 1 1 1zM13 4v4c0 .55.45 1 1 1h6c.55 0 1-.45 1-1V4c0-.55-.45-1-1-1h-6c-.55 0-1 .45-1 1z"
							/>
						</svg>
					</div>
				</section>
				{/* Forecast Section Container - displays 5-day hourly predictions */}
				<section className="my-1 next-week-component-container d-flex flex-column my-1">
					<br />
					{/* Section Header */}
					<section className="d-flex align-items-center justify-content-between mb-2 flex-row-reverse">
						<h6 className="fw-bold fs-6 my-3 text-start text-capitalize text-muted">
							Prediction
						</h6>
						<h6 className="fw-bold fs-6 my-3 text-start text-capitalize">
							Hourly
						</h6>
					</section>

					{/* Day 1-5 Forecast Sections using DRY component pattern */}
					<DayForecastSection dayNumber={1} mapFunction={mapFirstDayData} />
					<DayForecastSection dayNumber={2} mapFunction={mapSecondDayData} />
					<DayForecastSection dayNumber={3} mapFunction={mapThirdDayData} />
					<DayForecastSection dayNumber={4} mapFunction={mapFourthDayData} />
					<DayForecastSection dayNumber={5} mapFunction={mapFifthDayData} />
				</section>

				<Footer utilityTags={componentToInsert} />
				<br />
				<br />
				<br />
			</section>
		</React.Fragment>
	);
};

export default ForecastWeather;
