import * as storage from '../app/storage';
import { commandType, inputMode } from '../app/constants';
import { programState } from '../app/state';
import { dom } from '../ui/dom';
import { waitForUserInput } from './input';

// debounce
const sleep = (ms) => new Promise((res) => setTimeout(res, ms));

export async function RUN() {
  if (!storage.commandStorage.length) return;

  const numPrompts = storage.commandStorage.length;
  programState.isInputEnabled = false;

  for (let i = 0; i < numPrompts; i++) {
    const answer = await storage.commandStorage[i].fn(storage.commandStorage[i].args);
    let sleepTime = 100;

    dom.clearInput();

    // check if abort was pressed
    if (programState.abortProgram) {
      programState.abortProgram = false;
      programState.isInputEnabled = true;
      return;
    }

    // check if error was thrown
    if (answer.type === commandType.ERROR) {
      programState.isInputEnabled = true;
      dom.outputLine('?Syntax Error');
      return;
    }

    // execute GOTO
    if (answer.type === commandType.GOTO) {
      i = answer.value - 1;
      sleepTime = 0;
    }

    // execute INPUT
    if (answer.type === commandType.INPUT) {
      programState.activeInputMode = inputMode.INPUTVAR;
      programState.isInputEnabled = true;

      for (let j = 0; j < answer.value.length; j++) {
        try {
          await waitForUserInput(answer.value[j].value);
        } catch (err) {
          j--;
        }
      }

      programState.activeInputMode = inputMode.PROMPT;
      programState.isInputEnabled = false;
    }

    // add delay
    if (i < numPrompts - 1) await sleep(sleepTime);
  }

  programState.isInputEnabled = true;
  return { type: commandType.DEFAULT, value: null };
}
