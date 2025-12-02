/**
 * futureWeatherComponent.jsx
 * Future weather display component.
 *
 * @module FutureWeatherComponent
 * @description Displays a clickable weather card showing time,
 * weather icon, and temperature. Used in forecast strips and
 * weather previews. Similar to ForecastDailyWeatherComponent
 * but includes role="button" for accessibility.
 *
 * Styling:
 * - Uses Bootstrap utility classes (d-flex, align-items-center, etc.)
 * - Inline overscroll styles for horizontal scroll behavior
 * - Fixed image dimensions (40x50 pixels)
 * - Brand utility classes (brand-bg-white, brand-small-text, etc.)
 * - shadow-sm for subtle elevation
 *
 * Accessibility:
 * - role="button" on clickable section
 * - onClick handler for interaction
 *
 * DOM Structure:
 * - section.future-weather-container with role="button" (outer card)
 * - section.weather-wrapper (content wrapper)
 * - p.brand-small-text-2 (time display)
 * - section.weather-icon-section > img (weather icon, 40x50)
 * - p.brand-small-text (temperature with degree symbol)
 *
 * @example
 * import FutureWeatherComponent from '../components/futureWeatherComponent';
 * // In JSX:
 * <FutureWeatherComponent
 *   time="3 PM"
 *   icon="/assets/static/sunny.svg"
 *   weatherUnit="25"
 *   onClick={() => showWeatherDetails()}
 * />
 */
import React from "react";

/**
 * FutureWeatherComponent React functional component.
 * Renders a clickable weather preview card.
 *
 * @param {Object} props - Component properties
 * @param {Function} [props.onClick] - Click handler for card interaction
 * @param {string} props.time - Time display string (e.g., "3 PM", "12pm")
 * @param {string} props.icon - Path to weather icon image
 * @param {string} props.weatherUnit - Temperature value (without degree symbol)
 * @returns {JSX.Element} Clickable future weather card
 */
const FutureWeatherComponent = props =>{
   // Inline styles to hide scrollbar and enable horizontal scroll
   const customStyle = {
    "overscrollX":"scroll",
    "scrollbarWidth":"none"
   }
    return (
       <React.Fragment>
            <section style={customStyle} role="button" className="future-weather-container d-flex align-items-center justify-content-center flex-column brand-bg-white px-4  rounded-3 shadow-sm mx-2 my-2" onClick={props.onClick}>
                <section className="weather-wrapper d-flex flex-column align-items-center justify-content-center">
                    <p className="brand-small-text-2  py-1 text-center m-0">{props.time}</p>
                    <section className="weather-icon-section py-1">
                            <img src ={props.icon} height={"40"} width={"50"} alt={"sub-weather-icon"}/>
                    </section>
                    <p className="brand-small-text fw-bold text-center m-0"> {props.weatherUnit}<sup>o</sup></p>
                </section>
            </section> 
       </React.Fragment>
    )
}


export default FutureWeatherComponent;
