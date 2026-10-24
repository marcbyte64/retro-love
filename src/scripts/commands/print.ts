import type { CommandResult } from "../types/command";
import type { Token } from "../types/token";
import { commandType } from "../app/constants";
import * as storage from "../app/storage";
import { dom } from "../ui/dom";
import * as strings from "../utils/strings";

export async function PRINT(args: string | Token[]): Promise<CommandResult> {
  try {
    const tokens = typeof args === "string" ? strings.tokenize(args) : args;

    if (tokens.length) {
      const resolved = strings.substituteVariables(tokens, storage.variableStorage);
      const output = strings.parse(resolved);
      dom.outputLine(output);
    } else {
      dom.outputLine("");
    }

    return { type: commandType.DEFAULT, value: null };
  } catch {
    return { type: commandType.ERROR, value: null };
  }
}
