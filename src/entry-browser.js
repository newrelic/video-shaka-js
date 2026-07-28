import ShakaTracker from './tracker';

/**
 * Browser-only entry for the `/browser` webpack build.
 *
 * Reaches `tracker.js` only — `vegaTracker.js` is unreachable from this
 * entry's import graph, so the connected-device chain is dropped at the
 * module-resolution layer. Combined with the webpack `resolve.alias` that
 * rewires `@newrelic/video-core` -> `@newrelic/video-core/browser` for this
 * build, the resulting bundle contains only the Browser pipeline.
 */
export default ShakaTracker;
export { default as ShakaTracker } from './tracker';
