import { commandType } from "../app/constants";
import * as storage from "../app/storage";
import { programs } from "../programs";
import type { CommandResult } from "../types/command";

export async function LOAD(args: string): Promise<CommandResult> {
  const match = args.trim().match(/^"([^"]+)"$/);

  if (!match) {
    return { type: commandType.ERROR, value: null };
  }

  const programName = match[1].toLowerCase();
  const source = programs[programName];

  if (source === undefined) {
    return { type: commandType.ERROR, value: null };
  }

  // avoid a circular dependency
  const { dispatcher } = await import("../app/dispatcher");

  storage.clearCommandStorage();

  for (const line of source.split(/\r?\n/)) {
    if (line.trim()) {
      dispatcher.dispatchCommand(line);
    }
  }

  return { type: commandType.DEFAULT, value: null };
}
