const refTime = Date.UTC(2013, 5, 1, 0, 0, 0, 0) / 1000; // 04/01/2013

export default function getDvrDefectInfos(
  streamIndex, DVRWindowLength, headerTimescale, firstPositionCanBeBehind, manifestReceivedTime
) {
  if (streamIndex.length === 0) {
    throw new Error("No stream index");
  }

  return streamIndex.reduce((acc, index) => {
    const { $: indexAttributes, c } = index;

    if (indexAttributes == null) {
      throw new Error("No index attributes");
    }

    const type = indexAttributes.Type;
    const name = indexAttributes.Name;
    const timescale = indexAttributes.TimeScale || headerTimescale;

    if (type === "video" || type === "audio") {
      if (c) {
        if (timescale == null || DVRWindowLength == null) {
          throw new Error("No timescale or DVRWindowLength for content index");
        }
        const dvr = parseInt(DVRWindowLength, 10) / timescale;

        // Content ranges of segments (start + duration)
        const contentRanges = c.reduce((ranges, { $: value }) => {
          const { t, d, r } = value;
          const _t = t ? parseInt(t, 10) : undefined;
          const _d = d ? parseInt(d, 10) : undefined;
          const _r = r ? parseInt(r, 10) : undefined;

          if (_d) {
            const length = (_d * ((_r || 0) + 1));
            const lastElement = ranges[ranges.length - 1];
  
            if (_t) {
              if (lastElement && ((lastElement.start + lastElement.duration) === _t)) {
                lastElement.duration += length;
              } else {
                ranges.push({ start: _t, duration: length });
              }
            } else if (lastElement) {
              lastElement.duration += length;
            }
          }

          return ranges;
        }, []);

        if (contentRanges.length === 0) {
          acc.push({
            type,
            name,
            dvrWindowLength: dvr,
            defectType: "NO_CONTENT",
          });
          return acc;
        }

        const firstPosition = (contentRanges[0].start / timescale);
        const { start: lstart, duration: lduration } = contentRanges[contentRanges.length - 1];
        const lastPosition = ((lstart + lduration) / timescale);

        const presentationLiveGap = Date.now() / 1000 - (lastPosition + refTime);
        const dvrWindowStart = manifestReceivedTime - dvr - presentationLiveGap;

        if (presentationLiveGap < 0) {
          acc.push({
            type,
            name,
            dvrWindowLength: dvr,
            dvrWindowStart,
            presentationLiveGap,
            defectType: "LATE_CONTENT_END",
          });
        }

        if (presentationLiveGap >= 60) {
          acc.push({
            type,
            name,
            dvrWindowLength: dvr,
            dvrWindowStart,
            presentationLiveGap,
            defectType: "EARLY_CONTENT_END",
          });
        }

        if (firstPosition != null && (firstPosition + refTime - dvrWindowStart) >= 10) {
          acc.push({
            type,
            name,
            dvrWindowLength: dvr,
            dvrWindowStart,
            firstPosition: firstPosition + refTime,
            defectType: "LATE_CONTENT_START",
          });
        }

        if (contentRanges.length > 1) {
          acc.push({
            type,
            name,
            dvrWindowLength: dvr,
            rangeLength: contentRanges.length,
            defectType: "CONTENT_DISCOUNTINUITIES",
          });
        }

        const totalDuration = contentRanges.reduce((totDur, { duration }) => {
          return totDur + duration;
        }, 0) / timescale;

        if ((totalDuration + firstPositionCanBeBehind) < dvr) {
          acc.push({
            type,
            name,
            dvrWindowLength: dvr,
            totalDuration,
            defectType: "CONTENT_TOO_LONG",
          });
        }
      }
    }
    return acc;
  }, []);
}