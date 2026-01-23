import nrvideo from '@newrelic/video-core';
import ShakaTracker from './tracker';

// Assign ShakaTracker to the nrvideo object
nrvideo.ShakaTracker = ShakaTracker;

// Export both for compatibility
module.exports = nrvideo;
module.exports.default = nrvideo;
