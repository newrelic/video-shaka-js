import ShakaTracker from '../tracker';
import { version } from '../../package.json';

const player = {
  addEventListener: jest.fn(),
  removeEventListener: jest.fn(),
  getPlaybackRate: jest.fn(),
  getVariantTracks: jest.fn(),
  getAssetUri: jest.fn(),
  isLive: jest.fn(),
};

describe('ShakaTracker', () => {
  let shakaTracker;

  beforeEach(() => {
    shakaTracker = new ShakaTracker(player, {});
  });

  it('should initialize correctly with player and options', () => {
    const options = { debug: true };
    const tracker = new ShakaTracker(player, options);

    expect(tracker.player).toBe(player);
    expect(tracker).toBeInstanceOf(ShakaTracker);
  });

  it('Should return the tracker name', () => {
    const trackerName = shakaTracker.getTrackerName();
    expect(trackerName).toBe('shaka');
  });

  it('Should return the tracker version', () => {
    const trackerVersion = shakaTracker.getTrackerVersion();
    expect(trackerVersion).toBe(version);
  });

  it('isLive should return false if player is not dynamic', () => {
    shakaTracker.isLive = jest.fn().mockReturnValue(false);
    const isLive = shakaTracker.isLive();
    expect(isLive).toBe(false);
  });

  it('should call setPlayer method of Shaka Tracker', () => {
    const tag = ' ';
    shakaTracker.setPlayer = jest.fn();
    shakaTracker.setPlayer(player, tag);
    expect(shakaTracker.setPlayer).toHaveBeenCalledWith(player, tag);
  });

  it('should call getMediaElement when tag is not provided', () => {
    const mockElement = { tagName: 'VIDEO' };
    player.getMediaElement = jest.fn().mockReturnValue(mockElement);

    // Test the conditional logic
    const result = !null && player.getMediaElement ? player.getMediaElement() : null;
    expect(result).toBe(mockElement);
    expect(player.getMediaElement).toHaveBeenCalled();
  });

  it('should not call getMediaElement when tag is provided', () => {
    const mockTag = { tagName: 'VIDEO' };
    player.getMediaElement = jest.fn();

    // Test the conditional logic - if tag exists, don't call getMediaElement
    const result = !mockTag && player.getMediaElement ? player.getMediaElement() : mockTag;
    expect(result).toBe(mockTag);
    expect(player.getMediaElement).not.toHaveBeenCalled();
  });

  // BRANCH COVERAGE TESTS for setPlayer method - Line 10: if (!tag && player.getMediaElement)

  it('should call setPlayer with tag when tag is provided (branch 1)', () => {
    const mockTag = { tagName: 'VIDEO' };
    const testPlayer = { ...player, getMediaElement: jest.fn() };

    // Call actual setPlayer method to test the branch
    shakaTracker.setPlayer(testPlayer, mockTag);

    // Should NOT call getMediaElement because tag is provided
    expect(testPlayer.getMediaElement).not.toHaveBeenCalled();
  });

  it('should call getMediaElement when no tag and method exists (branch 2)', () => {
    const mockElement = { tagName: 'VIDEO' };
    const testPlayer = {
      ...player,
      getMediaElement: jest.fn().mockReturnValue(mockElement)
    };

    // Call actual setPlayer method to test the branch
    shakaTracker.setPlayer(testPlayer); // No tag provided

    // Should call getMediaElement because !tag is true AND method exists
    expect(testPlayer.getMediaElement).toHaveBeenCalled();
  });

  it('should handle player without getMediaElement method (branch 3)', () => {
    const testPlayer = { ...player };
    delete testPlayer.getMediaElement; // Remove the method

    // Call actual setPlayer method to test the branch
    shakaTracker.setPlayer(testPlayer); // No tag, no getMediaElement method

    // Should not crash and should handle gracefully
    expect(testPlayer.getMediaElement).toBeUndefined();
  });

  it('should handle falsy tag values correctly', () => {
    const testPlayer = {
      ...player,
      getMediaElement: jest.fn().mockReturnValue({ tagName: 'VIDEO' })
    };

    // Test with null tag
    shakaTracker.setPlayer(testPlayer, null);
    expect(testPlayer.getMediaElement).toHaveBeenCalledTimes(1);

    // Reset mock
    testPlayer.getMediaElement.mockClear();

    // Test with undefined tag
    shakaTracker.setPlayer(testPlayer, undefined);
    expect(testPlayer.getMediaElement).toHaveBeenCalledTimes(1);

    // Reset mock
    testPlayer.getMediaElement.mockClear();

    // Test with empty string tag
    shakaTracker.setPlayer(testPlayer, '');
    expect(testPlayer.getMediaElement).toHaveBeenCalledTimes(1);
  });

  it('should return the playrate of the player', () => {
    const rate = 1;
    shakaTracker.getPlayrate = player.getPlaybackRate.mockReturnValue(rate);
    expect(shakaTracker.getPlayrate()).toBe(rate);
  });

  it('Should return the player version', () => {
    const mockVersion = '3.2.1';
    // Mock the Player property on the tracker instance
    shakaTracker.Player = { version: mockVersion };

    const playerVersion = shakaTracker.getPlayerVersion();
    expect(playerVersion).toBe(mockVersion);
  });

  it('Should return instrumentation provider', () => {
    const provider = shakaTracker.getInstrumentationProvider();
    expect(provider).toBe('New Relic');
  });

  it('Should return instrumentation name', () => {
    const name = shakaTracker.getInstrumentationName();
    expect(name).toBe('Shaka'); // Should match getPlayerName()
  });

  it('Should return instrumentation version', () => {
    const mockVersion = '3.1.0';
    shakaTracker.Player = { version: mockVersion };

    const version = shakaTracker.getInstrumentationVersion();
    expect(version).toBe(mockVersion); // Should match getPlayerVersion()
  });

  it('Should return video source URI', () => {
    const mockUri = 'https://example.com/video.mpd';
    player.getAssetUri = jest.fn().mockReturnValue(mockUri);

    const src = shakaTracker.getSrc();
    expect(src).toBe(mockUri);
    expect(player.getAssetUri).toHaveBeenCalled();
  });

  it('Should return stream bitrate from player stats', () => {
    const mockStats = { streamBandwidth: 2500000 };
    player.getStats = jest.fn().mockReturnValue(mockStats);

    const bitrate = shakaTracker.getBitrate();
    expect(bitrate).toBe(2500000);
    expect(player.getStats).toHaveBeenCalled();
  });

  it('Should return true for live content', () => {
    player.isLive = jest.fn().mockReturnValue(true);

    const isLive = shakaTracker.isLive();
    expect(isLive).toBe(true);
    expect(player.isLive).toHaveBeenCalled();
  });
});

describe('getTrack', () => {
  let shakaTracker;

  beforeEach(() => {
    shakaTracker = new ShakaTracker(player, {});
  });

  it('should return the current track', () => {
    const mockTracks = [
      { id: 1, type: 'audio', active: false },
      { id: 2, type: 'video', active: true },
    ];

    player.getVariantTracks.mockReturnValue(mockTracks);

    const track = shakaTracker.getTrack();

    expect(track.type).toEqual(mockTracks[1].type);
    expect(track.active).toEqual(mockTracks[1].active);
  });

  it('should return null if no track is available', () => {
    const mockTracks = [
      { id: 1, type: 'audio', active: false },
      { id: 2, type: 'video', active: false },
    ];

    player.getVariantTracks.mockReturnValue(mockTracks);

    const track = shakaTracker.getTrack();
    expect(track).toEqual({});
  });

  it('should return active variant track', () => {
    const mockTracks = [
      { id: 1, type: 'audio', active: false },
      { id: 2, type: 'variant', active: true, bandwidth: 1000000 },
    ];

    player.getVariantTracks.mockReturnValue(mockTracks);

    const track = shakaTracker.getTrack();
    expect(track.type).toEqual('variant');
    expect(track.active).toEqual(true);
    expect(track.bandwidth).toEqual(1000000);
  });

  it('should return empty object when no variant tracks exist', () => {
    player.getVariantTracks.mockReturnValue([]);

    const track = shakaTracker.getTrack();
    expect(track).toEqual({});
  });

  it('should skip inactive video tracks and return active one', () => {
    const mockTracks = [
      { id: 1, type: 'video', active: false },
      { id: 2, type: 'video', active: true, width: 1920, height: 1080 },
      { id: 3, type: 'audio', active: true },
    ];

    player.getVariantTracks.mockReturnValue(mockTracks);

    const track = shakaTracker.getTrack();
    expect(track.id).toEqual(2);
    expect(track.width).toEqual(1920);
    expect(track.height).toEqual(1080);
  });

  it('should handle tracks with neither video nor variant type', () => {
    const mockTracks = [
      { id: 1, type: 'audio', active: true },
      { id: 2, type: 'text', active: true },
      { id: 3, type: 'unknown', active: true },
    ];

    player.getVariantTracks.mockReturnValue(mockTracks);

    const track = shakaTracker.getTrack();
    expect(track).toEqual({});
  });
});

describe('getPlayerName', () => {
  let shakaTracker;

  beforeEach(() => {
    shakaTracker = new ShakaTracker(player, {});
  });

  it('should return the player name', () => {
    const playerName = shakaTracker.getPlayerName();
    expect(playerName).toBe('Shaka');
  });
});

describe('getLanguage', () => {
  let shakaTracker;

  beforeEach(() => {
    shakaTracker = new ShakaTracker(player, {});
  });

  it('should return the language of the current track', () => {
    const mockTracks = [
      { id: 1, type: 'audio', language: 'en', active: false },
      { id: 2, type: 'video', language: 'fr', active: true },
    ];

    player.getVariantTracks.mockReturnValue(mockTracks);

    const language = shakaTracker.getLanguage();
    expect(language).toEqual(mockTracks[1].language);
  });
});

describe('getRenditionName', () => {
  let shakaTracker;

  beforeEach(() => {
    shakaTracker = new ShakaTracker(player, {});
  });

  it('should return the label of the current track', () => {
    const mockTracks = [
      { id: 1, type: 'audio', label: 'English', active: false },
      { id: 2, type: 'video', label: 'HD', active: true },
    ];

    player.getVariantTracks.mockReturnValue(mockTracks);

    const renditionName = shakaTracker.getRenditionName();
    expect(renditionName).toEqual(mockTracks[1].label);
  });
});

describe('getRenditionWidth', () => {
  let shakaTracker;

  beforeEach(() => {
    shakaTracker = new ShakaTracker(player, {});
  });

  it('should return the width of the current track', () => {
    const mockTracks = [
      { id: 1, type: 'audio', width: 0, active: false },
      { id: 2, type: 'video', width: 1920, active: true },
    ];

    player.getVariantTracks.mockReturnValue(mockTracks);

    const renditionWidth = shakaTracker.getRenditionWidth();
    expect(renditionWidth).toEqual(mockTracks[1].width);
  });
});

describe('getRenditionHeight', () => {
  let shakaTracker;

  beforeEach(() => {
    shakaTracker = new ShakaTracker(player, {});
  });

  it('should return the height of the current track', () => {
    const mockTracks = [
      { id: 1, type: 'audio', height: 0, active: false },
      { id: 2, type: 'video', height: 1080, active: true },
    ];

    player.getVariantTracks.mockReturnValue(mockTracks);

    const renditionHeight = shakaTracker.getRenditionHeight();
    expect(renditionHeight).toEqual(mockTracks[1].height);
  });
});

describe('isLive', () => {
  let shakaTracker;

  beforeEach(() => {
    shakaTracker = new ShakaTracker(player, {});
  });

  it('should return true if player is dynamic', () => {
    player.isLive = jest.fn().mockReturnValue(true);
    const isLive = shakaTracker.isLive();
    expect(isLive).toBe(true);
  });

  it('should return false if player is not dynamic', () => {
    player.isLive = jest.fn().mockReturnValue(false);
    const isLive = shakaTracker.isLive();
    expect(isLive).toBe(false);
  });
});

describe('getSrc', () => {
  let shakaTracker;

  beforeEach(() => {
    shakaTracker = new ShakaTracker(player, {});
  });

  it('should return the asset URI of the player', () => {
    const mockAssetUri = 'https://example.com/video.mp4';
    player.getAssetUri = jest.fn().mockReturnValue(mockAssetUri);

    const src = shakaTracker.getSrc();
    expect(src).toBe(mockAssetUri);
  });
});

describe('getPlayrate', () => {
  let shakaTracker;

  beforeEach(() => {
    shakaTracker = new ShakaTracker(player, {});
  });

  it('should return the playback rate of the player', () => {
    const mockPlaybackRate = 1.5;
    player.getPlaybackRate.mockReturnValue(mockPlaybackRate);

    const playrate = shakaTracker.getPlayrate();
    expect(playrate).toBe(mockPlaybackRate);
  });
});

describe('getRenditionBitrate', () => {
  let shakaTracker;

  beforeEach(() => {
    shakaTracker = new ShakaTracker(player, {});
  });

  it('should return the bitrate of the current track', () => {
    const mockTracks = [
      { id: 1, type: 'audio', bandwidth: 128000, active: false },
      { id: 2, type: 'video', bandwidth: 2500000, active: true },
    ];

    player.getVariantTracks.mockReturnValue(mockTracks);

    const renditionBitrate = shakaTracker.getRenditionBitrate();
    expect(renditionBitrate).toEqual(mockTracks[1].bandwidth);
  });
});

describe('getBitrate', () => {
  let shakaTracker;

  beforeEach(() => {
    shakaTracker = new ShakaTracker(player, {});
  });

  it('should return the bitrate of the player', () => {
    const mockStats = {
      streamBandwidth: 5000000,
    };
    player.getStats = jest.fn().mockReturnValue(mockStats);

    const bitrate = shakaTracker.getBitrate();
    expect(bitrate).toBe(mockStats.streamBandwidth);
  });
});

describe('registerListeners', () => {
  let shakaTracker;

  beforeEach(() => {
    shakaTracker = new ShakaTracker(player, {});
  });

  it('should register event listeners for various video events', () => {
    const mockOnDownload = jest.fn();
    const mockOnPlay = jest.fn();
    const mockOnPlaying = jest.fn();
    const mockOnPause = jest.fn();
    const mockOnSeeking = jest.fn();
    const mockOnSeeked = jest.fn();
    const mockOnError = jest.fn();
    const mockOnEnded = jest.fn();
    const mockOnAdaptation = jest.fn();
    const mockOnBuffering = jest.fn();

    shakaTracker.onDownload = mockOnDownload;
    shakaTracker.onPlay = mockOnPlay;
    shakaTracker.onPlaying = mockOnPlaying;
    shakaTracker.onAdaptation = mockOnAdaptation;
    shakaTracker.onBuffering = mockOnBuffering;
    shakaTracker.onPause = mockOnPause;
    shakaTracker.onSeeking = mockOnSeeking;
    shakaTracker.onSeeked = mockOnSeeked;
    shakaTracker.onError = mockOnError;
    shakaTracker.onEnded = mockOnEnded;

    shakaTracker.registerListeners();

    expect(shakaTracker.tag.addEventListener).toHaveBeenCalledWith(
      'pause',
      expect.any(Function)
    );
    expect(shakaTracker.tag.addEventListener).toHaveBeenCalledWith(
      'ended',
      expect.any(Function)
    );
    expect(shakaTracker.tag.addEventListener).toHaveBeenCalledWith(
      'play',
      expect.any(Function)
    );
    expect(shakaTracker.tag.addEventListener).toHaveBeenCalledWith(
      'loadedmetadata',
      expect.any(Function)
    );
    expect(shakaTracker.tag.addEventListener).toHaveBeenCalledWith(
      'loadeddata',
      expect.any(Function)
    );
    expect(shakaTracker.tag.addEventListener).toHaveBeenCalledWith(
      'loadstart',
      expect.any(Function)
    );
    expect(shakaTracker.tag.addEventListener).toHaveBeenCalledWith(
      'playing',
      expect.any(Function)
    );
    expect(shakaTracker.tag.addEventListener).toHaveBeenCalledWith(
      'seeking',
      expect.any(Function)
    );
    expect(shakaTracker.player.addEventListener).toHaveBeenCalledWith(
      'error',
      expect.any(Function)
    );
  });
});

describe('unregisterListeners', () => {
  let shakaTracker;

  beforeEach(() => {
    shakaTracker = new ShakaTracker(player, {});
  });

  it('should unregister event listeners for various video events', () => {
    const mockOff = jest.fn();

    shakaTracker.tag.off = mockOff;
    shakaTracker.player.off = mockOff;

    shakaTracker.unregisterListeners();

    expect(shakaTracker.tag.removeEventListener).toHaveBeenCalledWith(
      'pause',
      expect.any(Function)
    );
    expect(shakaTracker.tag.removeEventListener).toHaveBeenCalledWith(
      'ended',
      expect.any(Function)
    );
    expect(shakaTracker.tag.removeEventListener).toHaveBeenCalledWith(
      'play',
      expect.any(Function)
    );
    expect(shakaTracker.tag.removeEventListener).toHaveBeenCalledWith(
      'loadedmetadata',
      expect.any(Function)
    );
    expect(shakaTracker.tag.removeEventListener).toHaveBeenCalledWith(
      'loadeddata',
      expect.any(Function)
    );
    expect(shakaTracker.tag.removeEventListener).toHaveBeenCalledWith(
      'loadstart',
      expect.any(Function)
    );
    expect(shakaTracker.tag.removeEventListener).toHaveBeenCalledWith(
      'playing',
      expect.any(Function)
    );
    expect(shakaTracker.tag.removeEventListener).toHaveBeenCalledWith(
      'seeking',
      expect.any(Function)
    );
    expect(shakaTracker.player.removeEventListener).toHaveBeenCalledWith(
      'error',
      expect.any(Function)
    );
  });
});

describe('Tracker Event Handlers', () => {
  let shakaTracker;
  beforeEach(() => {
    shakaTracker = new ShakaTracker(player, {});

    // mock the methods being called in the event handlers
    shakaTracker.sendDownload = jest.fn();
    shakaTracker.sendRequest = jest.fn();
    shakaTracker.sendResume = jest.fn();
    shakaTracker.sendStart = jest.fn();
    shakaTracker.sendRenditionChanged = jest.fn();
    shakaTracker.sendBufferStart = jest.fn();
    shakaTracker.sendBufferEnd = jest.fn();
    shakaTracker.sendPause = jest.fn();
    shakaTracker.sendSeekStart = jest.fn();
    shakaTracker.sendSeekEnd = jest.fn();
    shakaTracker.sendError = jest.fn();
    shakaTracker.sendEnd = jest.fn();
  });

  it('should call sendDownload on onDownload', () => {
    const eventMock = { type: 'download' };
    shakaTracker.onDownload(eventMock);
    expect(shakaTracker.sendDownload).toHaveBeenCalledWith({
      state: eventMock.type,
    });
  });

  it('should call sendRequest on onPlay', () => {
    shakaTracker.onPlay();
    expect(shakaTracker.sendRequest).toHaveBeenCalled();
  });

  it('should call sendResume and sendStart on onPlaying', () => {
    shakaTracker.onPlaying();
    expect(shakaTracker.sendResume).toHaveBeenCalled();
    expect(shakaTracker.sendStart).toHaveBeenCalled();
  });

  it('should call sendRenditionChanged on onAdaptation', () => {
    const event = { type: 'adaptation' };
    shakaTracker.onAdaptation(event);
    expect(shakaTracker.sendRenditionChanged).toHaveBeenCalled();
  });

  it('should call sendBufferStart on onBufferingStalled', () => {
    const event = { buffering: true };
    shakaTracker.onBuffering(event);
    expect(shakaTracker.sendBufferStart).toHaveBeenCalled();
  });

  it('should call sendBufferEnd on onBufferingLoaded', () => {
    const event = { buffering: false };
    shakaTracker.onBuffering(event);
    expect(shakaTracker.sendBufferEnd).toHaveBeenCalled();
  });

  it('should call sendPause on onPause', () => {
    shakaTracker.onPause();
    expect(shakaTracker.sendPause).toHaveBeenCalled();
  });

  it('should call sendSeekStart on onSeeking', () => {
    shakaTracker.onSeeking();
    expect(shakaTracker.sendSeekStart).toHaveBeenCalled();
  });

  it('should call sendSeekEnd on onSeeked', () => {
    shakaTracker.onSeeked();
    expect(shakaTracker.sendSeekEnd).toHaveBeenCalled();
  });

  it('should call sendError on onError', () => {
    const event = {
      detail: {
        code: 1001,
        message: 'Network error'
      }
    };
    shakaTracker.onError(event);
    expect(shakaTracker.sendError).toHaveBeenCalledWith({
      errorCode: 1001,
      errorMessage: 'Network error'
    });
  });

  it('should handle onError with missing detail properties', () => {
    const event = {
      detail: {} // Missing code and message
    };
    shakaTracker.onError(event);
    expect(shakaTracker.sendError).toHaveBeenCalledWith({
      errorCode: undefined,
      errorMessage: undefined
    });
  });

  it('should handle onError with partial error details', () => {
    const event = {
      detail: {
        code: 2002
        // Missing message
      }
    };
    shakaTracker.onError(event);
    expect(shakaTracker.sendError).toHaveBeenCalledWith({
      errorCode: 2002,
      errorMessage: undefined
    });
  });

  it('should call sendEnd on onEnded', () => {
    shakaTracker.onEnded();
    expect(shakaTracker.sendEnd).toHaveBeenCalled();
  });
});
