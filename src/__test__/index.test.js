import * as nrvideo from "newrelic-video-core";
import Tracker from "../tracker";

const exportedModule = require("../index");

describe("nrvideo ShakaTracker Assignment", () => {
  it("should assign Tracker to nrvideo.ShakaTracker", () => {
    expect(nrvideo.ShakaTracker).toBe(Tracker);
  });

  it("should export the modified nrvideo object", () => {
    expect(exportedModule).toBe(nrvideo);
  });
});