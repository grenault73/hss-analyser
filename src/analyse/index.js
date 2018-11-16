import getDvrDefectInfos from "./dvrWindow";

/**
 * Check if manifest is valid.
 * Get defect infos.
 * @param {Object} SmoothStreamingMedia 
 */
export default function analyseManifest(SmoothStreamingMedia, gapTolerance) {
  if (!SmoothStreamingMedia || !SmoothStreamingMedia.StreamIndex) {
    throw new Error("No SmoothStreamingMedia or StreamIndex in manifest.");
  }
  const { $: { IsLive, DVRWindowLength, TimeScale } } = SmoothStreamingMedia;
  if (IsLive !== "TRUE" || DVRWindowLength == null || TimeScale == null) {
    throw new Error("Content is not live.");
  }

  return {
    defectInfos: {
      dvrDefectInfos: getDvrDefectInfos(
        SmoothStreamingMedia.StreamIndex,
        DVRWindowLength,
        TimeScale,
        gapTolerance)
    }
  };
}