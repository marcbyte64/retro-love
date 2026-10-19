import type { CommandResult } from "../types/command";
import { commandType } from "../app/constants";
import * as storage from "../app/storage";

export async function GOTO(args: string): Promise<CommandResult> {
  const targetLineNumber = Number(args.trim());
  const targetLine = storage.commandStorage.findIndex((obj) => obj.lineNumber === targetLineNumber);

  if (targetLine === -1) return { type: commandType.ERROR, value: null };
  return { type: commandType.GOTO, value: targetLine };
}
