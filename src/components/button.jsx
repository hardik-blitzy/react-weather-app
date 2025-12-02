/**
 * button.jsx
 * Reusable button component.
 *
 * @module Button
 * @description A minimal, stateless button component that renders
 * a standard HTML button element with customizable styles, classes,
 * click handlers, and text content.
 *
 * Note: Does not forward children, set button type (defaults to
 * "submit" in forms), or include accessibility attributes.
 *
 * @example
 * import Button from '../components/button';
 * // In JSX:
 * <Button
 *   text="Click Me"
 *   className="brand-btn"
 *   onClick={() => console.log('clicked')}
 *   style={{ marginTop: '10px' }}
 * />
 */

/**
 * Button React functional component.
 * Renders a customizable button element.
 *
 * @param {Object} props - Component properties
 * @param {Object} [props.style] - Inline styles object for the button
 * @param {string} [props.className] - CSS class names to apply
 * @param {Function} [props.onClick] - Click event handler function
 * @param {string} props.text - Button label text (required for display)
 * @returns {JSX.Element} Button element with provided props
 */
const Button = (props) =>{
  
    return (
        <button style={props.style} className = {props.className} onClick={props.onClick}>
            {props.text}
        </button>
    )
}

export default Button;
