/**
 * ForecastWeather.jsx
 * 5-day weather forecast page component.
 *
 * @module ForecastWeather
 * @description Displays weather forecasts in 3-hour intervals
 * for 5 days. Fetches forecast data from OpenWeatherMap API
 * and maps it to daily forecast components.
 *
 * Route: /forecast
 *
 * Features:
 * - 5-day weather forecast display
 * - 3-hour interval data (8 intervals per day)
 * - Weather condition icons and descriptions
 * - Click-to-see-details functionality via SweetAlert2
 * - First day forecast cached to localStorage for home screen
 *
 * Data Structure:
 * OpenWeatherMap 5-day forecast API returns 40 data points:
 * - 8 intervals per day × 5 days = 40 entries in result.list
 * - Each entry contains: dt_txt (datetime), main (temp), weather (conditions)
 *
 * Array Index Mapping:
 * - Day 1: indices 0-7   (mapFirstDayData)
 * - Day 2: indices 8-15  (mapSecondDayData)
 * - Day 3: indices 16-23 (mapThirdDayData)
 * - Day 4: indices 24-31 (mapFourthDayData)
 * - Day 5: indices 32-39 (mapFifthDayData)
 *
 * localStorage keys:
 * - Read: HOME_PAGE_SEEN, USER_DEFAULT_LOCATION, USER_LATITUDE, USER_LONGITUDE, WEATHER_UNIT
 * - Write: WEATHER_FORECAST_TIME_0-7, WEATHER_FORECAST_ICON_0-7, WEATHER_FORECAST_UNIT_0-7, WEATHER_FORECAST_TITLE_0-7
 *
 * WARNING: Contains hard-coded API key. Move to environment
 * variables for production deployment.
 *
 * @see ../apis/getCurrentWeather - checkWeatherCode for icon mapping
 * @see ../inc/scripts/utilities - Time formatting utilities
 */

import React, { useState, useEffect } from "react";
import Footer from "../components/footer";
import navigate from "../inc/scripts/utilities";
import Spinner from "../components/spinner";
import Button from "./../components/button";
import jQuery from "jquery";
import { db } from "../backend/app_backend";
import { getCurrentDate } from "../inc/scripts/utilities";
import * as currentWeather from "./../apis/getCurrentWeather";
import HumidityIcon from "./../assets/humidity-icon.svg";
import WindIcon from "./../assets/wind-icon.svg";
import PressureIcon from "./../assets/pressure-icon.svg";
import ForecastDailyWeatherComponent from "./../components/forecastWeatherComponent";
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
import * as utilis from "./../inc/scripts/utilities";

/**
 * ForecastWeather React functional component.
 * Fetches and displays 5-day weather forecast.
 *
 * @returns {JSX.Element} Forecast page with 5-day weather data
 */
const ForecastWeather = () => {
	// Redirect guard: Ensure user has completed onboarding
	if (!db.get("HOME_PAGE_SEEN")) {
		navigate("/");
	}
	//holds the current component to insert into the utility footer component
	const [componentToInsert, setComponentToInsert] = useState("");
	const [forecastData, setForecastData] = useState(null);

	useEffect(() => {
		jQuery(($) => {
			$.noConflict();
			// WARNING: API key hard-coded for development. For production:
			// Use process.env.REACT_APP_OPENWEATHER_API_KEY
			const $API_KEY = "cd34f692e856e493bd936095b256b337";
			const $WEATHER_UNIT = db.get("WEATHER_UNIT") || "metric";
			const $user_city = db.get("USER_DEFAULT_LOCATION");
			const $user_latitude = db.get("USER_LATITUDE");
			const $user_longitude = db.get("USER_LONGITUDE");
			let FORECAST_URL;
			// Determine API URL based on available location data:
			// Priority: lat/lon coordinates > city name > error (no location)
			if (
				$user_city == null && $user_latitude == null &&
				$user_longitude == null
			) {
				console.log(typeof $user_city);
				Swal.fire({
					text: "No saved location found!",
					icon: "error",
					timer: 3000,
					toast: true,
					showConfirmButton: false,
					position: "top",
				}).then((willProceed) => {
					return;
				});
			} else if (
				$user_city == null &&
				$user_latitude != null &&
				$user_longitude != null
			) {
				FORECAST_URL = `https://api.openweathermap.org/data/2.5/forecast?lat=${$user_latitude}&lon=${$user_longitude}&appid=${$API_KEY}&units=${$WEATHER_UNIT}`;
			} else {
				FORECAST_URL = `https://api.openweathermap.org/data/2.5/forecast?q=${$user_city}&appid=${$API_KEY}&units=${$WEATHER_UNIT}`;
			}
			$.ajax({
				url: FORECAST_URL,
				success: (result, status, xhr) => {
					if (result.cod == 200) {
						setForecastData(result);
					}
				},

				error: (xhr, status, error) => {
					//check if the error is empty
					if (error == "") {
						Swal.fire({
							toast: true,
							text: "Network Error!",
							icon: "info",
							timer: 1000,
							position: "top",
							showConfirmButton: false,
						}).then((willProceed) => {
							//scroll to top when the promise is resolved!
							currentWeather.scrollToElement("forecastPage");
						});
					} else {
						Swal.fire({
							toast: true,
							text: error,
							icon: "warning",
							timer: 1000,
							position: "top",
							showConfirmButton: false,
						}).then((willProceed) => {
							//scroll to top when the promise is resolved!
							currentWeather.scrollToElement("forecastPage");
						});
					}
				},
			});
		});
	}, []);

	/**
	 * Toggles the utility footer component's visibility.
	 * Uses jQuery to manipulate Bootstrap classes.
	 *
	 * @returns {void}
	 */
	const addUtilityComponentHeight = () => {
		jQuery(($) => {
			$.noConflict();
			$(".cmp").removeClass("d-none");
			$(".utility-component").toggleClass("add-utility-component-height");
		});
	};

	/**
	 * Template class for forecast weather data items.
	 * Represents a single 3-hour forecast entry.
	 *
	 * @class WeatherTemplate
	 * @param {number} id - Unique identifier for the forecast item
	 * @param {string} time - Display time in 12-hour format (e.g., "3 PM")
	 * @param {string} icon - Weather icon SVG path from checkWeatherCode
	 * @param {number} unit - Temperature value (rounded up via Math.ceil)
	 * @param {string} title - Weather condition description
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

	/**
	 * Maps forecast data for Day 1 (today).
	 * Processes API response list indices 0-7 (first 24 hours).
	 * Also persists first day data to localStorage for home screen preview.
	 *
	 * Array Slicing: indices 0-7 (8 × 3-hour intervals = 24 hours)
	 *
	 * localStorage keys written:
	 * - WEATHER_FORECAST_TIME_i (i=0..7): Time strings
	 * - WEATHER_FORECAST_ICON_i: Weather condition codes
	 * - WEATHER_FORECAST_UNIT_i: Temperature values
	 * - WEATHER_FORECAST_TITLE_i: Weather descriptions
	 *
	 * @param {Object} result - OpenWeatherMap API forecast response
	 * @param {Object[]} result.list - Array of 40 forecast entries
	 * @returns {JSX.Element[]} Array of ForecastDailyWeatherComponent elements
	 */
	const mapFirstDayData = (result) => {
		// Process 8 forecast intervals (3-hour slots for one day)
		let outputArray = [];

		for (let i = 0; i < 8; i++) {
			outputArray.push(
				new WeatherTemplate(
					i,
					utilis.convertTo12Hour(
						utilis.getTimeFromDateString(result.list[i].dt_txt)
					),
					currentWeather.checkWeatherCode(result.list[i].weather[0].id),
					Math.ceil(result.list[i].main.temp),
					result.list[i].weather[0].description
				)
			);

			// Persist first day forecast to localStorage for home screen preview
			db.create(
				`WEATHER_FORECAST_TIME_${i}`,
				`${utilis.convertTo12Hour(
					utilis.getTimeFromDateString(result.list[i].dt_txt)
				)}`
			);
			db.create(`WEATHER_FORECAST_ICON_${i}`, `${result.list[i].weather[0].id}`);
			db.create(
				`WEATHER_FORECAST_UNIT_${i}`,
				`${Math.ceil(result.list[i].main.temp)}`
			);
			db.create(
				`WEATHER_FORECAST_TITLE_${i}`,
				`${result.list[i].weather[0].description}`
			);
		}

		//map each of the individual objects into single component!
		const firstWeatherDataForecast = outputArray.map((data, index) => {
			const giveMoreDetails = () => {
				Swal.fire({
					text: data.title,
					toast: true,
					position: "top",
					timer: 3000,
					showConfirmButton: false,
					icon: "info",
				}).then((willProceed) => {
					return;
				});
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

		return firstWeatherDataForecast;
	};

	/**
	 * Maps forecast data for Day 2 (tomorrow).
	 * Processes API response list indices 8-15.
	 *
	 * Array Slicing: indices 8-15 (hours 24-48)
	 *
	 * @param {Object} result - OpenWeatherMap API forecast response
	 * @returns {JSX.Element[]} Array of ForecastDailyWeatherComponent elements
	 */
	const mapSecondDayData = (result) => {
		// Process 8 forecast intervals (3-hour slots for day 2)
		let outputArray = [];

		for (let i = 8; i < 16; i++) {
			outputArray.push(
				new WeatherTemplate(
					i,
					utilis.convertTo12Hour(
						utilis.getTimeFromDateString(result.list[i].dt_txt)
					),
					currentWeather.checkWeatherCode(result.list[i].weather[0].id),
					Math.ceil(result.list[i].main.temp),
					result.list[i].weather[0].description
				)
			);
		}

		//map each of the individual objects into single component!
		const secondWeatherDataForecast = outputArray.map((data, index) => {
			const giveMoreDetails = () => {
				Swal.fire({
					text: data.title,
					toast: true,
					position: "top",
					timer: 3000,
					showConfirmButton: false,
					icon: "info",
				}).then((willProceed) => {
					return;
				});
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

		return secondWeatherDataForecast;
	};

	/**
	 * Maps forecast data for Day 3.
	 * Processes API response list indices 16-23.
	 *
	 * Array Slicing: indices 16-23 (hours 48-72)
	 *
	 * @param {Object} result - OpenWeatherMap API forecast response
	 * @returns {JSX.Element[]} Array of ForecastDailyWeatherComponent elements
	 */
	const mapThirdDayData = (result) => {
		// Process 8 forecast intervals (3-hour slots for day 3)
		let outputArray = [];

		for (let i = 16; i < 24; i++) {
			outputArray.push(
				new WeatherTemplate(
					i,
					utilis.convertTo12Hour(
						utilis.getTimeFromDateString(result.list[i].dt_txt)
					),
					currentWeather.checkWeatherCode(result.list[i].weather[0].id),
					Math.ceil(result.list[i].main.temp),
					result.list[i].weather[0].description
				)
			);
		}

		//map each of the individual objects into single component!
		const thirdWeatherDataForecast = outputArray.map((data, index) => {
			const giveMoreDetails = () => {
				Swal.fire({
					text: data.title,
					toast: true,
					position: "top",
					timer: 3000,
					showConfirmButton: false,
					icon: "info",
				}).then((willProceed) => {
					return;
				});
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

		return thirdWeatherDataForecast;
	};

	/**
	 * Maps forecast data for Day 4.
	 * Processes API response list indices 24-31.
	 *
	 * Array Slicing: indices 24-31 (hours 72-96)
	 *
	 * @param {Object} result - OpenWeatherMap API forecast response
	 * @returns {JSX.Element[]} Array of ForecastDailyWeatherComponent elements
	 */
	const mapFourthDayData = (result) => {
		// Process 8 forecast intervals (3-hour slots for day 4)
		let outputArray = [];

		for (let i = 24; i < 32; i++) {
			outputArray.push(
				new WeatherTemplate(
					i,
					utilis.convertTo12Hour(
						utilis.getTimeFromDateString(result.list[i].dt_txt)
					),
					currentWeather.checkWeatherCode(result.list[i].weather[0].id),
					Math.ceil(result.list[i].main.temp),
					result.list[i].weather[0].description
				)
			);
		}

		//map each of the individual objects into single component!
		const forthWeatherDataForecast = outputArray.map((data, index) => {
			const giveMoreDetails = () => {
				Swal.fire({
					text: data.title,
					toast: true,
					position: "top",
					timer: 3000,
					showConfirmButton: false,
					icon: "info",
				}).then((willProceed) => {
					return;
				});
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

		return forthWeatherDataForecast;
	};

	/**
	 * Maps forecast data for Day 5.
	 * Processes API response list indices 32-39.
	 *
	 * Array Slicing: indices 32-39 (hours 96-120)
	 *
	 * @param {Object} result - OpenWeatherMap API forecast response
	 * @returns {JSX.Element[]} Array of ForecastDailyWeatherComponent elements
	 */
	const mapFifthDayData = (result) => {
		// Process 8 forecast intervals (3-hour slots for day 5)
		let outputArray = [];

		for (let i = 32; i < 40; i++) {
			outputArray.push(
				new WeatherTemplate(
					i,
					utilis.convertTo12Hour(
						utilis.getTimeFromDateString(result.list[i].dt_txt)
					),
					currentWeather.checkWeatherCode(result.list[i].weather[0].id),
					Math.ceil(result.list[i].main.temp),
					result.list[i].weather[0].description
				)
			);
		}

		//map each of the individual objects into single component!
		const fifthWeatherDataForecast = outputArray.map((data, index) => {
			const giveMoreDetails = () => {
				Swal.fire({
					text: data.title,
					toast: true,
					position: "top",
					timer: 3000,
					showConfirmButton: false,
					icon: "info",
				}).then((willProceed) => {
					return;
				});
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

		return fifthWeatherDataForecast;
	};

	const navigateToApp = () => {
		navigate("/weather");
	};
	//create the main weather component forecast tags
	const MainWeatherComponent = () => {
		return (
			<section className="d-flex align-items-center justify-content-center">
				<Button
					text="current weather forecast"
					className="shadow brand-btn-2 toggle-width-3 my-5 "
					onClick={navigateToApp}
				/>
			</section>
		);
	};

	//function to check if the dashboard icon was clicked
	const showMainWeatherComponent = () => {
		addUtilityComponentHeight();
		//change the variable to hold the current component to insert
		setComponentToInsert(<MainWeatherComponent />);
	};

	const navigateHome = () => {
		navigate("/weather");
	};

	return (
		<React.Fragment>
			
			<section className="container-fluid width-toggle-5 m-auto" id="forecastPage">
				<section className="app-header d-flex justify-content-between">
					<div className="toggle-btn my-3">
						<svg
							height={"30"}
							id="Layer_1"
							version="1.1"
							onClick={navigateHome}
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
				<section className="my-1 next-week-component-container d-flex flex-column my-1">
					<br />
					<section className="d-flex align-items-center justify-content-between mb-2 flex-row-reverse">
						<h6 className="fw-bold fs-6 my-3 text-start text-capitalize text-muted">
							{" "}
							Prediction
						</h6>
						<h6 className="fw-bold fs-6 my-3 text-start text-capitalize ">
							Hourly
						</h6>
					</section>

					<section className="day-1-container future-weather-days d-flex align-items-center justify-content-start">
						<section className="today-section d-flex mx-2 flex-column align-items-center justify-content-center">
							<p className="brand-small-text text-capitalize fw-bold">Day 1</p>
							<div className="future-weather-notch-active"></div>
						</section>
					</section>
					<section
						className="day-1-weather future-weather-forecast my-4 d-flex align-items-center justify-content-between "
						style={{ overflowX: "scroll" }}>
						{!(forecastData == null) ? (
							mapFirstDayData(forecastData)
						) : (
							"loading.."
						)}
					</section>

					<br />
					<section className="day-2-container future-weather-days d-flex align-items-center justify-content-start">
						<section className="today-section d-flex mx-2 flex-column align-items-center justify-content-center">
							<p className="brand-small-text text-capitalize fw-bold">Day 2</p>
							<div className="future-weather-notch-active"></div>
						</section>
					</section>
					<section
						className="day-2-weather future-weather-forecast my-4 d-flex align-items-center justify-content-between "
						style={{ overflowX: "scroll" }}>
						{!(forecastData == null) ? (
							mapSecondDayData(forecastData)
						) : (
							"loading.."
						)}
					</section>

					<br />
					<section className="day-3-container future-weather-days d-flex align-items-center justify-content-start">
						<section className="today-section d-flex mx-2 flex-column align-items-center justify-content-center">
							<p className="brand-small-text text-capitalize fw-bold">Day 3</p>
							<div className="future-weather-notch-active"></div>
						</section>
					</section>
					<section
						className="day-3-weather future-weather-forecast my-4 d-flex align-items-center justify-content-between "
						style={{ overflowX: "scroll" }}>
						{!(forecastData == null) ? (
							mapThirdDayData(forecastData)
						) : (
							"loading.."
						)}
					</section>
					<br />

					<section className="day-4-container future-weather-days d-flex align-items-center justify-content-start">
						<section className="today-section d-flex mx-2 flex-column align-items-center justify-content-center">
							<p className="brand-small-text text-capitalize fw-bold">Day 4</p>
							<div className="future-weather-notch-active"></div>
						</section>
					</section>
					<section
						className="day-4-weather future-weather-forecast my-4 d-flex align-items-center justify-content-between "
						style={{ overflowX: "scroll" }}>
						{!(forecastData == null) ? (
							mapFourthDayData(forecastData)
						) : (
							"loading.."
						)}
					</section>
					<br />
					<section className="day-5-container future-weather-days d-flex align-items-center justify-content-start">
						<section className="today-section d-flex mx-2 flex-column align-items-center justify-content-center">
							<p className="brand-small-text text-capitalize fw-bold">Day 5</p>
							<div className="future-weather-notch-active"></div>
						</section>
					</section>

					<section
						className="day-5-weather future-weather-forecast my-4 d-flex align-items-center justify-content-between "
						style={{ overflowX: "scroll" }}>
						{!(forecastData == null) ? (
							mapFifthDayData(forecastData)
						) : (
							"loading.."
						)}
					</section>
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
