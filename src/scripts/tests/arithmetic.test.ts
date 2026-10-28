import { describe, expect, it } from "vite-plus/test";
import { calculate } from "../utils/arithmetic";
import type { Token } from "../types/token";

describe("Arithmetic calculations", () => {
  const expression = (...values: (number | string)[]): Token[] =>
    values.map((value) => ({
      type: typeof value === "number" ? "number" : "operator",
      value,
    })) as Token[];

  describe("Basic operations", () => {
    it.each([
      [[2, "+", 3], "5"],
      [[7, "-", 4], "3"],
      [[6, "*", 3], "18"],
      [[12, "/", 4], "3"],
      [[5, "/", 2], "2.5"],
      [[0, "+", 0], "0"],
      [[5], "5"],
    ])("calculates %j as %s", (values, expected) => {
      expect(calculate(expression(...values))).toBe(expected);
    });
  });

  describe("Operator precedence", () => {
    it.each([
      [[2, "+", 3, "*", 4], "14"],
      [[2, "*", 3, "+", 4], "10"],
      [[10, "-", 6, "/", 2], "7"],
      [[20, "/", 4, "+", 3, "*", 2], "11"],
      [[2, "+", 3, "*", 4, "-", 5], "9"],
    ])("respects precedence in %j", (values, expected) => {
      expect(calculate(expression(...values))).toBe(expected);
    });
  });

  describe("Left-to-right evaluation", () => {
    it.each([
      [[10, "-", 3, "-", 2], "5"],
      [[20, "/", 2, "/", 2], "5"],
      [[2, "*", 3, "*", 4], "24"],
      [[10, "+", 5, "-", 3], "12"],
      [[12, "/", 3, "*", 2], "8"],
    ])("evaluates %j left to right", (values, expected) => {
      expect(calculate(expression(...values))).toBe(expected);
    });
  });

  describe("Invalid expressions", () => {
    it.each([
      [2, "+", "+", 3],
      [2, "*", "*", 3],
      [2, "+", 3, "+"],
      ["*", 2],
      [2, 3],
      [2, "+", "hello"],
    ])("rejects invalid expression %j", (...values) => {
      expect(() => calculate(expression(...values))).toThrow();
    });
  });

  describe("Edge cases", () => {
    it("supports decimal numbers", () => {
      expect(calculate(expression(1.5, "+", 2.25))).toBe("3.75");
    });

    it("handles division by zero", () => {
      expect(calculate(expression(5, "/", 0))).toBe("Infinity");
    });

    it("does not mutate the original tokens", () => {
      const tokens = expression(2, "+", 3, "*", 4);
      const original = structuredClone(tokens);

      calculate(tokens);

      expect(tokens).toEqual(original);
    });
  });

  describe("Unary minus", () => {
    it("handles a negative number", () => {
      expect(
        calculate([
          { type: "operator", value: "-" },
          { type: "number", value: "5" },
        ]),
      ).toBe("-5");
    });

    it("handles unary minus after multiplication", () => {
      expect(
        calculate([
          { type: "number", value: "2" },
          { type: "operator", value: "*" },
          { type: "operator", value: "-" },
          { type: "number", value: "3" },
        ]),
      ).toBe("-6");
    });

    it("handles subtraction of a negative number", () => {
      expect(
        calculate([
          { type: "number", value: "10" },
          { type: "operator", value: "-" },
          { type: "operator", value: "-" },
          { type: "number", value: "5" },
        ]),
      ).toBe("15");
    });

    it("still rejects consecutive plus operators", () => {
      expect(() =>
        calculate([
          { type: "number", value: "2" },
          { type: "operator", value: "+" },
          { type: "operator", value: "+" },
          { type: "number", value: "3" },
        ]),
      ).toThrow();
    });
  });
});
