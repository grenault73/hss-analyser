describe("load - parseManifest", () => {
  beforeEach(() => {
    jest.resetModules();
  });

  it("should reject if error during parsing", (done) => {
    const mockXML2Js = jest.fn((_, fn) => {
      const err = new Error("error 1");
      fn(err, {});
    });
    jest.mock("xml2js", () => ({
      __esModule: true,
      parseString: mockXML2Js,
    }));

    const parseSmoothStreamingMedia = require("../parseManifest").default;
    parseSmoothStreamingMedia().catch((err) => {
      expect(err).toEqual(new Error("error 1"));
      done();
    });
  });

  it("should reject if error during parsing", (done) => {
    const mockXML2Js = jest.fn((_, fn) => {
      fn(undefined, {
        SmoothStreamingMedia: {}
      });
    });
    jest.mock("xml2js", () => ({
      __esModule: true,
      parseString: mockXML2Js,
    }));

    const parseSmoothStreamingMedia = require("../parseManifest").default;
    parseSmoothStreamingMedia().then((res) => {
      expect(res).toEqual({});
      done();
    });
  });
});