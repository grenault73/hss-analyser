describe("load - index", () => {
  beforeEach(() => {
    jest.resetModules();
  });

  it("should throw if error in fetchManifest", (done) => {
    const mockFetchManifest = jest.fn(() => Promise.resolve({ err: new Error("error 1") }));
    jest.mock("../fetchManifest", () => ({
      __esModule: true,
      default: mockFetchManifest,
    }));

    const loadManifest = require("../index").default;
    loadManifest("fakeUrl").catch((err) => {
      const _err = new Error("error 1");
      expect(err).toEqual(_err);
      expect(err.message).toBe(_err.message);
      expect(mockFetchManifest).toHaveBeenCalledTimes(1);
      done();
    });
  });

  it("should throw if fetchManifest throws", () => {
    const mockFetchManifest = jest.fn(() => { throw new Error("error 1") });
    jest.mock("../fetchManifest", () => ({
      __esModule: true,
      default: mockFetchManifest,
    }));

    const loadManifest = require("../index").default;
    expect(() => loadManifest("fakeURL")).toThrowError("error 1");
  });

  it("should throw if parseManifest throws", (done) => {
    const spyDateNow = jest.spyOn(Date, "now");
    const mockFetchManifest = jest.fn(() => Promise.resolve({ manifest: {} }));
    jest.mock("../fetchManifest", () => ({
      __esModule: true,
      default: mockFetchManifest,
    }));

    const mockParseManifest = jest.fn(() => { throw new Error("error 2"); });
    jest.mock("../parseManifest", () => ({
      __esModule: true,
      default: mockParseManifest,
    }));

    const loadManifest = require("../index").default;
    loadManifest("fakeUrl").catch((err) => {
      const _err = new Error("error 2");
      expect(err).toEqual(_err);
      expect(err.message).toBe(_err.message);
      expect(spyDateNow).toHaveBeenCalledTimes(1);
      expect(mockFetchManifest).toHaveBeenCalledTimes(1);
      expect(mockParseManifest).toHaveBeenCalledTimes(1);
      spyDateNow.mockClear();
      done();
    });
  });

  it("should fetch and parse the manifest", (done) => {
    const now = Date.now();
    const spyDateNow = jest.spyOn(Date, "now")
      .mockImplementation(() => now);
    spyDateNow.mockClear();

    const mockFetchManifest = jest.fn(() => Promise.resolve({ manifest: {} }));
    jest.mock("../fetchManifest", () => ({
      __esModule: true,
      default: mockFetchManifest,
    }));

    const mockParseManifest = jest.fn(() => Promise.resolve({}));
    jest.mock("../parseManifest", () => ({
      __esModule: true,
      default: mockParseManifest,
    }));

    const loadManifest = require("../index").default;
    loadManifest("fakeUrl").then(({ manifest, manifestReceivedTime }) => {
      expect(manifest).toEqual({});
      expect(manifestReceivedTime).toBe(now / 1000);
      expect(spyDateNow).toHaveBeenCalledTimes(1);
      expect(mockFetchManifest).toHaveBeenCalledTimes(1);
      expect(mockParseManifest).toHaveBeenCalledTimes(1);
      spyDateNow.mockClear();
      done();
    });
  });
});