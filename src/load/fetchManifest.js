import https from "https";
import http from "http";

export default function fetchManifest(url) {
  return new Promise((resolve) => {
    const protocol = (() => {
      if (url.startsWith("https://")) {
        return https;
      } else if (url.startsWith("http://")) {
        return http;
      } else {
        resolve({ err: new Error("Unknown protocol.") })
      }
    })();

    const getRequest = protocol.get(url, (res) => {
      res.setEncoding("utf8");
      let body = "";
      res.on("data", data => {
        body += data;
      });
      res.on("end", () => {
        resolve({
          manifest: body,
        });
      });
      res.on("error", (err) => {
        resolve({ err })
      })
    });
    getRequest.on("error", (err) => {
      resolve({ err });
    })
  })
}