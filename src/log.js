/**
 * Returns log functions.
 * @param {boolean} debugMode 
 */
export default function log(debugMode) {
  return {
    error(message) {
      const date = new Date();
      console.error('[%s] - \x1b[36m%s \x1b[31m%s %s\x1b[0m', date, "HSS-analyser: ", 'Error -', message);
    },
    info(message) {
      const date = new Date();
      console.log('[%s] - \x1b[36m%s\x1b[0m %s\x1b[0m %s', date, "HSS-analyser: ", 'Info -', message);
    },
    debug(message) {
      if (debugMode) {
        const date = new Date();
        console.debug('[%s] - \x1b[36m%s \x1b[33m%s %s\x1b[0m', date, "HSS-analyser: ", 'Debug -', message);
      }
    },
  }
}

