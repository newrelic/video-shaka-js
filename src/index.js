import * as nrvideo from "newrelic-video-core";
import Tracker from "./tracker";
import AdsTracker from "./ads";

nrvideo.ShakaTracker = Tracker;
nrvideo.ShakaAdsTracker = AdsTracker;

module.exports = nrvideo;
