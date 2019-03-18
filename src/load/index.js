import fetchManifest from "./fetchManifest";
import parseManifest from "./parseManifest";

/**
 * Fetch and parse manifest.
 * Returns manifest and its receive time.
 * @param {string} url
 * @returns {Promise.<Object>} 
 */
export default function loadManifest(url) {
  return fetchManifest(url).then(({ manifest: content, err }) => {
    if (err) {
      throw err;
    }
    const manifestReceivedTime = Date.now() / 1000;
    return parseManifest(content).then((manifest) => {
      return { manifest, manifestReceivedTime }
    });
  });
}