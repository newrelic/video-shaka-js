# CHANGELOG

## [4.0.1] - 2025-11-13

### Enhancements

- Improved error logging by mapping Shaka errors to the following attributes: `errorCode`, `errorPlatformCode`, `errorMessage`, `errorStackTrace`, `errorSeverity`.

### Updates

- Attached the error `EventListener` to the player instead of its tag, following Shaka's specifications, to fix the `CONTENT_ERROR` event.

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
