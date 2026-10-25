import { beforeEach, describe, expect, it, vi } from "vite-plus/test";
import { commandType } from "../app/constants";
import { IF } from "../commands/if";
import { GOTO } from "../commands/goto";
import { dom } from "../ui/dom";

vi.mock("../ui/dom", () => ({
  dom: {
    outputLine: vi.fn(),
  },
}));

vi.mock("../commands/goto", () => ({
  GOTO: vi.fn(),
}));

const mockedGOTO = vi.mocked(GOTO);
const mockedOutputLine = vi.mocked(dom.outputLine);

beforeEach(() => {
  vi.clearAllMocks();

  mockedGOTO.mockResolvedValue({
    type: commandType.GOTO,
    value: 0,
  });
});

describe("IF command", () => {
  it.each([
    ["1=1", true],
    ["1=2", false],
    ["1<>2", true],
    ["1<>1", false],
    ["1<2", true],
    ["2<1", false],
    ["2<=2", true],
    ["2>1", true],
    ["1>2", false],
    ["2>=2", true],
  ])("evaluates %s correctly", async (expression, expected) => {
    const result = await IF(`${expression} then 100`);

    if (expected) {
      expect(mockedGOTO).toHaveBeenCalledWith("100");
      expect(result.type).toBe(commandType.GOTO);
    } else {
      expect(mockedGOTO).not.toHaveBeenCalled();
      expect(result).toEqual({
        type: commandType.DEFAULT,
        value: null,
      });
    }
  });

  it.each([
    ["1=1 AND 2=2", true],
    ["1=1 AND 2=3", false],
    ["1=2 AND 2=2", false],
    ["1=2 OR 2=2", true],
    ["1=2 OR 2=3", false],
    ["1=1 OR 2=3", true],
    ["1=1 AND 2=2 OR 3=4", true],
    ["1=2 AND 2=2 OR 3=3", true],
    ["1=1 OR 2=3 AND 3=4", true],
  ])("evaluates logical conditions: %s", async (expression, expected) => {
    const result = await IF(`${expression} THEN 100`);

    if (expected) {
      expect(mockedGOTO).toHaveBeenCalledWith("100");
      expect(result.type).toBe(commandType.GOTO);
    } else {
      expect(mockedGOTO).not.toHaveBeenCalled();
      expect(result.type).toBe(commandType.DEFAULT);
    }
  });

  it.each([
    "1=1 AND 2= THEN 100",
    "1=1 OR 2= THEN 100",
    "1=1 THEN",
    "1=1 THEN 100 GARBAGE",
    "1.2.3=1 THEN 100",
  ])("rejects invalid conditions: %s", async (input) => {
    const result = await IF(input);

    expect(result.type).toBe(commandType.ERROR);
    expect(mockedGOTO).not.toHaveBeenCalled();
  });

  it("executes PRINT when the condition is true", async () => {
    const result = await IF('1=1 THEN PRINT "HELLO"');

    expect(result.type).toBe(commandType.DEFAULT);
    expect(mockedOutputLine).toHaveBeenCalledWith("HELLO");
  });

  it("skips PRINT when the condition is false", async () => {
    const result = await IF('1=2 THEN PRINT "HELLO"');

    expect(result.type).toBe(commandType.DEFAULT);
    expect(mockedOutputLine).not.toHaveBeenCalled();
  });

  it("passes arithmetic expressions to PRINT", async () => {
    const result = await IF("1=1 THEN PRINT 2+3");

    expect(result.type).toBe(commandType.DEFAULT);
    expect(mockedOutputLine).toHaveBeenCalledWith("5");
  });

  it("returns an error for invalid PRINT expressions", async () => {
    const result = await IF("1=1 THEN PRINT 2+");

    expect(result.type).toBe(commandType.ERROR);
    expect(mockedOutputLine).not.toHaveBeenCalled();
  });
});
