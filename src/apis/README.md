# APIs Module

Browser-facing weather API integration layer for the Awesome Weather Application.

## Overview

This module provides the core API integration functionality for the weather application. It handles all external API communications, data processing, and UI updates for weather information.

**Key Responsibilities:**
- Weather data fetching from OpenWeatherMap API
- City search/autocomplete via API Ninjas
- Browser geolocation tracking
- Weather condition code to icon mapping
- DOM manipulation for weather display updates
- LocalStorage caching for offline access

**Pattern:** jQuery AJAX calls with localStorage persistence via the `db` singleton from the backend module.

**External APIs:**
- [OpenWeatherMap](https://openweathermap.org/) - Current weather and forecast data
- [API Ninjas](https://api-ninjas.com/) - City name search/autocomplete

---

## Files

| File | Purpose | Exports |
|------|---------|---------|
| `getCurrentWeather.js` | Current weather fetching and UI updates | 11 exports: `API_KEY`, `WEATHER_UNIT`, `closeUtilityComponent`, `scrollToElement`, `checkWeatherUnitDeg`, `handleWeatherForm`, `findCity`, `weatherSvg`, `checkWeatherCode`, `updateReactDom`, `getCurrentWeather` |
| `getGeolocation.js` | Browser geolocation handling | `getGeolocation` (default export) |
| `getWeatherForecast.js` | 5-day forecast fetching | `getWeatherForecast` |

---

## API Reference

### getCurrentWeather.js Exports

#### `API_KEY`

OpenWeatherMap API key constant.

- **Type:** `{string}`
- **Value:** Hard-coded API key

> ⚠️ **WARNING:** This API key is hard-coded. See [Security Notes](#security-notes) for production recommendations.

---

#### `WEATHER_UNIT`

Temperature unit setting retrieved from localStorage or defaults to "metric" (Celsius).

- **Type:** `{string}`
- **Default:** `"metric"`
- **Valid values:** `"metric"` (°C), `"imperial"` (°F), `"standard"` (K)

---

#### `closeUtilityComponent()`

Closes the utility component panel by hiding UI elements using jQuery and Bootstrap classes.

- **Parameters:** None
- **Returns:** `{void}`

**Example:**
```javascript
import { closeUtilityComponent } from './apis/getCurrentWeather';

closeUtilityComponent(); // Hides the search/utility panel
```

---

#### `scrollToElement(elementId)`

Smoothly scrolls the page to bring the specified element into view.

- **Parameters:**
  - `elementId` `{string}` - The DOM element ID to scroll to (without `#` prefix)
- **Returns:** `{void}`

**Example:**
```javascript
import { scrollToElement } from './apis/getCurrentWeather';

scrollToElement('weatherContainer'); // Scrolls to weather display section
```

---

#### `checkWeatherUnitDeg()`

Gets the temperature unit symbol based on current settings stored in localStorage.

- **Parameters:** None
- **Returns:** `{string}` - Temperature unit symbol:
  - `'c'` for Celsius
  - `'f'` for Fahrenheit
  - `'k'` for Kelvin

**Example:**
```javascript
import { checkWeatherUnitDeg } from './apis/getCurrentWeather';

const unit = checkWeatherUnitDeg(); // Returns 'c', 'f', or 'k'
```

---

#### `handleWeatherForm(e, search)`

Handles the weather search form submission. Validates tracking settings and triggers weather fetch.

- **Parameters:**
  - `e` `{Event}` - Form submit event (preventDefault is called)
  - `search` `{string}` *(optional)* - Search term to use instead of input value
- **Returns:** `{void}`

**Example:**
```jsx
import { handleWeatherForm } from './apis/getCurrentWeather';

<form onSubmit={(e) => handleWeatherForm(e)}>
  <input id="searchWeather" placeholder="Search city..." />
  <button type="submit">Search</button>
</form>
```

---

#### `findCity(searchTerm, updateDataArray)`

Searches for cities matching the given search term using API Ninjas. Returns up to 4 matching cities via callback.

- **Parameters:**
  - `searchTerm` `{string}` - City name or partial name to search
  - `updateDataArray` `{Function}` - Callback function receiving array of city results
- **Returns:** `{void}`

**Callback Response Structure:**
```javascript
[
  {
    name: "London",
    country: "GB",
    latitude: 51.5074,
    longitude: -0.1278,
    population: 8982000
  },
  // ... up to 4 results
]
```

**Example:**
```javascript
import { findCity } from './apis/getCurrentWeather';

findCity('London', (cities) => {
  console.log(cities); // [{name: 'London', country: 'GB', ...}, ...]
  // Use cities to populate autocomplete dropdown
});
```

---

#### `weatherSvg`

Mutable variable storing the current weather icon SVG path. Set by `checkWeatherCode()`.

- **Type:** `{string}` (mutable)
- **Description:** Contains the imported SVG asset path for the current weather condition

---

#### `checkWeatherCode(code)`

Maps OpenWeatherMap weather condition codes to SVG icon assets. Also sets the module-level `weatherSvg` variable.

- **Parameters:**
  - `code` `{number}` - OpenWeatherMap weather condition code (200-804)
- **Returns:** `{string}` - Path to the corresponding SVG icon asset

**Example:**
```javascript
import { checkWeatherCode } from './apis/getCurrentWeather';

const iconPath = checkWeatherCode(800); // Returns path to day.svg (clear sky)
const thunderIcon = checkWeatherCode(200); // Returns path to thunder.svg
```

See [Weather Code Mapping](#weather-code-mapping) for complete code-to-icon table.

---

#### `updateReactDom(result)`

Updates the DOM with weather data from API response. Also caches weather data in localStorage for offline access.

- **Parameters:**
  - `result` `{Object}` - OpenWeatherMap API response object
    - `result.name` `{string}` - City name
    - `result.sys.country` `{string}` - Country code
    - `result.main.temp` `{number}` - Temperature
    - `result.main.humidity` `{number}` - Humidity percentage
    - `result.main.pressure` `{number}` - Atmospheric pressure (hPa)
    - `result.weather[0].description` `{string}` - Weather description
    - `result.weather[0].id` `{number}` - Weather condition code
    - `result.wind.speed` `{number}` - Wind speed (m/s)
- **Returns:** `{void}`

**DOM Elements Updated:**
| Element ID | Content |
|------------|---------|
| `#weatherLocation` | City name and country code |
| `#currentDeg` | Temperature (rounded up) |
| `#weatherDes` | Weather description |
| `#currentDate` | Current formatted date |
| `#main-weather-icon-container` | Weather icon image |
| `#wind-value` | Wind speed (m/s) |
| `#humidity-value` | Humidity (%) |
| `#pressure-value` | Pressure (hPa) |

---

#### `getCurrentWeather(city)`

Fetches current weather data for the specified location from OpenWeatherMap API.

- **Parameters:**
  - `city` `{string}` - City name to fetch weather for (can include country code, e.g., "London,UK")
- **Returns:** `{void}` - Weather data is passed to `updateReactDom()` on success

**Example:**
```javascript
import { getCurrentWeather } from './apis/getCurrentWeather';

getCurrentWeather('London');          // Fetches London weather
getCurrentWeather('New York,US');     // Fetches with country code
getCurrentWeather('Tokyo,JP');        // Fetches Tokyo, Japan weather
```

---

### getGeolocation.js

#### `getGeolocation()` (default export)

Starts watching user's geolocation and triggers weather updates automatically. Uses `navigator.geolocation.watchPosition` for continuous tracking.

- **Parameters:** None
- **Returns:** `{void}`

**Behavior:**
1. Checks for Geolocation API support in browser
2. Requests user permission for location access
3. On first position: stores coordinates in localStorage (`USER_LONGITUDE`, `USER_LATITUDE`)
4. On subsequent positions: fetches weather for current coordinates via OpenWeatherMap

**Error Handling:**
Displays SweetAlert2 toast on location errors:
- `PERMISSION_DENIED` - User denied location access
- `POSITION_UNAVAILABLE` - Location information unavailable
- `TIMEOUT` - Location request timed out

> ⚠️ **Note:** This module registers a persistent watcher with no stop API. The watcher continues running until the page is closed.

**Example:**
```javascript
import getGeolocation from './apis/getGeolocation';

// Start tracking user location and auto-fetch weather
getGeolocation();
```

---

### getWeatherForecast.js

#### `getWeatherForecast()`

Fetches 5-day weather forecast from OpenWeatherMap API. The API returns weather data in 3-hour intervals, providing 40 data points (8 per day × 5 days).

- **Parameters:** None
- **Returns:** `{void}` - Data is returned via AJAX callback

**API Response Structure:**
```javascript
{
  cod: "200",
  list: [
    // 40 forecast entries (3-hour intervals)
    {
      dt: 1620000000,           // Unix timestamp
      main: { temp, humidity, pressure, ... },
      weather: [{ id, main, description, icon }],
      wind: { speed, deg },
      dt_txt: "2021-05-03 12:00:00"
    },
    // ... 39 more entries
  ],
  city: {
    name: "City Name",
    country: "XX"
  }
}
```

**Example:**
```javascript
import { getWeatherForecast } from './apis/getWeatherForecast';

getWeatherForecast(); // Fetches 5-day forecast
```

> **Note:** Current implementation uses a hardcoded location. Consider refactoring to accept location parameter.

---

## Weather Code Mapping

The `checkWeatherCode()` function maps OpenWeatherMap weather condition codes to SVG icon assets:

| Code Range | Weather Condition | Icon File | Description |
|------------|------------------|-----------|-------------|
| 200-232 | Thunderstorm | `thunder.svg` | Thunderstorm with varying rain intensity |
| 300-321 | Drizzle | `rainy-5.svg` | Light drizzle conditions |
| 500-504 | Rain | `rainy-7.svg` | Light to heavy rain |
| 511 | Freezing Rain | `freezing-rain.svg` | Rain that freezes on contact |
| 520-531 | Shower Rain | `rainy-7.svg` | Rain showers of varying intensity |
| 600-622 | Snow | `snowy-6.svg` | Snow conditions |
| 701 | Mist | `mist.svg` | Mist visibility condition |
| 702-781 | Atmosphere | `haze.svg` | Haze, smoke, dust, fog, sand, volcanic ash |
| 800 | Clear Sky | `day.svg` | Clear sky, sunny |
| 801 | Few Clouds | `few-clouds.svg` | 11-25% cloud coverage |
| 802 | Scattered Clouds | `scattered-clouds.svg` | 25-50% cloud coverage |
| 803 | Broken Clouds | `broken-clouds.svg` | 51-84% cloud coverage |
| 804 | Overcast Clouds | `overcast-clouds.svg` | 85-100% cloud coverage |

> 📖 **Reference:** [OpenWeatherMap Weather Condition Codes](https://openweathermap.org/weather-conditions)

---

## External APIs Used

| API | Provider | Endpoint | Purpose |
|-----|----------|----------|---------|
| Current Weather | OpenWeatherMap | `https://api.openweathermap.org/data/2.5/weather` | Real-time weather data |
| 5-Day Forecast | OpenWeatherMap | `https://api.openweathermap.org/data/2.5/forecast` | Weather predictions (40 data points) |
| City Search | API Ninjas | `https://api.api-ninjas.com/v1/city` | City name autocomplete (up to 4 results) |

### API Documentation Links

- **OpenWeatherMap Current Weather:** https://openweathermap.org/current
- **OpenWeatherMap 5-Day Forecast:** https://openweathermap.org/forecast5
- **API Ninjas City API:** https://api-ninjas.com/api/city

---

## Security Notes

> ⚠️ **CRITICAL WARNING:** API keys are currently hard-coded in source files.

### Current Hard-Coded Keys

| File | API Key | Line |
|------|---------|------|
| `getCurrentWeather.js` | OpenWeatherMap API key | Line 25 (`API_KEY` constant) |
| `getCurrentWeather.js` | API Ninjas key | Line 102 (`XAPIKEY` in `findCity`) |
| `getWeatherForecast.js` | OpenWeatherMap API key | Line 9 (`$API_KEY` variable) |

### Production Recommendations

For production deployment, follow these security best practices:

1. **Create environment file:**
   ```bash
   # Create .env file in project root
   touch .env
   ```

2. **Add API keys to .env:**
   ```env
   REACT_APP_OPENWEATHER_API_KEY=your_openweathermap_api_key
   REACT_APP_API_NINJAS_KEY=your_api_ninjas_key
   ```

3. **Access in code:**
   ```javascript
   // Replace hard-coded keys with:
   const API_KEY = process.env.REACT_APP_OPENWEATHER_API_KEY;
   const XAPIKEY = process.env.REACT_APP_API_NINJAS_KEY;
   ```

4. **Update .gitignore:**
   ```gitignore
   # Environment variables
   .env
   .env.local
   .env.*.local
   ```

5. **Never commit API keys to version control**

---

## LocalStorage Keys

Keys created and used by this module:

| Key | Description | Set By | Read By |
|-----|-------------|--------|---------|
| `WEATHER_LOCATION` | Current city and country (e.g., "London GB") | `updateReactDom` | Pages |
| `WEATHER_DEG` | Current temperature value | `updateReactDom` | Pages |
| `WEATHER_DESCRIPTION` | Weather description text | `updateReactDom` | Pages |
| `WEATHER_CODE` | Weather condition code (200-804) | `updateReactDom` | Pages |
| `SUB_WEATHER_WIND_VALUE` | Wind speed with unit (e.g., "5.2 m/s") | `updateReactDom` | Pages |
| `SUB_WEATHER_HUMIDITY_VALUE` | Humidity with unit (e.g., "65 %") | `updateReactDom` | Pages |
| `SUB_WEATHER_PRESSURE_VALUE` | Atmospheric pressure (e.g., "1013 hPa") | `updateReactDom` | Pages |
| `USER_LONGITUDE` | User's saved longitude coordinate | `getGeolocation` | `getGeolocation` |
| `USER_LATITUDE` | User's saved latitude coordinate | `getGeolocation` | `getGeolocation` |
| `WEATHER_UNIT` | Temperature unit setting | Settings module | `WEATHER_UNIT` constant |
| `TRACK_SAVED_LOCATION_WEATHER` | Tracking preference flag | Settings module | `handleWeatherForm`, `findCity` |

---

## Usage Examples

### Basic Weather Fetching

```javascript
// Import weather functions
import { getCurrentWeather, checkWeatherCode } from './apis/getCurrentWeather';

// Fetch weather for a specific city
getCurrentWeather('London');

// Fetch weather with country code for accuracy
getCurrentWeather('Paris,FR');
```

### Weather Icon Mapping

```javascript
import { checkWeatherCode, weatherSvg } from './apis/getCurrentWeather';

// Get icon path for a weather condition code
const iconPath = checkWeatherCode(800);  // Clear sky → day.svg
const thunderIcon = checkWeatherCode(200); // Thunderstorm → thunder.svg

// Use the weatherSvg module variable after calling checkWeatherCode
console.log(weatherSvg); // Path to the last computed icon
```

### City Search with Autocomplete

```javascript
import { findCity } from './apis/getCurrentWeather';

// Search for cities and handle results
findCity('Lon', (cities) => {
  cities.forEach(city => {
    console.log(`${city.name}, ${city.country}`);
    // Populate autocomplete dropdown
  });
});
```

### Geolocation-Based Weather

```javascript
import getGeolocation from './apis/getGeolocation';

// Start tracking user location
// Weather will be fetched automatically when position is available
getGeolocation();
```

### Complete Integration Example

```jsx
import React, { useEffect } from 'react';
import { getCurrentWeather, handleWeatherForm } from './apis/getCurrentWeather';
import getGeolocation from './apis/getGeolocation';

function WeatherApp() {
  useEffect(() => {
    // Start geolocation tracking on mount
    getGeolocation();
  }, []);

  return (
    <div>
      <form onSubmit={(e) => handleWeatherForm(e)}>
        <input 
          id="searchWeather" 
          placeholder="Search city..." 
        />
        <button type="submit">Search</button>
      </form>
      
      {/* Weather display elements */}
      <div id="weatherContainer">
        <span id="weatherLocation"></span>
        <span id="currentDeg"></span>
        <span id="weatherDes"></span>
        <div id="main-weather-icon-container"></div>
      </div>
    </div>
  );
}
```

---

## Dependencies

### Internal Dependencies

| Module | Import | Usage |
|--------|--------|-------|
| `../backend/app_backend` | `{ db }` | Database singleton for localStorage persistence |
| `../inc/scripts/utilities` | `{ getCurrentDate }` | Date formatting for weather display |
| `../assets/static/*.svg` | Weather icons | SVG icon assets for weather conditions |

### External Dependencies (npm)

| Package | Version | Usage |
|---------|---------|-------|
| `jquery` | ^3.7.1 | AJAX requests and DOM manipulation |
| `sweetalert2` | ^11.12.1 | Toast notifications for user feedback |

---

## Related Documentation

- [Back to Main README](../../README.md) - Project overview and setup
- [Backend Module](../backend/README.md) - Database persistence layer documentation
- [Pages Module](../pages/README.md) - Page components using these APIs
- [Assets Module](../assets/README.md) - Weather icon SVG files
- [Components Module](../components/README.md) - UI components

---

## Architecture Notes

### Data Flow

```
User Action (search/geolocation)
         ↓
    API Module
         ↓
    jQuery AJAX
         ↓
  External API (OpenWeatherMap/API Ninjas)
         ↓
    Response Processing
         ↓
  ┌──────┴──────┐
  ↓             ↓
DOM Update   localStorage Cache
(jQuery)     (db.create)
```

### Module Coupling

This module is tightly coupled with:
- **Backend module** - Uses `db` singleton for all localStorage operations
- **Utilities module** - Uses `getCurrentDate()` for date formatting
- **Asset files** - Imports SVG icons for weather conditions

### jQuery Usage Note

This module uses jQuery for AJAX calls and DOM manipulation alongside React. While this works, it bypasses React's virtual DOM reconciliation. Consider migrating to:
- `fetch()` or `axios` for API calls
- React refs and state for DOM updates

---

*Last updated: Documentation generated as part of the Awesome Weather Application enhancement project.*
