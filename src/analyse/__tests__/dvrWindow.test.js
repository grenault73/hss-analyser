describe("analyse - getDvrDefectInfos", () => {
  beforeEach(() => {
    jest.resetModules();
  });

  it("should throw when streamIndex is an empty array", () => {
    const streamIndex = [];
    const getDvrDefectInfos = require("../dvrWindow").default;
    expect(() => getDvrDefectInfos(streamIndex)).toThrowError("No stream index");
  });

  it("should do nothing when no video or audio track", () => {
    const streamIndex = [
      { $: { Type: "text" }, c: [] }
    ];
    const getDvrDefectInfos = require("../dvrWindow").default;
    expect(getDvrDefectInfos(streamIndex)).toEqual([]);
  });

  it("should do nothing when no content", () => {
    const streamIndex = [
      { $: { Type: "video" } }
    ];
    const getDvrDefectInfos = require("../dvrWindow").default;
    expect(getDvrDefectInfos(streamIndex)).toEqual([]);
  });

  it("should warn when no content range is empty", () => {
    const streamIndex = [
      { $: { Type: "video", TimeScale: 1 }, c: [
        { $: { d: 20 } }
      ] }
    ];
    const getDvrDefectInfos = require("../dvrWindow").default;
    const defectInfos = getDvrDefectInfos(streamIndex, 28800);
    const defect = defectInfos[0];
    expect(defect.defectType).toBe("NO_CONTENT");
  });

  it("should warn if presentation live gap too far from manifest time", () => {
    const now = Math.floor(Date.now() / 1000);
    const refTime = Math.floor(Date.UTC(2013, 5, 1, 0, 0, 0, 0) / 1000); // 04/01/2013
    const streamIndex = [
      { $: { Type: "video", TimeScale: 1, Name: "name" }, c: [
        { $ : { t: now - 28800 - 60 - refTime, d: 28800} } 
      ] }
    ];

    const spyDateNow = jest.spyOn(Date, "now").mockImplementation(() => now * 1000);
    spyDateNow.mockClear();

    const getDvrDefectInfos = require("../dvrWindow").default;
    const dvrDefectInfos = getDvrDefectInfos(
      streamIndex,
      28800,
      null,
      undefined,
      now - 0.002,
    );

    const defect = dvrDefectInfos[0];
    expect(defect).not.toBeUndefined();
    expect(defect.dvrWindowStart).toBeCloseTo(now - 28800 - 60);
    expect(defect.presentationLiveGap).toBeCloseTo(60);
    expect(spyDateNow).toHaveBeenCalledTimes(1);
    spyDateNow.mockClear();
  });

  it("should warn if presentation live gap too far from manifest time", () => {
    const now = Math.floor(Date.now() / 1000);
    const refTime = Math.floor(Date.UTC(2013, 5, 1, 0, 0, 0, 0) / 1000); // 04/01/2013
    const streamIndex = [
      { $: { Type: "video", TimeScale: 1, Name: "name" }, c: [
        { $ : { t: now - 28790 - 20 - refTime, d: 28790} } 
      ] }
    ];

    const spyDateNow = jest.spyOn(Date, "now").mockImplementation(() => now * 1000);
    spyDateNow.mockClear();

    const getDvrDefectInfos = require("../dvrWindow").default;
    const dvrDefectInfos = getDvrDefectInfos(
      streamIndex,
      28800,
      null,
      undefined,
      now - 0.002,
    );

    const defect = dvrDefectInfos[0];
    expect(defect).not.toBeUndefined();
    expect(defect.dvrWindowStart).toBeCloseTo(now - 28800 - 20);
    expect(defect.firstPosition).toBeCloseTo(now - 28790 - 20);
    expect(spyDateNow).toHaveBeenCalledTimes(1);
    spyDateNow.mockClear();
  });

  it("should warn if there is a discountinuity", () => {
    const now = Math.floor(Date.now() / 1000);
    const refTime = Math.floor(Date.UTC(2013, 5, 1, 0, 0, 0, 0) / 1000); // 04/01/2013
    const streamIndex = [
      { $: { Type: "video", TimeScale: 1, Name: "name" }, c: [
        { $ : { t: now - 28800 - 20 - refTime, d: 28800} },
        { $ : { t: now - 28800 - 20 - refTime + 30000, d: 28800} }
      ] }
    ];

    const spyDateNow = jest.spyOn(Date, "now").mockImplementation(() => now * 1000);
    spyDateNow.mockClear();

    const getDvrDefectInfos = require("../dvrWindow").default;
    const dvrDefectInfos = getDvrDefectInfos(
      streamIndex,
      28800,
      null,
      undefined,
      now - 0.002,
    );

    const defect = dvrDefectInfos[0];
    expect(defect).not.toBeUndefined();
    expect(defect.rangeLength).toBeCloseTo(2);
    expect(spyDateNow).toHaveBeenCalledTimes(1);
    spyDateNow.mockClear();
  });

  it("should warn if content is far too short", () => {
    const now = Math.floor(Date.now() / 1000);
    const refTime = Math.floor(Date.UTC(2013, 5, 1, 0, 0, 0, 0) / 1000); // 04/01/2013
    const streamIndex = [
      { $: { Type: "video", TimeScale: 1, Name: "name" }, c: [
        { $ : { t: now - 28800 - refTime, d: 40 } },
      ] }
    ];

    const spyDateNow = jest.spyOn(Date, "now").mockImplementation(() => now * 1000);
    spyDateNow.mockClear();

    const getDvrDefectInfos = require("../dvrWindow").default;
    const dvrDefectInfos = getDvrDefectInfos(
      streamIndex,
      28800,
      null,
      10,
      now - 0.002,
    );

    const defect = dvrDefectInfos.find(({ defectType }) => {
      return defectType && defectType === "ODD_TOTAL_DURATION";
    }); 
    expect(defect).not.toBeUndefined();
    expect(defect.totalDuration).toBeCloseTo(40);
    expect(spyDateNow).toHaveBeenCalledTimes(1);
    spyDateNow.mockClear();
  });

  it("should concat content ranges and don't warn", () => {
    const now = Math.floor(Date.now() / 1000);
    const refTime = Math.floor(Date.UTC(2013, 5, 1, 0, 0, 0, 0) / 1000); // 04/01/2013
    const streamIndex = [
      { $: { Type: "video", TimeScale: 1, Name: "name" }, c: [
        { $ : { t: now - 28800 - 20 - refTime, d: 2000 } },
        { $ : { t: now - 28800 - 20 + 2000 - refTime, d: 4000 } },
        { $ : { d: (28800 - (2000 + 4000)) / 2, r: 1 } },
        { $ : { t: 3 } }, // will not be considered
      ] }
    ];

    const spyDateNow = jest.spyOn(Date, "now").mockImplementation(() => now * 1000);
    spyDateNow.mockClear();

    const getDvrDefectInfos = require("../dvrWindow").default;
    const dvrDefectInfos = getDvrDefectInfos(
      streamIndex,
      28800,
      null,
      10,
      now - 0.002,
    );

    expect(dvrDefectInfos.length).toBe(0);
    expect(spyDateNow).toHaveBeenCalledTimes(1);
    spyDateNow.mockClear();
  });

  it("should throw error without indexAttributes", () => {
    const now = Math.floor(Date.now() / 1000);
    const refTime = Math.floor(Date.UTC(2013, 5, 1, 0, 0, 0, 0) / 1000); // 04/01/2013
    const streamIndex = [
      { c: [
        { $ : { t: now - 28800 - 20 - refTime, d: 2000 } },
        { $ : { t: now - 28800 - 20 + 2000 - refTime, d: 4000 } },
        { $ : { d: (28800 - (2000 + 4000)) / 2, r: 1 } },
        { $ : { t: 3 } }, // will not be considered
      ] }
    ];

    const getDvrDefectInfos = require("../dvrWindow").default;
    expect(() => getDvrDefectInfos(
      streamIndex,
      28800,
      null,
      10,
      now - 0.002,
    )).toThrowError("No index attributes");
  });

  it("should don't warn with indexAttributes but not timescale", () => {
    const now = Math.floor(Date.now() / 1000);
    const refTime = Math.floor(Date.UTC(2013, 5, 1, 0, 0, 0, 0) / 1000); // 04/01/2013
    const streamIndex = [
      { $: { Type: "video", Name: "name" }, c: [
        { $ : { t: now - 28800 - 20 - refTime, d: 2000 } },
        { $ : { t: now - 28800 - 20 + 2000 - refTime, d: 4000 } },
        { $ : { d: (28800 - (2000 + 4000)) / 2, r: 1 } },
        { $ : { t: 3 } }, // will not be considered
      ] }
    ];

    const spyDateNow = jest.spyOn(Date, "now").mockImplementation(() => now * 1000);
    spyDateNow.mockClear();

    const getDvrDefectInfos = require("../dvrWindow").default;
    const dvrDefectInfos = getDvrDefectInfos(
      streamIndex,
      28800,
      1,
      10,
      now - 0.002,
    );

    expect(dvrDefectInfos.length).toBe(0);
    expect(spyDateNow).toHaveBeenCalledTimes(1);
    spyDateNow.mockClear();
  });

  it("should throw if no given timescale", () => {
    const now = Math.floor(Date.now() / 1000);
    const refTime = Math.floor(Date.UTC(2013, 5, 1, 0, 0, 0, 0) / 1000); // 04/01/2013
    const streamIndex = [
      { $: { Type: "video", Name: "name" }, c: [
        { $ : { t: now - 28800 - 20 - refTime, d: 2000 } },
        { $ : { t: now - 28800 - 20 + 2000 - refTime, d: 4000 } },
        { $ : { d: (28800 - (2000 + 4000)) / 2, r: 1 } },
        { $ : { t: 3 } }, // will not be considered
      ] }
    ];

    const getDvrDefectInfos = require("../dvrWindow").default;
    expect(() => {
      return getDvrDefectInfos(
        streamIndex,
        28800,
        null,
        10,
        now - 0.002,
      )
    }).toThrowError("No timescale or DVRWindowLength for content index");
  });
});
