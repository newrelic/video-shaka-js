import { version } from '../package.json';
import { getRegisteredHarvester } from '@newrelic/video-core';
import ShakaTracker from './tracker';

/**
 * VegaTracker — Shaka tracker for the Amazon Vega SDK
 * (Kepler / Fire TV class devices).
 *
 * Structurally identical to ShakaTracker with one extra step: injects
 * `src: 'Vega'` via the `super` spread. That single field flows through:
 *   (a) `VideoTracker.setOptions` -> `this._src` -> `getAttributes`
 *       -> `att.src = 'Vega'` on every event.
 *   (b) `Core.addTracker` -> `setVideoConfig(info, config, 'Vega')`
 *       -> Vega-side global setup in `@newrelic/video-core`.
 *
 * The harvester is owned by `@newrelic/video-core/connectedDeviceAgent.js` as a module
 * singleton (`connectedDeviceAnalyticsHarvester`) — this class never constructs or
 * touches a harvester directly. Routing decisions happen inside
 * `recordEvent.js` based on `att.src`.
 *
 * Mirrors `VegaTracker` from `@newrelic/video-html5` and
 * `@newrelic/video-videojs`. Customers pick the package matching their
 * player; all three ship the same `att.src='Vega'` contract to the mobile
 * collector.
 *
 * @example
 * import { VegaTracker } from '@newrelic/video-shaka';
 *
 * const tracker = new VegaTracker(shakaPlayer, {
 *   info: {
 *     accountId: '<NR account id>',
 *     applicationToken: '<NR app token>',
 *     endpoint: 'US' // 'US' | 'EU' | 'staging'
 *   },
 *   config: {
 *     qoeAggregate: true,
 *     qoeIntervalFactor: 5
 *   }
 * });
 */
export default class VegaTracker extends ShakaTracker {
  constructor(player, options) {
    // Single src injection. The class always wins; a customer-supplied
    // options.src is silently overwritten.
    super(player, { ...options, src: 'Vega' });
  }

  /**
   * Override the inherited `getHarvester()` (which returns the Browser
   * harvester) with the Vega harvester. Drives `videotracker.js`'s QoE-drain
   * wiring through the connected-device pipeline so Vega QoE updates land in
   * the Vega buffer, not the Browser one.
   */
  getHarvester() {
    return getRegisteredHarvester('Vega');
  }

  getTrackerName() {
    return 'shaka';
  }

  getTrackerVersion() {
    return version;
  }

  /**
   * Strip browser-only fields that may appear via Kepler's polyfills.
   * `att.src = 'Vega'` is set by the inherited `VideoTracker.getAttributes`
   * via `this._src`, not here.
   */
  getAttributes(att, eventType) {
    att = super.getAttributes(att, eventType);
    delete att.pageUrl;
    delete att.isBackgroundEvent;
    return att;
  }
}
