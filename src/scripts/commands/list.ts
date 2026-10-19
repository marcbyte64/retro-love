import type { CommandResult } from "../types/command";
import { commandType } from "../app/constants";
import * as storage from "../app/storage";
import { dom } from "../ui/dom";

export async function LIST(): Promise<CommandResult> {
  // TODO: list prompts of range, e.g. LIST 30,80
  for (const prompt of storage.commandStorage) {
    dom.outputLine(
      `${prompt.lineNumber} ${prompt.name.toUpperCase()}${prompt.args ? ` ${prompt.args}` : ""}`,
    );
  }

  return { type: commandType.DEFAULT, value: null };
}
