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

  it('should return the playrate of the player', () => {
    const rate = 1;
    shakaTracker.getPlayrate = player.getPlaybackRate.mockReturnValue(rate);
    expect(shakaTracker.getPlayrate()).toBe(rate);
  });

  it('Should return the player version', () => {
    const mockVersion = '3.2.1';
    global.shaka = {
      Player: {
        version: mockVersion,
      },
    };

    const playerVersion = shakaTracker.getPlayerVersion();
    expect(playerVersion).toBe(mockVersion);
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
      "error",
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
    const event = { detail: 'error' };
    shakaTracker.onError(event);
    expect(shakaTracker.sendError).toHaveBeenCalledWith(event.detail);
  });

  it('should call sendEnd on onEnded', () => {
    shakaTracker.onEnded();
    expect(shakaTracker.sendEnd).toHaveBeenCalled();
  });
});
