/**
 * reportWebVitals.js
 * Web Vitals performance metrics reporting module.
 *
 * @module reportWebVitals
 * @description Provides optional performance measurement using the web-vitals
 * library. When enabled, reports Core Web Vitals metrics that measure
 * real-world user experience:
 *
 * - CLS (Cumulative Layout Shift): Visual stability metric
 * - FID (First Input Delay): Interactivity metric
 * - FCP (First Contentful Paint): Loading speed metric
 * - LCP (Largest Contentful Paint): Loading performance metric
 * - TTFB (Time to First Byte): Server response time metric
 *
 * The web-vitals library is dynamically imported to minimize bundle size
 * when performance reporting is not enabled.
 *
 * @see https://web.dev/vitals/
 * @see https://bit.ly/CRA-vitals
 */

/**
 * Reports Core Web Vitals metrics to the provided callback function.
 *
 * @param {Function} [onPerfEntry] - Callback function that receives performance entries.
 *   Each metric is passed as a parameter with properties: name, value, id, entries.
 * @returns {void}
 *
 * @example
 * // Log all metrics to console
 * reportWebVitals(console.log);
 *
 * @example
 * // Send metrics to an analytics endpoint
 * reportWebVitals((metric) => {
 *   sendToAnalytics({ name: metric.name, value: metric.value });
 * });
 */
const reportWebVitals = onPerfEntry => {
  if (onPerfEntry && onPerfEntry instanceof Function) {
    import('web-vitals').then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
      getCLS(onPerfEntry);
      getFID(onPerfEntry);
      getFCP(onPerfEntry);
      getLCP(onPerfEntry);
      getTTFB(onPerfEntry);
    });
  }
};

export default reportWebVitals;
