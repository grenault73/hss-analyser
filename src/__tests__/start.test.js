describe("index - ", () => {
  beforeEach(() => {
    jest.resetModules();
  });

  it("should return if an error is fatal", () => {
    const mockGetConfiguration = jest.fn(
      function getConfiguration() {
        return {
          configuration: {
            debugMode: true,
            logToFile: true,
            manifestsPath: "testpath",
            downloadInterval: 3,
          },
          errs: [
            { message: "errmessage", isFatal: true }
          ],
        };
      }
    );
    jest.mock("../configuration", () => ({
      __esModule: true,
      default: mockGetConfiguration,
    }));

    const mockLogInfo = jest.fn(() => ({}));
    const mockLogError = jest.fn(() => ({}));
    jest.mock("../log", () => ({
      __esModule: true,
      default: function logger() {
        return {
          info: mockLogInfo,
          error: mockLogError
        }
      }
    }));

    const start = require("../start").default;
    start();
    expect(mockLogInfo).toHaveBeenCalledTimes(4);
    expect(mockLogError).toHaveBeenCalledTimes(2);
    expect(mockGetConfiguration).toHaveBeenCalledTimes(1);
  });

  it("should return if no manifest path", () => {
    const mockGetConfiguration = jest.fn(
      function getConfiguration() {
        return {
          configuration: {
            debugMode: true,
            logToFile: true,
            manifestsPath: null,
            downloadInterval: 3,
          },
          errs: [
            { message: "errmessage", isFatal: false }
          ],
        };
      }
    );

    jest.mock("../configuration", () => ({
      __esModule: true,
      default: mockGetConfiguration,
    }));

    const mockLogInfo = jest.fn(() => ({}));
    const mockLogError = jest.fn(() => ({}));
    jest.mock("../log", () => ({
      __esModule: true,
      default: function logger() {
        return {
          info: mockLogInfo,
          error: mockLogError
        }
      }
    }));

    const start = require("../start").default;
    start();
    expect(mockLogInfo).toHaveBeenCalledTimes(4);
    expect(mockLogError).toHaveBeenCalledTimes(3);
    expect(mockLogError).toHaveBeenCalledWith("errmessage");
    expect(mockLogError).toHaveBeenCalledWith("No assets file provided.");
    expect(mockLogError).toHaveBeenCalledWith("HSS-analyser stopped.");
    expect(mockGetConfiguration).toHaveBeenCalledTimes(1);
  });

  it("should return if err when reading file", () => {
    const mockGetConfiguration = jest.fn(
      function getConfiguration() {
        return {
          configuration: {
            debugMode: true,
            logToFile: true,
            manifestsPath: "testpass",
            downloadInterval: 3,
          },
          errs: [
            { message: "errmessage", isFatal: false }
          ],
        };
      }
    );
    jest.mock("../configuration", () => ({
      __esModule: true,
      default: mockGetConfiguration,
    }));

    const mockLogInfo = jest.fn(() => ({}));
    const mockLogError = jest.fn(() => ({}));
    jest.mock("../log", () => ({
      __esModule: true,
      default: function logger() {
        return {
          info: mockLogInfo,
          error: mockLogError
        }
      }
    }));

    const mockResolve = jest.fn(() => {
      return "absolutePath";
    });

    jest.mock("path", () => ({
      __esModule: true,
      resolve: mockResolve,
    }));

    const mockReadFile = jest.fn((_, func) => {
      func(true); // err
    });

    jest.mock("fs", () => ({
      __esModule: true,
      readFile: mockReadFile,
    }));

    const mockLoadAndAnalyseManifests = jest.fn(() => {});
    jest.mock("../core", () => ({
      __esModule: true,
      default: mockLoadAndAnalyseManifests,
    }));

    const start = require("../start").default;
    start();
    expect(mockLogInfo).toHaveBeenCalledTimes(4);
    expect(mockLogError).toHaveBeenCalledTimes(3);
    expect(mockLogError).toHaveBeenCalledWith("errmessage");
    expect(mockLogError).toHaveBeenCalledWith("Could not read assets file.");
    expect(mockLogError).toHaveBeenCalledWith("HSS-analyser stopped.");
    expect(mockReadFile).toHaveBeenCalledTimes(1);
    expect(mockResolve).toHaveBeenCalledTimes(1);
    expect(mockLoadAndAnalyseManifests).not.toHaveBeenCalled();
    expect(mockGetConfiguration).toHaveBeenCalledTimes(1);
  });

  it("should return if no manifests on parsed JSON", () => {
    const mockGetConfiguration = jest.fn(
      function getConfiguration() {
        return {
          configuration: {
            debugMode: true,
            logToFile: true,
            manifestsPath: "testpass",
            downloadInterval: 3,
          },
          errs: [
            { message: "errmessage", isFatal: false }
          ],
        };
      }
    );
    jest.mock("../configuration", () => ({
      __esModule: true,
      default: mockGetConfiguration,
    }));

    const mockLogInfo = jest.fn(() => ({}));
    const mockLogError = jest.fn(() => ({}));
    jest.mock("../log", () => ({
      __esModule: true,
      default: function logger() {
        return {
          info: mockLogInfo,
          error: mockLogError
        }
      }
    }));

    const mockResolve = jest.fn(() => {
      return "absolutePath";
    });

    jest.mock("path", () => ({
      __esModule: true,
      resolve: mockResolve,
    }));

    const mockReadFile = jest.fn((_, func) => {
      func(false); // err
    });

    const spyJSONParse = jest.spyOn(JSON, "parse").mockImplementation(() => {
      return { manifests: null };
    })

    jest.mock("fs", () => ({
      __esModule: true,
      readFile: mockReadFile,
    }));

    const mockLoadAndAnalyseManifests = jest.fn(() => {});
    jest.mock("../core", () => ({
      __esModule: true,
      default: mockLoadAndAnalyseManifests,
    }));

    const start = require("../start").default;
    start();
    expect(mockLogInfo).toHaveBeenCalledTimes(4);
    expect(mockLogError).toHaveBeenCalledTimes(3);
    expect(mockLogError).toHaveBeenCalledWith("errmessage");
    expect(mockLogError).toHaveBeenCalledWith("No 'manifests' key found in manifests file.");
    expect(mockLogError).toHaveBeenCalledWith("HSS-analyser stopped.");
    expect(mockReadFile).toHaveBeenCalledTimes(1);
    expect(mockResolve).toHaveBeenCalledTimes(1);
    expect(mockGetConfiguration).toHaveBeenCalledTimes(1);
    expect(spyJSONParse).toHaveBeenCalledTimes(1);
    expect(mockLoadAndAnalyseManifests).not.toHaveBeenCalled();
    spyJSONParse.mockClear();
  });

  it("should return if no filtered manifest", () => {
    const mockGetConfiguration = jest.fn(
      function getConfiguration() {
        return {
          configuration: {
            debugMode: true,
            logToFile: true,
            manifestsPath: "testpass",
            downloadInterval: 3,
          },
          errs: [
            { message: "errmessage", isFatal: false }
          ],
        };
      }
    );
    jest.mock("../configuration", () => ({
      __esModule: true,
      default: mockGetConfiguration,
    }));

    const mockLogInfo = jest.fn(() => ({}));
    const mockLogError = jest.fn(() => ({}));
    jest.mock("../log", () => ({
      __esModule: true,
      default: function logger() {
        return {
          info: mockLogInfo,
          error: mockLogError
        }
      }
    }));

    const mockResolve = jest.fn(() => {
      return "absolutePath";
    });

    jest.mock("path", () => ({
      __esModule: true,
      resolve: mockResolve,
    }));

    const mockReadFile = jest.fn((_, func) => {
      func(false); // err
    });

    const spyJSONParse = jest.spyOn(JSON, "parse").mockImplementation(() => {
      return { manifests: [""] };
    })

    jest.mock("fs", () => ({
      __esModule: true,
      readFile: mockReadFile,
    }));

    const mockLoadAndAnalyseManifests = jest.fn(() => {});
    jest.mock("../core", () => ({
      __esModule: true,
      default: mockLoadAndAnalyseManifests,
    }));

    const start = require("../start").default;
    start();
    expect(mockLogInfo).toHaveBeenCalledTimes(4);
    expect(mockLogError).toHaveBeenCalledTimes(3);
    expect(mockLogError).toHaveBeenCalledWith("errmessage");
    expect(mockLogError).toHaveBeenCalledWith("No manifests provided in asset file.");
    expect(mockLogError).toHaveBeenCalledWith("HSS-analyser stopped.");
    expect(mockReadFile).toHaveBeenCalledTimes(1);
    expect(mockResolve).toHaveBeenCalledTimes(1);
    expect(mockGetConfiguration).toHaveBeenCalledTimes(1);
    expect(spyJSONParse).toHaveBeenCalledTimes(1);
    expect(mockLoadAndAnalyseManifests).not.toHaveBeenCalled();
    spyJSONParse.mockClear();
  });

  it("should go to the loading and analysing step", () => {
    const mockGetConfiguration = jest.fn(
      function getConfiguration() {
        return {
          configuration: {
            debugMode: true,
            logToFile: true,
            manifestsPath: "testpass",
            downloadInterval: 3,
          },
          errs: [
            { message: "errmessage", isFatal: false }
          ],
        };
      }
    );
    jest.mock("../configuration", () => ({
      __esModule: true,
      default: mockGetConfiguration,
    }));

    const mockLogInfo = jest.fn(() => ({}));
    const mockLogError = jest.fn(() => ({}));
    jest.mock("../log", () => ({
      __esModule: true,
      default: function logger() {
        return {
          info: mockLogInfo,
          error: mockLogError
        }
      }
    }));

    const mockResolve = jest.fn(() => {
      return "absolutePath";
    });

    jest.mock("path", () => ({
      __esModule: true,
      resolve: mockResolve,
    }));

    const mockReadFile = jest.fn((_, func) => {
      func(false); // err
    });

    const spyJSONParse = jest.spyOn(JSON, "parse").mockImplementation(() => {
      return { manifests: ["fakeurl"] };
    })

    jest.mock("fs", () => ({
      __esModule: true,
      readFile: mockReadFile,
    }));

    const mockLoadAndAnalyseManifests = jest.fn(() => {});
    jest.mock("../core", () => ({
      __esModule: true,
      default: mockLoadAndAnalyseManifests,
    }));

    const start = require("../start").default;
    start();
    expect(mockLogInfo).toHaveBeenCalledTimes(4);
    expect(mockLogError).toHaveBeenCalledTimes(1);
    expect(mockLogError).toHaveBeenCalledWith("errmessage");
    expect(mockReadFile).toHaveBeenCalledTimes(1);
    expect(mockResolve).toHaveBeenCalledTimes(1);
    expect(mockGetConfiguration).toHaveBeenCalledTimes(1);
    expect(spyJSONParse).toHaveBeenCalledTimes(1);
    expect(mockLoadAndAnalyseManifests).toHaveBeenCalledTimes(1);
    spyJSONParse.mockClear();
  });

  it("should return when JSON parsing failed", () => {
    const mockGetConfiguration = jest.fn(
      function getConfiguration() {
        return {
          configuration: {
            debugMode: false,
            logToFile: true,
            manifestsPath: "testpass",
            downloadInterval: 3,
          },
          errs: [
            { message: "errmessage", isFatal: false }
          ],
        };
      }
    );
    jest.mock("../configuration", () => ({
      __esModule: true,
      default: mockGetConfiguration,
    }));

    const mockLogInfo = jest.fn(() => ({}));
    const mockLogError = jest.fn(() => ({}));
    jest.mock("../log", () => ({
      __esModule: true,
      default: function logger() {
        return {
          info: mockLogInfo,
          error: mockLogError
        }
      }
    }));

    const mockResolve = jest.fn(() => {
      return "absolutePath";
    });

    jest.mock("path", () => ({
      __esModule: true,
      resolve: mockResolve,
    }));

    const mockReadFile = jest.fn((_, func) => {
      func(false); // err
    });

    const spyJSONParse = jest.spyOn(JSON, "parse").mockImplementation(() => {
      throw new Error("Parsing failed.");
    })

    jest.mock("fs", () => ({
      __esModule: true,
      readFile: mockReadFile,
    }));

    const mockLoadAndAnalyseManifests = jest.fn(() => {});
    jest.mock("../core", () => ({
      __esModule: true,
      default: mockLoadAndAnalyseManifests,
    }));

    const start = require("../start").default;
    start();
    expect(mockLogInfo).toHaveBeenCalledTimes(3);
    expect(mockLogError).toHaveBeenCalledTimes(3);
    expect(mockLogError).toHaveBeenCalledWith("errmessage");
    expect(mockLogError).toHaveBeenCalledWith("Parsing failed.");
    expect(mockLogError).toHaveBeenCalledWith("HSS-analyser stopped.");
    expect(mockReadFile).toHaveBeenCalledTimes(1);
    expect(mockResolve).toHaveBeenCalledTimes(1);
    expect(mockGetConfiguration).toHaveBeenCalledTimes(1);
    expect(spyJSONParse).toHaveBeenCalledTimes(1);
    expect(mockLoadAndAnalyseManifests).not.toHaveBeenCalled();
    spyJSONParse.mockClear();
  });

  it("should return when JSON parsing failed", () => {
    const mockGetConfiguration = jest.fn(
      function getConfiguration() {
        return {
          configuration: {
            debugMode: true,
            logToFile: true,
            manifestsPath: "testpass",
            downloadInterval: 3,
          },
          errs: [
            { message: "errmessage", isFatal: false }
          ],
        };
      }
    );
    jest.mock("../configuration", () => ({
      __esModule: true,
      default: mockGetConfiguration,
    }));

    const mockLogInfo = jest.fn(() => ({}));
    const mockLogError = jest.fn(() => ({}));
    jest.mock("../log", () => ({
      __esModule: true,
      default: function logger() {
        return {
          info: mockLogInfo,
          error: mockLogError
        }
      }
    }));

    const mockResolve = jest.fn(() => {
      return "absolutePath";
    });

    jest.mock("path", () => ({
      __esModule: true,
      resolve: mockResolve,
    }));

    const mockReadFile = jest.fn((_, func) => {
      func(false); // err
    });

    const spyJSONParse = jest.spyOn(JSON, "parse").mockImplementation(() => {
      return { manifests: ["fakeurl"] };
    })

    jest.mock("fs", () => ({
      __esModule: true,
      readFile: mockReadFile,
    }));

    const mockLoadAndAnalyseManifests = jest.fn(() => {
      throw new Error("Failed during loading.");
    });
    jest.mock("../core", () => ({
      __esModule: true,
      default: mockLoadAndAnalyseManifests,
    }));

    const start = require("../start").default;
    start();
    expect(mockLogInfo).toHaveBeenCalledTimes(4);
    expect(mockLogError).toHaveBeenCalledTimes(3);
    expect(mockLogError).toHaveBeenCalledWith("errmessage");
    expect(mockLogError).toHaveBeenCalledWith("Failed during loading.");
    expect(mockLogError).toHaveBeenCalledWith("HSS-analyser stopped.");
    expect(mockReadFile).toHaveBeenCalledTimes(1);
    expect(mockResolve).toHaveBeenCalledTimes(1);
    expect(mockGetConfiguration).toHaveBeenCalledTimes(1);
    expect(spyJSONParse).toHaveBeenCalledTimes(1);
    expect(mockLoadAndAnalyseManifests).toHaveBeenCalledTimes(1);
    spyJSONParse.mockClear();
  });

  it("should return when path resolver failed", () => {
    const mockGetConfiguration = jest.fn(
      function getConfiguration() {
        return {
          configuration: {
            debugMode: true,
            logToFile: true,
            manifestsPath: "testpass",
            downloadInterval: 3,
          },
          errs: [
            { message: "errmessage", isFatal: false }
          ],
        };
      }
    );
    jest.mock("../configuration", () => ({
      __esModule: true,
      default: mockGetConfiguration,
    }));

    const mockLogInfo = jest.fn(() => ({}));
    const mockLogError = jest.fn(() => ({}));
    jest.mock("../log", () => ({
      __esModule: true,
      default: function logger() {
        return {
          info: mockLogInfo,
          error: mockLogError
        }
      }
    }));

    const mockResolve = jest.fn(() => {
      throw new Error("Failed to resolve.")
    });

    jest.mock("path", () => ({
      __esModule: true,
      resolve: mockResolve,
    }));

    const mockLoadAndAnalyseManifests = jest.fn(() => {
      throw new Error("Failed during loading.");
    });
    jest.mock("../core", () => ({
      __esModule: true,
      default: mockLoadAndAnalyseManifests,
    }));

    const start = require("../start").default;
    start();
    expect(mockLogInfo).toHaveBeenCalledTimes(4);
    expect(mockLogError).toHaveBeenCalledTimes(3);
    expect(mockLogError).toHaveBeenCalledWith("errmessage");
    expect(mockLogError).toHaveBeenCalledWith("Failed to resolve.");
    expect(mockLogError).toHaveBeenCalledWith("HSS-analyser stopped.");
    expect(mockResolve).toHaveBeenCalledTimes(1);
    expect(mockGetConfiguration).toHaveBeenCalledTimes(1);
    expect(mockLoadAndAnalyseManifests).not.toHaveBeenCalled();
  });
});