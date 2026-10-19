import { dom } from "../ui/dom";
import { commands } from "../commands/index";
import * as storage from "./storage";

function createDispatcher() {
  function dispatchCommand(prompt: string) {
    const lineNumberMatch = prompt.match(/^(\d+)\s/);
    const commandText = lineNumberMatch ? prompt.slice(lineNumberMatch[0].length) : prompt;
    const validatedCommand = validateCommand(commandText);

    // newline
    if (commandText === "") {
      dom.resetInput(false);
      return;
    }

    // invalid command
    if (!validatedCommand || !validatedCommand.valid) {
      dom.outputLine(`?Syntax Error`);
      dom.resetInput(true);
      return;
    }

    if (lineNumberMatch !== null) {
      const lineNumber = Number(lineNumberMatch[1]);
      const { name, fn, args } = validatedCommand;

      storage.storeCommand({ lineNumber, name, fn, args });
      dom.resetInput(false);
    } else {
      void validatedCommand
        .fn(validatedCommand.args)
        .then(() => {
          dom.resetInput(true);
        })
        .catch((error: unknown) => {
          console.error("Command execution failed:", error);
        });
    }
  }

  function validateCommand(commandText: string) {
    const space = commandText.indexOf(" ");
    const command = commandText.slice(0, space === -1 ? undefined : space);
    const args = space === -1 ? "" : commandText.slice(space + 1);

    // lookup and validate command
    if (!isCommandName(command)) {
      return false;
    }
    const result = commands[command];

    if (!result) return false;

    const isValid = !!((result.args && args) || (!result.args && !args));

    return {
      valid: isValid,
      name: command,
      fn: result.fn,
      args,
    };
  }

  function isCommandName(name: string): name is keyof typeof commands {
    return Object.prototype.hasOwnProperty.call(commands, name);
  }

  return { dispatchCommand };
}

export const dispatcher = createDispatcher();
