import formatDefectError from "../formatDefectError";

describe("core - formatDefectError", () => {
  it("should return LATE_CONTENT_START formatted message", () => {
    expect(formatDefectError({
      defectType: "LATE_CONTENT_START",
      dvrWindowStart: 3,
      firstPosition: 15,
    })).toBe(
      "     DVR Window start: 3\n" +
      "     First content position: 15\n"
    );
  });
  it("should return EARLY_CONTENT_END formatted message", () => {
    expect(formatDefectError({
      defectType: "EARLY_CONTENT_END",
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
  it("should return CONTENT_TOO_LONG formatted message", () => {
    expect(formatDefectError({
      defectType: "CONTENT_TOO_LONG",
      totalDuration: 3
    })).toBe(
      "     Total content duration: 3\n"
    );
  });
  it("should return default formatted message", () => {
    expect(formatDefectError({ defectType: "NO_CONTENT" })).toBe("");
  });
});
