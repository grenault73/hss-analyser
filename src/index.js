const path = require("path");
const fs = require("fs");

import getConfiguration from "./configuration";
import loadAndAnalyseManifests from "./core";
import logger from "./log";

/**
 * Start HSS anaylser.
 * 1 - Load configuration file and parse it.
 * 2 - Get manifests and configuration.
 * 2 - Analyse manifests.
 */
function start() {
  const { argv } = process;

  const { configuration, errs } = getConfiguration(argv);
  const log = logger(configuration.debugMode, configuration.logToFile);

  log.info("Started HSS-analyser");
  if (configuration.debugMode) {
    log.info("Debug mode");
  }
  log.info("Assets file : " + configuration.manifestsPath);
  log.info("Polling interval : " + configuration.downloadInterval + " seconds");
  log.info("DVR gap tolerance : " + configuration.gapTolerance + " seconds");

  for (let i = 0; i < errs.length; i++) {
    const err = errs[i];
    log.error(err.message);
    if (err.isFatal) {
      log.error("HSS-analyser stopped.");
      return;
    }
  }

  try {
    if (configuration.manifestsPath == null) {
      log.error("No assets file provided.");
      log.error("HSS-analyser stopped.");
      return;
    }
  
    const absolutePath = path.resolve(configuration.manifestsPath);
    fs.readFile(absolutePath, (err, data) => {
      if (err) {
        log.error("Could not read assets file.");
        log.error("HSS-analyser stopped.");
        return;
      }
  
      try {
        const parsedFile = JSON.parse(data);
        const { manifests } = parsedFile;
        if (manifests == null) {
          log.error("No 'manifests' key found in manifests file.");
          log.error("HSS-analyser stopped.");
          return;
        }
    
        loadAndAnalyseManifests(manifests, configuration, log);
      } catch (err) {
        log.error("JSON is not correclty formatted.");
        log.error("HSS-analyser stopped.");
        return;
      }
    });
  } catch (err) {
    log.error("Undefined error: " + err.message || err);
    log.error("HSS-analyser stopped.");
    return;
  }
}

start();
