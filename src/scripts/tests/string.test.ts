import { describe, expect, it, vi } from "vite-plus/test";
import * as strings from "../utils/strings";

vi.mock("../ui/dom", () => ({
  dom: {},
}));

describe("BASIC tokenizer", () => {
  it("recognizes numeric literals", () => {
    const tokens = strings.tokenize("123");

    expect(tokens).toEqual([{ type: "number", value: 123 }]);
  });

  it.each(["ORANGE", "PRINTABLE", "ANDROID"])("recognizes %s as a complete variable", (name) => {
    expect(strings.tokenize(name)).toEqual([{ type: "variable", value: name.toLowerCase() }]);
  });

  it.each([
    [
      '1=1 THEN PRINT "YES"',
      [
        { type: "number", value: 1 },
        { type: "comparisonoperator", value: "=" },
        { type: "number", value: 1 },
        { type: "keyword", value: "then" },
        { type: "command", value: "print" },
        { type: "string", value: "YES" },
      ],
    ],
    [
      '1=2 OR 2=2 THEN PRINT "YES"',
      [
        { type: "number", value: 1 },
        { type: "comparisonoperator", value: "=" },
        { type: "number", value: 2 },
        { type: "keyword", value: "or" },
        { type: "number", value: 2 },
        { type: "comparisonoperator", value: "=" },
        { type: "number", value: 2 },
        { type: "keyword", value: "then" },
        { type: "command", value: "print" },
        { type: "string", value: "YES" },
      ],
    ],
  ])("recognizes keywords and commands separated by spaces", (input, expected) => {
    expect(strings.tokenize(input)).toEqual(expected);
  });
});

describe("BASIC variable type conversion", () => {
  it.each([
    ["12", 12],
    ["12.8", 12],
    ["-12.8", -12],
    [".5", 0],
    ["-.5", 0],
  ])("converts %s to integer %i", (input, expected) => {
    expect(strings.convertToType(input, "integer")).toBe(expected);
  });
});

describe("BASIC variable type compatibility", () => {
  it.each([
    ["A", "123", true],
    ["A", "-12.5", true],
    ["A", ".5", true],
    ["A", "12.", true],
    ["A", "HELLO", false],
    ["A", "", false],
    ["A%", "123", true],
    ["A%", "12.8", true],
    ["A%", "-.5", true],
    ["A%", "HELLO", false],
    ["A$", "HELLO", true],
    ["A$", "123", true],
    ["A$", "", true],
  ])("checks whether %s accepts %s", (variable, input, expected) => {
    expect(strings.isTypeCompatible(variable, input)).toBe(expected);
  });
});

describe("BASIC variable value conversion", () => {
  it.each([
    ["123", "float", 123],
    ["-12.5", "float", -12.5],
    [".5", "float", 0.5],
    ["12.", "float", 12],
    ["HELLO", "string", "HELLO"],
    ["  Hello World  ", "string", "Hello World"],
    ["123", "string", "123"],
    ["", "string", ""],
  ])("converts %s to %s", (input, type, expected) => {
    expect(strings.convertToType(input, type)).toBe(expected);
  });
});

describe("BASIC keyword preservation", () => {
  it.each([
    ['"AND WHAT"', "AND WHAT"],
    ['"IF SO"', "IF SO"],
    ['"OR ELSE"', "OR ELSE"],
    ['"PRINT HELLO"', "PRINT HELLO"],
    ['"THEN WHAT"', "THEN WHAT"],
  ])("preserves keywords and commands inside %s", (input, expected) => {
    expect(strings.tokenize(input)).toEqual([{ type: "string", value: expected }]);
  });
});
