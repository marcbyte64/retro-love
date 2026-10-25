import { beforeEach, describe, expect, it, vi } from "vite-plus/test";
import { commandType } from "../app/constants";
import * as storage from "../app/storage";
import { PRINT } from "../commands/print";
import { dom } from "../ui/dom";

vi.mock("../ui/dom", () => ({
  dom: {
    outputLine: vi.fn(),
  },
}));

const mockedOutputLine = vi.mocked(dom.outputLine);

beforeEach(() => {
  vi.clearAllMocks();
  storage.clearVariableStorage();
});

describe("PRINT command", () => {
  it.each([
    ['"HELLO"', "HELLO"],
    ["123", "123"],
    ["2+3", "5"],
    ["2+3*4", "14"],
    ['"HELLO', "HELLO"],
  ])("prints %s correctly", async (input, expected) => {
    const result = await PRINT(input);

    expect(result.type).toBe(commandType.DEFAULT);
    expect(mockedOutputLine).toHaveBeenCalledWith(expected);
  });

  it("prints a blank line without arguments", async () => {
    const result = await PRINT("");

    expect(result.type).toBe(commandType.DEFAULT);
    expect(mockedOutputLine).toHaveBeenCalledWith("");
  });

  it("substitutes numeric variables", async () => {
    storage.storeVariable("A", 42);

    const result = await PRINT("A");

    expect(result.type).toBe(commandType.DEFAULT);
    expect(mockedOutputLine).toHaveBeenCalledWith("42");
  });

  it("substitutes string variables", async () => {
    storage.storeVariable("A$", "HELLO");

    const result = await PRINT("A$");

    expect(result.type).toBe(commandType.DEFAULT);
    expect(mockedOutputLine).toHaveBeenCalledWith("HELLO");
  });

  it("evaluates arithmetic with variables", async () => {
    storage.storeVariable("A", 4);

    const result = await PRINT("A+3");

    expect(result.type).toBe(commandType.DEFAULT);
    expect(mockedOutputLine).toHaveBeenCalledWith("7");
  });

  it("handles output separators", async () => {
    const result = await PRINT('"HELLO";"WORLD"');

    expect(result.type).toBe(commandType.DEFAULT);
    expect(mockedOutputLine).toHaveBeenCalledWith("HELLO WORLD");
  });

  it.each(["2+", "2++3", "1.2.3", "12@34", "UNDEFINED"])(
    "returns an error for invalid input: %s",
    async (input) => {
      const result = await PRINT(input);

      expect(result.type).toBe(commandType.ERROR);
      expect(mockedOutputLine).not.toHaveBeenCalled();
    },
  );
});
