import { commandType } from '../app/constants';
import * as storage from '../app/storage';
import { dom } from '../ui/dom';

export async function LIST() {
  // TODO: list prompts of range, e.g. LIST 30,80
  storage.commandStorage.forEach((prompt) => {
    dom.outputLine(`${prompt.lineNumber} ${prompt.fn.name} ${prompt.args}`);
  });

  return { type: commandType.DEFAULT, value: null };
}
