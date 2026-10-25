import { beforeEach, describe, expect, it, vi } from "vite-plus/test";
import { commandType } from "../app/constants";
import * as storage from "../app/storage";
import { GOTO } from "../commands/goto";

vi.mock("../ui/dom", () => ({
  dom: {},
}));

beforeEach(() => {
  storage.clearCommandStorage();
});

describe("GOTO command", () => {
  beforeEach(() => {
    for (const lineNumber of [10, 20, 100]) {
      storage.storeCommand({
        lineNumber,
        name: "rem",
        fn: async () => ({ type: commandType.DEFAULT, value: null }),
        args: "",
      });
    }
  });

  it.each([
    ["10", 0],
    ["20", 1],
    ["100", 2],
    [" 20 ", 1],
  ])("resolves line %s to storage index %i", async (input, index) => {
    expect(await GOTO(input)).toEqual({
      type: commandType.GOTO,
      value: index,
    });
  });

  it.each(["30", "999", ""])("rejects a missing or empty target: %s", async (input) => {
    expect(await GOTO(input)).toEqual({
      type: commandType.ERROR,
      value: null,
    });
  });

  it.each(["1e2", "0x64", "100.0", "abc", "-10", "10+10"])(
    "rejects invalid line number syntax: %s",
    async (input) => {
      expect(await GOTO(input)).toEqual({
        type: commandType.ERROR,
        value: null,
      });
    },
  );
});
