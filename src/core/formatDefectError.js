/**
 * Format readable message from defect infos
 * @param {Object} dvrDefectInfo
 * @returns {string} 
 */
export default function formatDefectError(dvrDefectInfo) {
  switch(dvrDefectInfo.defectType) {
    case "ODD_START_OF_CONTENT":
      return (
        "     DVR Window start: " + dvrDefectInfo.dvrWindowStart + "\n" +
        "     First content position: " + dvrDefectInfo.firstPosition + "\n"
      );
    case "ODD_END_OF_CONTENT":
      return (
        "     DVR Window start: " + dvrDefectInfo.dvrWindowStart + "\n" +
        "     Presentation live gap: " + dvrDefectInfo.presentationLiveGap + "\n"
      );
    case "CONTENT_DISCOUNTINUITIES":
      return (
        "     Ranges: " + dvrDefectInfo.rangeLength + "\n"
      );
    case "ODD_TOTAL_DURATION":
      return (
        "     Total content duration: " + dvrDefectInfo.totalDuration + "\n"
      );
    default:
      return "";
  }
}