// Mock for @newrelic/video-core to make tests run
class MockVideoTracker {
  constructor(player, options) {
    this.player = player;
    this.options = options;
    this.tag = {
      addEventListener: jest.fn(),
      removeEventListener: jest.fn()
    };
  }

  // Mock all the methods that ShakaTracker calls on parent
  sendDownload() {}
  sendRequest() {}
  sendResume() {}
  sendStart() {}
  sendPause() {}
  sendSeekStart() {}
  sendSeekEnd() {}
  sendBufferStart() {}
  sendBufferEnd() {}
  sendRenditionChanged() {}
  sendError() {}
  sendEnd() {}

  // Mock the setPlayer method that's called by ShakaTracker
  setPlayer(player, tag) {
    this.player = player;
    this.tag = tag || this.tag;
  }
}

// Add the setPlayer method to the prototype for proper inheritance
MockVideoTracker.prototype.setPlayer = function(player, tag) {
  this.player = player;
  this.tag = tag || this.tag;
};

const mockCore = {
  addTracker: jest.fn(),
};

const mockLog = {
  debugCommonVideoEvents: jest.fn(),
};

const nrvideo = {
  VideoTracker: MockVideoTracker,
  Core: mockCore,
  Log: mockLog,
  ShakaTracker: null // Will be set by the actual module
};

module.exports = nrvideo;