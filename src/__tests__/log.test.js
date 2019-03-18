import log, { cleanLogFormatting } from "../log";

describe("log - cleanLogFormatting", () => {
  beforeEach(() => {
    jest.resetModules();
  });

  it("should clean log", () => {
    const textIn = (
      "\x1b[36m_" +
      "\x1b[0m_" +
      "\x1b[33m_" +
      "\x1b[31m_"
    );
  
    const textOut = cleanLogFormatting(textIn);
    expect(textOut).toBe("____");
  });
});

describe("log - log in debug mode", () => {
  const loggerDebug = log(true, false);

  beforeEach(() => {
    jest.resetModules();
  });

  it("should correclty log error", () => {
    let out = "";
    const stdout = process.stdout;
    const spy = jest.spyOn(stdout, "write").mockImplementation((mess) => {
      out += mess;
    });
    loggerDebug.error("Dieu est grand.");
    const date = new Date();
    expect(out).toBe('[' + date + '] - \x1b[36mHSS-analyser: \x1b[31mError - '
      + "Dieu est grand." + '\x1b[0m\n');
    expect(spy).toHaveBeenCalledTimes(1);
    spy.mockClear();
  });

  it("should correclty log info", () => {
    let out = "";
    const stdout = process.stdout;
    const spy = jest.spyOn(stdout, "write").mockImplementation((mess) => {
      out += mess;
    });
    loggerDebug.info("Dieu est grand.");
    const date = new Date();
    expect(out).toBe('[' + date + '] - \x1b[36mHSS-analyser: \x1b[0mInfo - '
      + "Dieu est grand." + '\n');
    expect(spy).toHaveBeenCalledTimes(1);
    spy.mockClear();
  });

  it("should correclty log debug", () => {
    let out = "";
    const stdout = process.stdout;
    const spy = jest.spyOn(stdout, "write").mockImplementation((mess) => {
      out += mess;
    });
    loggerDebug.debug("Dieu est grand.");
    const date = new Date();
    expect(out).toBe('[' + date + '] - \x1b[36mHSS-analyser: \x1b[33mDebug - '
      + "Dieu est grand." + '\x1b[0m\n');
    expect(spy).toHaveBeenCalledTimes(1);
    spy.mockClear();
  });

  it("should correclty log incremental debug without line jump", () => {
    let out = "";
    const stdout = process.stdout;

    const spyClearLine = jest.spyOn(stdout, "clearLine").mockImplementation(() => ({}));
    const spyCursorTo = jest.spyOn(stdout, "cursorTo").mockImplementation(() => ({}));
    const spy = jest.spyOn(stdout, "write").mockImplementation((mess) => {
      out += mess;
    });

    loggerDebug.incrementalDebug("Dieu est grand.", false);
    const date = new Date();
    expect(out).toBe('[' + date + '] - \x1b[36mHSS-analyser: \x1b[33mDebug - '
      + "Dieu est grand." + '\x1b[0m');
    expect(spy).toHaveBeenCalledTimes(1);
    expect(spyClearLine).toHaveBeenCalledTimes(1);
    expect(spyCursorTo).toHaveBeenCalledTimes(1);
    spy.mockClear();
    spyClearLine.mockClear();
    spyCursorTo.mockClear();
  });

  it("should correclty log incremental debug with line jump", () => {
    let out = "";
    const stdout = process.stdout;

    const spyClearLine = jest.spyOn(stdout, "clearLine").mockImplementation(() => ({}));
    const spyCursorTo = jest.spyOn(stdout, "cursorTo").mockImplementation(() => ({}));
    const spy = jest.spyOn(stdout, "write").mockImplementation((mess) => {
      out += mess;
    });

    loggerDebug.incrementalDebug("Dieu est grand.", true);
    const date = new Date();
    expect(out).toBe('[' + date + '] - \x1b[36mHSS-analyser: \x1b[33mDebug - '
      + "Dieu est grand." + '\x1b[0m\n');
    expect(spy).toHaveBeenCalledTimes(1);
    expect(spyClearLine).toHaveBeenCalledTimes(1);
    expect(spyCursorTo).toHaveBeenCalledTimes(1);
    spy.mockClear();
    spyClearLine.mockClear();
    spyCursorTo.mockClear();
  });
});

describe("log - log in non debug mode", () => {
  const logger = log(false, false);

  beforeEach(() => {
    jest.resetModules();
  });

  it("should correclty log error", () => {
    let out = "";
    const stdout = process.stdout;
    const spy = jest.spyOn(stdout, "write").mockImplementation((mess) => {
      out += mess;
    });
    logger.error("Dieu est grand.");
    const date = new Date();
    expect(out).toBe('[' + date + '] - \x1b[36mHSS-analyser: \x1b[31mError - '
      + "Dieu est grand." + '\x1b[0m\n');
    expect(spy).toHaveBeenCalledTimes(1);
    spy.mockClear();
  });

  it("should correclty log info", () => {
    let out = "";
    const stdout = process.stdout;
    const spy = jest.spyOn(stdout, "write").mockImplementation((mess) => {
      out += mess;
    });
    logger.info("Dieu est grand.");
    const date = new Date();
    expect(out).toBe('[' + date + '] - \x1b[36mHSS-analyser: \x1b[0mInfo - '
      + "Dieu est grand." + '\n');
    expect(spy).toHaveBeenCalledTimes(1);
    spy.mockClear();
  });

  it("should not log debug", () => {
    let out = "";
    const stdout = process.stdout;
    const spy = jest.spyOn(stdout, "write").mockImplementation((mess) => {
      out += mess;
    });
    logger.debug("Dieu est grand.");
    expect(out).toBe("");
    expect(spy).not.toHaveBeenCalled();
    spy.mockClear();
  });

  it("should not log incremental debug", () => {
    let out = "";
    const stdout = process.stdout;

    const spyClearLine = jest.spyOn(stdout, "clearLine").mockImplementation(() => ({}));
    const spyCursorTo = jest.spyOn(stdout, "cursorTo").mockImplementation(() => ({}));
    const spy = jest.spyOn(stdout, "write").mockImplementation((mess) => {
      out += mess;
    });

    logger.incrementalDebug("Dieu est grand.");
    expect(out).toBe("");
    expect(spy).not.toHaveBeenCalled();
    expect(spyClearLine).not.toHaveBeenCalled();
    expect(spyCursorTo).not.toHaveBeenCalled();
    spy.mockClear();
    spyClearLine.mockClear();
    spyCursorTo.mockClear();
  });
});