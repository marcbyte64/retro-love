import type { Token } from "../types/token";
import type { CommandResult } from "../types/command";
import { commandType } from "../app/constants";
import { storeVariable } from "../app/storage";
import * as strings from "../../scripts/utils/strings";
import { dom } from "../ui/dom";

export async function INPUT(args: string): Promise<CommandResult> {
  let tokens: Token[];

  try {
    tokens = strings.tokenize(args);
  } catch {
    return { type: commandType.ERROR, value: null };
  }

  // check optional prompt
  if (tokens[0]?.type === "string") {
    if (tokens[1]?.value !== ";" || tokens[2]?.type !== "variable") {
      return { type: commandType.ERROR, value: null };
    }

    dom.outputLine(tokens[0].value);
  }

  // extract variables
  const vars = tokens[0]?.type === "string" ? tokens.slice(2) : tokens;

  const lastElement = vars.slice(-1)[0];
  const separatorsValid = vars.every((value, index) =>
    index % 2 === 1 ? value.value === "," : true,
  );
  const variablesValid = vars.every((value, index) =>
    index % 2 === 0 ? value.type === "variable" : true,
  );

  if (!lastElement || lastElement.type !== "variable") {
    return { type: commandType.ERROR, value: null };
  }

  // invalild input
  if (!separatorsValid || !variablesValid || lastElement.type !== "variable") {
    return { type: commandType.ERROR, value: null };
  }

  const requestedVariables = vars.filter((_, i) => i % 2 === 0);
  return { type: commandType.INPUT, value: requestedVariables };
}

export async function waitForUserInput(variableName: string) {
  return new Promise((resolve, reject) => {
    const cleanup = () => {
      dom.input.removeEventListener("keydown", handler);
      dom.input.removeEventListener("cancelInput", cancelHandler);
    };

    const cancelHandler = () => {
      cleanup();
      reject(new Error("InputCancelled"));
    };

    const handler = (e: KeyboardEvent): void => {
      if (e.key === "Enter") {
        const inputValue = dom.input.value.trim();
        const isCompatible = strings.isTypeCompatible(variableName, inputValue);
        const expectedType = strings.determineVariableType(variableName);

        // reject if type is invalid
        if (!isCompatible) {
          cleanup();
          dom.outputLine(inputValue);
          dom.outputLine("?REDO FROM START");
          dom.clearInput();
          reject(new Error("InvalidType"));
          return;
        }

        // store if valid
        const value = strings.convertToType(inputValue, expectedType);
        storeVariable(variableName, value);
        dom.outputLine(inputValue);
        dom.clearInput();
        cleanup();
        resolve(inputValue);
      }
    };

    // add temporary event listeners
    dom.input.addEventListener("keydown", handler);
    dom.input.addEventListener("cancelInput", cancelHandler);
  });
}
