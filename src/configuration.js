/**
 * Build configuration from node arguments.
 * @param {Array.<*>} nodeArguments
 * @returns {Object} - configuration
 */
export default function getConfiguration(nodeArguments) {
  const configuration = {
    debugMode: false,
    downloadInterval: 5 * 60,
    manifestsPath: undefined,
    gapTolerance: 2,
    logToFile: false,
  };

  const errs = [];

  for (let i = 0; i < nodeArguments.length; i++) {
    switch (nodeArguments[i]) {
      case "-p":
        if (!nodeArguments[i + 1]) {
          errs.push({
            message: "Should specify a path for configuration file when using '-p' option.",
            isFatal: true,
          })
        } else {
          configuration.manifestsPath = nodeArguments[i + 1];
        }
        break;
      case "-i":
        if (!nodeArguments[i + 1]) {
          errs.push({
            message: "Should specify a download interval when using '-i' option. " +
              "Default interval is 5 minutes.",
            isFatal: false,
          })
        } else {
          try {
            const parsedInterval = parseInt(nodeArguments[i + 1], 10);
            if (isNaN(parsedInterval)) {
              errs.push({
                message: "Could not parse download interval. Default is 5 minutes.",
                isFatal: false,
              });
            } else {
              configuration.downloadInterval = parsedInterval;
            }
          } catch (err) {
            errs.push({
              message: "Could not parse download interval. Default is 5 minutes.",
              isFatal: false,
            });
          }
        }
        break;
      case "-t":
        if (!nodeArguments[i + 1]) {
          errs.push({
            message: "Should specify a gap tolerance when using '-t' option. " +
              "Default gap tolerance is 2 seconds.",
            isFatal: false,
          })
        } else {
          try {
            const parsedGap = parseInt(nodeArguments[i + 1], 10);
            if (isNaN(parsedGap)) {
              errs.push({
                message: "Could not parse gap tolerance. Default is 2 seconds.",
                isFatal: false,
              });
            } else {
              configuration.gapTolerance = parsedGap;
            }
          } catch (err) {
            errs.push({
              message: "Could not parse gap tolerance. Default is 2 seconds.",
              isFatal: false,
            });
          }
        }
        break;
      case "-d":
      case "--debug":
        configuration.debugMode = true;
        break;
      case "-l":
      case "--logToFile":
        configuration.logToFile = true;
        break;
    }
  }

  return {
    configuration,
    errs
  };
}