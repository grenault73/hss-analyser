import https from "https";

export default function fetchManifest(url) {
  return new Promise((resolve) => {

    https.get(url, (res) => {
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
        resolve({
          err,
        })
      })
    });
  })
}