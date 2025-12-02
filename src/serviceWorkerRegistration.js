/**
 * serviceWorkerRegistration.js
 * Service Worker registration and lifecycle management.
 *
 * @module serviceWorkerRegistration
 * @description Handles the registration, update detection, and unregistration
 * of the service worker for PWA functionality. Key behaviors:
 *
 * - Production-only registration (skipped in development)
 * - Localhost detection for development debugging
 * - Automatic update detection with configurable callbacks
 * - Origin validation to prevent CDN-served asset conflicts
 *
 * Registration Flow:
 * 1. Checks if running in production and SW is supported
 * 2. Validates PUBLIC_URL origin matches page origin
 * 3. On localhost: validates SW exists before registering
 * 4. On production: directly registers SW
 * 5. Monitors for updates and triggers callbacks
 *
 * @see ./service-worker.js - The actual service worker implementation
 * @see https://cra.link/PWA - Create React App PWA documentation
 */

// This optional code is used to register a service worker.
// register() is not called by default.

// This lets the app load faster on subsequent visits in production, and gives
// it offline capabilities. However, it also means that developers (and users)
// will only see deployed updates on subsequent visits to a page, after all the
// existing tabs open on the page have been closed, since previously cached
// resources are updated in the background.

// To learn more about the benefits of this model and instructions on how to
// opt-in, read https://cra.link/PWA

// Localhost detection: supports localhost, IPv6 [::1], and IPv4 127.x.x.x addresses
const isLocalhost = Boolean(
  window.location.hostname === 'localhost' ||
    // [::1] is the IPv6 localhost address.
    window.location.hostname === '[::1]' ||
    // 127.0.0.0/8 are considered localhost for IPv4.
    window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/)
);

/**
 * Registers the service worker with the provided configuration.
 * Only registers in production environment.
 *
 * @param {Object} [config] - Registration configuration options
 * @param {string} [config.scope] - Service worker scope path
 * @param {Object} [config.registerOptions] - Navigator.serviceWorker.register options
 * @param {Function} [config.onSuccess] - Callback when SW is successfully installed
 * @param {Function} [config.onUpdate] - Callback when a new SW version is available
 * @returns {void}
 *
 * @example
 * register({
 *   onSuccess: (registration) => console.log('SW registered'),
 *   onUpdate: (registration) => console.log('Update available')
 * });
 */
export function register(config) {
  if (process.env.NODE_ENV === 'production' && 'serviceWorker' in navigator) {
    // The URL constructor is available in all browsers that support SW.
    const publicUrl = new URL(process.env.PUBLIC_URL, window.location.href);
    if (publicUrl.origin !== window.location.origin) {
      // Our service worker won't work if PUBLIC_URL is on a different origin
      // from what our page is served on. This might happen if a CDN is used to
      // serve assets; see https://github.com/facebook/create-react-app/issues/2374
      return;
    }

    window.addEventListener('load', () => {
      console.log(process.env.PUBLIC_URL);
      const swUrl = `${process.env.PUBLIC_URL}/service-worker.js`;

      if (isLocalhost) {
        // This is running on localhost. Let's check if a service worker still exists or not.
        checkValidServiceWorker(swUrl, config);

        // Add some additional logging to localhost, pointing developers to the
        // service worker/PWA documentation.
        navigator.serviceWorker.ready.then(() => {
          console.log(
            'This web app is being served cache-first by a service ' +
              'worker. To learn more, visit https://cra.link/PWA'
          );
        });
      } else {
        // Is not localhost. Just register service worker
        registerValidSW(swUrl, config);
      }
    });
  }
}

/**
 * Internal function to register a valid service worker.
 * Handles the registration lifecycle and update detection.
 *
 * @private
 * @param {string} swUrl - URL of the service worker script
 * @param {Object} [config] - Configuration with callback options
 */
function registerValidSW(swUrl, config) {
  navigator.serviceWorker
    .register(swUrl)
    .then((registration) => {
      registration.onupdatefound = () => {
        const installingWorker = registration.installing;
        if (installingWorker == null) {
          return;
        }
        installingWorker.onstatechange = () => {
          if (installingWorker.state === 'installed') {
            if (navigator.serviceWorker.controller) {
              // At this point, the updated precached content has been fetched,
              // but the previous service worker will still serve the older
              // content until all client tabs are closed.
              console.log(
                'New content is available and will be used when all ' +
                  'tabs for this page are closed. See https://cra.link/PWA.'
              );

              // Execute callback
              if (config && config.onUpdate) {
                config.onUpdate(registration);
              }
            } else {
              // At this point, everything has been precached.
              // It's the perfect time to display a
              // "Content is cached for offline use." message.
              console.log('Content is cached for offline use.');

              // Execute callback
              if (config && config.onSuccess) {
                config.onSuccess(registration);
              }
            }
          }
        };
      };
    })
    .catch((error) => {
      console.error('Error during service worker registration:', error);
    });
}

/**
 * Validates the service worker script exists and is JavaScript.
 * Used on localhost to ensure we're not caching an old/invalid SW.
 *
 * @private
 * @param {string} swUrl - URL of the service worker script
 * @param {Object} [config] - Configuration with callback options
 */
function checkValidServiceWorker(swUrl, config) {
  // Check if the service worker can be found. If it can't reload the page.
  fetch(swUrl, {
    headers: { 'Service-Worker': 'script' },
  })
    .then((response) => {
      // Ensure service worker exists, and that we really are getting a JS file.
      const contentType = response.headers.get('content-type');
      if (
        response.status === 404 ||
        (contentType != null && contentType.indexOf('javascript') === -1)
      ) {
        // No service worker found. Probably a different app. Reload the page.
        navigator.serviceWorker.ready.then((registration) => {
          registration.unregister().then(() => {
            window.location.reload();
          });
        });
      } else {
        // Service worker found. Proceed as normal.
        registerValidSW(swUrl, config);
      }
    })
    .catch(() => {
      console.log('No internet connection found. App is running in offline mode.');
    });
}

/**
 * Unregisters the active service worker.
 * Useful for debugging or when disabling offline functionality.
 *
 * @returns {void}
 *
 * @example
 * // Disable service worker
 * import { unregister } from './serviceWorkerRegistration';
 * unregister();
 */
export function unregister() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.ready
      .then((registration) => {
        registration.unregister();
      })
      .catch((error) => {
        console.error(error.message);
      });
  }
}
