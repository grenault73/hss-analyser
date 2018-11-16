export default function getDvrDefectInfos(
  streamIndex, DVRWindowLength, headerTimescale, gapTolerance
) {
  return streamIndex.reduce((acc, index) => {
    const { $: indexAttributes, c } = index;

    const type = indexAttributes ? indexAttributes.Type : undefined;
    const name = indexAttributes ? indexAttributes.Name : undefined;

    const timescale = indexAttributes ?
      (indexAttributes.TimeScale || headerTimescale) : headerTimescale;

    if (type === "video" || type === "audio") {
      if (c) {
        const contentLength = c.reduce((length, { $: value }) => {
          const { d, r } = value;
          const _d = d ? parseInt(d, 10) : undefined;
          const _r = r ? parseInt(r, 10) : undefined;
          length += (_d * ((_r || 0) + 1));
          return length;
        }, 0) / timescale; 
        const dvr = parseInt(DVRWindowLength, 10) / timescale;
        const diff = dvr - contentLength;
        if (diff > gapTolerance || 2) {
          acc.push({
            type,
            name,
            dvrWindowLength: dvr,
            contentLength,
            missingTime: diff,
            type
          });
        }
      }
    }
    return acc;
  }, []);
}