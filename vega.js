// Filesystem-resolution shim for bundlers that don't honor `package.json`
// `exports` (e.g. Metro < 0.80). Modern bundlers resolve
// `@newrelic/video-shaka/vega` via the `exports` map; this file gives older
// Node-style resolvers a path that exists on disk.
module.exports = require('./dist/cjs/vega/index.js');
