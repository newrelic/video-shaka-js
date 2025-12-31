import nrvideo from '@newrelic/video-core'
import Tracker from "../tracker";
import ShakaTracker from "../index";

describe("nrvideo ShakaTracker Assignment", () => {
  it("should assign Tracker to nrvideo.ShakaTracker", () => {
    // The ShakaTracker should be the same as our Tracker class
    expect(ShakaTracker).toBe(Tracker);
  });

  it("should export ShakaTracker as default export", () => {
    expect(ShakaTracker).toBe(Tracker);
    expect(typeof ShakaTracker).toBe('function');
  });
});