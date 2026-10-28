import { beforeEach, describe, expect, it, vi } from "vite-plus/test";

vi.mock("../ui/dom", () => ({
  dom: {
    outputLine: vi.fn(),
    resetInput: vi.fn(),
  },
}));

vi.mock("../programs", () => ({
  programs: {
    website: '10 PRINT "HELLO"\n20 PRINT "WORLD"',
  },
}));

import { LOAD } from "../commands/load";
import { commandType } from "../app/constants";
import * as storage from "../app/storage";

describe("LOAD", () => {
  beforeEach(() => {
    storage.clearAllStorage();
    vi.clearAllMocks();
  });

  it("loads a bundled BASIC program", async () => {
    const result = await LOAD('"WEBSITE"');

    expect(result.type).toBe(commandType.DEFAULT);
    expect(storage.commandStorage.map((line) => line.lineNumber)).toEqual([10, 20]);
    expect(storage.commandStorage.map((line) => line.name)).toEqual(["print", "print"]);
  });

  it("accepts lowercase program names", async () => {
    const result = await LOAD('"website"');

    expect(result.type).toBe(commandType.DEFAULT);
    expect(storage.commandStorage).toHaveLength(2);
  });

  it("rejects an unknown program", async () => {
    const result = await LOAD('"UNKNOWN"');

    expect(result.type).toBe(commandType.ERROR);
    expect(storage.commandStorage).toHaveLength(0);
  });

  it("rejects an unquoted program name", async () => {
    const result = await LOAD("WEBSITE");

    expect(result.type).toBe(commandType.ERROR);
  });

  it("replaces the previously stored program", async () => {
    await LOAD('"WEBSITE"');

    const result = await LOAD('"WEBSITE"');

    expect(result.type).toBe(commandType.DEFAULT);
    expect(storage.commandStorage).toHaveLength(2);
  });

  it("preserves existing variables", async () => {
    storage.storeVariable("A", 42);

    await LOAD('"WEBSITE"');

    expect(storage.variableStorage.a).toBe(42);
  });
});
