import VegaTracker from './vegaTracker';

/**
 * Vega-only entry for the `/vega` webpack build.
 *
 * Reaches `vegaTracker.js` (and its parent `tracker.js`) only. Combined with
 * the webpack `resolve.alias` that rewires `@newrelic/video-core` ->
 * `@newrelic/video-core/vega` for this build, the resulting bundle contains
 * only the Vega pipeline — the Browser harvester chain (agent.js,
 * harvestScheduler.js) is not reachable from `@newrelic/video-core/vega`.
 *
 * Both classes use `getRegisteredHarvester(...)` from core's recordEvent
 * registry instead of importing harvester bindings directly, so the parent
 * `tracker.js` compiles cleanly under either alias.
 */
export default VegaTracker;
export { default as VegaTracker } from './vegaTracker';
