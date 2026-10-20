import { beforeEach, describe, expect, it, vi } from "vite-plus/test";
import { commandType } from "../app/constants";
import { IF } from "../commands/if";
import { GOTO } from "../commands/goto";

vi.mock("../commands/goto", () => ({
  GOTO: vi.fn(),
}));

const mockedGOTO = vi.mocked(GOTO);

beforeEach(() => {
  vi.clearAllMocks();
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
    mockedGOTO.mockResolvedValue({
      type: commandType.DEFAULT,
      value: null,
    });

    const result = await IF(`${expression} then 100`);

    if (expected) {
      expect(mockedGOTO).toHaveBeenCalledWith("100");
    } else {
      expect(mockedGOTO).not.toHaveBeenCalled();
      expect(result).toEqual({
        type: commandType.DEFAULT,
        value: null,
      });
    }
  });
});
