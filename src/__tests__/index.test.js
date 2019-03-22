describe("index", () => {
  beforeEach(() => {
    jest.resetModules();
  });

  xit("should be correclty imported and executed", () => {
    const mockStart = jest.fn(() => null);
    jest.mock("../start", () => ({
      __esModule: true,
      default: mockStart,
    }));
    expect(require("../index")).not.toThrow();
    expect(mockStart).toHaveBeenCalledTimes(1);
  });

  xit("should throw", () => {
    const mockStart = jest.fn(() => {
      throw new Error("error");
    });
    jest.mock("../start", () => ({
      __esModule: true,
      default: mockStart,
    }));
    expect(() => {
      const a = require("../index");
      console.log(a);
    }).toThrowError("error");
    expect(mockStart).toHaveBeenCalledTimes(1);
  });
});
