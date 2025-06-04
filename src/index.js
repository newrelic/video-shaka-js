import * as nrvideo from "newrelic-video-core";
import Tracker from "./tracker";
import ShakaAdsTracker from "./shaka-ads";
import JasperAdsTracker from "./jasper-ads";

nrvideo.ShakaTracker = Tracker;
nrvideo.ShakaAdsTracker = ShakaAdsTracker;
nrvideo.JasperAdsTracker = JasperAdsTracker;

module.exports = nrvideo;
