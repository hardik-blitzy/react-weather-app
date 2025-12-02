# Inc Module - Static Scripts and Styles

This module contains static JavaScript utilities and CSS stylesheets that provide core functionality and styling for the Awesome Weather Application.

## Overview

The `src/inc/` directory serves as the home for static assets that are imported application-wide. It is organized into two main subdirectories:

- **`scripts/`** - JavaScript utility functions for date/time formatting, navigation, and DOM initialization
- **`styles/`** - CSS files including design tokens, component styles, and third-party animation libraries

These assets are loaded via `src/autoload.js` to ensure they are available throughout the application.

## Directory Structure

```
src/inc/
├── scripts/
│   ├── script.js         # DOM-ready initialization
│   └── utilities.js      # Date/time and navigation helpers
└── styles/
    ├── style.css         # Main application styles
    ├── overScrollStyles.css  # Scrollbar hiding
    └── three-dots.css    # Loading spinner animations
```

## Scripts Reference

| File | Purpose | Exports |
|------|---------|---------|
| `scripts/script.js` | DOM-ready initialization, jQuery noConflict mode setup, spinner hiding on page load | None (side-effects only) |
| `scripts/utilities.js` | Date/time formatting and navigation helpers | `getCurrentDate`, `convertTo12Hour`, `getTimeFromDateString`, `navigate` |

### script.js

This file executes side-effects on DOM ready:

1. **jQuery noConflict Mode** - Calls `$.noConflict()` to prevent conflicts with other libraries that use the `$` symbol
2. **Spinner Hiding** - Hides the `#spinner` loading overlay element once the page has loaded

```javascript
// Automatically executed on page load - no manual import needed for side-effects
import "./inc/scripts/script.js";
```

## Utility Functions API Reference

The `utilities.js` module exports four utility functions for date/time manipulation and navigation.

### getCurrentDate()

Returns the current date formatted as a human-readable string with ordinal suffix.

**Returns:** `{string}` - Formatted date in "Day, Nth of Month" format

**Format Examples:**
- `"Friday, 3rd of March"`
- `"Monday, 1st of January"`
- `"Wednesday, 22nd of November"`

**Ordinal Logic:**
- Dates ending in 1 (except 11): "st" suffix
- Dates ending in 2 (except 12): "nd" suffix
- Dates ending in 3 (except 13): "rd" suffix
- All other dates: "th" suffix

**Example:**
```javascript
import { getCurrentDate } from "./inc/scripts/utilities";

const today = getCurrentDate();
console.log(today); // "Friday, 3rd of March"
```

---

### convertTo12Hour(time)

Converts a 24-hour time format string to 12-hour format with AM/PM indicator.

**Parameters:**
| Name | Type | Description |
|------|------|-------------|
| `time` | `string` | Time in 24-hour format (e.g., "14:30", "09:15") |

**Returns:** `{string}` - Time in 12-hour format with AM/PM (e.g., "2 pm", "9 am")

**Conversion Rules:**
- Hours 0-11 display with "am" suffix
- Hours 12-23 display with "pm" suffix
- Hour 0 converts to 12 am
- Hour 12 remains as 12 pm

**Example:**
```javascript
import { convertTo12Hour } from "./inc/scripts/utilities";

console.log(convertTo12Hour("14:30")); // "2 pm"
console.log(convertTo12Hour("09:15")); // "9 am"
console.log(convertTo12Hour("00:00")); // "12 am"
console.log(convertTo12Hour("12:00")); // "12 pm"
```

---

### getTimeFromDateString(datetime)

Extracts and parses the time portion from a datetime string in `YYYY/MM/DD HH:MM:SS` format.

**Parameters:**
| Name | Type | Description |
|------|------|-------------|
| `datetime` | `string` | Datetime string in format "YYYY/MM/DD HH:MM:SS" |

**Returns:** `{string}` - Time portion with parsed hour (removes leading zero from hours)

**Example:**
```javascript
import { getTimeFromDateString } from "./inc/scripts/utilities";

const time = getTimeFromDateString("2024/03/15 14:30:00");
console.log(time); // "14:30:00"

const morningTime = getTimeFromDateString("2024/03/15 09:15:00");
console.log(morningTime); // "9:15:00"
```

---

### navigate(page)

Performs programmatic navigation to a specified route using `window.location.href`.

**Parameters:**
| Name | Type | Description |
|------|------|-------------|
| `page` | `string` | Target route path to navigate to |

**Returns:** `{void}` - No return value; triggers page navigation

**Example:**
```javascript
import { navigate } from "./inc/scripts/utilities";

// Navigate to the weather page
navigate("/weather");

// Navigate to settings
navigate("/settings");

// Navigate to home
navigate("/");
```

**Note:** This function causes a full page reload. For SPA-style navigation within React Router, consider using the router's navigation methods instead.

---

## Styles Reference

| File | Purpose | Key Classes/Properties |
|------|---------|------------------------|
| `styles/style.css` | Main application styles | Custom fonts, CSS design tokens, buttons, footer navigation, utility components |
| `styles/overScrollStyles.css` | Scrollbar customization | `::-webkit-scrollbar` suppression |
| `styles/three-dots.css` | Loading spinner animations | `.dot-elastic`, `.dot-pulse`, and other dot animation classes |

### style.css

The main stylesheet provides the application's visual foundation.

#### Custom Fonts

```css
@font-face {
  font-family: poppins;
  src: url("./../../fonts/poppins.ttf");
}
```

The application uses the **Poppins** font family for all text elements.

#### CSS Design Tokens (Custom Properties)

All design tokens are defined in the `:root` selector for consistent theming:

| Token | Value | Usage |
|-------|-------|-------|
| `--brand-primary-color` | `rgb(83, 166, 250)` | Primary blue color for buttons, accents |
| `--brand-secondary-color` | `rgb(124, 183, 241)` | Secondary blue for hover states, backgrounds |
| `--brand-tertiary-color` | `rgb(137, 190, 243)` | Tertiary blue for subtle accents |
| `--brand-white-color` | `#ffffff` | White backgrounds, text on dark |
| `--brand-mute-color` | `rgb(211, 205, 205)` | Muted text and backgrounds |
| `--footer-nav-border-radius` | `30px` | Border radius for footer navigation |
| `--footer-notch-border-radius` | `60px` | Border radius for footer notch |
| `--brand-weather-value-font-size` | `4rem` | Large temperature display font |
| `--brand-medium-font-size` | `1.6rem` | Medium heading font |
| `--brand-footer-nav-fontsize` | `0.9rem` | Footer navigation text |
| `--brand-input-border-radius` | `5px` | Form input border radius |
| `--brand-button-3-border-radius` | `5px` | Tertiary button border radius |

#### Key CSS Classes

| Class | Purpose |
|-------|---------|
| `#spinner` | Full-screen loading overlay with centered content |
| `.brand-btn` | Primary rounded button with brand colors |
| `.brand-btn-2` | White/light button variant |
| `.brand-btn-3` | Square-cornered button variant |
| `.footer-nav` | Bottom navigation bar styling |
| `.footer-nav-container` | Fixed-position footer container |
| `.utility-component` | Slide-up panel component |
| `.add-utility-component-height` | Animates utility panel to 60% height |
| `.brand-text-mute` | Muted text color |
| `.brand-bg-white` | White background |
| `.brand-small-text` | Small text sizing |
| `.brand-large-text` | Large text sizing |
| `.brand-primary-color` | Primary brand background |

### overScrollStyles.css

A minimal stylesheet that hides webkit scrollbars for a cleaner mobile experience:

```css
::-webkit-scrollbar {
  height: 0;
  width: 0;
}
```

### three-dots.css

A third-party CSS animation library for loading spinners.

**License:** MIT License  
**Version:** v0.2.3  
**Author:** nzbin  
**Source:** https://nzbin.github.io/three-dots/

#### Available Animation Classes

| Class | Animation Type |
|-------|----------------|
| `.dot-elastic` | Elastic bouncing dots animation |
| `.dot-pulse` | Pulsing dots animation |
| `.dot-flashing` | Flashing dots animation |
| `.dot-collision` | Collision effect dots animation |
| `.dot-revolution` | Revolving dots animation |
| `.dot-carousel` | Carousel-style dots animation |
| `.dot-typing` | Typing indicator animation |
| `.dot-windmill` | Windmill spinning animation |
| `.dot-bricks` | Brick-stacking animation |
| `.dot-floating` | Floating dots animation |
| `.dot-fire` | Fire-like animation |
| `.dot-spin` | Spinning dots animation |
| `.dot-falling` | Falling dots animation |
| `.dot-stretchy` | Stretchy dots animation |

**Usage Example:**
```jsx
<div className="dot-elastic"></div>
```

## Usage

### Importing Utility Functions

```javascript
// Import specific functions
import { getCurrentDate, convertTo12Hour, getTimeFromDateString, navigate } from "./inc/scripts/utilities";

// Or import navigate as default
import navigate from "./inc/scripts/utilities";
```

### Importing Styles

Styles are typically imported in the main entry point or via `autoload.js`:

```javascript
// In autoload.js or index.js
import "./inc/styles/style.css";
import "./inc/styles/overScrollStyles.css";
import "./inc/styles/three-dots.css";
```

### Using Design Tokens in Inline Styles

```jsx
const MyComponent = () => (
  <div style={{ backgroundColor: 'var(--brand-primary-color)' }}>
    Styled with design token
  </div>
);
```

## Dependencies

### External Dependencies

| Package | Version | Usage |
|---------|---------|-------|
| `jquery` | ^3.7.1 | Used in `script.js` and `utilities.js` for DOM manipulation and noConflict setup |

### Internal Dependencies

| Module | Usage |
|--------|-------|
| `src/fonts/` | Custom Poppins font files referenced in `style.css` |

## Related Documentation

- [Back to Main README](../../README.md)
- [Components Module](../components/README.md) - UI components that use these styles
- [Pages Module](../pages/README.md) - Page components using utility functions

---

*This documentation was created to support developer onboarding and codebase understanding for the Awesome Weather Application.*
