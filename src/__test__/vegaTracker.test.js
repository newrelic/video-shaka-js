import VegaTracker from '../vegaTracker';
import { getRegisteredHarvester } from '@newrelic/video-core';
import { version } from '../../package.json';

jest.mock('@newrelic/video-core', () => ({
  __esModule: true,
  default: {
    VideoTracker: class VideoTracker {
      constructor(player, options) {
        this.player = player;
        this.tag = player;
        this._src = null;
        if (options && options.src !== undefined) this._src = options.src;
      }
      setPlayer(player, tag) {
        this.player = player;
        this.tag = tag || player;
      }
      getAttributes(att) {
        return { ...att, src: this._src || 'Browser' };
      }
      sendDownload() {}
      sendRequest() {}
      sendResume() {}
      sendStart() {}
      sendPause() {}
      sendSeekStart() {}
      sendSeekEnd() {}
      sendError() {}
      sendEnd() {}
      sendRenditionChanged() {}
    },
    Core: { addTracker: jest.fn() },
    Log: { debugCommonVideoEvents: jest.fn() },
  },
  getRegisteredHarvester: jest.fn(),
}));

const mockVegaHarvester = { addEvent: jest.fn() };

const player = {
  on: jest.fn(),
  off: jest.fn(),
  getMediaElement: jest.fn().mockReturnValue(null),
  getAssetUri: jest.fn(),
  getStats: jest.fn().mockReturnValue({}),
  isLive: jest.fn(),
  getPlaybackRate: jest.fn(),
  getVariantTracks: jest.fn().mockReturnValue([]),
};

describe('VegaTracker', () => {
  let tracker;

  beforeEach(() => {
    jest.clearAllMocks();
    getRegisteredHarvester.mockReturnValue(mockVegaHarvester);
    tracker = new VegaTracker(player, {});
  });

  describe('constructor', () => {
    it('sets _src to Vega', () => {
      expect(tracker._src).toBe('Vega');
    });

    it('preserves customer options alongside src injection', () => {
      const t = new VegaTracker(player, { customData: { contentTitle: 'Test' } });
      expect(t._src).toBe('Vega');
    });

    it('overwrites any customer-supplied src with Vega', () => {
      const t = new VegaTracker(player, { src: 'Browser' });
      expect(t._src).toBe('Vega');
    });
  });

  describe('getTrackerName', () => {
    it('returns shaka', () => {
      expect(tracker.getTrackerName()).toBe('shaka');
    });
  });

  describe('getTrackerVersion', () => {
    it('returns package version', () => {
      expect(tracker.getTrackerVersion()).toBe(version);
    });
  });

  describe('getHarvester', () => {
    it('calls getRegisteredHarvester with Vega key', () => {
      tracker.getHarvester();
      expect(getRegisteredHarvester).toHaveBeenCalledWith('Vega');
    });

    it('returns the Vega harvester', () => {
      const harvester = tracker.getHarvester();
      expect(harvester).toBe(mockVegaHarvester);
    });
  });

  describe('getAttributes', () => {
    it('strips pageUrl from attributes', () => {
      const att = { pageUrl: 'https://example.com', actionName: 'CONTENT_START', src: 'Vega' };
      const result = tracker.getAttributes(att, 'CONTENT_START');
      expect(result.pageUrl).toBeUndefined();
    });

    it('strips isBackgroundEvent from attributes', () => {
      const att = { isBackgroundEvent: false, actionName: 'CONTENT_START', src: 'Vega' };
      const result = tracker.getAttributes(att, 'CONTENT_START');
      expect(result.isBackgroundEvent).toBeUndefined();
    });

    it('strips both pageUrl and isBackgroundEvent together', () => {
      const att = {
        pageUrl: 'https://example.com',
        isBackgroundEvent: true,
        actionName: 'CONTENT_HEARTBEAT',
        contentBitrate: 1234,
        src: 'Vega',
      };
      const result = tracker.getAttributes(att, 'CONTENT_HEARTBEAT');
      expect(result.pageUrl).toBeUndefined();
      expect(result.isBackgroundEvent).toBeUndefined();
    });

    it('preserves all other attributes', () => {
      const att = {
        pageUrl: 'https://example.com',
        isBackgroundEvent: false,
        actionName: 'CONTENT_HEARTBEAT',
        contentBitrate: 5000,
        userId: 'user-1',
        src: 'Vega',
      };
      const result = tracker.getAttributes(att, 'CONTENT_HEARTBEAT');
      expect(result.actionName).toBe('CONTENT_HEARTBEAT');
      expect(result.contentBitrate).toBe(5000);
      expect(result.userId).toBe('user-1');
      expect(result.src).toBe('Vega');
    });
  });
});
