describe("load - fetchManifest", () => {
  beforeEach(() => {
    jest.resetModules();
  });

  it("should return error if no protocol", (done) => {
    const fetchManifest = require("../fetchManifest").default;
    fetchManifest("fakeUrl").then(({ err }) => {
      const _err = new Error("Unknown protocol.");
      expect(err).toEqual(_err);
      expect(err.message).toEqual(_err.message);
      done();
    })
  });

  it("should return error if get requests return error", (done) => {
    jest.mock("http", () => ({
      __esModule: true,
      get: () => {
        return {
          on: (name, func) => {
            if (name === "error") {
              const err = new Error("error 1");
              func(err);
            }
          }
        }
      },
    }));
    const fetchManifest = require("../fetchManifest").default;
    fetchManifest("http://ggg").then(({ err }) => {
      const _err = new Error("error 1");
      expect(err).toEqual(_err);
      expect(err.message).toEqual(_err.message);
      done();
    })
  });

  it("should return manifest body", (done) => {
    jest.mock("http", () => ({
      __esModule: true,
      get: (_, func) => {
        const res = {
          setEncoding: () => ({}),
          on: (msg, fn) => {
            switch(msg) {
              case "data":
                setTimeout(() => {
                  fn("200");
                }, 50);
                break;
              case "end":
                setTimeout(() => {
                  fn();
                }, 200);
                break;
              default:
                break;
            }
          }
        };
        func(res);
        return {
          on: () => {}
        }
      },
    }));
    const fetchManifest = require("../fetchManifest").default;
    fetchManifest("http://ggg").then(({ manifest }) => {
      expect(manifest).toEqual("200");
      done();
    })
  });


  it("should throw when request throws", (done) => {
    jest.mock("https", () => ({
      __esModule: true,
      get: (_, func) => {
        const res = {
          setEncoding: () => ({}),
          on: (msg, fn) => {
            if (msg === "error") {
              const err = new Error("error 2");
              fn(err);
            }
          }
        };
        func(res);
        return {
          on: () => {}
        }
      },
    }));
    const fetchManifest = require("../fetchManifest").default;
    fetchManifest("https://ggg").then(({ err }) => {
      const _err = new Error("error 2");
      expect(err).toEqual(_err);
      expect(err.message).toEqual(_err.message);
      done();
    })
  });
});