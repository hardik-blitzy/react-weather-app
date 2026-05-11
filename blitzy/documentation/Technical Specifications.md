# Technical Specification

# 0. Agent Action Plan

## 0.1 Executive Summary and Intent Clarification

### 0.1.1 User Prompt Verbatim

The user's prompt is preserved here without paraphrase to anchor every interpretation that follows:

> "Choose from your saved rules so every generation follows the same standards automatically. You can also create a new one if needed."

The user-supplied metadata is also preserved verbatim: zero attachments, zero environment instructions, an empty list of environment variable names (`[]`), an empty list of secret names (`[]`), and an empty list of implementation rules (`[]`).

### 0.1.2 Core Refactoring Objective

Based on the prompt, the Blitzy platform understands that the literal text supplied is meta-instructional guidance describing how to use a "saved rules" selector in the project-creation interface so that future code generations apply consistent coding standards. The text is procedural UI copy directed at the human user of the rule-management feature; it is not a refactoring directive against the source tree of `react-weather-app` [package.json:L2] documented elsewhere in this Technical Specification [1.1.1 Project Overview, "react-weather-app" identification].

Translated to refactoring terminology, the prompt does NOT specify any of the elements that a code-level refactoring objective requires:

| Required Refactoring Element | Provided in User Prompt? | Evidence |
|------------------------------|--------------------------|----------|
| Refactoring type (structure / pattern / performance / modularity / migration) | NO | Prompt names no refactoring category |
| Source artifact (module, file, class, API) | NO | Prompt cites no path under `src/`, `server.js`, `package.json`, or any other location |
| Target architecture | NO | Prompt names no target stack, framework, or topology |
| Target repository (same vs. new) | NO | Prompt names no migration destination |
| Behavioral preservation guarantees (e.g., maintain public API contracts) | NO | Prompt issues no preservation directive |
| Design system or component library | NO | Prompt names no library, no Figma reference, no token system |
| Performance or scalability targets | NO | Prompt sets no metrics, no SLOs, no benchmarks |
| Files to add / update / delete | NO | Prompt enumerates no paths |
| Acceptance criteria | NO | Prompt declares no validation gates |

Refactoring type classification: `[INDETERMINATE — no refactoring directive supplied]`. The five refactoring categories (Code structure, Design pattern, Performance, Modularity, Tech stack migration) cannot be assigned because none is described.

Target repository classification: `[INDETERMINATE — no migration target supplied]`. The two repository targeting options (Same repository, New repository migration) cannot be assigned because the prompt names neither.

### 0.1.3 Technical Interpretation

This refactoring translates to the following technical transformation strategy: there is no transformation strategy to translate, because the prompt does not authorize a transformation. The Blitzy platform's faithful interpretation is that the user has either:

- **(Interpretation A — most likely)** Pasted UI copy from a rules-management screen as the project description by accident, in which case the correct downstream action is to halt code generation and request a concrete refactoring directive from the user.
- **(Interpretation B — possible but unsupported by the codebase)** Intended to request the addition of a "saved rules" feature to the application itself. This interpretation is not supported by the existing system: `react-weather-app` is a weather-forecast Single Page Application <cite index="...">with no rules-management surface, no rule storage, and no code-generation pipeline</cite> — the closest user-preference surfaces in the app are `Settings.jsx` and the `Database` `localStorage` wrapper [src/backend/database.js:L1-L40], and these manage weather-related preferences (default location, units, tracking flag), not generation rules.

Because Interpretation A is overwhelmingly the more reasonable reading of the literal text, this Agent Action Plan is structured as a **transparent, no-op-by-default refactoring plan**: it documents the existing system baseline so that any clarified directive can be attached to it in a follow-up iteration, and it explicitly refrains from fabricating goals, files, transformations, or dependency changes that the user did not authorize.

### 0.1.4 Clarification Required Before Code Generation

For Blitzy to execute a refactor in subsequent iterations, the user must supply at minimum the following clarifications. This list is provided to guide the next prompt, not to assume an answer:

- **Refactoring goal**: One concrete sentence describing what should change about the running system (for example: "Migrate from Bootstrap 5 to Tailwind CSS", "Replace jQuery AJAX in `src/apis/*.js` with `fetch`", "Convert `server.js` from CommonJS to ES Modules", "Migrate from Create React App to Vite", "Extract the `Database` class into a generic key/value adapter so a future IndexedDB backend can plug in").
- **Scope envelope**: The folders, paths, or wildcard patterns that ARE in scope, and explicitly named items that are OUT of scope.
- **Behavioral invariants**: Which behaviors must be preserved bit-for-bit (e.g., the `GET /health` JSON contract documented in `README.md` [README.md:L25-L60] and `server.js` [server.js:L16-L30]) and which may change.
- **Acceptance criteria**: How completion will be verified (build success, test pass, manual route walkthrough, lighthouse score, etc.).
- **Constraints inherited from existing rules**: Whether the previously-recorded rule that prohibited frontend source changes during the `/health` server-tier work [3.1.1 — "RULE-007"] still applies, and whether other RULE-001 through RULE-008 constraints should govern this iteration.

### 0.1.5 Implicit Requirements Surfaced

Even with no directive, two implicit requirements are intrinsic to the act of generating an Agent Action Plan and are surfaced here so they remain visible to downstream stages:

- **Do no harm**: In the absence of a directive, no file in this repository may be modified, created, or deleted by downstream code generation. The actionable in-scope set is empty (Section 0.2).
- **Honest reporting**: This AAP must report what the prompt says and does not say. Where the prompt is silent, downstream agents must read silence as silence — not as authorization to invent.

## 0.2 Technical Scope and Boundaries

### 0.2.1 Scope Determination

Because the user prompt issues no refactoring directive (Section 0.1), the actionable scope of this iteration is empty. The Blitzy platform must therefore treat every file in the repository as **out of scope** until a follow-up clarification names specific files or wildcard patterns to refactor.

This sub-section documents the empty in-scope set explicitly, so that downstream code generation cannot mistake silence for permission. It also enumerates the candidate paths that exist in the repository — these candidates are NOT in scope; they are listed only so that a future clarified directive can attach to them without requiring re-discovery.

### 0.2.2 Exhaustively In Scope

| Category | Path or Pattern | Status |
|----------|-----------------|--------|
| Source transformations | — | None requested |
| Test updates | — | None requested |
| Configuration updates | — | None requested |
| Documentation updates | — | None requested |
| Import corrections | — | None requested |
| Rule-mandated files | — | None — user-specified rules list is empty (`[]`) |

**The actionable in-scope set is `{}` (empty).**

### 0.2.3 Explicitly Out of Scope

Every file and folder in the repository is out of scope for this iteration. The following enumeration is provided for completeness, drawn from the discovery inventory [Section 0.8.2 — Search Log]:

| Path | Type | Status |
|------|------|--------|
| `server.js` | File | OUT OF SCOPE — no refactor directive [server.js:L1-L71] |
| `package.json` | File | OUT OF SCOPE — no dependency change requested [package.json:L1-L51] |
| `package-lock.json` | File | OUT OF SCOPE — no dependency change requested |
| `README.md` | File | OUT OF SCOPE — no documentation change requested [README.md:L1-L80] |
| `public/index.html` | File | OUT OF SCOPE — no shell change requested |
| `public/manifest.json` | File | OUT OF SCOPE — no PWA metadata change requested |
| `public/robots.txt` | File | OUT OF SCOPE — no crawl policy change requested |
| `src/index.js` | File | OUT OF SCOPE — no bootstrap change requested |
| `src/App.js` | File | OUT OF SCOPE — no router change requested [src/App.js:L1-L34] |
| `src/App.test.js` | File | OUT OF SCOPE — no test change requested |
| `src/autoload.js` | File | OUT OF SCOPE — no asset autoload change requested |
| `src/reportWebVitals.js` | File | OUT OF SCOPE — no telemetry change requested |
| `src/service-worker.js` | File | OUT OF SCOPE — no PWA worker change requested |
| `src/serviceWorkerRegistration.js` | File | OUT OF SCOPE — no PWA registration change requested |
| `src/setupTests.js` | File | OUT OF SCOPE — no test bootstrap change requested |
| `src/apis/getCurrentWeather.js` | File | OUT OF SCOPE — no API integration change requested |
| `src/apis/getGeolocation.js` | File | OUT OF SCOPE — no geolocation change requested |
| `src/apis/getWeatherForecast.js` | File | OUT OF SCOPE — no forecast change requested |
| `src/backend/app_backend.js` | File | OUT OF SCOPE — no singleton change requested |
| `src/backend/database.js` | File | OUT OF SCOPE — no persistence change requested |
| `src/backend/settings.js` | File | OUT OF SCOPE — no settings handler change requested |
| `src/components/*.jsx` (9 files) | Files | OUT OF SCOPE — no component change requested |
| `src/inc/scripts/utilities.js` | File | OUT OF SCOPE — no utility change requested |
| `src/inc/scripts/script.js` | File | OUT OF SCOPE — no init script change requested |
| `src/inc/styles/style.css` | File | OUT OF SCOPE — no styling change requested |
| `src/inc/styles/overScrollStyles.css` | File | OUT OF SCOPE — no styling change requested |
| `src/inc/styles/three-dots.css` | File | OUT OF SCOPE — third-party vendored, no change requested |
| `src/pages/*.jsx` (7 files) | Files | OUT OF SCOPE — no route-level page change requested |
| `scripts/*.sh` (4 files) | Files | OUT OF SCOPE — no operational script change requested |
| `blitzy/documentation/*.md` | Files | OUT OF SCOPE — no documentation change requested |
| `.vscode/*` | Files | OUT OF SCOPE — IDE workspace settings, untouched |

### 0.2.4 Design System Compliance Sub-Section Status

The Design System Alignment Protocol does **not** apply to this iteration. The user prompt names no component library, no design system, no proprietary in-repo system, and no Figma deliverable. Consequently, no system identification, component mapping, token mapping, gaps inventory, or compliance summary is produced.

For factual context only (not a directive), the existing codebase incidentally uses the following UI primitives, none of which are being conformed-to or migrated-from in this iteration:

- **Bootstrap 5.3.6** [package.json:L11] — referenced via `src/autoload.js` (Bootstrap CSS/JS imports) [referenced in 1.1 EXECUTIVE SUMMARY context summary]
- **jQuery 3.7.1** + **jQuery Mobile 1.5.0-alpha.1** [package.json:L17-L18] — used inside `src/inc/scripts/utilities.js`, `src/apis/*.js`, `src/components/utilityFooterComponet.jsx`, and `src/backend/settings.js`
- **SweetAlert2 11.12.1** [package.json:L23] — used for modal dialogs and toasts in pages and settings handlers
- **Project-local CSS tokens** in `src/inc/styles/style.css` (poppins font, brand color custom properties, branded button classes) — see project-local design surface [3.1.2 Markup and Styling Languages]

If a future clarified directive requires migration to a named design system (e.g., Tailwind, Material UI, Ant Design, Shadcn/ui), the Design System Compliance sub-section will be authored at that time per the protocol.

## 0.3 Target Design

### 0.3.1 Target Design Determination

A target architecture cannot be designed for this iteration because the prompt does not name one (Section 0.1). This sub-section documents the **observed baseline** as the reference point that any future clarified directive will refactor against. The baseline is recorded in the present tense — it describes what exists, not what is being proposed.

### 0.3.2 Refactored Structure Planning

No refactored structure is proposed. The target tree below is the **current tree**, presented so that a future directive can attach to it without re-discovery. Each entry annotates whether the file belongs to the server tier, client tier, persistence tier, build/operations layer, or documentation layer:

```
react-weather-app/
├── package.json                          (npm manifest, dependencies, scripts) [package.json:L1-L51]
├── package-lock.json                     (deterministic dependency snapshot)
├── README.md                             (human-facing overview, /health contract) [README.md:L1-L80]
├── server.js                             (Express server tier — single file)    [server.js:L1-L71]
├── .vscode/
│   ├── extensions.json                   (recommended VS Code extensions)
│   └── settings.json                     (workspace formatting preferences)
├── public/                               (SPA shell, served verbatim by react-scripts)
│   ├── index.html                        (root mount node, SEO/PWA meta)
│   ├── manifest.json                     (PWA install metadata)
│   └── robots.txt                        (crawler policy)
├── scripts/                              (POSIX sh operational entrypoints)
│   ├── deliver-for-development.sh        (calls npm run build)
│   ├── deploy-for-production.sh          (build + install --production + node server.js & + .pidfile)
│   ├── kill.sh                           (kills .pidfile process and stray npm processes)
│   └── test.sh                           (instructional test wrapper, mostly disabled)
├── src/                                  (React 18.3.1 client tier)
│   ├── App.js                            (BrowserRouter + 7 routes)              [src/App.js:L1-L34]
│   ├── App.test.js                       (Jest smoke test for /weather/i text)
│   ├── autoload.js                       (Bootstrap CSS/JS + project CSS imports)
│   ├── index.js                          (ReactDOM.createRoot + StrictMode + SW register)
│   ├── reportWebVitals.js                (web-vitals hook, currently dormant)
│   ├── service-worker.js                 (Workbox precache + image runtime cache)
│   ├── serviceWorkerRegistration.js      (production-only SW registration logic)
│   ├── setupTests.js                     (@testing-library/jest-dom bootstrap)
│   ├── apis/
│   │   ├── getCurrentWeather.js          (OpenWeatherMap current + api-ninjas city)
│   │   ├── getGeolocation.js             (navigator.geolocation watchPosition)
│   │   └── getWeatherForecast.js         (OpenWeatherMap 5-day/3-hour forecast)
│   ├── assets/
│   │   ├── humidity.svg, pressure.svg, wind.svg
│   │   └── static/                       (additional weather-condition artwork)
│   ├── backend/                          (browser-side persistence)
│   │   ├── app_backend.js                (singleton db = new Database())
│   │   ├── database.js                   (Database CRUD wrapper over localStorage)
│   │   └── settings.js                   (settings UI handlers)
│   ├── components/                       (reusable presentational components)
│   │   ├── button.jsx, footer.jsx, footerNav.jsx
│   │   ├── forecastWeatherComponent.jsx, forecastWeatherItems.jsx
│   │   ├── futureWeatherComponent.jsx, nextWeekComponent.jsx
│   │   ├── spinner.jsx
│   │   └── utilityFooterComponet.jsx     (note: project-local spelling preserved)
│   ├── inc/
│   │   ├── scripts/
│   │   │   ├── script.js                 (DOM-ready spinner hide)
│   │   │   └── utilities.js              (navigate, getCurrentDate, time helpers)
│   │   └── styles/
│   │       ├── style.css                 (poppins fonts, brand tokens, layout)
│   │       ├── overScrollStyles.css      (WebKit scrollbar hide)
│   │       └── three-dots.css            (vendored loader animations, MIT)
│   └── pages/                            (route-level screens)
│       ├── 404.jsx, ForecastWeather.jsx, Home.jsx, Settings.jsx
│       ├── Support.jsx, Weather.jsx, WeatherMain.jsx
└── blitzy/
    └── documentation/
        ├── Project Guide.md
        └── Technical Specifications.md
```

The above tree is **fully UNCHANGED**. No files are extracted, consolidated, abstracted, renamed, moved, or split.

### 0.3.3 Web Search Research Conducted

No web searches were conducted for this iteration. The conditions that would normally trigger research — a named refactoring pattern (e.g., "best practices for hexagonal architecture migration"), a named language/framework convention (e.g., "Vite migration guide for CRA"), a named tooling target (e.g., "AST-grep rules for jQuery removal") — are absent from the user prompt. Conducting speculative research would risk anchoring downstream code generation on goals the user did not request.

If a future clarified directive arrives, candidate research topics that would become relevant include (this list is illustrative only and is **not** a commitment):

- Best practices for the named refactoring pattern (e.g., extract-class, replace-conditional-with-polymorphism)
- Migration tooling for the named transformation (e.g., codemods, jscodeshift recipes, ts-migrate)
- Conventions for the named target framework (e.g., Vite, Next.js, TypeScript strict mode)
- Tools for safe refactoring (e.g., comby, ast-grep, ESLint custom rules)

### 0.3.4 Design Pattern Applications

No design patterns are proposed for application in this iteration because no transformation is requested. For factual context only, the existing codebase already exhibits the following patterns:

| Existing Pattern | Where Located | Evidence |
|------------------|---------------|----------|
| Singleton (mutable for testability) | `src/backend/app_backend.js` exports `let db = new Database()` | [observed via folder summary; src/backend/app_backend.js] |
| Storage wrapper / facade | `Database` class wrapping `localStorage` CRUD | [src/backend/database.js:L1-L40] |
| Module bifurcation | CommonJS `require` in `server.js`; ESM `import` in `src/**/*.{js,jsx}` | [server.js:L3-L4] vs [src/App.js:L1-L10] |
| Production-gated PWA | `serviceWorkerRegistration.js` registers only when `NODE_ENV === 'production'` | [referenced in 5.1.1.2] |
| Graceful shutdown | `SIGTERM`/`SIGINT` traps + uncaughtException/unhandledRejection in `server.js` | [server.js:L60-L70] |

These patterns are observations of the current state, not refactoring proposals.

### 0.3.5 User Interface Design

No UI design changes are requested. The user prompt names no screen, no flow, no component, no Figma frame, and no visual deliverable. The seven existing routes (`/`, `/support`, `/weather`, `/weathermain`, `/forecast`, `/settings`, and the `*` catch-all) [src/App.js:L21-L29] continue to be served exactly as they are.

## 0.4 Transformation Mapping

### 0.4.1 File-by-File Transformation Plan

No file-by-file transformation is authorized for this iteration because the user prompt does not authorize any UPDATE, CREATE, or REFERENCE actions against specific paths. The transformation table is therefore explicitly empty:

| Target File | Transformation | Source File | Key Changes |
|------------|----------------|-------------|-------------|
| — | — | — | No file transformations are requested. The user prompt did not name a source artifact, target architecture, or any files to modify, create, or reference. |

This empty table is intentional and must not be filled in by downstream code generation without a clarified directive. Any file appearing in Section 0.2.3 ("Explicitly Out of Scope") remains untouched.

### 0.4.2 Cross-File Dependencies

No import statement updates, configuration updates, or test file import corrections are requested. The cross-file dependency graph of the existing system remains intact:

- **CommonJS in server.js** [server.js:L3-L4] — `const express = require('express')` and `const path = require('path')` remain as-is.
- **ES Modules in src/** — every `import` statement under `src/` remains as-is.
- **Re-export of singleton db** — `src/backend/app_backend.js` continues to be the single source of `db` consumed by `src/App.js` [src/App.js:L9], `src/apis/*.js`, `src/backend/settings.js`, and the page modules.
- **Bootstrap and project CSS injection** — `src/autoload.js` continues to be the single point of CSS/JS asset loading; no consumers' import paths change.

### 0.4.3 Wildcard Patterns

No wildcard patterns are used in this iteration because no patterned transformation is requested. If a clarified directive arrives in a future iteration, only **trailing** wildcard patterns will be permitted (per the prompt convention — e.g., `src/apis/*.js | UPDATE`, never `**/apis/*.js`).

### 0.4.4 One-Phase Execution

The one-phase execution principle is restated here so it remains visible to future iterations: when a clarified refactoring directive is provided, the entire refactor will be executed by Blitzy in **one phase**. The project will never be split across multiple temporal phases. All in-scope files will be addressed together in a single coordinated change set.

For the current iteration, the one-phase principle is moot because the change set is empty.

## 0.5 Dependency Inventory

### 0.5.1 Dependency Change Summary

No dependency additions, removals, or version changes are requested by the user prompt. The Blitzy platform will not introduce, retire, or bump any package in this iteration.

### 0.5.2 Existing Dependency Baseline

The following table is the baseline inventory drawn from `package.json` [package.json:L5-L25]. It is **reference material only** — every entry is unchanged in this iteration. Versions are reproduced exactly as pinned in the manifest, including the leading `^` semver caret where present:

| Registry | Package Name | Version (as pinned) | Purpose / Tier |
|----------|--------------|---------------------|----------------|
| npm | `react` | `^18.3.1` | Client tier — UI library [package.json:L18] |
| npm | `react-dom` | `^18.3.1` | Client tier — DOM renderer [package.json:L19] |
| npm | `react-router-dom` | `^6.22.3` | Client tier — routing [package.json:L20] |
| npm | `react-scripts` | `5.0.1` | Build pipeline — Create React App toolchain [package.json:L21] |
| npm | `express` | `^4.21.2` | Server tier — HTTP framework [package.json:L13] |
| npm | `bootstrap` | `^5.3.6` | Client tier — utility CSS [package.json:L11] |
| npm | `bootstrap5` | `^1.1.9` | Client tier — auxiliary Bootstrap helpers [package.json:L12] |
| npm | `jquery` | `^3.7.1` | Client tier — DOM manipulation and AJAX [package.json:L16] |
| npm | `jquery-mobile` | `^1.5.0-alpha.1` | Client tier — auxiliary jQuery Mobile [package.json:L17] |
| npm | `framer-motion` | `^8.5.5` | Client tier — animation [package.json:L14] |
| npm | `sweetalert2` | `^11.12.1` | Client tier — modal/toast UI [package.json:L23] |
| npm | `animate.css` | `^4.1.1` | Client tier — CSS animations [package.json:L9] |
| npm | `aos` | `^2.3.4` | Client tier — Animate-On-Scroll [package.json:L10] |
| npm | `react-swipeable` | `^7.0.2` | Client tier — touch gestures [package.json:L22] |
| npm | `web-vitals` | `^2.1.4` | Client tier — performance telemetry (currently dormant) [package.json:L24] |
| npm | `grunt` | `^1.6.1` | Build/operations — task runner [package.json:L15] |
| npm | `@testing-library/jest-dom` | `^6.6.3` | Test tier — Jest DOM matchers [package.json:L6] |
| npm | `@testing-library/react` | `^16.3.0` | Test tier — React testing utilities [package.json:L7] |
| npm | `@testing-library/user-event` | `^14.0.0` | Test tier — user event simulation [package.json:L8] |

Notes on the baseline (observations, not changes):

- The manifest declares no `engines` field. Node.js compatibility is documented in `Project Guide.md` as v14.x minimum, v18.x or v20.x recommended [referenced in 3.1.1].
- Express is intentionally pinned to the 4.x line. RULE-006 from the existing tech spec requires Express 4.21.x (not 5.x) [referenced in 5.1.1.2]; this rule is preserved.
- `react-scripts` is at `5.0.1` (not caret-prefixed), pinning the build pipeline exactly [package.json:L21].

### 0.5.3 Import Refactoring

No import refactoring is requested. The existing import graph is preserved verbatim. No file matching `src/**/*.{js,jsx}`, `tests/**/*.{js,jsx}`, or `scripts/**/*` will have its import statements modified in this iteration.

### 0.5.4 External Reference Updates

No configuration files, documentation files, build files, or CI/CD files require reference updates. Specifically:

- `**/*.config.*`, `**/*.json` — unchanged
- `**/*.md` (including `README.md` and `blitzy/documentation/*.md`) — unchanged
- Build files (`package.json`, `package-lock.json`) — unchanged
- CI/CD: a `Jenkinsfile` exists per the tech spec [referenced in 3.1.3] but is not modified in this iteration; no `.github/workflows/` or `.gitlab-ci.yml` exists in the repository

## 0.6 Special Analysis

### 0.6.1 Analysis Determination

No special analysis is required by the user prompt. The user has not directed Blitzy to investigate cross-cutting classes, dependency removal techniques, or any other deep technical concern. This sub-section is therefore a brief and honest report rather than a substantive deep dive.

### 0.6.2 Candidate Analyses for Future Directives (Reference Only)

The following list is illustrative only. None of these analyses is being conducted in this iteration. They are recorded so that the Blitzy platform can quickly recognize the kind of cross-cutting question a future directive might require, and so that a clarified prompt can reference them by name without ambiguity:

- **jQuery removal cross-cut**: `jquery` is consumed across at least four surfaces of the client tier — `src/apis/getCurrentWeather.js` (DOM mutations and AJAX), `src/apis/getGeolocation.js` (`$.noConflict()` and AJAX), `src/backend/settings.js` (form reads), `src/components/utilityFooterComponet.jsx` (class toggles on `.cmp` and `.utility-component`), `src/inc/scripts/utilities.js` (DOM-ready and helpers), and `src/inc/scripts/script.js` (spinner hide on DOM-ready) [evidence assembled from folder summaries of `src/apis`, `src/backend`, `src/components`, and `src/inc/scripts`]. A jQuery-removal directive would require cataloguing every call site and replacing each with React state, refs, or `fetch`.
- **CommonJS-to-ESM server migration**: `server.js` uses `require` [server.js:L3-L4]. A migration to ESM would require either renaming to `server.mjs` or adding `"type": "module"` to `package.json` (which would in turn affect any other `.js` file expected to be CommonJS).
- **Bootstrap-to-Tailwind migration**: Bootstrap utility classes (`d-flex`, `align-items-*`, `justify-content-*`) are spread across the components and pages folders per the existing component-level summaries; replacing them with Tailwind utilities would touch every `*.jsx` file plus the autoload pipeline in `src/autoload.js`.
- **CRA-to-Vite migration**: `react-scripts 5.0.1` would be retired in favor of `vite`, requiring new entry HTML wiring and adjusted `public/` semantics; `scripts/deploy-for-production.sh` and `scripts/deliver-for-development.sh` would need their `npm run build` step revalidated against the new build output directory.
- **API-key extraction**: The hardcoded OpenWeatherMap API key in `src/apis/getCurrentWeather.js` is acknowledged technical debt per the existing architecture documentation [referenced in 5.1.2 — "API keys hardcoded — acknowledged technical debt"]. A directive could move it to runtime configuration, in which case the server tier may need to expose a config endpoint or the build step may need to inject `REACT_APP_*` env vars.
- **Test-coverage uplift**: The only test today is the smoke test in `src/App.test.js` [referenced in 1.3 SCOPE evidentiary list] and `scripts/test.sh` documents but does not run a Jest suite. A coverage uplift directive would touch `setupTests.js`, add new `*.test.{js,jsx}` files alongside each `src/` module, and may enable the disabled commands in `scripts/test.sh`.

Each bullet above is a problem statement, not a plan. None of them is in scope until the user supplies a clarified refactoring directive.

## 0.7 Refactoring Rules and Constraints

### 0.7.1 User-Specified Refactoring Rules

The user-specified implementation rules list is empty (`[]`). No refactoring-specific rules have been issued for this iteration.

### 0.7.2 Special Instructions and Constraints

No special instructions, no migration requirements, no performance or scalability targets, no examples, and no web search requirements were provided. The user's prompt contains no directives of the kind that this section is designed to capture (e.g., "maintain all public interfaces", "preserve test coverage", "follow [pattern] X").

### 0.7.3 Constraints Inherited From the Existing Technical Specification

Although the user prompt issues no rules, the existing Technical Specification documents constraints (RULE-001 through RULE-008, referenced in 5.1.1.2) that govern any change to this codebase. The Blitzy platform records them here so that any future clarified directive must reckon with them. These constraints are NOT new for this iteration; they are repeated from existing documentation and remain in force by default until a future user prompt explicitly relaxes one of them:

- **RULE-006 (Express major version pin)**: Express must remain on the 4.21.x line; do not introduce Express 5.x. [referenced in 5.1.1.2]
- **RULE-007 (Frontend immutability during server-tier work)**: When the work in scope is operational/server-tier, frontend source code must not be modified. This rule was authored in the context of the recent `/health` feature addition and may not apply to a future directive that explicitly targets the frontend; the user prompt should clarify scope. [referenced in 1.1.1 and 3.1.1]
- **No TypeScript adoption**: The existing specification disallows TypeScript and requires new code to "match existing JavaScript codebase." [referenced in 3.1.1]
- **No CRA ejection**: Create React App customization through ejection is out of scope by the existing specification. [referenced in 1.3.2.1]
- **Hardcoded OpenWeatherMap API key (acknowledged debt)**: The key in `src/apis/getCurrentWeather.js` remains in place; rotation is explicitly out of scope unless a directive mandates extraction. [referenced in 1.3.2.1]
- **localStorage schema preservation**: All `localStorage` keys in the `weather-app` namespace (e.g., `HOME_PAGE_SEEN`, `USER_DEFAULT_LOCATION`, `WEATHER_UNIT`, `TRACK_SAVED_LOCATION_WEATHER`) retain their current names and value semantics. [referenced in 1.3.2.1]

### 0.7.4 Behavioral Invariants to Preserve

Even with no directive, the following user-facing and operator-facing contracts MUST be preserved by any downstream code generation that may run for this iteration. Because no transformation is authorized, preservation is automatic; the contracts are listed for completeness and for future reference:

- **`GET /health` JSON contract** — must return `{status, uptime, timestamp}` with HTTP 200 on success and `{status:"error", message:"Health check failed", timestamp}` with HTTP 503 on failure [server.js:L16-L30, README.md:L48-L60].
- **SPA fallback routing** — wildcard `app.get('*')` continues to serve `build/index.html` [server.js:L38-L48].
- **Static asset cache headers** — `maxAge: '1d'`, `etag: true`, `lastModified: true` [server.js:L32-L36].
- **Graceful shutdown** — `SIGTERM` and `SIGINT` traps continue to call `gracefulShutdown` [server.js:L60-L61].
- **Routing map** — the seven routes declared in `src/App.js` [src/App.js:L21-L29] remain unchanged.
- **Onboarding gate** — `db.get("HOME_PAGE_SEEN")` continues to choose between `<Home />` and `<WeatherApp />` for the index route [src/App.js:L13-L17].
- **PWA registration gating** — service worker registers only in production [referenced in 5.1.1.2].

## 0.8 References and Search Log

### 0.8.1 Citation Discipline Statement

Every claim in this Agent Action Plan about the existing system is grounded by an inline `[<path>:<locator>]` citation immediately following the claim. Where a claim could not be tied to a specific source location (for example, statements describing the absence of a feature in the user prompt itself), the claim is grounded against the user prompt's verbatim text reproduced in Section 0.1.1 rather than against the codebase. No `[inferred — no direct source]` markers were necessary because every codebase-level claim in this AAP can be tied to a retrieved file or to an existing tech spec section.

### 0.8.2 Search Log

The following enumerates every retrieval performed during the authoring of this Agent Action Plan. It is provided for downstream verification and to aid any follow-up iteration:

#### 0.8.2.1 Folder Inspections (deep search)

| # | Folder Path | Tool | Purpose |
|---|-------------|------|---------|
| 1 | `` (root) | get_source_folder_contents | Establish repository topology |
| 2 | `src` | get_source_folder_contents | Identify client tier composition |
| 3 | `src/apis` | get_source_folder_contents | Catalog external API integration modules |
| 4 | `src/backend` | get_source_folder_contents | Catalog persistence-layer modules |
| 5 | `src/components` | get_source_folder_contents | Catalog reusable presentational components |
| 6 | `src/inc` | get_source_folder_contents | Catalog shared scripts and styles |
| 7 | `src/pages` | get_source_folder_contents | Catalog route-level page components |
| 8 | `public` | get_source_folder_contents | Catalog SPA shell and PWA assets |
| 9 | `scripts` | get_source_folder_contents | Catalog operational shell scripts |
| 10 | `blitzy` | get_source_folder_contents | Locate documentation hub |

#### 0.8.2.2 File Reads

| # | File Path | Tool | Purpose |
|---|-----------|------|---------|
| 1 | `README.md` | read_file | Confirm `/health` contract and project description |
| 2 | `package.json` | read_file | Inventory dependencies and scripts |
| 3 | `server.js` | read_file | Confirm `/health` route, static serving, SPA fallback, shutdown handlers |
| 4 | `src/App.js` | read_file | Confirm route declarations and onboarding gate |

#### 0.8.2.3 Broad Searches

| # | Query | Tool | Outcome |
|---|-------|------|---------|
| 1 | "blitzyignore configuration file specifying paths to exclude from analysis" | search_files | No `.blitzyignore` files found |

#### 0.8.2.4 Tech Spec Section Retrievals

| # | Section Heading | Purpose |
|---|------------------|---------|
| 1 | 1.1 EXECUTIVE SUMMARY | Project context and recent feature classification |
| 2 | 1.3 SCOPE | Existing in-scope/out-of-scope inventory and references |
| 3 | 5.1 HIGH-LEVEL ARCHITECTURE | Tier topology, principles, integration points, data flows |
| 4 | 3.1 PROGRAMMING LANGUAGES | Module-system bifurcation and version constraints |

### 0.8.3 Attachments Inventory

| Attachment Filename | Description |
|---------------------|-------------|
| — | None. The user provided 0 attachments. |

### 0.8.4 Figma Frames Inventory

| Frame Name | URL | Description |
|------------|-----|-------------|
| — | — | None. The user provided 0 Figma frames. |

### 0.8.5 External URLs Referenced

| URL | Source | Purpose |
|-----|--------|---------|
| — | — | No external URLs were retrieved. The user prompt named none, and no web search was conducted (Section 0.3.3). |

### 0.8.6 Source Inventory by Citation Locator

For convenience, the locator anchors used in inline `[<path>:<locator>]` citations across this Agent Action Plan are summarized below so that downstream verification can be performed quickly:

| Locator | What It Anchors |
|---------|-----------------|
| `[server.js:L1-L71]` | Express server tier — health endpoint, static serving, SPA fallback, shutdown handlers |
| `[server.js:L16-L30]` | `/health` route handler with try/catch and 200/503 contract |
| `[server.js:L32-L36]` | `express.static` middleware with cache headers |
| `[server.js:L38-L48]` | Wildcard SPA fallback handler |
| `[server.js:L60-L61]` | `SIGTERM`/`SIGINT` traps |
| `[package.json:L1-L51]` | Full npm manifest |
| `[package.json:L5-L25]` | `dependencies` block |
| `[README.md:L1-L80]` | Project overview and `/health` documentation |
| `[README.md:L25-L60]` | `/health` endpoint contract |
| `[src/App.js:L1-L34]` | Router composition and onboarding gate |
| `[src/App.js:L9]` | `db` import from `./backend/app_backend` |
| `[src/App.js:L13-L17]` | `HOME_PAGE_SEEN` conditional default route |
| `[src/App.js:L21-L29]` | Routes declarations for the seven app paths |
| `[src/backend/database.js:L1-L40]` | `Database` CRUD wrapper over `localStorage` |

