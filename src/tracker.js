import nrvideo from '@newrelic/video-core';
import { version } from '../package.json';

export default class ShakaTracker extends nrvideo.VideoTracker {
  constructor(player, options) {
    super(player, options);
    nrvideo.Core.addTracker(this, options);
  }
  setPlayer(player, tag) {
    if (!tag && player.getMediaElement) tag = player.getMediaElement();
    nrvideo.VideoTracker.prototype.setPlayer.call(this, player, tag);
  }

  getTrackerName() {
    return 'shaka';
  }

  getTrackerVersion() {
    return version;
  }

  getInstrumentationProvider() {
    return 'New Relic';
  }

  getInstrumentationName() {
    return this.getPlayerName();
  }

  getInstrumentationVersion() {
    return this.getPlayerVersion();
  }

  isLive() {
    return this.player.isLive();
  }

  getSrc() {
    return this.player.getAssetUri();
  }

  getPlayrate() {
    return this.player.getPlaybackRate();
  }

  getTrack() {
    var tracks = this.player.getVariantTracks();
    for (var i in tracks) {
      var track = tracks[i];
      if (
        track.active &&
        (track.type === 'video' || track.type === 'variant')
      ) {
        return track;
      }
    }
    return {};
  }

  getLanguage() {
    return this.getTrack().language;
  }

  getPlayerName() {
    return 'Shaka';
  }

  getBitrate() {
    return this.getContentBitratePlayback();
  }

  // Measures: Actual content consumption rate during playback
  getContentBitratePlayback() {
    try {
      // Get the current variant's bitrate from manifest (streamBandwidth)
      const stats = this.player.getStats();
      if (stats && stats.streamBandwidth && stats.streamBandwidth > 0) {
        return stats.streamBandwidth;
      }
    } catch (err) {}
    return null;
  }

  // Measures: Highest available bitrate from all variants in the manifest
  getManifestBitrate() {
    try {
      // Return highest available bitrate from all variants
      const tracks = this.player.getVariantTracks();
      if (tracks && tracks.length > 0) {
        return Math.max(...tracks.map((t) => t.bandwidth));
      }
    } catch (err) {}
    return null;
  }

  // Measures: Segment download bitrate (estimated bandwidth)
  getSegmentDownloadBitrate() {
    try {
      // Use estimatedBandwidth for measured bitrate
      const stats = this.player.getStats();
      if (stats && stats.estimatedBandwidth > 0) {
        return stats.estimatedBandwidth;
      }
    } catch (err) {}
    return null;
  }

  // Measures: Network download bitrate (calculated throughput from bytes and time)
  getNetworkDownloadBitrate() {
    try {
      const stats = this.player.getStats();

      // Calculate throughput manually: (bytesDownloaded * 8) / totalTime
      if (stats && stats.bytesDownloaded > 0) {
        // Use total elapsed time (playTime + pauseTime + bufferingTime)
        const totalTime = (stats.playTime || 0) + (stats.pauseTime || 0) + (stats.bufferingTime || 0);

        if (totalTime > 0) {
          // Convert bytes to bits (multiply by 8) and divide by time to get bits per second
          const throughput = (stats.bytesDownloaded * 8) / totalTime;
          return Math.round(throughput);
        }
      }
    } catch (err) {}
    return null;
  }

  getRenditionName() {
    return this.getTrack().label;
  }

  getRenditionWidth() {
    return this.getTrack().width;
  }

  getRenditionHeight() {
    return this.getTrack().height;
  }

  getPlayerVersion() {
    try {
      // Shaka 4.x: version on shaka.Player.version (static)
      if (this.player?.constructor?.version) {
        return this.player.constructor.version;
      }
      // Shaka 5.x: version may be on the prototype or global
      if (typeof shaka !== 'undefined' && shaka.Player?.version) {
        return shaka.Player.version;
      }
    } catch (err) {}
    return null;
  }

  registerListeners() {
    nrvideo.Log.debugCommonVideoEvents(this.tag);
    nrvideo.Log.debugCommonVideoEvents(this.player, [
      null,
      'buffering',
      'loading',
      'adaptation',
      'emsg',
      'trackschanged',
      'unloading',
      'expirationupdated',
      'largegap',
      'texttrackvisibility',
      'trackschanged',
    ]);

    // BIND LISTENER METHODS
    this.onPause = this.onPause.bind(this);
    this.onEnded = this.onEnded.bind(this);
    this.onPlay = this.onPlay.bind(this);
    this.onDownload = this.onDownload.bind(this);
    this.onPlaying = this.onPlaying.bind(this);
    this.onSeeking = this.onSeeking.bind(this);
    this.onSeeked = this.onSeeked.bind(this);
    this.onError = this.onError.bind(this);
    this.onBuffering = this.onBuffering.bind(this);
    this.onAdaptation = this.onAdaptation.bind(this);

    this.tag.addEventListener('pause', this.onPause);
    this.tag.addEventListener('ended', this.onEnded);
    this.tag.addEventListener('play', this.onPlay);
    this.tag.addEventListener('loadedmetadata', this.onDownload);
    this.tag.addEventListener('loadeddata', this.onDownload);
    this.tag.addEventListener('loadstart', this.onDownload);
    this.tag.addEventListener('playing', this.onPlaying);
    this.tag.addEventListener('seeking', this.onSeeking);
    this.tag.addEventListener('seeked', this.onSeeked);
    this.tag.addEventListener('error', this.onError);

    this.player.addEventListener('buffering', this.onBuffering);
    this.player.addEventListener('adaptation', this.onAdaptation);
  }

  unregisterListeners() {
    this.tag.removeEventListener('pause', this.onPause);
    this.tag.removeEventListener('ended', this.onEnded);
    this.tag.removeEventListener('play', this.onPlay);
    this.tag.removeEventListener('loadedmetadata', this.onDownload);
    this.tag.removeEventListener('loadeddata', this.onDownload);
    this.tag.removeEventListener('loadstart', this.onDownload);
    this.tag.removeEventListener('playing', this.onPlaying);
    this.tag.removeEventListener('seeking', this.onSeeking);
    this.tag.removeEventListener('seeked', this.onSeeked);
    this.tag.removeEventListener('error', this.onError);

    this.player.removeEventListener('buffering', this.onBuffering);
    this.player.removeEventListener('adaptation', this.onAdaptation);
  }

  onDownload(e) {
    this.sendDownload({ state: e.type });
  }

  onPlay() {
    this.sendRequest();
  }

  onPlaying() {
    this.sendResume();
    this.sendStart();
  }

  onAdaptation(e) {
    this.sendRenditionChanged();
  }

  onBuffering(e) {
    if (e.buffering) {
      this.sendBufferStart();
    } else {
      this.sendBufferEnd();
    }
  }

  onPause() {
    this.sendPause();
  }

  onSeeking() {
    this.sendSeekStart();
  }

  onSeeked() {
    this.sendSeekEnd();
  }

  onError(e) {
    // HTML video element errors use e.target.error
    // Shaka player errors use e.detail
    const error = e.detail || e.target?.error || {};
    const errorCode = error.code;
    const errorMessage = error.message;
    this.sendError({ errorCode, errorMessage });
  }

  onEnded() {
    this.sendEnd();
  }
}
