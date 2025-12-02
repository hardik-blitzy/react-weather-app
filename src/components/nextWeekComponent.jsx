/**
 * nextWeekComponent.jsx
 * Weekly forecast row item component.
 *
 * @module NextWeekComponent
 * @description Displays a single day's forecast in a horizontal
 * row format, showing day name, high/low temperatures, and a
 * weather condition icon. Used in weekly forecast views.
 *
 * Styling:
 * - Uses Bootstrap utility classes and brand-specific classes
 * - brand-gradient background for visual distinction
 * - shadow, rounded corners (rounded-3)
 * - Two <br/> elements for vertical spacing below component
 *
 * DOM Structure:
 * - section.next-week-component (outer row container)
 * - section.today-section > p (day name)
 * - section (temperature section) with high/low temps
 * - section.next-week-weather-x > img (weather icon, 20x20)
 *
 * Note: Contains a typo in className "brand-small-textd-block"
 * (missing space between text and d-block)
 *
 * @example
 * import NextWeekComponent from '../components/nextWeekComponent';
 * // In JSX:
 * <NextWeekComponent
 *   day="Monday"
 *   firstUnit="28"
 *   secondUnit="22"
 *   icon="/assets/static/sunny.svg"
 * />
 */

import React from "react";

/**
 * NextWeekComponent React functional component.
 * Renders a weekly forecast row with day, temps, and icon.
 *
 * @param {Object} props - Component properties
 * @param {string} props.day - Day name (e.g., "Monday", "Tuesday")
 * @param {string} props.firstUnit - High temperature value
 * @param {string} props.secondUnit - Low temperature value
 * @param {string} props.icon - Path to weather icon image
 * @returns {JSX.Element} Weekly forecast row element
 */
const NextWeekComponent = (props) => {
	return (
		<React.Fragment>
			<section className="w-100 next-week-component d-flex align-items-start justify-content-between brand-gradient p-4 rounded-3 shadow">
				<section className="today-section d-flex align-items-start justify-content-start flex-row text-light">
					<p className="text-start fw-bold text-capitalize brand-small-text d-block m-0">{props.day}</p>
				</section>
				{/* High/Low temperature display with degree symbols */}
				<section className="d-flex align-items-center justify-content-between">
						<p className="text-muted brand-small-textd-block px-2  m-0">
							{props.firstUnit}<sup>o</sup>
						</p>
						<div className="next-week-notch d-block mt-3"></div>
						<p className="fw-bold brand-small-text d-block px-2  m-0 text-muted">
							{props.secondUnit}<sup>o</sup>
						</p>
				</section>
				{/* Weather condition icon (20x20 pixels) */}
				<section className="next-week-weather-x align-items-center justify-content-between icon">
						<img src={props.icon} height={"20"} width = {"20"} alt={"weather-icons"}/>
				</section>
				
			</section>
			<br/>
			<br/>
		</React.Fragment>
	);
};

export default NextWeekComponent;
