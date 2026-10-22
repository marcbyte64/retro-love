import type { CommandResult } from "../types/command";
import { commandType } from "../app/constants";
import { dom } from "../ui/dom";

// TODO: CLR should clear the variables
export async function CLR(): Promise<CommandResult> {
  dom.clearOutput();
  dom.clearInput();

  return { type: commandType.DEFAULT, value: null };
}
