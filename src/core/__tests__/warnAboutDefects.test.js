describe("core - warnAboutDefects", () => {
  beforeEach(() => {
    jest.resetModules();
  });

  it("should log when no manifest infos", () => {
    const warnAboutDefects = require("../warnAboutDefects").default;

    const mockLogDebug = jest.fn(() => ({}));
    const mockLog = {
      debug: mockLogDebug,
    };
    warnAboutDefects([], mockLog);
    expect(mockLogDebug).toHaveBeenCalledTimes(1);
    expect(mockLogDebug).toHaveBeenCalledWith("No defects on loaded manifests.");
  });

  it("should log if no error or defect", () => {
    const warnAboutDefects = require("../warnAboutDefects").default;

    const mockLogDebug = jest.fn(() => ({}));
    const mockLogError = jest.fn(() => ({}));

    const mockLog = {
      debug: mockLogDebug,
      error: mockLogError,
    };

    warnAboutDefects([{}], mockLog);
    expect(mockLogDebug).toHaveBeenCalledTimes(1);
    expect(mockLogDebug).toHaveBeenCalledWith("No defects on loaded manifests.");
    expect(mockLogError).not.toHaveBeenCalled();
  });

  it("should log if no error and no dvr defect infos", () => {
    const warnAboutDefects = require("../warnAboutDefects").default;

    const mockLogDebug = jest.fn(() => ({}));
    const mockLogError = jest.fn(() => ({}));

    const mockLog = {
      debug: mockLogDebug,
      error: mockLogError,
    };

    warnAboutDefects([{ defectInfos: {} }], mockLog);
    expect(mockLogDebug).toHaveBeenCalledTimes(1);
    expect(mockLogDebug).toHaveBeenCalledWith("No defects on loaded manifests.");
    expect(mockLogError).not.toHaveBeenCalled();
  });

  it("should log if error and no defect", () => {
    const warnAboutDefects = require("../warnAboutDefects").default;

    const mockLogDebug = jest.fn(() => ({}));
    const mockLogError = jest.fn(() => ({}));

    const mockLog = {
      debug: mockLogDebug,
      error: mockLogError,
    };

    const err = new Error("Error 1");
    warnAboutDefects([{
      defectInfos: {},
      err,
    }], mockLog);
    expect(mockLogDebug).toHaveBeenCalledTimes(2);
    expect(mockLogDebug).toHaveBeenCalledWith("No defects on loaded manifests.");
    expect(mockLogDebug).toHaveBeenCalledWith(
      "Error while loading and/or parsing manifest :\n" +
        "   URL: undefined\n" +
        "   Loading date: undefined\n" +
        "   Error: Error 1"
    );
  });

  it("should log if defect", () => {
    const warnAboutDefects = require("../warnAboutDefects").default;

    const mockLogDebug = jest.fn(() => ({}));
    const mockLogError = jest.fn(() => ({}));

    const mockLog = {
      debug: mockLogDebug,
      error: mockLogError,
    };

    jest.mock("../formatDefectError", () => ({
      __esModule: true,
      default: () => ("")
    }));
    warnAboutDefects([{
      defectInfos: {
        dvrDefectInfos: [
          {}
        ]
      },
    }], mockLog);
    expect(mockLogDebug).not.toHaveBeenCalled();
    expect(mockLogError).toHaveBeenCalled();
    expect(mockLogError).toHaveBeenCalledWith(
      "Manifest has defect :\n" +
        "   URL: undefined\n" +
        "   Loading date: undefined\n" +
        "   Defect infos: \n" +
        "     Defect type: undefined\n" +
        "     Content type: undefined\n" +
        "     Track name: undefined\n" +
        "     DVR Window length (seconds): undefined\n"
    );
  });
});