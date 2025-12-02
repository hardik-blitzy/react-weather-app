# Public Directory

Static assets and configuration files for the Weather App Progressive Web Application (PWA).

## Overview

The `public/` directory contains static assets that are served directly by web servers and CDNs without processing by the build system. These files form the foundation of the PWA, including:

- **SPA Shell**: The HTML template that serves as the mount point for the React application
- **PWA Manifest**: Configuration for installability and app-like behavior on mobile devices
- **SEO & Social**: Meta tags for search engine optimization and social media sharing
- **Icons**: Favicon and PWA icons in various resolutions for different platforms

### %PUBLIC_URL% Placeholder

Files in this directory can reference other public assets using the `%PUBLIC_URL%` placeholder. During development, this resolves to the root path, while in production builds it resolves to the configured public URL (useful for CDN deployments or non-root paths).

```html
<!-- Example usage -->
<link rel="icon" href="%PUBLIC_URL%/favicon.ico" />
```

## Files

| File | Purpose | Description |
|------|---------|-------------|
| `index.html` | SPA Shell | Single-page application HTML template with React mount point (`<div id="root">`), SEO meta tags, Open Graph/Twitter cards, and PWA manifest link |
| `manifest.json` | PWA Manifest | Web app manifest defining app name, icons, start URL, display mode, and theme colors for PWA installability |
| `robots.txt` | Crawler Directives | Search engine crawler permissions (allows all crawlers to index all pages) |
| `favicon.ico` | Browser Icon | Multi-resolution favicon for browser tabs (64x64, 32x32, 24x24, 16x16) |
| `logo.png` | PWA Icon | Primary PWA install icon at 512x512 pixels |
| `maskable_icon.png` | Adaptive Icon | Base maskable icon for Android adaptive icon support |
| `maskable_icon_x48.png` | Adaptive Icon 48px | Maskable icon at 48x48 pixels |
| `maskable_icon_x72.png` | Adaptive Icon 72px | Maskable icon at 72x72 pixels |
| `maskable_icon_x96.png` | Adaptive Icon 96px | Maskable icon at 96x96 pixels |
| `maskable_icon_x128.png` | Adaptive Icon 128px | Maskable icon at 128x128 pixels |
| `maskable_icon_x192.png` | Adaptive Icon 192px | Maskable icon at 192x192 pixels |
| `maskable_icon_x384.png` | Adaptive Icon 384px | Maskable icon at 384x384 pixels |
| `maskable_icon_x512.png` | Adaptive Icon 512px | Maskable icon at 512x512 pixels |

## Manifest Configuration

The `manifest.json` file provides metadata for PWA installability and app-like behavior.

### Properties

| Property | Value | Description |
|----------|-------|-------------|
| `name` | `"Weather App"` | Full application name displayed during install prompts |
| `short_name` | `"Weather App"` | Abbreviated name for home screen icons (max ~12 chars recommended) |
| `start_url` | `"."` | Entry point when app is launched (relative to manifest location) |
| `display` | `"standalone"` | Display mode - app appears without browser UI (address bar, navigation) |
| `theme_color` | `"#000000"` | Browser toolbar and status bar color (black) |
| `background_color` | `"#ffffff"` | Splash screen background color during app load (white) |

### Icons Array

The manifest defines three icon entries for different use cases:

```json
{
  "icons": [
    {
      "src": "favicon.ico",
      "sizes": "64x64 32x32 24x24 16x16",
      "type": "image/x-icon"
    },
    {
      "src": "logo.png",
      "type": "image/png",
      "sizes": "512x512"
    },
    {
      "src": "logo.png",
      "type": "image/png",
      "sizes": "512x512",
      "purpose": "any maskable"
    }
  ]
}
```

| Icon | Sizes | Purpose |
|------|-------|---------|
| `favicon.ico` | 64x64, 32x32, 24x24, 16x16 | Browser tab icon, bookmarks |
| `logo.png` | 512x512 | Standard PWA icon for install prompts and home screen |
| `logo.png` (maskable) | 512x512 | Adaptive icon for Android devices with `purpose: "any maskable"` |

### Maskable Icons

Maskable icons (also called adaptive icons) allow Android devices to apply different shaped masks (circle, squircle, rounded square) to app icons. The `purpose: "any maskable"` declaration indicates the icon can be used as both a standard icon and a maskable icon.

The additional `maskable_icon_x*.png` files in this directory provide pre-rendered maskable icons at various resolutions for optimal display across different device pixel densities.

## Meta Tags Documentation

The `index.html` file contains comprehensive meta tags for SEO and social media sharing.

### Basic SEO Tags

| Tag | Value | Purpose |
|-----|-------|---------|
| `charset` | `utf-8` | Character encoding for proper text rendering |
| `viewport` | `width=device-width, initial-scale=1` | Responsive viewport configuration for mobile devices |
| `description` | `"A weather forecast web application"` | Page description for search engine results |
| `keywords` | `"weather app, react weather app, zedd weather app..."` | Search keywords (limited SEO impact) |
| `author` | `"Adedoyin Emmanuel Adeniyi"` | Content author attribution |
| `canonical` | `https://zedd-weather.vercel.app/weather` | Canonical URL to prevent duplicate content issues |
| `robots` | `index, follow` | Instructs search engines to index page and follow links |
| `theme-color` | `#000000` | Browser toolbar color on mobile devices |

### Open Graph Tags

Open Graph meta tags control how the app appears when shared on social platforms like Facebook and LinkedIn.

| Property | Value | Purpose |
|----------|-------|---------|
| `og:title` | `"Weather App Page"` | Title displayed in social shares |
| `og:description` | `"An amazing weather application that can track..."` | Description in social share previews |
| `og:image` | `https://zedd-weather.vercel.app/static/media/pic_1.0d611f9e932e3c646a70.png` | Preview image for social shares |
| `og:url` | `https://zedd-weather.vercel.app` | Canonical URL for social shares |

### Twitter Card Tags

Twitter-specific meta tags for enhanced Twitter share previews.

| Property | Value | Purpose |
|----------|-------|---------|
| `twitter:card` | `"Amaxing Weather App Built With Modern Technologies"` | Card type/summary for Twitter shares |
| `twitter:title` | `"Accurate weather app built using modern technologies."` | Title in Twitter share previews |
| `twitter:description` | `"An amazing weather application that can track..."` | Description in Twitter share previews |
| `twitter:image` | `https://zedd-weather.vercel.app/static/media/pic_1.0d611f9e932e3c646a70.png` | Preview image for Twitter shares |

## SPA Configuration

### React Mount Point

The `index.html` file contains the React application mount point:

```html
<div id="root"></div>
```

This empty `<div>` is where the React application renders its component tree. The build system injects bundled JavaScript at the end of the `<body>` tag.

### Noscript Fallback

For users with JavaScript disabled, a fallback message is displayed:

```html
<noscript>You need to enable JavaScript to run this app.</noscript>
```

### PWA Manifest Link

The manifest is linked in the `<head>` section:

```html
<link rel="manifest" href="%PUBLIC_URL%/manifest.json" />
```

### Apple Touch Icon

For iOS home screen icons:

```html
<link rel="apple-touch-icon" href="%PUBLIC_URL%/logo192.png" />
```

## Robots.txt Configuration

The `robots.txt` file uses a permissive configuration that allows all search engine crawlers to access all pages:

```
User-agent: *
Disallow:
```

| Directive | Value | Meaning |
|-----------|-------|---------|
| `User-agent` | `*` | Applies to all crawlers (Googlebot, Bingbot, etc.) |
| `Disallow` | (empty) | No paths are disallowed - full site access permitted |

This configuration ensures maximum search engine visibility for the Weather App.

## Development vs Production

| Aspect | Development | Production |
|--------|-------------|------------|
| `%PUBLIC_URL%` | Resolves to `/` | Resolves to configured public URL |
| Asset paths | Served from dev server | Served from CDN/static host |
| Caching | No caching | Long-term caching with hashed filenames |
| Manifest | Served directly | Served directly (no hashing) |

### Build Output

When running `npm run build`, files in `public/` are copied to the `build/` directory. Unlike source files, these are not processed by Webpack - they retain their original filenames (no content hashing) except for assets imported in JavaScript.

## Related Documentation

- [Back to Main README](../README.md) - Project overview and setup instructions
- [Service Worker Documentation](../src/service-worker.js) - PWA caching strategies and offline support
- [Service Worker Registration](../src/serviceWorkerRegistration.js) - SW registration and update handling

---

*This documentation is part of the Weather App module documentation structure.*
