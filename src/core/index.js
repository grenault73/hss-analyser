import analyseManifest from "../analyse";
import loadManifest from "../load";
import warnAboutDefects from "./warnAboutDefects";

/**
 * Analyse manifests.
 * 1 - Load manifests and parse them into JS objects.
 * 2 - Analyse manifest indexes.
 * 3 - Warn about defects.
 * @param {Array.<Object>} manifestUrls
 * @param {Object} configuration
 * @param {Object} log
 */
export default function loadAndAnalyseManifests(manifestUrls, configuration, log) {
  const { downloadInterval } = configuration;
  try {
    log.info(manifestUrls.length + " manifest(s) " + ((manifestUrls.length === 1) ? "was": "were") + " found.");
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
        const loadedManifests = manifestUrls.map((url) => {
          try {
            return loadManifest(url)
            .then(({ manifest: SmoothStreamingMedia, manifestReceivedTime }) => {
              loadedCount++;
              log.incrementalDebug("Loading manifests ... [" + loadedCount + "/" + manifestUrls.length + "]", (loadedCount === manifestUrls.length));
              const date = new Date();
              return {
                url,
                SmoothStreamingMedia,
                date,
                manifestReceivedTime
              };
            }).catch((err) => { 
              loadedCount++;
              log.incrementalDebug("Loading manifests ... [" + loadedCount + "/" + manifestUrls.length + "]", (loadedCount === manifestUrls.length));
              const date = new Date();
              return {
                url,
                err: err.message || err,
                date
              };
            })
          } catch(err) {
            loadedCount++;
            log.incrementalDebug("Loading manifests ... [" + loadedCount + "/" + manifestUrls.length + "]", (loadedCount === manifestUrls.length));
            const date = new Date();
            return {
              url,
              err: err.message || err,
              date
            };
          }
        });

        return Promise.all(loadedManifests)
          .then((SmoothStreamingMedias) => {
            loadedCount = 0;
            const manifestsInfos = SmoothStreamingMedias
              .map(({ SmoothStreamingMedia, url, err, date, manifestReceivedTime }) => {
                const manifestInformations = { url, err, date };
                if (err) {
                  return manifestInformations;
                }
                try {
                  const { firstPositionCanBeBehind } = configuration;
                  const { defectInfos } =
                    analyseManifest(SmoothStreamingMedia, firstPositionCanBeBehind, manifestReceivedTime);
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

    return callbackWithInterval(callback, downloadInterval * 1000);
  } catch(err) {
    log.error("Could not parse assets file. Error" + err.message || err);
    log.error("HSS-analyser stopped.");
    return;
  }
}