

/**
 * Returns log functions.
 * @param {boolean} debugMode 
 */
export default function log(debugMode) {
  return {
    error(message) {
      const date = new Date();
      process.stdout.write('[' + date + '] - \x1b[36mHSS-analyser: \x1b[31mError - '
        + message + '\x1b[0m\n');
    },
    info(message) {
      const date = new Date();
      process.stdout.write('[' + date + '] - \x1b[36mHSS-analyser: \x1b[0mInfo - '
        + message + '\n');
    },
    debug(message) {
      if (debugMode) {
        const date = new Date();
        process.stdout.write('[' + date + '] - \x1b[36mHSS-analyser: \x1b[33mDebug - '
          + message + '\x1b[0m\n');
      }
    },
    incrementalDebug(message, jump) {
      if (debugMode) {
        const date = new Date();
        process.stdout.clearLine();
        process.stdout.cursorTo(0);
        process.stdout.write('[' + date + '] - \x1b[36mHSS-analyser: \x1b[33mDebug - '
          + message + '\x1b[0m' + (jump ? '\n' : ''));
      }
    }
  }
}

