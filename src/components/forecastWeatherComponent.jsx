/**
 * forecastWeatherComponent.jsx
 * Forecast weather card component.
 *
 * @module ForecastDailyWeatherComponent
 * @description Displays a forecast weather card with time, icon,
 * and temperature. Supports click interaction and title attribute.
 * Used in the 5-day forecast page for individual time slot displays.
 *
 * Styling:
 * - Uses Bootstrap utility classes (d-flex, align-items-center, etc.)
 * - Inline overscroll styles for horizontal scroll behavior
 * - Fixed image dimensions (40x50 pixels)
 * - Brand utility classes (brand-bg-white, brand-small-text, etc.)
 * - shadow-sm for subtle elevation
 *
 * DOM Structure:
 * - section#future-weather-container (outer card with title attr)
 * - section.weather-wrapper (content wrapper)
 * - p.brand-small-text-2 (time display)
 * - section.weather-icon-section > img (weather icon, 40x50)
 * - p.brand-small-text (temperature with degree symbol)
 *
 * @example
 * import ForecastDailyWeatherComponent from '../components/forecastWeatherComponent';
 * // In JSX:
 * <ForecastDailyWeatherComponent
 *   title="Partly Cloudy"
 *   time="3 PM"
 *   icon="/assets/static/cloudy.svg"
 *   weatherUnit="25"
 *   onClick={() => showDetails()}
 * />
 */
import React from "react";

/**
 * ForecastDailyWeatherComponent React functional component.
 * Renders a forecast weather card for a specific time slot.
 *
 * @param {Object} props - Component properties
 * @param {string} props.title - Card title text (used as HTML title attribute)
 * @param {Function} [props.onClick] - Click handler for card interaction
 * @param {string} props.time - Time display string (e.g., "3 PM")
 * @param {string} props.icon - Path to weather icon image
 * @param {string} props.weatherUnit - Temperature value (without degree symbol)
 * @returns {JSX.Element} Forecast weather card element
 */
const ForecastDailyWeatherComponent = props =>{
    // Inline styles to hide scrollbar and enable horizontal scroll
    const customStyle = {
        "overscrollX":"scroll",
        "scrollbarWidth":"none"
       }
    return (
       <React.Fragment>
            <section style={customStyle} id="future-weather-container" className="future-weather-container d-flex align-items-center justify-content-center flex-column brand-bg-white px-4  rounded-3 shadow-sm mx-2 my-3" title={props.title} onClick={props.onClick}>
                <section className="weather-wrapper d-flex flex-column align-items-center justify-content-center">
                    <p className="brand-small-text-2  py-1 text-center m-0">{props.time}</p>
                    <section className="weather-icon-section py-1">
                            <img src ={props.icon} height={"40"} width={"50"} alt={"sub-weather-icon"} />
                    </section>
                    <p className="brand-small-text fw-bold text-center m-0"> {props.weatherUnit}<sup>o</sup></p>
                </section>
            </section> 
       </React.Fragment>
    )
}


export default ForecastDailyWeatherComponent;
