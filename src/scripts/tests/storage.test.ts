import { beforeEach, describe, expect, it } from "vite-plus/test";
import { commandType } from "../app/constants";
import * as storage from "../app/storage";
import type { Command } from "../types/command";

const createCommand = (lineNumber: number, args = ""): Command => ({
  lineNumber,
  name: "rem",
  args,
  fn: async () => ({ type: commandType.DEFAULT, value: null }),
});

beforeEach(() => {
  storage.clearAllStorage();
});

describe("Program storage", () => {
  it("stores program lines in numerical order", () => {
    storage.storeCommand(createCommand(30));
    storage.storeCommand(createCommand(10));
    storage.storeCommand(createCommand(20));

    expect(storage.commandStorage.map((command) => command.lineNumber)).toEqual([10, 20, 30]);
  });

  it("replaces an existing program line", () => {
    storage.storeCommand(createCommand(10, "OLD"));
    storage.storeCommand(createCommand(10, "NEW"));

    expect(storage.commandStorage).toHaveLength(1);
    expect(storage.commandStorage[0].args).toBe("NEW");
  });

  it("deletes a program line without affecting other lines", () => {
    storage.storeCommand(createCommand(10));
    storage.storeCommand(createCommand(20));
    storage.storeCommand(createCommand(30));

    storage.deleteCommand(20);

    expect(storage.commandStorage.map((command) => command.lineNumber)).toEqual([10, 30]);
  });

  it("clears program lines without clearing variables", () => {
    storage.storeCommand(createCommand(10));
    storage.storeVariable("A", 42);

    storage.clearCommandStorage();

    expect(storage.commandStorage).toEqual([]);
    expect(storage.variableStorage.a).toBe(42);
  });
});

describe("Variable storage", () => {
  it("normalizes variable names to lowercase", () => {
    storage.storeVariable("A", 42);
    storage.storeVariable("NAME$", "Hello");

    expect(storage.variableStorage).toEqual({
      a: 42,
      name$: "Hello",
    });
  });

  it("replaces a variable regardless of name capitalization", () => {
    storage.storeVariable("A", 10);
    storage.storeVariable("a", 20);

    expect(storage.variableStorage).toEqual({ a: 20 });
  });

  it("clears variables without clearing program lines", () => {
    storage.storeCommand(createCommand(10));
    storage.storeVariable("A", 42);

    storage.clearVariableStorage();

    expect(storage.variableStorage).toEqual({});
    expect(storage.commandStorage).toHaveLength(1);
  });
});

describe("All storage", () => {
  it("clears both program lines and variables", () => {
    storage.storeCommand(createCommand(10));
    storage.storeVariable("A", 42);

    storage.clearAllStorage();

    expect(storage.commandStorage).toEqual([]);
    expect(storage.variableStorage).toEqual({});
  });
});
