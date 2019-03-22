import formatDefectError from "./formatDefectError";

/**
 * From loaded and analysed manifests, warn user if some manifests
 * are considered defective.
 * @param {Object} manifestsInfos
 * @param {Object} log 
 */
export default function warnAboutDefects(manifestsInfos, log) {
  let hasDefect = false;

  manifestsInfos.forEach((manifestInfo) => {
    const { defectInfos } = manifestInfo;
    if (defectInfos && defectInfos.dvrDefectInfos) {
      const { dvrDefectInfos } = defectInfos;
      dvrDefectInfos.forEach((dvrDefectInfo) => {
          hasDefect = true;

          const defectLogError = formatDefectError(dvrDefectInfo);
          log.error("Manifest has defect :\n" +
            "   URL: " + manifestInfo.url + "\n" +
            "   Loading date: " + manifestInfo.date + "\n" +
            "   Defect infos: \n" +
            "     Defect type: " + dvrDefectInfo.defectType + "\n" +
            "     Content type: " + dvrDefectInfo.type + "\n" +
            "     Track name: " + dvrDefectInfo.name + "\n" +
            "     DVR Window length (seconds): " + dvrDefectInfo.dvrWindowLength + "\n" +
            defectLogError
          );
      });
    }
    if (!!manifestInfo.err) {
      log.debug("Error while loading and/or parsing manifest :\n" +
        "   URL: " + manifestInfo.url + "\n" +
        "   Loading date: " + manifestInfo.date + "\n" +
        "   Error: " + manifestInfo.err.message || manifestInfo.err);
    }
  });
  if (!hasDefect) {
    log.debug("No defects on loaded manifests.");
  }
}