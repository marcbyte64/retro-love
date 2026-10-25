import type { CommandResult } from "../types/command";
import { commandType } from "../app/constants";
import * as storage from "../app/storage";

export async function GOTO(args: string): Promise<CommandResult> {
  const target = args.trim();

  if (!/^\d+$/.test(target)) {
    return { type: commandType.ERROR, value: null };
  }

  const targetLineNumber = Number(target);
  const targetIndex = storage.commandStorage.findIndex(
    (obj) => obj.lineNumber === targetLineNumber,
  );

  if (targetIndex === -1) return { type: commandType.ERROR, value: null };
  return { type: commandType.GOTO, value: targetIndex };
}
