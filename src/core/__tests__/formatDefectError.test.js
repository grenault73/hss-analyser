import formatDefectError from "../formatDefectError";

describe("core - formatDefectError", () => {
  it("should return ODD_START_OF_CONTENT formatted message", () => {
    expect(formatDefectError({
      defectType: "ODD_START_OF_CONTENT",
      dvrWindowStart: 3,
      firstPosition: 15,
    })).toBe(
      "     DVR Window start: 3\n" +
      "     First content position: 15\n"
    );
  });
  it("should return ODD_END_OF_CONTENT formatted message", () => {
    expect(formatDefectError({
      defectType: "ODD_END_OF_CONTENT",
      dvrWindowStart: 3,
      presentationLiveGap: 15,
    })).toBe(
      "     DVR Window start: 3\n" +
      "     Presentation live gap: 15\n"
    );
  });
  it("should return CONTENT_DISCOUNTINUITIES formatted message", () => {
    expect(formatDefectError({
      defectType: "CONTENT_DISCOUNTINUITIES",
      rangeLength: 3
    })).toBe(
      "     Ranges: 3\n"
    );
  });
  it("should return ODD_TOTAL_DURATION formatted message", () => {
    expect(formatDefectError({
      defectType: "ODD_TOTAL_DURATION",
      totalDuration: 3
    })).toBe(
      "     Total content duration: 3\n"
    );
  });
  it("should return default formatted message", () => {
    expect(formatDefectError({ defectType: "NO_CONTENT" })).toBe("");
  });
});
