import type { CommandResult } from "../types/command";
import * as storage from "../app/storage";
import { commandType, inputMode } from "../app/constants";
import { programState } from "../app/state";
import { dom } from "../ui/dom";
import { waitForUserInput } from "./input";

const sleep = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

export async function RUN(): Promise<CommandResult> {
  if (!storage.commandStorage.length) {
    return { type: commandType.DEFAULT, value: null };
  }

  const lineCount = storage.commandStorage.length;
  programState.isInputEnabled = false;

  try {
    for (let i = 0; i < lineCount; i++) {
      const result = await storage.commandStorage[i].fn(storage.commandStorage[i].args);
      let delayMs = 10;

      dom.clearInput();

      // check if abort was pressed
      if (programState.abortProgram) {
        programState.abortProgram = false;
        return { type: commandType.DEFAULT, value: null };
      }

      // handle command errors
      if (result.type === commandType.ERROR) {
        dom.outputLine("?Syntax Error");
        return { type: commandType.ERROR, value: null };
      }

      // execute GOTO
      if (result.type === commandType.GOTO) {
        i = result.value - 1;
        delayMs = 0;
      }

      // execute INPUT
      if (result.type === commandType.INPUT) {
        programState.activeInputMode = inputMode.INPUTVAR;
        programState.isInputEnabled = true;

        for (let j = 0; j < result.value.length; j++) {
          try {
            await waitForUserInput(String(result.value[j].value));
          } catch {
            if (programState.abortProgram) {
              programState.abortProgram = false;
              return { type: commandType.DEFAULT, value: null };
            }

            j--;
          }
        }

        programState.activeInputMode = inputMode.PROMPT;
        programState.isInputEnabled = false;
      }

      // add delay
      if (i < lineCount - 1) await sleep(delayMs);
    }
  } finally {
    programState.activeInputMode = inputMode.PROMPT;
    programState.isInputEnabled = true;
  }

  return { type: commandType.DEFAULT, value: null };
}
