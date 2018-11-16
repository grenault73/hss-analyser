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
  const log = logger(configuration.debugMode);
  log.info("Started HSS-analyser.");

  for (let i = 0; i < errs.length; i++) {
    const err = errs[i];
    log.error(err.message);
    if (err.isFatal) {
      log.error("HSS-analyse stopped.");
      return;
    }
  }

  try {
    if (configuration.manifestsPath == null) {
      log.error("No configuration provided.");
      log.error("HSS-analyse stopped.");
      return;
    }
  
    const absolutePath = path.resolve(configuration.manifestsPath);
    fs.readFile(absolutePath, (err, data) => {
      if (err) {
        log.error("Could not read file.");
        log.error("HSS-analyse stopped.");
        return;
      }
  
      const parsedFile = JSON.parse(data);
      const { manifests } = parsedFile;
      if (manifests == null) {
        log.error("No 'manifests' key found in manifests file.");
        log.error("HSS-analyse stopped.");
        return;
      }
  
      loadAndAnalyseManifests(manifests, configuration, log);
    });
  } catch (err) {
    log.error("Undefined error: " + err.message || err);
    log.error("HSS-analyse stopped.");
    return;
  }
}

start();
