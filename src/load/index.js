import fetchManifest from "./fetchManifest";
import parseManifest from "./parseManifest";

export default function loadManifest(url) {
  return fetchManifest(url).then(({ manifest: content, err }) => {
    if (err) {
      throw err;
    }
    return parseManifest(content);
  });
}