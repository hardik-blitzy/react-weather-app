/**
 * forecastWeatherItems.jsx
 * Individual forecast weather item component.
 *
 * @module ForecastWeatherItems
 * @description Displays a single weather forecast item with
 * weather description, icon, and temperature. Used to show
 * individual time slots in forecast displays.
 *
 * Styling:
 * - Uses Bootstrap utility classes (d-flex, align-items-center, etc.)
 * - Inline overscroll styles for horizontal scroll behavior
 * - Fixed image dimensions (30x30 pixels)
 * - Brand utility classes (brand-bg-white, brand-small-text, etc.)
 *
 * DOM Structure:
 * - section.future-weather-container (outer card)
 * - section.weather-wrapper (content wrapper)
 * - p.brand-small-text-2 (weather name/description)
 * - section.weather-icon-section > img (weather icon)
 * - p.brand-small-text (temperature with degree symbol)
 *
 * @example
 * import ForecastWeatherItems from '../components/forecastWeatherItems';
 * // In JSX:
 * <ForecastWeatherItems
 *   name="Partly Cloudy"
 *   icon="/assets/static/sunny.svg"
 *   weatherUnit="25"
 * />
 */
import React from "react";

/**
 * ForecastWeatherItems React functional component.
 * Renders a weather forecast card with description, icon, and temp.
 *
 * @param {Object} props - Component properties
 * @param {string} props.name - Weather description/condition name
 * @param {string} props.icon - Path to weather icon image (SVG/PNG)
 * @param {string} props.weatherUnit - Temperature value (without degree symbol)
 * @returns {JSX.Element} Forecast item card
 */
const ForecastWeatherItems = props =>{
    // Inline styles to hide scrollbar and enable horizontal scroll
    const customStyle = {
        "overscrollX":"scroll",
        "scrollbarWidth":"none"
       }
    return (
       <React.Fragment>
            <section style={customStyle} className="future-weather-container d-flex align-items-center justify-content-between flex-column brand-bg-white px-4  rounded-3 shadow mx-4">
                <section className="weather-wrapper d-flex flex-column align-items-center justify-content-between">
                    <p className="brand-small-text-2 text-dark py-1 text-center m-0">{props.name}</p>
                    <section className="weather-icon-section py-1">
                            <img src ={props.icon} height={"30"} width={"30"} alt={"sub-weather-icon"}/>
                    </section>
                    <p className="brand-small-text fw-bold text-center text-dark m-0"> {props.weatherUnit}<sup>o</sup></p>
                </section>
            </section> 
       </React.Fragment>
    )
}


export default ForecastWeatherItems;
