import analyseManifest from "./analyse";
import loadManifest from "./load";

/**
 * From loaded and analysed manifests, warn user if some manifests
 * are considered defective.
 * @param {Object} manifestsInfos
 * @param {Object} log 
 */
function warnAboutDefects(manifestsInfos, log) {
  let hasDefect = false;

  manifestsInfos.forEach((manifestInfo) => {
    const { defectInfos } = manifestInfo;
    const { dvrDefectInfos } = defectInfos;
    dvrDefectInfos.forEach((dvrDefectInfo) => {
      if (dvrDefectInfos.length !== 0) {
        hasDefect = true;
        log.error("Manifest has defect :\n" +
          "   URL: " + manifestInfo.url + "\n" +
          "   Loading date: " + manifestInfo.date + "\n" +
          "   DVR Infos: \n" +
          "     type: " + dvrDefectInfo.type + "\n" +
          "     Missing time (seconds): " + dvrDefectInfo.missingTime + "\n" +
          "     window length (seconds): " + dvrDefectInfo.dvrWindowLength + "\n" +
          "     content length: (seconds): " + dvrDefectInfo.contentLength);
      }
    })
    if (!!manifestInfo.err) {
      log.debug("Error while loading and/or parsing manifest :\n" +
        "   URL: " + manifestInfo.url + "\n" +
        "   Loading date: " + manifestInfo.date + "\n" +
        "   Error: " + manifestInfo.err);
    }
  });
  if (!hasDefect) {
    log.debug("No defects on loaded manifests.");
  }
}

/**
 * Analyse manifests.
 * 1 - Load manifests and parse them into JS objects.
 * 2 - Analyse manifest indexes.
 * 3 - Warn about defects.
 * @param {Array.<Object>} manifests
 * @param {Object} configuration
 * @param {Object} log
 */
export default function loadAndAnalyseManifests(manifests, configuration, log) {
  const { debugMode, downloadInterval } = configuration;
  try {
    log.info(manifests.length + " manifest(s) " + ((manifests.length === 1) ? "was": "were") + " found.");
    log.info("Start polling.");

    function callbackWithInterval(_callback, pollingInterval) {
      _callback().then(() => {
        setTimeout(() => {
          callbackWithInterval(_callback, pollingInterval);
        }, pollingInterval);
      });
    }

    let loadedCount = 0;

    function callback() {
      return new Promise((resolve) => {
        log.debug("Polling ...");
        const loadedManifests = manifests.map((url) => {
          return loadManifest(url)
            .then((SmoothStreamingMedia) => {
              loadedCount++;
              log.incrementalDebug("Loading manifests ... [" + loadedCount + "/" + manifests.length + "]", (loadedCount === manifests.length));
              const date = new Date();
              return {
                url,
                SmoothStreamingMedia,
                date
              };
            }).catch((err) => {
              loadedCount++;
              log.incrementalDebug("Loading manifests ... [" + loadedCount + "/" + manifests.length + "]", (loadedCount === manifests.length));
              const date = new Date();
              return {
                url,
                err: err.message || err,
                date
              };
            })
        });

        return Promise.all(loadedManifests)
          .then((SmoothStreamingMedias) => {
            loadedCount = 0;
            const manifestsInfos = SmoothStreamingMedias.map(({ SmoothStreamingMedia, url, err, date }) => {
              const manifestInformations = { url, err, date };
              if (err) {
                return manifestInformations;
              }
              try {
                const { defectInfos } = analyseManifest(SmoothStreamingMedia);
                manifestInformations.defectInfos = defectInfos;
                return manifestInformations;
              } catch(err) {
                manifestInformations.err = err.message || err;
                return manifestInformations;
              }
            });
            warnAboutDefects(manifestsInfos, log);
            resolve();
          });
      });
    }

    callbackWithInterval(callback, downloadInterval * 1000);
  } catch(err) {
    log.error("Could not parse assets file.");
    log.error("HSS-analyser stopped.");
    return;
  }
}