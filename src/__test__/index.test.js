import ShakaTracker from "../tracker";

const exportedModule = require("../index");

describe("ShakaTracker Module Export", () => {
  it("should export ShakaTracker as default", () => {
    expect(exportedModule.default).toBe(ShakaTracker);
  });
});