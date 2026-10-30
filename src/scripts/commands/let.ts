import type { CommandResult } from "../types/command";
import { commandType } from "../app/constants";
import * as strings from "../utils/strings";
import * as storage from "../app/storage";
import { calculate } from "../utils/arithmetic";

export async function LET(args: string): Promise<CommandResult> {
  try {
    const tokens = strings.tokenize(args);

    if (
      tokens.length < 3 ||
      tokens[0].type !== "variable" ||
      tokens[1].type !== "comparisonoperator" ||
      tokens[1].value !== "="
    ) {
      return { type: commandType.ERROR, value: null };
    }

    const variableName = String(tokens[0].value);
    const expectedType = strings.determineVariableType(variableName);

    const expression = strings.substituteVariables(tokens.slice(2), storage.variableStorage);

    let value: string | number;

    if (expectedType === "string") {
      if (expression.length !== 1 || expression[0].type !== "string") {
        return { type: commandType.ERROR, value: null };
      }

      value = String(expression[0].value);
    } else {
      if (expression.some((token) => token.type !== "number" && token.type !== "operator")) {
        return { type: commandType.ERROR, value: null };
      }

      const result = calculate(expression);
      value = strings.convertToType(result, expectedType);
    }

    storage.storeVariable(variableName, value);

    return { type: commandType.DEFAULT, value: null };
  } catch {
    return { type: commandType.ERROR, value: null };
  }
}
