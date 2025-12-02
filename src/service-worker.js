/**
 * service-worker.js
 * Workbox-powered Service Worker for PWA functionality.
 *
 * @module service-worker
 * @description Implements offline-first caching strategies using Workbox.
 * This service worker provides:
 * - Precaching of build assets via __WB_MANIFEST injection
 * - App Shell routing for SPA navigation (serves index.html for navigation requests)
 * - Runtime caching for same-origin PNG images using StaleWhileRevalidate strategy
 * - Skip waiting functionality for immediate activation of new service workers
 *
 * Build-time requirement: Workbox build step must inject self.__WB_MANIFEST
 * containing the precache manifest. The build process (react-scripts/CRA)
 * handles this automatically.
 *
 * @see https://developers.google.com/web/tools/workbox
 * @see https://cra.link/PWA
 */

/* eslint-disable no-restricted-globals */

// This service worker can be customized!
// See https://developers.google.com/web/tools/workbox/modules
// for the list of available Workbox modules, or add any other
// code you'd like.
// You can also remove this file if you'd prefer not to use a
// service worker, and the Workbox build step will be skipped.

import { clientsClaim } from 'workbox-core';
import { ExpirationPlugin } from 'workbox-expiration';
import { precacheAndRoute, createHandlerBoundToURL } from 'workbox-precaching';
import { registerRoute } from 'workbox-routing';
import { StaleWhileRevalidate } from 'workbox-strategies';

// Immediately take control of all clients (pages) without waiting for refresh.
// This ensures the service worker activates right after installation.
clientsClaim();

// Precache strategy: Cache all build-generated assets at install time.
// __WB_MANIFEST is replaced at build time with an array of {url, revision} entries.
// Their URLs are injected into the manifest variable below.
// This variable must be present somewhere in your service worker file,
// even if you decide not to use precaching. See https://cra.link/PWA
precacheAndRoute(self.__WB_MANIFEST);

// Set up App Shell-style routing, so that all navigation requests
// are fulfilled with your index.html shell. Learn more at
// https://developers.google.com/web/fundamentals/architecture/app-shell

// Regex pattern to detect URLs with file extensions (e.g., /path/file.js).
// Used to skip App Shell routing for actual asset requests.
const fileExtensionRegexp = new RegExp('/[^/?]+\\.[^/]+$');

// Navigation request handler for App Shell routing pattern:
// - Only handles 'navigate' mode requests (page navigations)
// - Excludes special paths starting with '/_' (reserved for API routes)
// - Excludes requests for files with extensions (static assets)
// Returns index.html for all other navigation requests, enabling SPA routing.
registerRoute(
  // Return false to exempt requests from being fulfilled by index.html.
  ({ request, url }) => {
    // If this isn't a navigation, skip.
    if (request.mode !== 'navigate') {
      return false;
    }

    // If this is a URL that starts with /_, skip.
    // Reserved paths (e.g., /_api) should not be handled by App Shell.
    if (url.pathname.startsWith('/_')) {
      return false;
    }

    // If this looks like a URL for a resource, because it contains
    // a file extension, skip. Static assets should be served directly.
    if (url.pathname.match(fileExtensionRegexp)) {
      return false;
    }

    // Return true to signal that we want to use the handler.
    // All other navigation requests will be served index.html.
    return true;
  },
  createHandlerBoundToURL(process.env.PUBLIC_URL + '/index.html')
);

// Runtime caching strategy for PNG images:
// - StaleWhileRevalidate: Serves cached version immediately while fetching update
// - Applies only to same-origin requests (self.location.origin)
// - Cache named 'images' with max 50 entries (LRU eviction via ExpirationPlugin)
// Extend this pattern for other asset types (jpg, svg, gif) as needed.
registerRoute(
  // Add in any other file extensions or routing criteria as needed.
  ({ url }) => url.origin === self.location.origin && url.pathname.endsWith('.png'),
  // Customize this strategy as needed, e.g., by changing to CacheFirst.
  new StaleWhileRevalidate({
    cacheName: 'images',
    plugins: [
      // Ensure that once this runtime cache reaches a maximum size the
      // least-recently used images are removed.
      new ExpirationPlugin({ maxEntries: 50 }),
    ],
  })
);

// Message listener for skipWaiting control:
// Allows the application to force-activate a waiting service worker
// by calling: registration.waiting.postMessage({type: 'SKIP_WAITING'})
// This is typically triggered when a user chooses to update to a new version.
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

// Any other custom service worker logic can go here.
