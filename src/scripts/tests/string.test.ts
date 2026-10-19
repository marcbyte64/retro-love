import { describe, expect, it } from "vite-plus/test";
import * as strings from "../utils/strings";

describe("BASIC tokenizer", () => {
  it("recognizes numeric literals", () => {
    const tokens = strings.tokenize("123");

    expect(tokens).toEqual([{ type: "number", value: 123 }]);
  });
});
