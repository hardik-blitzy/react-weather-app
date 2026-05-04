# Page Redirects — Exhaustive Catalog

> **Exhaustive Redirect Catalog for the React Weather Application.** This document enumerates every code path that triggers a navigation transition — every `navigate(...)` call site, every `window.location.href` assignment, and every implicit redirect that arises from the conditional index route or the wildcard 404 — with source file, line number, trigger event, and resolved destination URL.
>
> **See also:** [Navigation Mechanisms](./navigation-mechanisms.md) for the helper that performs every internal redirect; [Conditional Routing](./conditional-routing.md) for the post-onboarding redirect to `/weather`; [Route Guards](./route-guards.md) for the two guards that issue `navigate("/")`; [Routing Overview](./routing-overview.md) for the seven `<Route>` declarations that mount the destination components.

---

## Table of Contents

1. [Overview](#1-overview)
2. [Internal Redirect Catalog](#2-internal-redirect-catalog)
3. [External Redirect Catalog](#3-external-redirect-catalog)
4. [Fallback Redirect Catalog](#4-fallback-redirect-catalog)
5. [Per-Page Redirect Subsections](#5-per-page-redirect-subsections)
   - [5.1 `Home.jsx`](#51-homejsx)
   - [5.2 `Weather.jsx`](#52-weatherjsx)
   - [5.3 `WeatherMain.jsx`](#53-weathermainjsx)
   - [5.4 `ForecastWeather.jsx`](#54-forecastweatherjsx)
   - [5.5 `Settings.jsx`](#55-settingsjsx)
   - [5.6 `Support.jsx`](#56-supportjsx)
   - [5.7 `404.jsx`](#57-404jsx)
6. [Footer Navigation Strip](#6-footer-navigation-strip)
7. [Redirect Web Diagram](#7-redirect-web-diagram)
8. [Source Citations](#8-source-citations)

---

## 1. Overview

This is the **exhaustive Redirect Catalog** for the React Weather Application. Every code path in the codebase that triggers a navigation transition is documented here, with the originating source file, line number, trigger event, helper argument, and resolved destination URL. The catalog is designed for two purposes: (1) to allow a contributor to answer "where does the user go when they click X?" without reading every page component; and (2) to allow a contributor to find every site that needs to be touched when adding, removing, or relocating a route.

The catalog breaks down as follows:

- **17 internal redirects** via `navigate(...)` to internal paths (the dominant pattern in the codebase)
- **2 external redirects** via `navigate(...)` to absolute `https://...` URLs (Support page only)
- **2 fallback redirects** via direct `window.location.href` assignment (catch-block fallbacks in `Home.jsx` and `settings.js`)
- **Total: 21 documented redirect call sites**

The total of 21 deliberately **excludes** two related artifacts that are sometimes confused with redirect call sites:

1. The helper definition itself at `src/inc/scripts/utilities.js:4` — that line *is* the implementation of `navigate(page)` (a `window.location.href` assignment), not a fallback or an extra call site.
2. The `<Route path="*" element={<NotFound />} />` declaration at `src/App.js:28` — that is a *route declaration* in the `react-router-dom` JSX tree, not a redirect. The 404 page does, however, contain its own redirect at `src/pages/404.jsx:8`, which is row 6 of the Internal Redirect Catalog.

All internal redirects in this catalog use the **custom `navigate(page)` helper from `src/inc/scripts/utilities.js`** — a one-line wrapper that assigns `window.location.href = ${page}`. This helper is **not** React Router's `useNavigate` hook. As a consequence, every redirect in this catalog (including those to internal SPA paths) **triggers a full browser page reload**: the React tree is torn down, the JavaScript bundle re-evaluates, and `App()` runs again from the top, re-reading `db.get("HOME_PAGE_SEEN")` and re-resolving the index route. See [Navigation Mechanisms](./navigation-mechanisms.md) for the complete rationale and trade-off analysis.

> **Naming note throughout this document:** "redirect" means any programmatic transition from one route or external URL to another, regardless of mechanism. "Internal" means the destination is a path within this SPA. "External" means the destination is an absolute URL whose origin is outside the application (`https://github.com/...`). "Fallback" means the redirect was issued via direct `window.location.href` assignment in a `catch` block, NOT via the `navigate(page)` helper.

---

## 2. Internal Redirect Catalog

The table below lists every internal `navigate(...)` call site in the codebase. Rows are sorted by source file path so the catalog reads like a directory listing.

| #  | File                              | Line | Trigger Event                                                                                | `navigate` Argument | Resolved Destination                                                                                       |
| -- | --------------------------------- | ---- | -------------------------------------------------------------------------------------------- | ------------------- | ---------------------------------------------------------------------------------------------------------- |
| 1  | `src/backend/settings.js`         | 98   | `restoreFactorySettings()` invoked from Settings page "restore settings" button              | `"/"`               | `/` (re-renders index route — first-time-user `Home` because `db.destroy()` cleared the flag)              |
| 2  | `src/backend/settings.js`         | 102  | Catch-block re-attempt of factory-reset redirect (after the initial `navigate("/")` throws)  | `"/"`               | `/` (same as above)                                                                                        |
| 3  | `src/components/footerNav.jsx`    | 6    | Footer "App" tab click                                                                       | `"weather"`         | `/weather`                                                                                                 |
| 4  | `src/components/footerNav.jsx`    | 10   | Footer "Settings" tab click                                                                  | `"settings"`        | `/settings`                                                                                                |
| 5  | `src/components/footerNav.jsx`    | 14   | Footer "Support" tab click                                                                   | `"support"`         | `/support`                                                                                                 |
| 6  | `src/pages/404.jsx`               | 8    | "Home" button click on the 404 page                                                          | `"/weather"`        | `/weather`                                                                                                 |
| 7  | `src/pages/ForecastWeather.jsx`   | 45   | Top-of-component guard (when `db.get("HOME_PAGE_SEEN")` is falsy)                            | `"/"`               | `/` (renders `Home` because the flag is falsy — the same condition that triggered the guard)               |
| 8  | `src/pages/ForecastWeather.jsx`   | 252  | Back-arrow click + "current weather forecast" button (`navigateToWeather`)                   | `"/weather"`        | `/weather`                                                                                                 |
| 9  | `src/pages/Home.jsx`              | 69   | After successful onboarding modal confirmation + the four `db.create` writes succeed         | `"weather"`         | `/weather`                                                                                                 |
| 10 | `src/pages/Settings.jsx`          | 10   | Back-arrow click (`navigateHome`)                                                            | `"./weather"`       | `/weather`                                                                                                 |
| 11 | `src/pages/Support.jsx`           | 8    | Back-arrow click (`navigateHome`)                                                            | `"./weather"`       | `/weather`                                                                                                 |
| 12 | `src/pages/Weather.jsx`           | 37   | Top-of-component guard (when `db.get("HOME_PAGE_SEEN")` is falsy)                            | `"/"`               | `/` (renders `Home` because the flag is falsy)                                                             |
| 13 | `src/pages/Weather.jsx`           | 55   | "Tomorrow" / "Next" tab clicks (`onClick={navigateToForecast}`)                              | `"/forecast"`       | `/forecast`                                                                                                |
| 14 | `src/pages/Weather.jsx`           | 88   | Future weather card click (`handleElementClick` returned by the `mapDbSavedData` map)        | `"/forecast"`       | `/forecast`                                                                                                |
| 15 | `src/pages/Weather.jsx`           | 119  | "Show More Weather" tile click (`showMoreWeather`)                                           | `"weathermain"`     | `/weathermain`                                                                                             |
| 16 | `src/pages/Weather.jsx`           | 133  | "Forecast Weather" button click in the utility footer overlay (`showForecastWeather`)        | `"/forecast"`       | `/forecast`                                                                                                |
| 17 | `src/pages/WeatherMain.jsx`       | 26   | Back-arrow click (`navigateHome`)                                                            | `"/weather"`        | `/weather`                                                                                                 |

> **Observation about bare-relative arguments.** Several `navigate(...)` arguments in this catalog are bare relative strings (`"weather"`, `"settings"`, `"support"`, `"weathermain"`) rather than absolute paths (`"/weather"`, `"/settings"`, etc.). When passed to `window.location.href`, the browser's URL resolution treats these as relative to the current document. Every call site in this catalog that uses a bare-relative string executes when the user is at `/` or at a sibling top-level path — therefore the resolution produces the expected `/weather`, `/settings`, etc. If the codebase were extended to mount the footer at a deeper path (e.g., `/dashboard/weather`), these bare-relative arguments would resolve to `/dashboard/weather` rather than `/weather`. **Adding a leading slash to all such calls would make them robust** but is OUT OF SCOPE for this documentation task. The mixed pattern (`"./weather"` in `Settings.jsx:10` and `Support.jsx:8` vs. plain `"weather"` in `footerNav.jsx:6` and `Home.jsx:69`) reflects the codebase's current state, not a recommendation.

---

## 3. External Redirect Catalog

The table below lists the two `navigate(...)` calls in the codebase whose argument is an absolute URL with an external origin. Both originate in `src/pages/Support.jsx` and target GitHub destinations.

| # | File                    | Line | Trigger Event                                       | `navigate` Argument                                              | Resolved Destination                       |
| - | ----------------------- | ---- | --------------------------------------------------- | ---------------------------------------------------------------- | ------------------------------------------ |
| 1 | `src/pages/Support.jsx` | 12   | "View GitHub repository" button click (`navigateToProject`) | `"https://github.com/Adedoyin-Emmanuel/react-weather-app"` | **External:** GitHub repository page       |
| 2 | `src/pages/Support.jsx` | 16   | "Support on GitHub" button click (`navigateToGithub`)       | `"https://github.com/Adedoyin-Emmanuel"`                   | **External:** GitHub user profile page     |

> Both external redirects exploit the fact that the custom `navigate(page)` helper performs `window.location.href = ${page}` — a fully unrestricted assignment. When the argument is an absolute URL with an external origin, the browser navigates to that URL, leaving the application entirely. **The user's session in the React Weather App ends** at that point; clicking the browser's Back button is the only way to return to the SPA. A native React Router `useNavigate` call would not behave this way — it would treat `https://github.com/...` as a path inside the SPA and produce a routing error or a no-op match against the wildcard route. This is one of the practical implications of the codebase's choice to use a custom helper. See [Navigation Mechanisms](./navigation-mechanisms.md) for the full mechanism comparison.

---


## 4. Fallback Redirect Catalog

The table below lists every direct `window.location.href` assignment in the codebase that exists for the explicit purpose of issuing a redirect when the primary `navigate(...)` path fails. These are catch-block fallbacks — they execute only if the surrounding `try` block threw an exception.

| # | File                       | Line | Trigger Event                                                                            | Assignment                              | Resolved Destination |
| - | -------------------------- | ---- | ---------------------------------------------------------------------------------------- | --------------------------------------- | -------------------- |
| 1 | `src/pages/Home.jsx`       | 72   | Catch-block fallback after `navigate("weather")` throws on the post-onboarding redirect  | `window.location.href = "/weather"`     | `/weather`           |
| 2 | `src/backend/settings.js`  | 105  | Inner catch block in `restoreFactorySettings` after both nested `navigate("/")` calls fail | `window.location.href = "/"`          | `/`                  |

> **Note on the third occurrence.** A third occurrence of `window.location.href = ...` exists at `src/inc/scripts/utilities.js:4`, but that line is the **body of the `navigate(page)` helper itself** — it is the implementation of the imperative navigation mechanism, not a fallback. It is therefore NOT counted in this Fallback Redirect Catalog. Every internal redirect documented in [§2 Internal Redirect Catalog](#2-internal-redirect-catalog) flows through that line at runtime, but the helper definition is a single point of indirection rather than 17 separate fallback assignments. See [Navigation Mechanisms §3](./navigation-mechanisms.md) for the full helper definition and behavior contract.

> **Why these fallbacks exist.** The primary path uses the `navigate(page)` helper; the helper's body is the very simple `window.location.href = ${page}` assignment. In normal operation, that assignment cannot throw — `window.location` is always defined in a browser context, and assignment to `.href` is a synchronous, side-effecting operation that succeeds. The catch-block fallbacks are defensive: they guard against the (extremely unlikely) cases where the surrounding try block fails for reasons unrelated to the assignment itself (e.g., a polyfill or a hostile environment that intercepted `window.location`). In practice, neither fallback is expected to fire — but their presence ensures that the user is never stuck on a screen with a broken handler.

---

## 5. Per-Page Redirect Subsections

The subsections below catalog every page in the application (one subsection per page). Each subsection lists the page's **incoming** redirects (how the user arrives at the page) and **outgoing** redirects (where the user can go from the page), followed by a verbatim code excerpt of the relevant handlers.

### 5.1 `Home.jsx`

`src/pages/Home.jsx` is the first-time-user landing page. It is mounted at the index route `/` only when `db.get("HOME_PAGE_SEEN")` is falsy (see [Conditional Routing](./conditional-routing.md) for the resolution logic).

#### 5.1.1 Incoming Redirects (how the user reaches Home)

| Source                                | Trigger                                                            | Source Line                            | Notes                                                                                                                                                            |
| ------------------------------------- | ------------------------------------------------------------------ | -------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Initial visit to `/`                  | When `db.get("HOME_PAGE_SEEN")` is falsy                           | `src/App.js:13-17, 22`                 | `App.js` ternary picks `<Home />` for `DEFAULT_ROUTE_PAGE`; the `<Route index>` declaration mounts it.                                                          |
| Post-factory-reset visit to `/`       | After `restoreFactorySettings` clears the flag                     | `src/backend/settings.js:97-98`        | `db.destroy()` runs first, then `navigate("/")` reloads the page; `App.js` re-reads the (now-null) flag and mounts `<Home />`.                                  |
| Guard redirect from `/weather`        | When user direct-visits `/weather` without onboarding              | `src/pages/Weather.jsx:36-38`          | The guard fires `navigate("/")`; the page reloads, and `App.js`'s ternary picks `<Home />`.                                                                     |
| Guard redirect from `/forecast`       | When user direct-visits `/forecast` without onboarding             | `src/pages/ForecastWeather.jsx:44-46`  | The guard fires `navigate("/")`; the page reloads, and `App.js`'s ternary picks `<Home />`.                                                                     |

#### 5.1.2 Outgoing Redirects (where the user goes from Home)

| Trigger                                                                       | Mechanism                              | Source Line                | Destination |
| ----------------------------------------------------------------------------- | -------------------------------------- | -------------------------- | ----------- |
| "Today's Weather" button click + valid location modal confirmation            | `navigate("weather")`                  | `src/pages/Home.jsx:69`    | `/weather`  |
| Catch-block fallback when `navigate(...)` throws                              | `window.location.href = "/weather"`    | `src/pages/Home.jsx:72`    | `/weather`  |

#### 5.1.3 Code Excerpt

The relevant block is the inner `try`/`catch` at `src/pages/Home.jsx:68-73`:

```jsx
                  try {
                    navigate("weather");
                  } catch (navError) {
                    // Fallback navigation
                    window.location.href = "/weather";
                  }
```

> **Note:** The full Home onboarding flow — including the four `db.create` writes (`HOME_PAGE_SEEN`, `USER_DEFAULT_LOCATION`, `TRACK_SAVED_LOCATION_WEATHER`, `WEATHER_UNIT`) that precede this redirect — is documented in [Conditional Routing §5 (First-Time User Flow)](./conditional-routing.md). The post-onboarding redirect at line 69 is the moment the user transitions from "first-time" to "returning"; on the next index-route visit, the ternary will resolve to `<WeatherApp />` instead of `<Home />`.

---


### 5.2 `Weather.jsx`

`src/pages/Weather.jsx` (the `WeatherApp` component) is the central weather dashboard. It is mounted at **two routes** simultaneously: the index route `/` (when `db.get("HOME_PAGE_SEEN")` is truthy) and the named route `/weather`. As a result, almost every redirect in the codebase resolves either at, or to, this component.

#### 5.2.1 Incoming Redirects

| Source                                                                           | Trigger                              | Source Line                              | Notes                                                                                       |
| -------------------------------------------------------------------------------- | ------------------------------------ | ---------------------------------------- | ------------------------------------------------------------------------------------------- |
| Initial visit to `/`                                                             | When `db.get("HOME_PAGE_SEEN")` is truthy | `src/App.js:15-17, 22`              | `App.js` ternary picks `<WeatherApp />` for `DEFAULT_ROUTE_PAGE`.                           |
| Direct visit to `/weather`                                                       | URL match                            | `src/App.js:24`                          | The `<Route path="weather" element={<WeatherApp />} />` declaration always matches.         |
| Footer "App" tab click from any page                                             | `navigate("weather")`                | `src/components/footerNav.jsx:6`         | Resolves to `/weather` because the footer is always mounted at a top-level path.            |
| 404 "Home" button click                                                          | `navigate("/weather")`               | `src/pages/404.jsx:8`                    | Resolves directly to `/weather`.                                                            |
| `WeatherMain.jsx` back-arrow click                                               | `navigate("/weather")`               | `src/pages/WeatherMain.jsx:26`           | Resolves directly to `/weather`.                                                            |
| `ForecastWeather.jsx` back-arrow + "current weather forecast" button             | `navigate("/weather")`               | `src/pages/ForecastWeather.jsx:252`      | Resolves directly to `/weather`.                                                            |
| `Settings.jsx` back-arrow click                                                  | `navigate("./weather")`              | `src/pages/Settings.jsx:10`              | Resolves to `/weather` (the `./` prefix is dropped by browser URL resolution at `/settings`).|
| `Support.jsx` back-arrow click                                                   | `navigate("./weather")`              | `src/pages/Support.jsx:8`                | Resolves to `/weather` (the `./` prefix is dropped by browser URL resolution at `/support`).|

#### 5.2.2 Outgoing Redirects

| Trigger                                                                  | Mechanism                | Source Line                          | Destination                                              |
| ------------------------------------------------------------------------ | ------------------------ | ------------------------------------ | -------------------------------------------------------- |
| Top-of-component guard (when `HOME_PAGE_SEEN` is falsy)                  | `navigate("/")`          | `src/pages/Weather.jsx:37`           | `/` (mounts `<Home />` after the page reload re-resolves the index ternary) |
| "Tomorrow" / "Next" tab clicks (`onClick={navigateToForecast}`)          | `navigate("/forecast")`  | `src/pages/Weather.jsx:55`           | `/forecast`                                              |
| Future weather card click (`handleElementClick` in mapped data)          | `navigate("/forecast")`  | `src/pages/Weather.jsx:88`           | `/forecast`                                              |
| "Show More Weather" tile click (`showMoreWeather`)                       | `navigate("weathermain")`| `src/pages/Weather.jsx:119`          | `/weathermain`                                           |
| "Forecast Weather" button click in utility footer overlay (`showForecastWeather`) | `navigate("/forecast")` | `src/pages/Weather.jsx:133`     | `/forecast`                                              |

#### 5.2.3 Code Excerpts

The guard at `src/pages/Weather.jsx:36-38` (the comment at line 35 is included for context):

```jsx
	//check if the user navigated from the home page
	if (!db.get("HOME_PAGE_SEEN")) {
		navigate("/");
	}
```

The "Show More Weather" handler at `src/pages/Weather.jsx:118-120`:

```jsx
	const showMoreWeather = () => {
		navigate("weathermain");
	};
```

The "Tomorrow / Next" tab handler at `src/pages/Weather.jsx:54-56`:

```jsx
	const navigateToForecast = () =>{
		navigate("/forecast");
	}
```

The future-card click handler at `src/pages/Weather.jsx:87-89`, defined inside the `mapDbSavedData` map callback:

```jsx
			const handleElementClick = () =>{
				navigate("/forecast");
			}
```

The utility footer "Forecast Weather" button handler at `src/pages/Weather.jsx:132-134`:

```jsx
	const showForecastWeather = () => {
		navigate("/forecast");
	};
```

> See [Route Guards §3](./route-guards.md) for full coverage of the guard pattern at line 37.

---


### 5.3 `WeatherMain.jsx`

`src/pages/WeatherMain.jsx` is the expanded weather-detail screen. It is mounted at `/weathermain` and is **not guarded** — direct visits succeed even if `HOME_PAGE_SEEN` is falsy. The page is reached only via the `Weather.jsx` "Show More Weather" tile.

#### 5.3.1 Incoming Redirects

| Source                                                | Trigger                       | Source Line                  | Notes                                                                                |
| ----------------------------------------------------- | ----------------------------- | ---------------------------- | ------------------------------------------------------------------------------------ |
| Direct visit to `/weathermain`                        | URL match                     | `src/App.js:25`              | The `<Route path="weathermain" element={<WeatherMain />} />` declaration always matches. |
| `Weather.jsx` "Show More Weather" tile click          | `navigate("weathermain")`     | `src/pages/Weather.jsx:119`  | Resolves to `/weathermain` because the call site executes when the user is at `/weather`, a sibling top-level path. |

#### 5.3.2 Outgoing Redirects

| Trigger              | Mechanism                | Source Line                          | Destination |
| -------------------- | ------------------------ | ------------------------------------ | ----------- |
| Back-arrow click (`navigateHome`) | `navigate("/weather")` | `src/pages/WeatherMain.jsx:26` | `/weather`  |

#### 5.3.3 Code Excerpt

Lines 24–27 (component declaration + `navigateHome` handler):

```jsx
const WeatherMain = (props) => {
	const navigateHome = () => {
		navigate("/weather");
	};
```

> **Note on the handler name:** The variable is named `navigateHome` even though it sends the user to `/weather`, not `/`. This naming mirrors `Settings.jsx:9` and `Support.jsx:7`, where the same `navigateHome` name is used for the back-arrow handler. The convention treats `/weather` as the application's "home" from a UX perspective (it is the dashboard the user spends most time on), distinct from the routing-level index path `/`.

---

### 5.4 `ForecastWeather.jsx`

`src/pages/ForecastWeather.jsx` is the 5-day forecast screen mounted at `/forecast`. Like `Weather.jsx`, it has a **top-of-component guard** that redirects unguarded users back to `/`.

#### 5.4.1 Incoming Redirects

| Source                                                                | Trigger                  | Source Line                  | Notes                                                                                                  |
| --------------------------------------------------------------------- | ------------------------ | ---------------------------- | ------------------------------------------------------------------------------------------------------ |
| Direct visit to `/forecast`                                           | URL match                | `src/App.js:26`              | The `<Route path="forecast" element={<ForecastWeather />} />` declaration always matches.              |
| `Weather.jsx` "Tomorrow" / "Next" tab clicks                          | `navigate("/forecast")`  | `src/pages/Weather.jsx:55`   | Resolves directly to `/forecast`.                                                                      |
| `Weather.jsx` future weather card click                               | `navigate("/forecast")`  | `src/pages/Weather.jsx:88`   | Resolves directly to `/forecast`.                                                                      |
| `Weather.jsx` "Forecast Weather" button click (utility footer overlay)| `navigate("/forecast")`  | `src/pages/Weather.jsx:133`  | Resolves directly to `/forecast`.                                                                      |

#### 5.4.2 Outgoing Redirects

| Trigger                                                                       | Mechanism                | Source Line                                | Destination                                                              |
| ----------------------------------------------------------------------------- | ------------------------ | ------------------------------------------ | ------------------------------------------------------------------------ |
| Top-of-component guard (when `HOME_PAGE_SEEN` is falsy)                       | `navigate("/")`          | `src/pages/ForecastWeather.jsx:45`         | `/` (mounts `<Home />` after the index ternary re-resolves)              |
| Back-arrow click + "current weather forecast" button (`navigateToWeather`)    | `navigate("/weather")`   | `src/pages/ForecastWeather.jsx:252`        | `/weather`                                                               |

#### 5.4.3 Code Excerpts

The guard at `src/pages/ForecastWeather.jsx:42-46`:

```jsx
const ForecastWeather = () => {
	// Redirect to home if user hasn't completed initial setup
	if (!db.get("HOME_PAGE_SEEN")) {
		navigate("/");
	}
```

The back-navigation handler at `src/pages/ForecastWeather.jsx:251-253`:

```jsx
	const navigateToWeather = () => {
		navigate("/weather");
	};
```

> See [Route Guards §4](./route-guards.md) for full coverage of the guard pattern at line 45.

---

### 5.5 `Settings.jsx`

`src/pages/Settings.jsx` is the user-preferences screen mounted at `/settings`. It is **not guarded** — a non-onboarded user reaching `/settings` directly will see the form, but `db.get(...)` reads will return falsy values for inputs that have not yet been initialized. The Settings page also indirectly issues a routing side-effect via `restoreFactorySettings` in `src/backend/settings.js`.

#### 5.5.1 Incoming Redirects

| Source                          | Trigger                 | Source Line                              | Notes                                                                            |
| ------------------------------- | ----------------------- | ---------------------------------------- | -------------------------------------------------------------------------------- |
| Direct visit to `/settings`     | URL match               | `src/App.js:27`                          | The `<Route path="settings" element={<Settings />} />` declaration always matches. |
| Footer "Settings" tab click     | `navigate("settings")`  | `src/components/footerNav.jsx:10`        | Resolves to `/settings`.                                                          |

#### 5.5.2 Outgoing Redirects

| Trigger                                                                 | Mechanism                              | Source Line                       | Destination                                                                 |
| ----------------------------------------------------------------------- | -------------------------------------- | --------------------------------- | --------------------------------------------------------------------------- |
| Back-arrow click (`navigateHome`)                                       | `navigate("./weather")`                | `src/pages/Settings.jsx:10`       | `/weather`                                                                  |
| "Restore Settings" button click (indirect via `restoreFactorySettings`) | `navigate("/")`                        | `src/backend/settings.js:98`      | `/` (mounts `<Home />` because `db.destroy()` cleared the flag)             |
| Indirect catch-block re-attempt (after the line-98 call throws)         | `navigate("/")`                        | `src/backend/settings.js:102`     | `/`                                                                         |
| Indirect catch-block fallback (after the line-102 call also throws)     | `window.location.href = "/"`           | `src/backend/settings.js:105`     | `/`                                                                         |

#### 5.5.3 Code Excerpt

The back-arrow handler at `src/pages/Settings.jsx:8-11`:

```jsx
const Settings = () => {
	const navigateHome = () => {
		navigate("./weather");
	};
```

> The "Restore Settings" path triggers a routing side-effect through `src/backend/settings.js:95-108` rather than a direct `navigate(...)` call in the page component. The button at `Settings.jsx:115-119` passes `settings.restoreFactorySettings` as its `onClick` handler; when the user clicks, `db.destroy()` runs first, then the chain of `navigate("/")` → `navigate("/")` → `window.location.href = "/"` fires from the imported settings module. The full factory-reset cycle is documented at [Conditional Routing §8 (Factory Reset Cycle)](./conditional-routing.md).

---


### 5.6 `Support.jsx`

`src/pages/Support.jsx` is the developer-support screen mounted at `/support`. It is the **only page in the codebase that issues external redirects** — both buttons on the page navigate to GitHub destinations using the same `navigate(...)` helper that performs internal redirects. See [§3 External Redirect Catalog](#3-external-redirect-catalog) for the catalog row.

#### 5.6.1 Incoming Redirects

| Source                         | Trigger                | Source Line                             | Notes                                                                       |
| ------------------------------ | ---------------------- | --------------------------------------- | --------------------------------------------------------------------------- |
| Direct visit to `/support`     | URL match              | `src/App.js:23`                         | The `<Route path="support" element={<Support />} />` declaration always matches. |
| Footer "Support" tab click     | `navigate("support")`  | `src/components/footerNav.jsx:14`       | Resolves to `/support`.                                                     |

#### 5.6.2 Outgoing Redirects

| Trigger                                                              | Mechanism                                                                         | Source Line                       | Destination                                       |
| -------------------------------------------------------------------- | --------------------------------------------------------------------------------- | --------------------------------- | ------------------------------------------------- |
| Back-arrow click (`navigateHome`)                                    | `navigate("./weather")`                                                           | `src/pages/Support.jsx:8`         | `/weather`                                        |
| "View GitHub repository" button click (`navigateToProject`)          | `navigate("https://github.com/Adedoyin-Emmanuel/react-weather-app")`              | `src/pages/Support.jsx:12`        | **External:** GitHub repository page              |
| "Support on GitHub" button click (`navigateToGithub`)                | `navigate("https://github.com/Adedoyin-Emmanuel")`                                | `src/pages/Support.jsx:16`        | **External:** GitHub user profile page            |

#### 5.6.3 Code Excerpt

All three handlers are defined together at `src/pages/Support.jsx:6-17`:

```jsx
const Settings = () => {
  const navigateHome = () => {
    navigate("./weather");
  };

  const navigateToProject = ()=>{
    navigate("https://github.com/Adedoyin-Emmanuel/react-weather-app");
  }

  const navigateToGithub = () =>{
    navigate("https://github.com/Adedoyin-Emmanuel");
  }
```

> **Note on file-internal naming.** `src/pages/Support.jsx` default-exports a function component whose internal variable name is `Settings` (line 6) — and the same name is used for the default export at line 108 (`export default Settings;`). Despite the misleading internal name, `src/App.js:2` imports it as `Support` (`import Support from "./pages/Support";`) and mounts it at `/support` (line 23). At runtime, the routing surface is unaffected by the internal variable name. See [Routing Overview](./routing-overview.md) for full coverage of this naming quirk.

---

### 5.7 `404.jsx`

`src/pages/404.jsx` (the `NotFound` component) is the wildcard handler mounted at `*`. It is the catch-all for any URL not matched by the six explicit routes declared earlier in `src/App.js`.

#### 5.7.1 Incoming Redirects

| Source                                          | Trigger                       | Source Line                | Notes                                                                                  |
| ----------------------------------------------- | ----------------------------- | -------------------------- | -------------------------------------------------------------------------------------- |
| Any URL not matched by an earlier route         | URL match (wildcard `*`)      | `src/App.js:28`            | The `<Route path="*" element={<NotFound />} />` declaration catches all unmatched URLs (e.g., `/foo`, `/bar/baz`, `/weather/extra`). |

#### 5.7.2 Outgoing Redirects

| Trigger                                | Mechanism              | Source Line                | Destination |
| -------------------------------------- | ---------------------- | -------------------------- | ----------- |
| "Home" button click (`returnHome`)     | `navigate("/weather")` | `src/pages/404.jsx:8`      | `/weather`  |

#### 5.7.3 Code Excerpt

The `returnHome` handler at `src/pages/404.jsx:5-10`:

```jsx
const NotFound = ()=>{
    
    const returnHome = ()=>{
        navigate("/weather");
    }
    return (
```

> **Important: the wildcard 404 redirects to `/weather`, NOT to `/`.** This is non-obvious. A user reaching the 404 page who has not completed onboarding (i.e., `HOME_PAGE_SEEN` is falsy) and who clicks the "Home" button would be sent to `/weather`. Because `Weather.jsx` has a top-of-component guard at lines 36–38 that fires `navigate("/")` when the flag is falsy, the user would experience a **two-hop redirect chain**: `404 → /weather → /` (Home). Each hop is a full page reload. If the contributor wants the 404 to land directly on the appropriate index resolution (Home for first-time users, Weather for returning users), they should change the argument to `/`. See [Route Guards §3](./route-guards.md) for the guard that produces the second hop.

---

## 6. Footer Navigation Strip

The footer-navigation component is a standalone subsection of this document because it issues navigation on behalf of every page that mounts it. Unlike the page-level handlers documented in [§5](#5-per-page-redirect-subsections), the footer is shared infrastructure: a single edit to `footerNav.jsx` affects redirects from `Weather`, `Settings`, `Support`, `WeatherMain`, and `ForecastWeather` simultaneously.

### 6.1 Source

The footer-navigation component is defined in `src/components/footerNav.jsx` as the `FooterNav` functional component. It is consumed by the shared `Footer` component (`src/components/footer.jsx`), which in turn is mounted by `Weather.jsx`, `WeatherMain.jsx`, `ForecastWeather.jsx`, `Settings.jsx`, and `Support.jsx`.

### 6.2 Code Excerpt

The imports and three navigation handlers at `src/components/footerNav.jsx:1-15`:

```jsx
import React from "react";
import navigate from "./../inc/scripts/utilities";

const FooterNav = (props) => {
  const appNavigation = () => {
    navigate("weather");
  };

  const settingsNavigation = () => {
    navigate("settings");
  };

  const supportNavigation = () => {
    navigate("support");
  };
```

### 6.3 Behavior

The footer is a persistent strip with **four** clickable tabs. The first three are bound to internal redirect handlers defined inside `FooterNav`; the fourth is bound to a `props.onClick` handler supplied by the parent page.

| Tab        | Handler                                | Behavior                                                                                                                                            |
| ---------- | -------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| App        | `appNavigation`                        | `navigate("weather")` → `/weather`                                                                                                                  |
| Search     | `props.onClick`                        | **Externally controlled** — does NOT issue a navigation. The parent page passes a click handler that toggles a search overlay (e.g., `Weather.jsx:419` passes `testSearch`, which calls `addUtilityComponentHeight()` and `setComponentToInsert(<SearchComponent />)`). |
| Settings   | `settingsNavigation`                   | `navigate("settings")` → `/settings`                                                                                                                |
| Support    | `supportNavigation`                    | `navigate("support")` → `/support`                                                                                                                  |

> **Note on the Search tab.** The "Search" tab is bound to `onClick={props.onClick}` at `footerNav.jsx:42`. The handler is supplied by the parent component via the `onClick` prop. On `Weather.jsx`, the parent passes `testSearch` (line 419 — `<Footer utilityTags={componentToInsert} onClick={testSearch} />`), which is a local function that mutates the `componentToInsert` state to render a `<SearchComponent />` inside the utility footer overlay. The Search tab does **not** issue a `navigate(...)` call and does **not** trigger a page reload — it simply toggles in-page UI state. This is documented here for completeness so future contributors don't mistake the footer for a fully self-contained navigation component.

---


## 7. Redirect Web Diagram

The Mermaid `flowchart LR` (left-to-right) below shows every redirect edge in the application. Pages are nodes; redirects are labeled arrows. **Solid arrows** (`-->`) represent direct outgoing redirects from page-level handlers; **dotted arrows** (`-.->`) represent indirect redirects (the index conditional, the catch-block `window.location.href` fallbacks, and the footer strip mounted across multiple pages).

```mermaid
flowchart LR
    Index["/ (index)"]
    Home["Home<br/>/ when HOME_PAGE_SEEN<br/>is falsy"]
    Weather["WeatherApp<br/>/weather (or / when truthy)"]
    WMain["WeatherMain<br/>/weathermain"]
    Forecast["ForecastWeather<br/>/forecast"]
    Settings["Settings<br/>/settings"]
    Support["Support<br/>/support"]
    NotFound["NotFound<br/>* (wildcard)"]
    Github["GitHub.com<br/>(external)"]

    %% Index resolution
    Index -.->|HOME_PAGE_SEEN truthy<br/>App.js:13-17| Weather
    Index -.->|HOME_PAGE_SEEN falsy<br/>App.js:13-17| Home

    %% Outgoing from Home
    Home -->|navigate(&quot;weather&quot;)<br/>Home.jsx:69| Weather
    Home -->|window.location.href<br/>fallback Home.jsx:72| Weather

    %% Outgoing from Weather
    Weather -->|guard navigate(&quot;/&quot;)<br/>Weather.jsx:37| Index
    Weather -->|navigate(&quot;/forecast&quot;)<br/>Weather.jsx:55, 88, 133| Forecast
    Weather -->|navigate(&quot;weathermain&quot;)<br/>Weather.jsx:119| WMain

    %% Outgoing from WeatherMain
    WMain -->|navigate(&quot;/weather&quot;)<br/>WeatherMain.jsx:26| Weather

    %% Outgoing from ForecastWeather
    Forecast -->|guard navigate(&quot;/&quot;)<br/>ForecastWeather.jsx:45| Index
    Forecast -->|navigate(&quot;/weather&quot;)<br/>ForecastWeather.jsx:252| Weather

    %% Outgoing from Settings
    Settings -->|navigate(&quot;./weather&quot;)<br/>Settings.jsx:10| Weather
    Settings -->|restoreFactorySettings<br/>navigate(&quot;/&quot;)<br/>settings.js:98, 102| Index
    Settings -.->|window.location.href fallback<br/>settings.js:105| Index

    %% Outgoing from Support
    Support -->|navigate(&quot;./weather&quot;)<br/>Support.jsx:8| Weather
    Support -->|navigate(github URL)<br/>Support.jsx:12, 16| Github

    %% Outgoing from NotFound
    NotFound -->|navigate(&quot;/weather&quot;)<br/>404.jsx:8| Weather

    %% Footer-driven (multi-source, abbreviated)
    Settings -.->|footer App<br/>footerNav.jsx:6| Weather
    Settings -.->|footer Support<br/>footerNav.jsx:14| Support
    Support -.->|footer App<br/>footerNav.jsx:6| Weather
    Support -.->|footer Settings<br/>footerNav.jsx:10| Settings
    WMain -.->|footer App / Settings / Support<br/>footerNav.jsx| Weather
    Forecast -.->|footer App / Settings / Support<br/>footerNav.jsx| Weather
```

**Reading the diagram:**

- **Solid arrows** are direct outgoing redirects from the originating page's own handlers. Their edge labels cite the source line.
- **Dotted arrows** are indirect redirects: the conditional index resolution at `App.js:13-17`, the catch-block `window.location.href` fallback at `settings.js:105`, and the footer-driven cross-page redirects from pages that mount `<Footer />` (which in turn mounts `<FooterNav />`).
- The **Footer-driven edges are abbreviated**. Every page that mounts `<Footer />` (`Weather`, `WeatherMain`, `ForecastWeather`, `Settings`, `Support`) has three potential outgoing edges to `Weather`, `Settings`, and `Support` from the App / Settings / Support tabs. These are collapsed in the diagram to avoid clutter; the full set is documented row-by-row in [§2 Internal Redirect Catalog](#2-internal-redirect-catalog) (rows 3, 4, 5).
- The `Github` node represents the external destination of the two `navigate(...)` calls at `Support.jsx:12` and `Support.jsx:16`. Visiting that node ends the user's session in the SPA.
- The two-hop chain `404 → /weather → /` (described in [§5.7](#57-404jsx)) is visible as the path `NotFound → Weather → Index` along solid arrows: `NotFound` redirects to `Weather`, and `Weather`'s guard redirects to `Index`.

---

## 8. Source Citations

The following citations support every claim made in this document. Each citation gives the repository-relative path and an inclusive line range.

- `Source: src/App.js:13-17` — Conditional ternary that resolves the index route to either `<Home />` or `<WeatherApp />` based on `db.get("HOME_PAGE_SEEN")`
- `Source: src/App.js:22-28` — Seven `<Route>` declarations: `index`, `support`, `weather`, `weathermain`, `forecast`, `settings`, and the wildcard `*`
- `Source: src/inc/scripts/utilities.js:3-5, 137` — `navigate(page)` helper definition (lines 3–5) and its default export (line 137)
- `Source: src/pages/Home.jsx:68-73` — Onboarding success path with `navigate("weather")` and the `window.location.href = "/weather"` catch-block fallback
- `Source: src/pages/Weather.jsx:36-38` — Top-of-component guard reading `db.get("HOME_PAGE_SEEN")` and firing `navigate("/")`
- `Source: src/pages/Weather.jsx:54-56` — `navigateToForecast` handler (`/forecast`) bound to "Tomorrow" / "Next" tabs
- `Source: src/pages/Weather.jsx:87-89` — `handleElementClick` future-card handler (`/forecast`) defined inside `mapDbSavedData`
- `Source: src/pages/Weather.jsx:118-120` — `showMoreWeather` handler (`/weathermain`) bound to "Show More Weather" tile
- `Source: src/pages/Weather.jsx:132-134` — `showForecastWeather` handler (`/forecast`) bound to "Forecast Weather" button in the utility footer overlay
- `Source: src/pages/WeatherMain.jsx:25-27` — `navigateHome` back-arrow handler (`/weather`)
- `Source: src/pages/ForecastWeather.jsx:42-46` — Top-of-component guard reading `db.get("HOME_PAGE_SEEN")` and firing `navigate("/")`
- `Source: src/pages/ForecastWeather.jsx:251-253` — `navigateToWeather` back-arrow handler (`/weather`)
- `Source: src/pages/Settings.jsx:9-11` — `navigateHome` back-arrow handler (`./weather`)
- `Source: src/pages/Support.jsx:7-17` — `navigateHome`, `navigateToProject`, `navigateToGithub` handlers (back-arrow + 2 external GitHub redirects)
- `Source: src/pages/404.jsx:7-9` — `returnHome` handler (`/weather`)
- `Source: src/components/footerNav.jsx:5-15` — `appNavigation`, `settingsNavigation`, `supportNavigation` handlers
- `Source: src/components/footerNav.jsx:42` — Search tab's `onClick={props.onClick}` binding (externally controlled)
- `Source: src/backend/settings.js:95-108` — `restoreFactorySettings` (factory reset with `db.destroy()` + nested `navigate("/")` calls + `window.location.href = "/"` fallback)
- `Source: src/pages/Weather.jsx:419` — Parent-side `<Footer onClick={testSearch} />` mount that supplies the Search-tab handler

---

**Next:** Continue to [`conditional-routing.md`](./conditional-routing.md) for the `HOME_PAGE_SEEN` flag lifecycle and the onboarding state machine, or to [`route-guards.md`](./route-guards.md) for the two imperative guards that issue the `navigate("/")` redirects from `Weather.jsx:37` and `ForecastWeather.jsx:45`. For the visual quick reference of all routing diagrams, see [`diagrams/README.md`](./diagrams/README.md).
