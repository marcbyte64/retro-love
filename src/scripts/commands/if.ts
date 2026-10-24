import type { CommandResult } from "../types/command";
import { commandType } from "../app/constants";
import * as strings from "../utils/strings";
import * as storage from "../app/storage";
import type { Token } from "../types/token";
import { GOTO } from "./goto";
import { PRINT } from "./print";

type ComparisonResult = {
  type: "success" | "error";
  value: boolean;
};

export async function IF(args: string): Promise<CommandResult> {
  const tokens = strings.tokenize(args);
  let isResolved = false;

  let comparison: ComparisonResult = { type: "success", value: false };
  for (let i = 0; i < tokens.length;) {
    // evaluate first statement
    if (i === 0) {
      comparison = evaluateComparison(tokens[i], tokens[i + 2], tokens[i + 1]);
      i += 3;
      continue;
    }

    // abort if arguments are invalid
    if (comparison.type === "error") {
      return { type: commandType.ERROR, value: null };
    }

    // evaluate or-statements
    if (tokens[i].type === "keyword" && tokens[i].value === "or" && !isResolved) {
      if (comparison.value) {
        isResolved = true;
      } else {
        comparison = evaluateComparison(tokens[i + 1], tokens[i + 3], tokens[i + 2]);
      }
      i += 4;
      continue;
    }

    // evaluate and-statements
    if (tokens[i].type === "keyword" && tokens[i].value === "and" && !isResolved) {
      if (comparison.value) {
        comparison = evaluateComparison(tokens[i + 1], tokens[i + 3], tokens[i + 2]);
      }
      i += 4;
      continue;
    }

    // then: check for move to line
    if (
      comparison.value &&
      tokens[i].type === "keyword" &&
      (tokens[i].value === "then" || tokens[i].value === "goto") &&
      tokens[i + 1].type === "number"
    ) {
      return GOTO(String(tokens[i + 1].value));
    }

    // then: check for execute follow-up command
    if (
      comparison.value &&
      tokens[i].type === "keyword" &&
      tokens[i].value === "then" &&
      tokens[i + 1].value === "print"
    ) {
      return PRINT(`"${tokens[i + 2].value}"`);
    }

    i++;
  }

  return { type: commandType.DEFAULT, value: null };
}

function evaluateComparison(operand1: Token, operand2: Token, operator: Token): ComparisonResult {
  const validOperands = ["string", "number", "variable"];

  if (
    !validOperands.includes(operand1.type) ||
    !validOperands.includes(operand2?.type) ||
    operator.type !== "comparisonoperator"
  ) {
    return { type: "error", value: false };
  }

  // prepare variables and arguments
  const leftValue =
    operand1.type === "variable"
      ? strings.substituteVariables([operand1], storage.variableStorage)[0].value
      : operand1.value;
  const rightValue =
    operand2.type === "variable"
      ? strings.substituteVariables([operand2], storage.variableStorage)[0].value
      : operand2.value;
  let isTrue = false;

  // compare operands via operator
  // TODO: determineVariableType and throw mismatch error?
  if (operator.value === "=" && leftValue == rightValue) {
    isTrue = true;
  } else if (operator.value === "<>" && leftValue != rightValue) {
    isTrue = true;
  } else if (operator.value === "<" && leftValue < rightValue) {
    isTrue = true;
  } else if (operator.value === "<=" && leftValue <= rightValue) {
    isTrue = true;
  } else if (operator.value === ">" && leftValue > rightValue) {
    isTrue = true;
  } else if (operator.value === ">=" && leftValue >= rightValue) {
    isTrue = true;
  }

  return { type: "success", value: isTrue };
}
