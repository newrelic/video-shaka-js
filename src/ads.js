import * as nrvideo from "newrelic-video-core";
import { version } from "../package.json";

export default class ShakaAdsTracker extends nrvideo.VideoTracker {
  getTrackerName() {
    return "shaka-ads";
  }

  getTrackerVersion() {
    return version;
  }

  getDuration() {
    return this.duration;
  }

  getSrc() {
    return this.resource;
  }

  getPlayhead() {
    return this.playhead;
  }

  getTitle() {
    return this.title;
  }

  getAdCreativeId() {
    return this._creativeId;
  }

  registerListeners() {
    nrvideo.Log.debugCommonVideoEvents(this.player, [
      null,
      "ad-started",
      "ad-complete",
      "ad-progress",
      "ad-impression",
      "ad-resumed",
      "ad-paused",
      "ad-skipped",
      "ad-clicked",
    ]);
    
    this.onStartedListener = this.onStarted.bind(this);
    this.onCompleteListener = this.onComplete.bind(this);
    this.onTimeListener = this.onTime.bind(this);
    this.onImpressionListener = this.onImpression.bind(this);
    this.onPlayListener = this.onPlay.bind(this);
    this.onPauseListener = this.onPause.bind(this);
    this.onSkippedListener = this.onSkipped.bind(this);
    this.onClickListener = this.onClick.bind(this);
    
    const adManager = this.player.getAdManager();
    adManager.addEventListener("ad-started", this.onStartedListener);
    adManager.addEventListener("ad-complete", this.onCompleteListener);
    adManager.addEventListener("ad-progress", this.onTimeListener);
    adManager.addEventListener("ad-impression", this.onImpressionListener);
    adManager.addEventListener("ad-resumed", this.onPlayListener);
    adManager.addEventListener("ad-paused", this.onPauseListener);
    adManager.addEventListener("ad-skipped", this.onSkippedListener);
    adManager.addEventListener("ad-clicked", this.onClickListener);
  }

  unregisterListeners() {
    const adManager = this.player.getAdManager();

    adManager.removeEventListener("ad-started", this.onStartedListener);
    adManager.removeEventListener("ad-complete", this.onCompleteListener);
    adManager.removeEventListener("ad-progress", this.onTimeListener);
    adManager.removeEventListener("ad-impression", this.onImpressionListener);
    adManager.removeEventListener("ad-resumed", this.onPlayListener);
    adManager.removeEventListener("ad-paused", this.onPauseListener);
    adManager.removeEventListener("ad-skipped", this.onSkippedListener);
    adManager.removeEventListener("ad-clicked", this.onClickListener);
  }

  onTime(event) {
    const adData = event.originalEvent.getAdData();
    this.playhead = adData.currentTime;
    this.duration = adData.duration;
  }

  onStarted(event) {
    this._creativeId = event.sdkAdObject.getCreativeId();
    this.resource = this._getClickThroughUrl(event.sdkAdObject);
    this.title = event.sdkAdObject.getTitle();

    this.sendRequest();
    this.sendStart();
  }

  onImpression(event) {
    this.resource = this._getClickThroughUrl(event.sdkAdObject);
    this.title = event.sdkAdObject.getTitle();
  }

  onPause(_event) {
    this.sendPause();
  }

  onPlay(_event) {
    this.sendResume();
  }

  onSkipped(_event) {
    this.sendEnd({ skipped: true });
    this.resetValues();
  }

  onComplete(_event) {
    this.sendEnd();
    this.resetValues();
  }

  onClick(event) {
    this.sendAdClick({ url: event.tag });
  }

  onError(event) {
    this.sendError({ errorMessage: event.message });
    this.sendEnd();
  }

  resetValues() {
    this.playhead = undefined;
    this.duration = undefined;
    this.resource = undefined;
    this.title = undefined;
    this._creativeId = undefined;
  }
  
  _getClickThroughUrl(googleImaAd) {
    return Object.values(googleImaAd)[0].clickThroughUrl;
  }
}
