import { commandType } from "./constants";
import { dom } from "../ui/dom";
import { commands } from "../commands/index";
import * as storage from "./storage";

function createDispatcher() {
  function dispatchCommand(inputLine: string) {
    const lineNumberMatch = inputLine.match(/^(\d+)(?:\s|$)/);
    const commandText = lineNumberMatch ? inputLine.slice(lineNumberMatch[0].length) : inputLine;

    // newline / delete storage line
    if (commandText === "") {
      if (lineNumberMatch) {
        storage.deleteCommand(Number(lineNumberMatch[1]));
      }

      dom.resetInput(false);
      return;
    }

    const validatedCommand = validateCommand(commandText);

    // invalid command
    if (!validatedCommand || !validatedCommand.valid) {
      dom.outputLine(`?Syntax Error`);
      dom.resetInput(true);
      return;
    }

    // store numbered programm lines
    if (lineNumberMatch !== null) {
      const lineNumber = Number(lineNumberMatch[1]);
      const { name, fn, args } = validatedCommand;

      storage.storeCommand({ lineNumber, name, fn, args });
      dom.resetInput(false);
      return;
    }

    // execute commands without line number
    void validatedCommand
      .fn(validatedCommand.args)
      .then((result) => {
        if (result.type === commandType.ERROR) {
          dom.outputLine("?Syntax Error");
        }

        dom.resetInput(true);
      })
      .catch((error: unknown) => {
        console.error("Command execution failed:", error);
        dom.resetInput(true);
      });
  }

  function validateCommand(commandText: string) {
    const spaceIndex = commandText.indexOf(" ");
    const command = commandText.slice(0, spaceIndex === -1 ? undefined : spaceIndex).toLowerCase();
    const args = spaceIndex === -1 ? "" : commandText.slice(spaceIndex + 1);

    if (!isCommandName(command)) {
      return false;
    }

    const definition = commands[command];
    const isValid =
      definition.args === "optional" ||
      (definition.args === "required" && args !== "") ||
      (definition.args === "none" && args === "");

    return {
      valid: isValid,
      name: command,
      fn: definition.fn,
      args,
    };
  }

  function isCommandName(name: string): name is keyof typeof commands {
    return Object.prototype.hasOwnProperty.call(commands, name);
  }

  return { dispatchCommand };
}

export const dispatcher = createDispatcher();
