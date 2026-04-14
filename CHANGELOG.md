# CHANGELOG

## [4.1.1] - 2026-04-08

### Changed

- **`getNetworkDownloadBitrate()`:** Updated to calculate throughput manually using `(bytesDownloaded × 8) / totalTime` where `totalTime` includes `playTime + pauseTime + bufferingTime`. This provides more accurate network download bitrate measurements based on actual data transfer across the entire session duration.
- **`getManifestBitrate()`:** Simplified to use `track.bandwidth` directly instead of calculating `videoBandwidth + audioBandwidth`. The `bandwidth` property already contains the total bitrate (video + audio combined) as declared in the manifest, making the calculation cleaner and more reliable.
- **`getContentBitratePlayback()`:** Renamed method that now returns `stats.streamBandwidth` instead of `track.videoBandwidth`, providing the current variant's total bitrate from the manifest for more accurate content bitrate tracking.

### Removed

- **`getRenditionBitrate()`:** Removed redundant method that was returning `track.bandwidth`, as this information is now better represented through other bitrate metrics.

### Updated

- **README.md:** Comprehensive update matching the Video.js tracker documentation style, including:
  - Added npm version and license badges
  - Enhanced feature highlights with clear descriptions
  - Restructured with table of contents for better navigation
  - Added two installation options (NPM/Yarn and direct script include)
  - Improved usage section with step-by-step instructions
  - Complete API reference with detailed method documentation
  - Bitrate metrics section explaining the three distinct metrics
  - Enhanced support section with multiple support channels


### Fixed

- **Tests:** Removed `getRenditionBitrate` test to match the implementation changes.

## [4.1.0] - 2026-03-09

### Added

- **New Bitrate Metrics:** Introduced three new bitrate attributes for granular playback observability:
  - `contentManifestBitrate` — Total variant bitrate (video + audio) as declared in the manifest, derived from `stats.streamBandwidth` (Indicated Bitrate).
  - `contentMeasuredBitrate` — Estimated network bandwidth measured by Shaka's ABR algorithm, derived from `stats.estimatedBandwidth` (Observed Bitrate).
  - `contentDownloadBitrate` — Effective download throughput in bits per second, calculated as `(bytesDownloaded × 8) / playTime`.

- **QoE (Quality of Experience) Support:** Added support for QoE aggregate events via `video-core`. The following KPIs are now tracked automatically when `qoeAggregate` is enabled in the config:
  - `startupTime` — Time from content request to content start (ms).
  - `peakBitrate` — Maximum `contentBitrate` observed during playback.
  - `averageBitrate` — Weighted average bitrate across playback.
  - `hadStartupFailure` — `true` if a content error occurred before content started.
  - `hadPlaybackFailure` — `true` if a content error occurred during playback.
  - `totalRebufferingTime` — Total time spent rebuffering (ms).
  - `rebufferingRatio` — Rebuffering time as a percentage of total playtime.
  - `totalPlaytime` — Total content playtime (ms).
  - `numberOfErrors` — Total number of errors during the session.

### Changed

- **`contentBitrate`:** Updated to use `track.videoBandwidth` (video-only bitrate), differentiating it from manifest and rendition bitrates which report combined video + audio bandwidth.
- **Shaka 5.x Compatibility:** Tracker is now compatible with both Shaka Player 4.x and 5.x:
  - `getPlayerVersion()` resolves version from `this.player.constructor.version` (4.x) with fallback to `shaka.Player.version` (5.x).
  - `onError()` handles both Shaka player errors (`e.detail`) and HTML video element errors (`e.target.error`).
  - Sample files updated: removed deprecated `shaka.polyfill.installAll()`, updated player instantiation to `new shaka.Player()` + `await player.attach(video)`.

### Updated

- **DATAMODEL.md:** Updated bitrate attribute definitions with precise sources and descriptions.
- **samples/hls.html:** Updated to use Shaka Player 5.0.4 with v5-compatible initialization.

## [4.0.1] - 2026-02-18

### Fixed

- **Content Bitrate Reporting:** Fixed `contentBitrate` to accurately report the actual bitrate of the currently playing video stream by using `streamBandwidth`

## [4.0.0] - 2025-07-28

### Changed

- **Standalone Agent:** This tracker now operates independently with its own authorization details, removing the dependency on a browser agent.

## [3.1.0] - 2025-05-27

### Enhancements

- **Publishing to npm:** The package can now be published to npm, making it easily accessible.

### Build

- **Distribution Formats:** Added `cjs`, `esm`, and `umd` builds to the `dist` folder, ensuring compatibility with CommonJS, ES Modules, and UMD module formats.

## [3.0.1] - 2025-04-22

- **Update:** The `errorName` attribute has been deprecated and `errorMessage` is introduced as its replacement.

## [3.0.0] - 2025/02/21

### New Event Type Introduced [VideoAction, VideoErrorAction, VideoAdAction, VideoCustomAction]

- PageAction Deprecated.
- Some New Attributes Introduced.

## [0.4.0] - 2024/10/07

### Update

- new Attributes added playerName, playerVersion and instrumentation attributes

## [0.3.0] - 2024/10/07

### Update

- Upgraded Shaka Player version `4.11.2`.

## [0.2.0] - 2017/11/28

### Lib

- Upgraded to use lib version `0.9.1+`.

## [0.1.0] -

- First Version
