
import { parseString as parseXMLToJSObject } from "xml2js";

/**
 * Analyse a manifest.
 * @param {Object} content 
 * @param {Object|undefined} err 
 */
export default function parseSmoothStreamingMedia(content) {
  return new Promise((resolve, reject) => {   
    parseXMLToJSObject(content, (err, { SmoothStreamingMedia }) => {
      if (err) {
        reject(err);
      } else {
        resolve(SmoothStreamingMedia);
      }
    });
  });
}