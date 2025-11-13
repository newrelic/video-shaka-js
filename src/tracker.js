import nrvideo from '@newrelic/video-core';
import { version } from '../package.json';
import ShakaToNewRelicMapper from "./utils/shakaToNewRelicMapper";

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

    this.tag.addEventListener('pause', this.onPause.bind(this));
    this.tag.addEventListener('ended', this.onEnded.bind(this));
    this.tag.addEventListener('play', this.onPlay.bind(this));
    this.tag.addEventListener('loadedmetadata', this.onDownload.bind(this));
    this.tag.addEventListener('loadeddata', this.onDownload.bind(this));
    this.tag.addEventListener('loadstart', this.onDownload.bind(this));
    this.tag.addEventListener('playing', this.onPlaying.bind(this));
    this.tag.addEventListener('seeking', this.onSeeking.bind(this));
    this.tag.addEventListener('seeked', this.onSeeked.bind(this));

    this.player.addEventListener('error', this.onError.bind(this));
    this.player.addEventListener('buffering', this.onBuffering.bind(this));
    this.player.addEventListener('adaptation', this.onAdaptation.bind(this));
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
    this.tag.removeEventListener('ended', this.onEnded);

    this.player.removeEventListener('error', this.onError);
    this.player.removeEventListener('loadstart', this.onDownload);
    this.player.removeEventListener('loadedmetadata', this.onDownload);
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
    this.sendError(ShakaToNewRelicMapper.mapErrorAttributes(error));
  }

  onEnded() {
    this.sendEnd();
  }
}
