import nrvideo from '@newrelic/video-core'
import { version } from '../package.json';

export default class ShakaTracker extends nrvideo.VideoTracker {
  setPlayer(player, tag) {
    if (!tag && player.getMediaElement) tag = player.getMediaElement();
    nrvideo.VideoTracker.prototype.setPlayer.call(this, player, tag);
    nrvideo.Core.addTracker(this);
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
    return this.player.getStats().streamBandwidth;
  }

  getRenditionName() {
    return this.getTrack().label;
  }

  getRenditionBitrate() {
    return this.getTrack().bandwidth;
  }

  getRenditionWidth() {
    return this.getTrack().width;
  }

  getRenditionHeight() {
    return this.getTrack().height;
  }

  getPlayerVersion() {
    return this.Player?.version;
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

    this.onLoadStartListener = this.onDownload.bind(this);
    this.onLoadedMetadataListener = this.onDownload.bind(this);
    this.onLoadedDataListener = this.onDownload.bind(this);
    this.onPlayListener = this.onPlay.bind(this);
    this.onPlayingListener = this.onPlaying.bind(this);
    this.onPauseListener = this.onPause.bind(this);
    this.onSeekingListener = this.onSeeking.bind(this);
    this.onSeekedListener = this.onSeeked.bind(this);
    this.onErrorListener = this.onError.bind(this);
    this.onEndedListener = this.onEnded.bind(this);
    this.onBufferingListener = this.onBuffering.bind(this);
    this.onAdaptationListener = this.onAdaptation.bind(this);

    this.tag.addEventListener('loadstart', this.onLoadStartListener);
    this.tag.addEventListener('loadedmetadata', this.onLoadedMetadataListener);
    this.tag.addEventListener('loadeddata', this.onLoadedDataListener);
    this.tag.addEventListener('play', this.onPlayListener);
    this.tag.addEventListener('playing', this.onPlayingListener);
    this.tag.addEventListener('pause', this.onPauseListener);
    this.tag.addEventListener('seeking', this.onSeekingListener);
    this.tag.addEventListener('seeked', this.onSeekedListener);
    this.tag.addEventListener('ended', this.onEndedListener);
    this.tag.addEventListener('error', this.onErrorListener);

    this.player.addEventListener('buffering', this.onBufferingListener);
    this.player.addEventListener('adaptation', this.onAdaptationListener);
  }

  unregisterListeners() {
    this.tag.removeEventListener('loadstart', this.onLoadStartListener);
    this.tag.removeEventListener('loadedmetadata', this.onLoadedMetadataListener);
    this.tag.removeEventListener('loadeddata', this.onLoadedDataListener);
    this.tag.removeEventListener('play', this.onPlayListener);
    this.tag.removeEventListener('playing', this.onPlayingListener);
    this.tag.removeEventListener('pause', this.onPauseListener);
    this.tag.removeEventListener('seeking', this.onSeekingListener);
    this.tag.removeEventListener('seeked', this.onSeekedListener);
    this.tag.removeEventListener('ended', this.onEndedListener);
    this.tag.removeEventListener('error', this.onErrorListener);

    this.player.removeEventListener('buffering', this.onBufferingListener);
    this.player.removeEventListener('adaptation', this.onAdaptationListener);
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
    const error = e.detail;
    const errorCode = error.code;
    const errorMessage = error.message;
    this.sendError({ errorCode, errorMessage });
  }

  onEnded() {
    this.sendEnd();
  }
}
