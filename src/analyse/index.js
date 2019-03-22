import getDvrDefectInfos from "./dvrWindow";

/**
 * Check if manifest is valid.
 * Get defect infos.
 * @param {Object} SmoothStreamingMedia
 * @returns {Object}
 */
export default function analyseManifest(
  SmoothStreamingMedia, firstPositionCanBeBehind, manifestReceivedTime) {
  if (!SmoothStreamingMedia || !SmoothStreamingMedia.StreamIndex) {
    throw new Error("No SmoothStreamingMedia or StreamIndex in manifest.");
  }
  const { $: { IsLive, DVRWindowLength, TimeScale } } = SmoothStreamingMedia;
  if (IsLive !== "TRUE" || DVRWindowLength == null) {
    throw new Error("Content is not live.");
  }

  return {
    defectInfos: {
      dvrDefectInfos: getDvrDefectInfos(
        SmoothStreamingMedia.StreamIndex,
        DVRWindowLength,
        TimeScale,
        firstPositionCanBeBehind,
        manifestReceivedTime
      )
    }
  };
}