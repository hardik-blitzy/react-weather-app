/**
 * utilities.js
 * Date, time, and navigation utility functions.
 *
 * @module utilities
 * @description Provides helper functions for date formatting,
 * time conversion, and programmatic navigation used throughout
 * the weather application.
 *
 * @requires jquery - For closeUtilityComponent internal function
 * @exports navigate - Navigation function (also default export)
 * @exports getCurrentDate - Date formatting function
 * @exports convertTo12Hour - Time conversion function
 * @exports getTimeFromDateString - Datetime parsing function
 */
import jQuery from "jquery";

/**
 * Navigates to the specified route using window.location.
 * Triggers a full page navigation (not client-side routing).
 *
 * @param {string} page - The target URL or route path to navigate to
 * @returns {void}
 * @example
 * navigate('/weather');
 * navigate('/settings');
 */
export function navigate(page) {
	window.location.href = `${page}`;
}

/**
 * Internal helper to close the utility component panel.
 * Removes the height class from utility-component elements on DOM-ready.
 * Uses jQuery for DOM manipulation.
 *
 * @private
 * @returns {void}
 */
const closeUtilityComponent = () => {
	jQuery(($) => {
		$.noConflict();

		$(".utility-component").removeClass("add-utility-component-height");
	});
};

/**
 * Returns the current date formatted as a human-readable string.
 * Format: "Day, Nth of Month" (e.g., "Friday, 3rd of March")
 *
 * Uses switch statements to map numeric month/day indices to full English names.
 * Calculates ordinal suffix (st, nd, rd, th) based on date value.
 *
 * @returns {string} Formatted date string in "Day, Nth of Month" format
 * @example
 * const today = getCurrentDate();
 * // Returns: "Monday, 1st of January" (example)
 */
export const getCurrentDate = () => {
	let day, month, date, result, dateExtension;

	const DATE = new Date();

	date = DATE.getDate();

	// Map month index (0-11) to full month name
	switch (DATE.getMonth()) {
		case 0:
			month = "January";
			break;
		case 1:
			month = "February";
			break;
		case 2:
			month = "March";
			break;
		case 3:
			month = "April";
			break;
		case 4:
			month = "May";
			break;
		case 5:
			month = "June";
			break;
		case 6:
			month = "July";
			break;
		case 7:
			month = "August";
			break;
		case 8:
			month = "September";
			break;
		case 9:
			month = "October";
			break;
		case 10:
			month = "November";
			break;
		case 11:
			month = "December";
			break;
		default:
			month = "Undefined";
			break;
	}

	// Map day index (0-6) to full day name (Sunday=0)
	switch (DATE.getDay()) {
		case 0:
			day = "Sunday";
			break;
		case 1:
			day = "Monday";
			break;
		case 2:
			day = "Tuesday";
			break;
		case 3:
			day = "Wednesday";
			break;
		case 4:
			day = "Thursday";
			break;
		case 5:
			day = "Friday";
			break;
		case 6:
			day = "Saturday";
			break;
		default:
			day = "Undefined";
			break;
	}

	// Calculate ordinal suffix (st, nd, rd, th) based on date value
	// Special handling for 1st, 2nd, 3rd and teen numbers (11th, 12th, 13th)
	let dateLength = date.toString().length;
	if (
		(dateLength == 1 && date == 1) ||
		(dateLength == 2 && date.toString().indexOf("1") == 1)
	) {
		dateExtension = "st";
	} else if (
		(dateLength == 1 && date == 2) ||
		(dateLength == 2 &&
			date.toString()[0] > 1 &&
			date.toString().lastIndexOf("2") == 1)
	) {
		dateExtension = "nd";
	} else if (
		(dateLength == 1 && date == 3) ||
		(dateLength == 2 &&
			date.toString()[0] > 1 &&
			date.toString().indexOf("3") == 1)
	) {
		dateExtension = "rd";
	} else {
		dateExtension = "th";
	}

	result = `${day}, ${date}${dateExtension} of ${month}`;
	return result;
};

/**
 * Converts a 24-hour format time string to 12-hour format with AM/PM.
 *
 * @param {string} time - Time string starting with hours (e.g., "14:30" or "09:00")
 * @returns {string} Time in 12-hour format with am/pm suffix (e.g., "2 pm", "9 am")
 * @example
 * convertTo12Hour("14:30"); // Returns "2 pm"
 * convertTo12Hour("09:00"); // Returns "9 am"
 * convertTo12Hour("00:15"); // Returns "12 am"
 */
export const convertTo12Hour = (time) => {
	var hours = parseInt(time.substr(0, 2));
	var minutes = time.substr(3);
	var ampm = hours >= 12 ? "pm" : "am";
	hours = hours % 12;
	hours = hours ? hours : 12; // the hour '0' should be '12'
	return hours + " " + ampm;
};

/**
 * Extracts and formats the time portion from a datetime string.
 * Expects input format: "YYYY/MM/DD HH:MM:SS"
 *
 * @param {string} datetime - Datetime string with time starting at index 11
 * @returns {string} Formatted time string with parsed hour prefix
 * @example
 * getTimeFromDateString("2024/01/15 14:30:00"); // Returns "14:30:00"
 */
export function getTimeFromDateString(datetime) {
	// Takes a format of YYYY/MM/DD HH:MM:SS and returns HH:MM:SS
	let time = datetime.substr(11);
	var hours = parseInt(time.substr(0, 2));
	var formattedTime = hours + time.substr(2);
	return formattedTime;
}
export default navigate;
