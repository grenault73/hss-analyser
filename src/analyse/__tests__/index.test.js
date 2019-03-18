describe("analyse - analyseManifest", () => {
  beforeEach(() => {
    jest.resetModules();
  });

  it("should throw if no SmoothStreamingMedia", () => {
    const analyseManifest = require("../index").default;
    expect(() => analyseManifest(undefined))
      .toThrowError("No SmoothStreamingMedia or StreamIndex in manifest.");
  })
  it("should throw if no StreamIndex", () => {
    const analyseManifest = require("../index").default;
    expect(() => analyseManifest({}))
      .toThrowError("No SmoothStreamingMedia or StreamIndex in manifest.");

  })
  it("should throw if no DVRWindowLength", () => {
    const analyseManifest = require("../index").default;
    expect(() => analyseManifest({ $: { IsLive: "TRUE" }, StreamIndex: {} }))
      .toThrowError("Content is not live.");
  })
  it("should throw if no live content", () => {
    const analyseManifest = require("../index").default;
    expect(() => analyseManifest({ $: { IsLive: "FALSE" }, StreamIndex: {} }))
      .toThrowError("Content is not live.");
  })
  it("should throw if getDvrDefectInfos throws", () => {
    const mockGetDvrDefectInfos = jest.fn(function() { throw new Error("error"); });
    jest.mock("../dvrWindow", () => ({
      __esModule: true,
      default: mockGetDvrDefectInfos,
    }));
    const analyseManifest = require("../index").default;
    expect(() => analyseManifest({ $: { IsLive: "TRUE", DVRWindowLength: 2 }, StreamIndex: {} }))
      .toThrowError("error");
    expect(mockGetDvrDefectInfos).toHaveBeenCalledTimes(1);
  })

  it("should return defect infos", () => {
    const mockGetDvrDefectInfos = jest.fn(() => ([]));
    jest.mock("../dvrWindow", () => ({
      __esModule: true,
      default: mockGetDvrDefectInfos,
    }));
    const analyseManifest = require("../index").default;
    expect(analyseManifest({ $: { IsLive: "TRUE", DVRWindowLength: 2 }, StreamIndex: {} }))
      .toEqual({ defectInfos: { dvrDefectInfos: [] } });
    expect(mockGetDvrDefectInfos).toHaveBeenCalledTimes(1);
  })
});
