const fs = require("fs");

/**
 * Clean log formatting :
 * - remove color references.
 * @param {string} log 
 * @returns {string}
 */
export function cleanLogFormatting(log) {
  return log
    .replace("\x1b[36m", "")
    .replace("\x1b[0m", "")
    .replace("\x1b[33m", "")
    .replace("\x1b[31m", "");
}

/**
 * Returns log functions.
 * @param {boolean} debugMode 
 */
export default function log(debugMode, _logOnFile) {
  let logOnFile = _logOnFile;
  let isStreamOpen = false;
  let isWritingOnFile = false;
  let stream;

  /**
   * Write log to log file, then write to stdout
   * @param {string} message 
   */
  function writeLog(log) {
    process.stdout.write(log);
    if (logOnFile && isStreamOpen) {
      isWritingOnFile = true;
      stream.write(cleanLogFormatting(log), () => {
        isWritingOnFile = false;
      });
    }
  }

  if (logOnFile) {
    stream = fs.createWriteStream("./logs/" + Date.now() + ".log");
    stream.once('error', function() {
      const date = new Date();
      writeLog('[' + date + '] - \x1b[36mHSS-analyser: \x1b[31mError - '
        + "Can't write to log file." + '\x1b[0m\n');
      logOnFile = false;
    });
    stream.once('open', function() {
      isStreamOpen = true;
    });
  }

  // Handle exiting signal
  process.on('SIGINT', function() {
    const date = new Date();
    writeLog('[' + date + '] - \x1b[36mHSS-analyser: \x1b[0mInfo - '
      + "Exiting ...\n");
    if (logOnFile) {
      function tryToEnd() {
        setTimeout(() => {
          if (isWritingOnFile) {
            tryToEnd();
          } else {
            isStreamOpen = false;
            stream.end();
            return process.exit();
          }
        }, 100);
      }
      tryToEnd();
    } else {
      return process.exit();
    }
  });

  return {
    error(message) {
      const date = new Date();
      writeLog('[' + date + '] - \x1b[36mHSS-analyser: \x1b[31mError - '
        + message + '\x1b[0m\n');
    },
    info(message) {
      const date = new Date();
      writeLog('[' + date + '] - \x1b[36mHSS-analyser: \x1b[0mInfo - '
        + message + '\n');
    },
    debug(message) {
      if (debugMode) {
        const date = new Date();
        writeLog('[' + date + '] - \x1b[36mHSS-analyser: \x1b[33mDebug - '
          + message + '\x1b[0m\n');
      }
    },
    incrementalDebug(message, jump) {
      if (debugMode) {
        const date = new Date();
        process.stdout.clearLine();
        process.stdout.cursorTo(0);
        writeLog('[' + date + '] - \x1b[36mHSS-analyser: \x1b[33mDebug - '
          + message + '\x1b[0m' + (jump ? '\n' : ''));
      }
    }
  }
}

