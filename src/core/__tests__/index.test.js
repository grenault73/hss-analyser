describe("core - index", () => {
  beforeEach(() => {
    jest.resetModules();
  });

  it("should call correct log funcs when loading manifests", (done) => {
    const spyDate = jest.spyOn(global, "Date");  // spy on Date
    jest.mock("../../load", () => ({
      __esModule: true,
      default: () => { throw new Error("error 1"); }
    }));

    const mockWarnAboutDefects = jest.fn(() => ({}));
    jest.mock("../warnAboutDefects", () => ({
      __esModule: true,
      default: mockWarnAboutDefects,
    }));

    const mockLogIncrDebug = jest.fn(() => ({}));
    const mockLogInfo = jest.fn(() => ({}));
    const mockLogDebug = jest.fn(() => ({}));
    const mockLogError = jest.fn(() => {});
    const mockLog = {
      info: mockLogInfo,
      error: mockLogError,
      debug: mockLogDebug,
      incrementalDebug: mockLogIncrDebug,
    };
    const loadAndAnalyseManifests = require("../index").default;
    loadAndAnalyseManifests(
      ["url", "url", "url"],
      { downloadInterval: 100 },
      mockLog
    );
    setTimeout(() => {
      expect(mockLogError).not.toHaveBeenCalled();
      expect(mockLogDebug).toHaveBeenCalledTimes(1);
      expect(mockLogDebug).toHaveBeenCalledWith("Polling ...");

      expect(mockLogInfo).toHaveBeenCalledTimes(2);
      expect(mockLogInfo).toHaveBeenCalledWith("3 manifest(s) were found.");
      expect(mockLogInfo).toHaveBeenCalledWith("Start polling.");

      expect(mockLogIncrDebug).toHaveBeenCalledTimes(3);
      expect(mockLogIncrDebug).toHaveBeenCalledWith("Loading manifests ... [1/3]", false);
      expect(mockLogIncrDebug).toHaveBeenCalledWith("Loading manifests ... [2/3]", false);
      expect(mockLogIncrDebug).toHaveBeenCalledWith("Loading manifests ... [3/3]", true);

      expect(mockWarnAboutDefects).toHaveBeenCalledTimes(1);
      expect(mockWarnAboutDefects).toHaveBeenCalledWith(
        [
          { url: "url", err: "error 1", date: spyDate.mock.instances[0] },
          { url: "url", err: "error 1", date: spyDate.mock.instances[1] },
          { url: "url", err: "error 1", date: spyDate.mock.instances[2] }
        ],
        mockLog,
      );

      spyDate.mockClear();
      done();
    }, 200);
  });
});
