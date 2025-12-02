/**
 * Weather.jsx
 * Main weather display page component.
 *
 * @module WeatherApp
 * @description Primary weather page featuring current weather
 * conditions display, city search functionality, and navigation
 * to detailed weather and forecast views.
 *
 * Route: /weather
 *
 * Features:
 * - Current weather conditions display
 * - City search with autocomplete via API Ninjas
 * - Temperature, humidity, wind, pressure data
 * - Navigation to WeatherMain (detailed view)
 * - Navigation to ForecastWeather (5-day forecast)
 * - Geolocation-based weather fetching
 * - Cached forecast strip from localStorage
 *
 * State Management:
 * - componentToInsert: Dynamic utility component content
 * - weatherInput: Search input value
 * - Uses localStorage for data persistence
 *
 * localStorage keys read:
 * - HOME_PAGE_SEEN: Redirect guard
 * - USER_DEFAULT_LOCATION: Default search location
 * - WEATHER_FORECAST_TIME_0-7: Cached forecast times
 * - WEATHER_FORECAST_ICON_0-7: Cached forecast icons
 * - WEATHER_FORECAST_UNIT_0-7: Cached forecast temps
 *
 * API Integration:
 * - Uses formHandler (getCurrentWeather API) for weather data
 * - Uses getGeolocation for browser location tracking
 *
 * @see ../apis/getCurrentWeather - Weather API integration
 * @see ../apis/getGeolocation - Browser geolocation
 * @see ./WeatherMain.jsx - Detailed weather view
 * @see ./ForecastWeather.jsx - 5-day forecast view
 */

import React, { useState, useRef, useEffect } from "react";
import jQuery from "jquery";
import Button from "./../components/button";
import Footer from "../components/footer";
import rainIcon from "./../assets/rain (1).png";
import windIcon from "./../assets/windy.png";
import humidity from "./../assets/humidity.png";
import FutureWeatherComponent from "../components/futureWeatherComponent";
import navigate from "../inc/scripts/utilities";
import ForecastWeatherItems from "../components/forecastWeatherItems";
import Spinner from "../components/spinner";
import Ripple1 from "./../assets/ripple1.gif";
import Location from "./../assets/map.png";
import * as formHandler from "./../apis/getCurrentWeather";
import { db } from "../backend/app_backend";
import getGeolocation from "../apis/getGeolocation";
import { getCurrentDate } from "../inc/scripts/utilities";
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
import HumidityIcon from "./../assets/humidity-icon.svg";
import WindIcon from "./../assets/wind-icon.svg";
import PressureIcon from "./../assets/pressure-icon.svg";

/**
 * WeatherApp React functional component.
 * Main weather display with search, current conditions, and forecast preview.
 *
 * @returns {JSX.Element} Main weather page
 */
const WeatherApp = () => {
	// Redirect guard: Send users to onboarding if they haven't completed setup
	if (!db.get("HOME_PAGE_SEEN")) {
		navigate("/");
	}
	//holds the current component to insert into the utility footer component
	const [componentToInsert, setComponentToInsert] = useState("");
	const [weatherInput, setWeatherInput] = useState();
	let savedLocation;

	savedLocation = db.get("USER_DEFAULT_LOCATION");

	/**
	 * Toggles the utility footer component's visibility.
	 * Uses jQuery to manipulate Bootstrap classes for show/hide.
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
	 * Navigates to the forecast weather page.
	 *
	 * @returns {void}
	 */
	const navigateToForecast = () =>{
		navigate("/forecast");
	}

	/**
	 * Template class for cached forecast data items.
	 * Represents a single forecast entry with time, icon, and temperature.
	 *
	 * @class MappedSavedDataTemplate
	 * @param {number} id - Unique identifier for the forecast item
	 * @param {string} time - Display time (e.g., "12pm")
	 * @param {string} icon - Weather icon SVG path
	 * @param {string} unit - Temperature value
	 */
	class MappedSavedDataTemplate {
		constructor(id, time, icon, unit) {
			this.id = id;
			this.time = time;
			this.icon = icon;
			this.unit = unit;
		}
	}

	/**
	 * Maps cached forecast data from localStorage to UI components.
	 * Reads WEATHER_FORECAST_TIME/ICON/UNIT keys for 8 time slots.
	 * Falls back to default values if keys are not set.
	 *
	 * Array indices 0-7 represent 8 three-hour forecast intervals
	 * (24 hours of forecast data from the current day).
	 *
	 * @returns {JSX.Element[]} Array of FutureWeatherComponent elements
	 */
	const mapDbSavedData = () => {
		const count = 8;

		let weatherData = [];

		for (let i = 0; i < count; i++) {
			const FORECAST_TIME = db.get(`WEATHER_FORECAST_TIME_${i}`) || "12pm";
			const FORECAST_ICON = db.get(`WEATHER_FORECAST_ICON_${i}`) || "800";
			const FORECAST_UNIT = db.get(`WEATHER_FORECAST_UNIT_${i}`) || "26";

			weatherData.push(
				new MappedSavedDataTemplate(
					i,
					FORECAST_TIME,
					formHandler.checkWeatherCode(parseInt(FORECAST_ICON)),
					FORECAST_UNIT
				)
			);
		}

		const uiData = weatherData.map((data, index) => {
			const handleElementClick = () =>{
				navigate("/forecast");
			}
			return (
				<FutureWeatherComponent
					key={data.id}
					time={data.time}
					icon={data.icon}
					weatherUnit={data.unit}
					onClick={handleElementClick}
				/>
			);
		});

		return uiData;
	};

	let forecastData = [
		{
			name: ["Keketu"],
			icon: [Day],
			unit: ["10"],
		},

		{
			name: ["Sango"],
			icon: [Thunder],
			unit: ["50"],
		},
	];

	/**
	 * Navigates to the detailed weather view page.
	 *
	 * @returns {void}
	 */
	const showMoreWeather = () => {
		navigate("weathermain");
	};

	// Maps static forecast data to ForecastWeatherItems components
	const uiForeCastData = forecastData.map((data, index) => {
		return (
			<ForecastWeatherItems
				key={data.name}
				name={data.name}
				icon={data.icon}
				weatherUnit={data.unit}
			/>
		);
	});

	/**
	 * Navigates to the forecast weather page.
	 * Used by the "forecast weather" button in utility component.
	 *
	 * @returns {void}
	 */
	const showForecastWeather = () => {
		navigate("/forecast");
	};

	/**
	 * Utility component showing forecast preview and navigation button.
	 * Displayed in the expandable footer section.
	 *
	 * @returns {JSX.Element} Forecast preview with navigation button
	 */
	const UtilityForecastTags = () => {
		return (
			<section className="cmp d-flex align-items-center justify-content-center flex-column my-5">
				<br />
				<br />
				<br />

				<section className="d-flex align-items-center justify-content-center my-5">
					{uiForeCastData}
				</section>

				<section className="d-flex align-items-center justify-content-center">
					<Button
						text="forecast weather"
						className="shadow brand-btn-2 toggle-width-3"
						onClick={showForecastWeather}
					/>
				</section>
			</section>
		);
	};

	/**
	 * Shows the forecast utility component in the footer.
	 * Triggered by clicking the forecast icon in footer nav.
	 *
	 * @returns {void}
	 */
	const beginWeatherForecast = () => {
		addUtilityComponentHeight();
		// Change the variable to hold the current component to insert
		setComponentToInsert(<UtilityForecastTags />);
		
	};

	/**
	 * Search form component for looking up weather by city.
	 * Includes city autocomplete and saved location quick-search.
	 *
	 * @returns {JSX.Element} Search form with autocomplete
	 */
	const SearchComponent = () => {
		const [searchValue, setSearchValue] = useState("");
		return (
			<section className="cmp d-flex align-items-center justify-content-center flex-column my-5">
				<form
					id="searchWeatherForm"
					onSubmit={(e) => {
						formHandler.handleWeatherForm(e);
						setWeatherInput();
					}} onChange={(e)=>{
						setSearchValue(e.target.value)
					}}>
					<label htmlFor="searchWeather" className="py-2 text-capitalize ">
						search city
					</label>
					<input
						type="text"
						name="searchWeather"
						id="searchWeather"
						placeholder="Enter the name of city"
						value={weatherInput}
						className="form-control search-input p-3 brand-small-text w-100"
						onChange={(e) => {
							setWeatherInput(e.target.value);
						}}
						autoComplete="off"
						autoFocus={true}
					/>
					<p
						className="error-holder text-danger py-3 fs-6 brand-small-text text-center d-none"
						id="searchErrorLog">
						city not found
					</p>

					<section className="d-none "></section>
					<SearchMenuComponent search={searchValue}/>
					<Button
						text="track saved location!"
						className="shadow brand-btn-3-secondary toggle-width-3 my-5 text-dark text-capitalize p-2"
						id="searchSavedLocationWeather"
						onClick={(e) => {
							formHandler.handleWeatherForm(e, savedLocation);
							setWeatherInput();
						}}
					/>
				</form>
			</section>
		);
	};

	/**
	 * Autocomplete dropdown component for city search.
	 * Queries API Ninjas for matching cities when search length > 3.
	 *
	 * @param {Object} props - Component props
	 * @param {string} props.search - Current search input value
	 * @returns {JSX.Element} Dropdown list of matching cities
	 */
	const SearchMenuComponent = ({search}) => {
		const [dataArray, changeDataArray] = useState([]);

		// Fetch city suggestions when search term exceeds 3 characters
		useEffect(()=>{
			if(search.length > 3){
				formHandler.findCity(search,changeDataArray)
			}
		},[search])

		/**
		 * Handles city selection from autocomplete dropdown.
		 * Sets the selected city name in the input and triggers weather fetch.
		 *
		 * @param {Event} e - Click event from the list item
		 * @returns {void}
		 */
		function clickHandler(e){
			jQuery("#searchWeather").val(e.target.textContent)
			formHandler.handleWeatherForm(e, savedLocation);
			setWeatherInput()
		}

		return (
			<section className="cmp d-flex align-items-center justify-content-start bg-white px-2 mt-2 rounded">
				<ul className="m-0 p-0">
					{dataArray.map((data,ind)=> <li key={ind} onClick={clickHandler} style={{cursor:"pointer"}}><p className="text-dark text-left m-0" style={{fontSize:"14px"}}>{data.name}</p></li>)}
				</ul>
			</section>		
		)
	}

	/**
	 * Opens the search component in the utility footer.
	 * Triggered by clicking the search icon in footer nav.
	 *
	 * @returns {void}
	 */
	const testSearch = () => {
		addUtilityComponentHeight();
		setComponentToInsert(<SearchComponent />);

	};

	return (
		<React.Fragment>
			<Spinner />
			<div
				className="container-fluid d-flex flex-column py-2 px-0 width-toggle-5 m-auto"
				style={{ overflowX: "hidden" }}
				id="weatherContainer">
				<section className="app-header d-flex justify-content-between px-2 flex-row-reverse ">
					<section className="city-location">
						<h5 className="fw-bold fs-5" id="weatherLocation">
							{db.get("WEATHER_LOCATION") || "Lagos 9ja"}
						</h5>
						<p className="date-time text-muted brand-small-text text-capitalize">
							{getCurrentDate()}
						</p>
					</section>

					<svg
						xmlns="http://www.w3.org/2000/svg"
						width={"30px"}
						height={"30px"}
						viewBox="0 0 24 24"
						className="d-block"
						onClick={beginWeatherForecast}
						id="weatherDashboardIcon">
						<path fill="white" d="M0 0h24v24H0V0z" />
						<path
							fill="lightskyblue"
							d="M4 13h6c.55 0 1-.45 1-1V4c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v8c0 .55.45 1 1 1zm0 8h6c.55 0 1-.45 1-1v-4c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v4c0 .55.45 1 1 1zm10 0h6c.55 0 1-.45 1-1v-8c0-.55-.45-1-1-1h-6c-.55 0-1 .45-1 1v8c0 .55.45 1 1 1zM13 4v4c0 .55.45 1 1 1h6c.55 0 1-.45 1-1V4c0-.55-.45-1-1-1h-6c-.55 0-1 .45-1 1z"
						/>
					</svg>
				</section>
				<section className="current-weather-container d-flex justify-content-between px-2 my-3">
					<section className="current-weather-value-container">
						<section className="d-flex ">
							<h1
								className="current-weather-value fw-bold brand-large-text"
								id="currentDeg">
								{Math.ceil(db.get("WEATHER_DEG")) || 30}
							</h1>

							<sup className="fw-bold brand-medium-text current-weather-unit">
								o
							</sup>
						</section>
						<p className="text-muted text-capitalize" id="weatherDes">
							{db.get("WEATHER_DESCRIPTION") || "clear sky"}
						</p>
					</section>
					<section
						className="current-weather-icon my-4 mx-3 px-3"
						id="main-weather-icon-container">
						<img
							src={formHandler.checkWeatherCode(db.get("WEATHER_CODE")) || Day}
							width={64}
							height={64}
							alt="main weather icon"
							id="main-weather-icon"
						/>
					</section>
				</section>
				{/* d-flex align-items-center justify-content-between brand-tertiary-color rounded-3 shadow p-3 m-0" */}
				<section
					role="button"
					className="mx-2 rounded-3 shadow my-5 py-2 current-weather-assets brand-tertiary-color d-flex align-items-center justify-content-around text-center  "
					onClick={showMoreWeather}>
					<section className="current-weather-wind-speed d-flex flex-column align-items-center justify-content-center">
						<section className="wind-icon py-1">
							<img src={WindIcon} height={"30"} width={"30"} alt="wind-icon" />
						</section>
						<p
							className="wind-value fw-bold text-light  brand-small-text text-center py-1 m-0"
							id="wind-value">
							{db.get("SUB_WEATHER_WIND_VALUE") || "2.90 m/s"}
						</p>
						<p className="m-0 wind-text text-muted text-capitalize brand-small-text-2 weather-text text-center">
							Wind
						</p>
					</section>

					<section className=" current-weather-humidity-degree d-flex flex-column align-items-center ">
						<section className="humidity-icon py-1">
							<img
								src={HumidityIcon}
								height={"30"}
								width={"30"}
								alt="humidity-icon"
							/>
						</section>
						<p
							className="humidity-value fw-bold text-light  brand-small-text  text-center py-1 m-0"
							id="humidity-value">
							{db.get("SUB_WEATHER_HUMIDITY_VALUE") || "98%"}
						</p>
						<p className="m-0 humidity-text text-muted text-capitalize text-center brand-small-text-2 weather-text">
							humidity
						</p>
					</section>

					<section className="current-weather-rain-degree d-flex flex-column align-items-center">
						<section className="rain-icon py-1">
							<img
								src={PressureIcon}
								height={"30"}
								width={"30"}
								alt="rain-icon"
							/>
						</section>
						<p
							className="rain-value fw-bold text-light brand-small-text  text-center py-1 m-0"
							id="pressure-value">
							{db.get("SUB_WEATHER_PRESSURE_VALUE") || "1000 hPa"}
						</p>
						<p className="m-0 rain-text text-muted text-capitalize text-center brand-small-text-2 weather-text">
							Pressure
						</p>
					</section>
				</section>
				<section className="future-weather-days d-flex align-items-center justify-content-start">
					<section role="button" className="today-section d-flex mx-2 flex-column align-items-center justify-content-center">
						<p className="brand-small-text text-capitalize fw-bold">today</p>
						<div className="future-weather-notch-active"></div>
					</section>
					<section role="button" className="tomorrow-section d-flex mx-2 flex-column align-items-center justify-content-center" onClick={navigateToForecast}>
						<p className="brand-small-text text-capitalize">tomorrow</p>
						<div className="future-weather-notch"></div>
					</section>
					<section role="button" className="week-section d-flex mx-2 flex-column align-items-center justify-content-center" onClick={navigateToForecast}>
						<p className="brand-small-text text-capitalize">next</p>
						<div className="future-weather-notch"></div>
					</section>
				</section>
				<section
					className="future-weather-forecast my-4 d-flex align-items-center justify-content-between "
					style={{ overflowX: "scroll" }}>
					{mapDbSavedData()}
				</section>
				<section className="ripple-container d-flex align-items-center justify-content-center">
					<section className="map-container d-flex align-items-center justify-content-center">
						<img
							src={Location}
							alt={"google-map"}
							height={"30"}
							width={"30"}
							className="map"
						/>
					</section>
					<section
						id="ripple-container"
						className="ripple-section d-flex align-items-center justify-content-center">
						<img
							src={Ripple1}
							width={"300"}
							height={"300"}
							alt={"ripple-efffect"}
						/>
					</section>
				</section>

				<section className="d-flex align-items-center justify-content-center">
					<Button
						text="current location"
						className="brand-btn my-5 width-toggle"
						onClick={getGeolocation}
					/>
					<br />
				</section>

				<br />
				<br />
				<br />
				{/* @utilityTags - dynamic components to be inserted into the footer component @onClick event - responsible for the search component trigger on the app || weather route*/}
				<Footer utilityTags={componentToInsert} onClick={testSearch} />
			</div>
		</React.Fragment>
	);
};

export default WeatherApp;
