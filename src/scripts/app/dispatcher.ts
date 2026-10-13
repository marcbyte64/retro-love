import { dom } from '../ui/dom';
import { commands } from '../commands/index';
import * as storage from './storage';

function createDispatcher() {
  function dispatchCommand(prompt: string) {
    const lineNumberMatch = prompt.match(/^(\d+)\s/);
    const lineNumber = lineNumberMatch ? Number(lineNumberMatch[1]) : null;
    const commandText = lineNumberMatch ? prompt.slice(lineNumberMatch[0].length) : prompt;
    const validatedCommand = validateCommand(commandText);

    // todo: clean up
    if (!validatedCommand || !validatedCommand.valid) {
      dom.outputLine(`?Syntax Error`);
      dom.resetInput(true);
      return;
    }

    if (lineNumberMatch !== null) {
      const lineNumber = Number(lineNumberMatch[1]);
      const { fn, args } = validatedCommand;

      storage.storeCommand({ lineNumber, fn, args });
      dom.resetInput(false);
    } else {
      validatedCommand.fn(validatedCommand.args).then(() => {
        dom.resetInput(true);
      });
    }
  }

  function validateCommand(commandText: string) {
    const space = commandText.indexOf(' ');
    let command, args;

    if (space !== -1) {
      command = commandText.slice(0, space);
      args = space !== -1 ? commandText.slice(space + 1) : null;
    } else {
      command = commandText;
      args = null;
    }

    // check if cmd exists and arguments match
    const result = commands[command];

    if (!result) return false;

    const isValid = !!((result.args && args) || (!result.args && !args));

    return {
      valid: isValid,
      fn: result.fn,
      args: args,
    };
  }

  return { dispatchCommand };
}

export const dispatcher = createDispatcher();
