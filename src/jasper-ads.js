import * as nrvideo from "newrelic-video-core";
import { version } from "../package.json";

export default class JasperAdsTracker extends nrvideo.VideoTracker {
  getPlayerName() {
    return "IMA";
  }
  
  getTrackerName() {
    return "IMATracker";
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

  getAdPosition() {
    return this.adPosition;
  }

  getAdQuartile() {
    return this.adQuartile;
  }

  getBitrate () {
    return this.adBitrate;
  }
}
