# Assets Module

Image and icon assets for the Awesome Weather Application.

## Overview

This module houses all image and icon assets used throughout the Weather Application. Assets are organized into two main categories:

- **Root-level assets**: UI elements, illustrations, and indicator icons used for general application branding and weather statistics display
- **Static subfolder (`static/`)**: Weather condition SVG icons dynamically selected based on OpenWeatherMap API weather codes

### File Types

| Type | Extension | Usage |
|------|-----------|-------|
| SVG | `.svg` | Scalable vector graphics for icons (resolution-independent) |
| PNG | `.png` | Raster images for illustrations and complex graphics |
| GIF | `.gif` | Animated loading indicators |

## Asset Inventory

### Root-Level Assets (17 files)

| File | Type | Purpose |
|------|------|---------|
| `humidity.png` | PNG | Humidity indicator image (full-size illustration) |
| `humidity (1).png` | PNG | Humidity indicator image (alternate version) |
| `humidity-icon.svg` | SVG | Humidity icon for weather statistics display |
| `pressure-icon.svg` | SVG | Atmospheric pressure indicator icon |
| `wind-icon.svg` | SVG | Wind speed indicator icon |
| `map.png` | PNG | Location/map indicator for geolocation features |
| `pic_1.png` | PNG | Hero/splash image for application branding |
| `rain (1).png` | PNG | Rain weather illustration |
| `rain (3).png` | PNG | Rain weather illustration (alternate) |
| `ripple1.gif` | GIF | Loading animation effect |
| `ripple2.gif` | GIF | Loading animation effect (alternate) |
| `storm.png` | PNG | Storm/thunderstorm weather illustration |
| `sun.png` | PNG | Sunny/clear weather illustration |
| `umbrella.png` | PNG | Rain protection/weather illustration |
| `wind1.png` | PNG | Wind weather illustration |
| `wind2.png` | PNG | Wind weather illustration (alternate) |
| `windy.png` | PNG | Windy conditions illustration |

### Weather Icons (`static/` Subfolder - 31 SVG files)

The `static/` subfolder contains SVG weather icons organized by weather condition category. These icons are dynamically imported based on weather codes returned by the OpenWeatherMap API.

#### Clear Sky Conditions

| File | Description |
|------|-------------|
| `day.svg` | Clear sky during daytime |
| `night.svg` | Clear sky during nighttime |

#### Cloud Coverage Icons

| File | Description |
|------|-------------|
| `few-clouds.svg` | Few clouds (11-25% coverage) |
| `scattered-clouds.svg` | Scattered clouds (25-50% coverage) |
| `broken-clouds.svg` | Broken clouds (51-84% coverage) |
| `overcast-clouds.svg` | Overcast clouds (85-100% coverage) |
| `cloudy.svg` | General cloudy condition |

#### Day/Night Cloud Variants

| File | Description |
|------|-------------|
| `cloudy-day-1.svg` | Daytime partial cloud coverage (variant 1) |
| `cloudy-day-2.svg` | Daytime partial cloud coverage (variant 2) |
| `cloudy-day-3.svg` | Daytime partial cloud coverage (variant 3) |
| `cloudy-night-1.svg` | Nighttime partial cloud coverage (variant 1) |
| `cloudy-night-2.svg` | Nighttime partial cloud coverage (variant 2) |
| `cloudy-night-3.svg` | Nighttime partial cloud coverage (variant 3) |

#### Precipitation Icons (Rain)

| File | Description |
|------|-------------|
| `rainy-1.svg` | Light rain (intensity level 1) |
| `rainy-2.svg` | Light rain (intensity level 2) |
| `rainy-3.svg` | Moderate rain (intensity level 3) |
| `rainy-4.svg` | Moderate rain (intensity level 4) |
| `rainy-5.svg` | Heavy rain / Drizzle (intensity level 5) |
| `rainy-6.svg` | Heavy rain (intensity level 6) |
| `rainy-7.svg` | Very heavy rain (intensity level 7) |
| `freezing-rain.svg` | Freezing rain / ice precipitation |

#### Snow Conditions

| File | Description |
|------|-------------|
| `snowy-1.svg` | Light snow (intensity level 1) |
| `snowy-2.svg` | Light snow (intensity level 2) |
| `snowy-3.svg` | Moderate snow (intensity level 3) |
| `snowy-4.svg` | Moderate snow (intensity level 4) |
| `snowy-5.svg` | Heavy snow (intensity level 5) |
| `snowy-6.svg` | Very heavy snow (intensity level 6) |

#### Storm & Special Conditions

| File | Description |
|------|-------------|
| `thunder.svg` | Thunderstorm with lightning |

#### Atmospheric Conditions

| File | Description |
|------|-------------|
| `haze.svg` | Hazy, smoky, or dusty conditions |
| `mist.svg` | Misty or foggy conditions |

#### Generic

| File | Description |
|------|-------------|
| `weather.svg` | Generic/fallback weather icon |

## Icon to Weather Code Mapping

The application dynamically selects weather icons based on OpenWeatherMap API weather condition codes. This mapping is implemented in the `checkWeatherCode()` function located at `src/apis/getCurrentWeather.js`.

### OpenWeatherMap Code Reference

| Code Range | Condition Group | Icon File | Notes |
|------------|----------------|-----------|-------|
| 200-299 | Thunderstorm | `thunder.svg` | All thunderstorm variants (with/without rain) |
| 300-399 | Drizzle | `rainy-5.svg` | Light intensity drizzle conditions |
| 500-510, 520-599 | Rain | `rainy-7.svg` | Rain excluding freezing rain |
| 511 | Freezing Rain | `freezing-rain.svg` | Freezing rain specifically |
| 600-699 | Snow | `snowy-6.svg` | Snow conditions (implied fallback) |
| 701 | Mist | `mist.svg` | Mist specifically |
| 702-799 | Atmosphere | `haze.svg` | Smoke, haze, dust, fog, sand, volcanic ash |
| 800 | Clear | `day.svg` | Clear sky |
| 801 | Few Clouds | `few-clouds.svg` | 11-25% cloud coverage |
| 802 | Scattered Clouds | `scattered-clouds.svg` | 25-50% cloud coverage |
| 803 | Broken Clouds | `broken-clouds.svg` | 51-84% cloud coverage |
| 804 | Overcast Clouds | `overcast-clouds.svg` | 85-100% cloud coverage |

**Source**: [OpenWeatherMap Weather Conditions](https://openweathermap.org/weather-conditions)

### Code Implementation Reference

The weather code to icon mapping is defined in `src/apis/getCurrentWeather.js`:

```javascript
// Imports at top of file
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

// checkWeatherCode(code) function maps codes to appropriate icons
```

## Usage

### Importing Weather Icons

```javascript
// Import specific weather icons
import DayIcon from './assets/static/day.svg';
import ThunderIcon from './assets/static/thunder.svg';
import RainyIcon from './assets/static/rainy-7.svg';
```

### Importing UI Indicator Icons

```javascript
// Import indicator icons for weather statistics
import HumidityIcon from './assets/humidity-icon.svg';
import WindIcon from './assets/wind-icon.svg';
import PressureIcon from './assets/pressure-icon.svg';
```

### Using Icons in JSX Components

```jsx
// Using as img element
<img src={DayIcon} alt="Clear sky" width="64" height="64" />

// Using indicator icons in weather stats display
<div className="weather-stat">
  <img src={HumidityIcon} alt="Humidity" />
  <span>72%</span>
</div>
```

### Dynamic Weather Icon Selection

Weather icons are dynamically selected based on the weather code returned by the OpenWeatherMap API. The `checkWeatherCode()` function in `src/apis/getCurrentWeather.js` handles this mapping:

```javascript
// Example: Get icon for current weather
import { checkWeatherCode, weatherSvg } from './apis/getCurrentWeather';

// Call with weather code from API response
checkWeatherCode(result.weather[0].id);

// Use the resulting SVG
<img src={weatherSvg} alt="Weather icon" width="64" height="64" />
```

## File Naming Convention

### Root-Level Assets

- **Icon files**: Use descriptive names with `-icon` suffix (e.g., `humidity-icon.svg`)
- **Illustration files**: Use descriptive names (e.g., `storm.png`, `umbrella.png`)
- **Animated files**: Use descriptive names with number suffix (e.g., `ripple1.gif`)

### Static Weather Icons

- **Condition-based**: Named after weather condition (e.g., `thunder.svg`, `mist.svg`)
- **Intensity variants**: Use numbered suffix for intensity levels (e.g., `rainy-1.svg` through `rainy-7.svg`)
- **Time-based variants**: Use `-day` or `-night` suffix (e.g., `cloudy-day-1.svg`)
- **Coverage-based**: Descriptive cloud coverage names (e.g., `few-clouds.svg`, `scattered-clouds.svg`)

## Adding New Assets

When adding new weather-related assets:

1. **Weather condition icons**: Add SVG files to `static/` subfolder
2. **UI illustrations**: Add PNG/GIF files to root `assets/` folder
3. **Update mapping**: If adding new weather icons, update `checkWeatherCode()` in `src/apis/getCurrentWeather.js`
4. **Follow naming conventions**: Use consistent naming patterns as described above

## Related Documentation

- [Back to Main README](../../README.md) - Project overview and setup
- [APIs Module](../apis/README.md) - Weather code to icon mapping logic (`checkWeatherCode()`)
- [Components Module](../components/README.md) - Components using these assets
