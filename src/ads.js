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

    const adManager = this.player.getAdManager();
    adManager.addEventListener("ad-started", this.onStarted.bind(this));
    adManager.addEventListener("ad-complete", this.onComplete.bind(this));
    adManager.addEventListener("ad-progress", this.onTime.bind(this));
    adManager.addEventListener("ad-impression", this.onImpression.bind(this));
    adManager.addEventListener("ad-resumed", this.onPlay.bind(this));
    adManager.addEventListener("ad-paused", this.onPause.bind(this));
    adManager.addEventListener("ad-skipped", this.onSkipped.bind(this));
    adManager.addEventListener("ad-clicked", this.onClick.bind(this));
  }

  unregisterListeners() {
    const adManager = this.player.getAdManager();

    adManager.removeEventListener("ad-started", this.onStarted);
    adManager.removeEventListener("ad-complete", this.onComplete);
    adManager.removeEventListener("ad-progress", this.onTime);
    adManager.removeEventListener("ad-impression", this.onImpression);
    adManager.removeEventListener("ad-resumed", this.onPlay);
    adManager.removeEventListener("ad-paused", this.onPause);
    adManager.removeEventListener("ad-skipped", this.onSkipped);
    adManager.removeEventListener("ad-clicked", this.onClick);
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
