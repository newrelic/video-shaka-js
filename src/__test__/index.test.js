import ShakaTracker from "../tracker";
import VegaTracker from "../vegaTracker";

const exportedModule = require("../index");

describe("ShakaTracker Module Export", () => {
  it("should export ShakaTracker as default", () => {
    expect(exportedModule.default).toBe(ShakaTracker);
  });

  it("should export ShakaTracker as named export", () => {
    expect(exportedModule.ShakaTracker).toBe(ShakaTracker);
  });

  it("should export VegaTracker as named export", () => {
    expect(exportedModule.VegaTracker).toBe(VegaTracker);
  });
});
