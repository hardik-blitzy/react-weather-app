/**
 * spinner.jsx
 * Loading spinner/indicator component.
 *
 * @module Spinner
 * @description Displays a three-dot windmill animation during
 * loading states. Uses CSS animations from inc/styles/three-dots.css
 * which provides the dot-windmill animation class.
 *
 * DOM Structure:
 * - Container div with id="spinner" and className="spinner"
 * - Child div with className="dot-windmill spinner-child"
 *
 * Styling Dependencies:
 * - src/inc/styles/three-dots.css - Provides .dot-windmill animation
 * - src/inc/styles/style.css - Provides .spinner overlay positioning
 *
 * Usage: Import and render during async operations
 * @example
 * import Spinner from '../components/spinner';
 * // In JSX:
 * {isLoading && <Spinner />}
 *
 * @returns {JSX.Element} Loading spinner overlay
 */

/**
 * Spinner React functional component.
 * Renders a loading indicator with dot-windmill animation.
 * No props required - purely presentational.
 *
 * @returns {JSX.Element} Loading spinner element
 */
const Spinner = () =>{
    return (
        <div id="spinner" className = "spinner">

                <div className="dot-windmill spinner-child" id="spinner-child"></div>
                
        </div>
    );
}


export default Spinner;
