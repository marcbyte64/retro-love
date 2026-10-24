import type { CommandResult } from "../types/command";
import { commandType } from "../app/constants";
import * as storage from "../app/storage";
import { dom } from "../ui/dom";
import * as strings from "../utils/strings";

export async function PRINT(args: string): Promise<CommandResult> {
  if (args) {
    const tokens = strings.tokenize(args);
    const resolved = strings.substituteVariables(tokens, storage.variableStorage);
    const output = strings.parse(resolved);
    dom.outputLine(output);
  } else {
    dom.outputLine("");
  }

  return { type: commandType.DEFAULT, value: null };
}
