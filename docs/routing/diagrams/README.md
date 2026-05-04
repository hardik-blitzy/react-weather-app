# Routing Diagrams — Visual Reference Appendix

> **Reading note:** This is a **visual quick-reference**. Each diagram below is reproduced from its canonical parent document. For full prose context, follow the "Source" link beneath each diagram. The canonical version of every diagram lives in the parent doc, NOT here. If a parent diagram changes, this file must be updated to match.
>
> See also: [`../README.md`](../README.md) — routing docs index.

This page aggregates all 7 Mermaid diagrams from the routing documentation set. Each section below contains the diagram itself plus a back-link to the parent document where the full prose explanation lives.

**Diagrams in this appendix:**

1. [Route Topology](#1-route-topology) — `flowchart TD` of the 7 declarative routes from `src/App.js`
2. [First-Time User Flow](#2-first-time-user-flow) — `sequenceDiagram` of the onboarding redirect chain
3. [Returning User Flow](#3-returning-user-flow) — `sequenceDiagram` of the truthy-flag short-circuit
4. [Onboarding State Machine](#4-onboarding-state-machine) — `stateDiagram-v2` for the `HOME_PAGE_SEEN` lifecycle
5. [Redirect Web](#5-redirect-web) — `flowchart LR` of every page-to-page redirect edge
6. [Navigation Mechanism Decision Tree](#6-navigation-mechanism-decision-tree) — `flowchart TD` for choosing a redirect mechanism
7. [Route Guard Sequence](#7-route-guard-sequence) — `sequenceDiagram` for the imperative guard pattern

---

## 1. Route Topology

A top-down view of the React tree mounting the seven `<Route>` declarations from `src/App.js:22-28`, including the conditional ternary that selects between `<WeatherApp />` and `<Home />` for the index route.

```mermaid
flowchart TD
    Index["index.js<br/>renders &lt;App /&gt;"]
    App["App.js<br/>renders &lt;BrowserRouter&gt;"]
    BR["&lt;BrowserRouter&gt;"]
    RoutesNode["&lt;Routes&gt;"]
    R1["&lt;Route index<br/>element={DEFAULT_ROUTE_PAGE} /&gt;"]
    R2["&lt;Route path='support'<br/>element={&lt;Support /&gt;} /&gt;"]
    R3["&lt;Route path='weather'<br/>element={&lt;WeatherApp /&gt;} /&gt;"]
    R4["&lt;Route path='weathermain'<br/>element={&lt;WeatherMain /&gt;} /&gt;"]
    R5["&lt;Route path='forecast'<br/>element={&lt;ForecastWeather /&gt;} /&gt;"]
    R6["&lt;Route path='settings'<br/>element={&lt;Settings /&gt;} /&gt;"]
    R7["&lt;Route path='*'<br/>element={&lt;NotFound /&gt;} /&gt;"]

    DRP{"DEFAULT_ROUTE_PAGE<br/>(ternary on HOME_PAGE_SEEN)"}
    HomePage["&lt;Home /&gt;<br/>(src/pages/Home.jsx)"]
    WeatherPage["&lt;WeatherApp /&gt;<br/>(src/pages/Weather.jsx)"]
    SupportPage["&lt;Support /&gt;<br/>(src/pages/Support.jsx)"]
    WMainPage["&lt;WeatherMain /&gt;<br/>(src/pages/WeatherMain.jsx)"]
    ForecastPage["&lt;ForecastWeather /&gt;<br/>(src/pages/ForecastWeather.jsx)"]
    SettingsPage["&lt;Settings /&gt;<br/>(src/pages/Settings.jsx)"]
    NotFoundPage["&lt;NotFound /&gt;<br/>(src/pages/404.jsx)"]

    Index --> App
    App --> BR
    BR --> RoutesNode
    RoutesNode --> R1
    RoutesNode --> R2
    RoutesNode --> R3
    RoutesNode --> R4
    RoutesNode --> R5
    RoutesNode --> R6
    RoutesNode --> R7

    R1 --> DRP
    DRP -->|HOME_PAGE_SEEN truthy| WeatherPage
    DRP -->|HOME_PAGE_SEEN falsy| HomePage
    R2 --> SupportPage
    R3 --> WeatherPage
    R4 --> WMainPage
    R5 --> ForecastPage
    R6 --> SettingsPage
    R7 --> NotFoundPage
```

**Source:** [`../routing-overview.md` §7 (Route Topology Diagram)](../routing-overview.md)

---

## 2. First-Time User Flow

A sequence diagram tracing the request from the browser to `index.js`, `App.js`, the falsy `db.get("HOME_PAGE_SEEN")`, the `Home` onboarding modal, the four `db.create` writes, and the post-onboarding `navigate("weather")` redirect (a full page reload).

```mermaid
sequenceDiagram
    actor User
    participant Browser
    participant ReactDOM as React (StrictMode)
    participant App as App.js
    participant DB as db.get / db.create (localStorage)
    participant Home as Home.jsx
    participant Modal as SweetAlert2 modal
    participant Helper as navigate(page)

    User->>Browser: Visit /
    Browser->>ReactDOM: Hydrate React tree
    ReactDOM->>App: Render <App />
    App->>DB: db.get("HOME_PAGE_SEEN")
    DB-->>App: null
    Note over App: Ternary: DEFAULT_ROUTE_PAGE = <Home />
    App->>Home: Render <Home /> at index route /
    Home-->>User: Display "How's today's weather?" landing page

    User->>Home: Click "today's weather"
    Home->>Modal: Swal.fire({ title: "Default Location", ... })
    Modal-->>User: Display location input modal
    User->>Modal: Enter location and confirm
    Modal->>Home: { isConfirmed: true, value: "Lagos" }

    Home->>DB: db.create("HOME_PAGE_SEEN", true)
    Home->>DB: db.create("USER_DEFAULT_LOCATION", "Lagos")
    Home->>DB: db.create("TRACK_SAVED_LOCATION_WEATHER", false)
    Home->>DB: db.create("WEATHER_UNIT", "metric")
    Home->>Helper: navigate("weather")
    Helper->>Browser: window.location.href = "weather"
    Browser->>Browser: Full page reload to /weather

    Browser->>ReactDOM: Re-hydrate React tree
    ReactDOM->>App: Render <App /> (second time)
    App->>DB: db.get("HOME_PAGE_SEEN")
    DB-->>App: "true"
    App->>App: Route /weather matches, mount <WeatherApp />
    App-->>User: Display weather dashboard
```

**Source:** [`../conditional-routing.md` §5 (First-Time User Flow)](../conditional-routing.md)

---

## 3. Returning User Flow

A sequence diagram showing the abbreviated path for a returning user: `App.js` reads a truthy `HOME_PAGE_SEEN`, the ternary picks `<WeatherApp />`, the `Weather.jsx` guard re-reads the flag (still truthy), and the dashboard renders without onboarding.

```mermaid
sequenceDiagram
    actor User
    participant Browser
    participant ReactDOM as React (StrictMode)
    participant App as App.js
    participant DB as db.get (localStorage)
    participant Weather as WeatherApp (Weather.jsx)

    User->>Browser: Visit /
    Browser->>ReactDOM: Hydrate React tree
    ReactDOM->>App: Render <App />
    App->>DB: db.get("HOME_PAGE_SEEN")
    DB-->>App: "true"
    Note over App: Ternary: DEFAULT_ROUTE_PAGE = <WeatherApp />
    App->>Weather: Render <WeatherApp /> at index route /
    Weather->>DB: db.get("HOME_PAGE_SEEN") (guard at line 36)
    DB-->>Weather: "true" (truthy — no redirect)
    Weather-->>User: Display weather dashboard
```

**Source:** [`../conditional-routing.md` §6 (Returning User Flow)](../conditional-routing.md)

---

## 4. Onboarding State Machine

A `stateDiagram-v2` modeling the lifecycle of the `HOME_PAGE_SEEN` flag: from `NotOnboarded` through `ShowingModal`, `ValidatingInput`, `Writing`, into `Onboarded`; and the factory-reset edge that returns to `NotOnboarded`.

```mermaid
stateDiagram-v2
    [*] --> NotOnboarded : Fresh install or factory reset

    NotOnboarded --> ShowingModal : User clicks "today's weather"<br/>on Home.jsx
    ShowingModal --> ValidatingInput : User confirms modal<br/>with input
    ShowingModal --> NotOnboarded : User cancels modal

    ValidatingInput --> NotOnboarded : Empty / invalid input<br/>(showError toast)
    ValidatingInput --> Writing : Valid input

    Writing --> Onboarded : db.create writes<br/>HOME_PAGE_SEEN=true,<br/>USER_DEFAULT_LOCATION,<br/>TRACK_SAVED_LOCATION_WEATHER,<br/>WEATHER_UNIT
    Onboarded --> Onboarded : User navigates between<br/>weather, forecast, settings, support
    Onboarded --> NotOnboarded : User clicks "Restore Factory Settings"<br/>(db.destroy + navigate("/"))
```

**Source:** [`../conditional-routing.md` §7 (Onboarding State Machine)](../conditional-routing.md)

---

## 5. Redirect Web

A `flowchart LR` showing every page node connected by labeled arrows representing `navigate(...)` redirects, including the GitHub external node and the footer's multi-source dotted edges. Solid arrows are direct redirects from page handlers; dotted arrows are indirect redirects (the index conditional, footer-strip multiplexed redirects, and `window.location.href` fallbacks).

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
    Home -->|"navigate(&quot;weather&quot;)<br/>Home.jsx:69"| Weather
    Home -->|window.location.href<br/>fallback Home.jsx:72| Weather

    %% Outgoing from Weather
    Weather -->|"guard navigate(&quot;/&quot;)<br/>Weather.jsx:37"| Index
    Weather -->|"navigate(&quot;/forecast&quot;)<br/>Weather.jsx:55, 88, 133"| Forecast
    Weather -->|"navigate(&quot;weathermain&quot;)<br/>Weather.jsx:119"| WMain

    %% Outgoing from WeatherMain
    WMain -->|"navigate(&quot;/weather&quot;)<br/>WeatherMain.jsx:26"| Weather

    %% Outgoing from ForecastWeather
    Forecast -->|"guard navigate(&quot;/&quot;)<br/>ForecastWeather.jsx:45"| Index
    Forecast -->|"navigate(&quot;/weather&quot;)<br/>ForecastWeather.jsx:252"| Weather

    %% Outgoing from Settings
    Settings -->|"navigate(&quot;./weather&quot;)<br/>Settings.jsx:10"| Weather
    Settings -->|"restoreFactorySettings<br/>navigate(&quot;/&quot;)<br/>settings.js:98, 102"| Index
    Settings -.->|window.location.href fallback<br/>settings.js:105| Index

    %% Outgoing from Support
    Support -->|"navigate(&quot;./weather&quot;)<br/>Support.jsx:8"| Weather
    Support -->|"navigate(github URL)<br/>Support.jsx:12, 16"| Github

    %% Outgoing from NotFound
    NotFound -->|"navigate(&quot;/weather&quot;)<br/>404.jsx:8"| Weather

    %% Footer-driven (multi-source, abbreviated)
    Settings -.->|footer App<br/>footerNav.jsx:6| Weather
    Settings -.->|footer Support<br/>footerNav.jsx:14| Support
    Support -.->|footer App<br/>footerNav.jsx:6| Weather
    Support -.->|footer Settings<br/>footerNav.jsx:10| Settings
    WMain -.->|footer App / Settings / Support<br/>footerNav.jsx| Weather
    Forecast -.->|footer App / Settings / Support<br/>footerNav.jsx| Weather
```

**Source:** [`../page-redirects.md` §7 (Redirect Web Diagram)](../page-redirects.md)

---

## 6. Navigation Mechanism Decision Tree

A `flowchart TD` decision tree for contributors choosing how to issue a navigation: declarative `<Route>` (Mechanism 1), imperative `navigate(...)` helper (Mechanism 2), or `window.location.href` direct assignment (Mechanism 3).

```mermaid
flowchart TD
    Start[Need to issue navigation?] --> Q1{Is this a route<br/>declaration in App.js?}
    Q1 -->|Yes| M1["Use Mechanism 1:<br/>Declarative<br/>&lt;Route&gt; element"]
    Q1 -->|No| Q2{Is this a runtime<br/>page transition<br/>triggered by code?}
    Q2 -->|No| Stop1[Not a navigation concern]
    Q2 -->|Yes| Q3{Is the destination<br/>an external URL?}
    Q3 -->|Yes| M2A["Use Mechanism 2:<br/>navigate('https://...')<br/>(matches existing<br/>pattern in Support.jsx)"]
    Q3 -->|No| Q4{Is this in a catch block<br/>where navigate may fail?}
    Q4 -->|Yes| M3["Use Mechanism 3:<br/>window.location.href = '...'<br/>(matches Home.jsx:72,<br/>settings.js:105)"]
    Q4 -->|No| M2B["Use Mechanism 2:<br/>navigate('/path')"]
```

**Source:** [`../navigation-mechanisms.md` §5 (Decision Tree)](../navigation-mechanisms.md)

---

## 7. Route Guard Sequence

A `sequenceDiagram` tracing the imperative guard at the top of `Weather.jsx` (line 36-38) and `ForecastWeather.jsx` (line 44-46): the synchronous `db.get("HOME_PAGE_SEEN")` read, the alt-block branching on truthy/falsy, and the `navigate("/")` redirect that triggers a full page reload.

```mermaid
sequenceDiagram
    actor User
    participant Browser
    participant ReactDOM as React (StrictMode)
    participant App as App.js
    participant Page as Weather.jsx / ForecastWeather.jsx
    participant DB as db.get() (localStorage)
    participant Helper as navigate(page)

    User->>Browser: Visit /weather (or /forecast)
    Browser->>ReactDOM: Hydrate React tree
    ReactDOM->>App: Render <App />
    App->>Page: Match route, render <WeatherApp /> (or <ForecastWeather />)
    Page->>DB: db.get("HOME_PAGE_SEEN")
    alt HOME_PAGE_SEEN is null/undefined/falsy
        DB-->>Page: null
        Page->>Helper: navigate("/")
        Helper->>Browser: window.location.href = "/"
        Browser->>Browser: Full page reload to "/"
        Browser->>ReactDOM: New page load, re-hydrate
        Note over App: App.js ternary now picks <Home /> for the index route
    else HOME_PAGE_SEEN is truthy
        DB-->>Page: "true" (or any truthy string)
        Page->>Page: Continue rendering page body
        Page-->>User: Display weather page
    end
```

**Source:** [`../route-guards.md` §6 (Guard Execution Sequence Diagram)](../route-guards.md)

---

## See Also

- [Routing Documentation Index](../README.md) — start here for the full routing docs set
- [Routing Overview](../routing-overview.md) — route table and `BrowserRouter` setup
- [Navigation Mechanisms](../navigation-mechanisms.md) — three-mechanism explainer
- [Page Redirects](../page-redirects.md) — exhaustive Redirect Catalog (21 entries)
- [Conditional Routing](../conditional-routing.md) — `HOME_PAGE_SEEN` lifecycle
- [Route Guards](../route-guards.md) — imperative guard pattern

> **Maintenance note:** When any parent diagram changes, the corresponding section in this file MUST be updated to match. The diagrams here are aggregated copies, NOT canonical. The canonical version of every diagram lives in its parent document.
