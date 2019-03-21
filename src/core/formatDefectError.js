/**
 * Format readable message from defect infos
 * @param {Object} dvrDefectInfo
 * @returns {string} 
 */
export default function formatDefectError(dvrDefectInfo) {
  switch(dvrDefectInfo.defectType) {
    case "LATE_CONTENT_START":
      return (
        "     DVR Window start: " + dvrDefectInfo.dvrWindowStart + "\n" +
        "     First content position: " + dvrDefectInfo.firstPosition + "\n"
      );
    case "EARLY_CONTENT_END":
      return (
        "     DVR Window start: " + dvrDefectInfo.dvrWindowStart + "\n" +
        "     Presentation live gap: " + dvrDefectInfo.presentationLiveGap + "\n"
      );
    case "CONTENT_DISCOUNTINUITIES":
      return (
        "     Ranges: " + dvrDefectInfo.rangeLength + "\n"
      );
    case "CONTENT_TOO_LONG":
      return (
        "     Total content duration: " + dvrDefectInfo.totalDuration + "\n"
      );
    case "LATE_CONTENT_END":
      return (
        "     DVR Window start: " + dvrDefectInfo.dvrWindowStart + "\n" +
        "     Presentation live gap: " + dvrDefectInfo.presentationLiveGap + "\n"
      );
    default:
      return "";
  }
}