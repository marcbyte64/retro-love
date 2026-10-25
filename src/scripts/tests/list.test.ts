import { beforeEach, describe, expect, it, vi } from "vite-plus/test";
import { commandType } from "../app/constants";
import * as storage from "../app/storage";
import { LIST } from "../commands/list";
import { dom } from "../ui/dom";

vi.mock("../ui/dom", () => ({
  dom: {
    outputLine: vi.fn(),
  },
}));

const mockedOutputLine = vi.mocked(dom.outputLine);

beforeEach(() => {
  vi.clearAllMocks();
  storage.clearCommandStorage();
});

describe("LIST command", () => {
  it("lists program lines in numerical order", async () => {
    for (const lineNumber of [30, 10, 20]) {
      storage.storeCommand({
        lineNumber,
        name: "rem",
        args: "",
        fn: async () => ({ type: commandType.DEFAULT, value: null }),
      });
    }

    const result = await LIST();

    expect(result).toEqual({
      type: commandType.DEFAULT,
      value: null,
    });

    expect(mockedOutputLine.mock.calls).toEqual([["10 REM"], ["20 REM"], ["30 REM"]]);
  });

  it("prints command names in uppercase and preserves arguments", async () => {
    storage.storeCommand({
      lineNumber: 10,
      name: "print",
      args: '"Hello World"',
      fn: async () => ({ type: commandType.DEFAULT, value: null }),
    });

    await LIST();

    expect(mockedOutputLine).toHaveBeenCalledWith('10 PRINT "Hello World"');
  });

  it("does not add trailing spaces to commands without arguments", async () => {
    storage.storeCommand({
      lineNumber: 20,
      name: "clr",
      args: "",
      fn: async () => ({ type: commandType.DEFAULT, value: null }),
    });

    await LIST();

    expect(mockedOutputLine).toHaveBeenCalledWith("20 CLR");
  });

  it("produces no output for an empty program", async () => {
    const result = await LIST();

    expect(result).toEqual({
      type: commandType.DEFAULT,
      value: null,
    });
    expect(mockedOutputLine).not.toHaveBeenCalled();
  });
});
