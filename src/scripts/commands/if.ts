import type { CommandResult } from "../types/command";
import { commandType } from "../app/constants";
import * as strings from "../../scripts/utils/strings";
import * as storage from "../app/storage";
import { GOTO } from "./goto";

export async function IF(args: string): Promise<CommandResult> {
  const tokens = strings.tokenize(args);
  const validOperands = ["variable", "string", "number"];

  //console.log(tokens);

  if (
    !validOperands.includes(tokens[0].type) ||
    !validOperands.includes(tokens[2].type || tokens[1].type !== "comparisonoperator")
  ) {
    return { type: commandType.ERROR, value: null };
  }

  // prepare variables and arguments
  const operands = tokens.map((token, index) =>
    token.type === "variable" && index < 3
      ? strings.substituteVariables([token], storage.variableStorage)[0]
      : token,
  );
  const operand1 = operands[0].value;
  const operand2 = operands[2].value;
  const operator = tokens[1].value;
  const command = tokens[3].value;
  const lineNumber = tokens[4].value;
  let isTrue = false;

  // compare operands via operator
  // TODO: determineVariableType and throw mismatch error?
  if (operator === "=") {
    if (operand1 == operand2) {
      isTrue = true;
    }
  } else if (operator === "<>") {
    if (operand1 != operand2) {
      isTrue = true;
    }
  } else if (operator === "<") {
    if (operand1 < operand2) {
      isTrue = true;
    }
  } else if (operator === "<=") {
    if (operand1 <= operand2) {
      isTrue = true;
    }
  } else if (operator === ">") {
    if (operand1 > operand2) {
      isTrue = true;
    }
  } else if (operator === ">=") {
    if (operand1 >= operand2) {
      isTrue = true;
    }
  }

  // TODO: accept command after then: if 1=1 then print "hello"
  if (isTrue) {
    if (command === "then") {
      return GOTO(String(lineNumber));
    } else {
      return { type: commandType.ERROR, value: null };
    }
  }

  return { type: commandType.DEFAULT, value: null };
}
