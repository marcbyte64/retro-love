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
