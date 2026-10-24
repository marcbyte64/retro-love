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
  let tokens: Token[];
  let isResolved = false;
  let comparison: ComparisonResult = { type: "success", value: false };

  try {
    tokens = strings.tokenize(args);
  } catch {
    return { type: commandType.ERROR, value: null };
  }

  for (let i = 0; i < tokens.length;) {
    // evaluate first statement
    if (i === 0) {
      comparison = evaluateComparison(tokens[i], tokens[i + 2], tokens[i + 1]);

      if (comparison.type === "error") {
        return { type: commandType.ERROR, value: null };
      }

      i += 3;
      continue;
    }

    // evaluate or-statements
    if (tokens[i].type === "keyword" && tokens[i].value === "or") {
      const result = evaluateComparison(
        tokens[i + 1],
        tokens[i + 3],
        tokens[i + 2],
        !isResolved && !comparison.value,
      );

      if (result.type === "error") {
        return { type: commandType.ERROR, value: null };
      }

      if (comparison.value) {
        isResolved = true;
      } else if (!isResolved) {
        comparison = result;
      }

      i += 4;
      continue;
    }

    // evaluate and-statements
    if (tokens[i].type === "keyword" && tokens[i].value === "and") {
      const result = evaluateComparison(
        tokens[i + 1],
        tokens[i + 3],
        tokens[i + 2],
        !isResolved && comparison.value,
      );

      if (result.type === "error") {
        return { type: commandType.ERROR, value: null };
      }

      if (!isResolved && comparison.value) {
        comparison = result;
      }

      i += 4;
      continue;
    }

    // then: check for move to line
    if (
      tokens[i].type === "keyword" &&
      (tokens[i].value === "then" || tokens[i].value === "goto") &&
      tokens[i + 1]?.type === "number" &&
      i + 2 === tokens.length
    ) {
      if (comparison.value) {
        return GOTO(String(tokens[i + 1].value));
      }

      return { type: commandType.DEFAULT, value: null };
    }

    // then: check for execute follow-up command
    if (
      tokens[i].type === "keyword" &&
      tokens[i].value === "then" &&
      tokens[i + 1]?.type === "command" &&
      tokens[i + 1].value === "print"
    ) {
      if (comparison.value) {
        return PRINT(tokens.slice(i + 2));
      }

      return { type: commandType.DEFAULT, value: null };
    }

    return { type: commandType.ERROR, value: null };
  }

  return { type: commandType.ERROR, value: null };
}

function evaluateComparison(
  operand1: Token | undefined,
  operand2: Token | undefined,
  operator: Token | undefined,
  shouldEvaluate = true,
): ComparisonResult {
  const validOperands = ["string", "number", "variable"];

  if (
    !operand1 ||
    !operand2 ||
    !operator ||
    !validOperands.includes(operand1.type) ||
    !validOperands.includes(operand2.type) ||
    operator.type !== "comparisonoperator" ||
    !["=", "<>", "<", "<=", ">", ">="].includes(String(operator.value))
  ) {
    return { type: "error", value: false };
  }

  if (!shouldEvaluate) {
    return { type: "success", value: false };
  }

  // prepare variables and arguments
  const leftValue =
    operand1.type === "variable" ? storage.variableStorage[String(operand1.value)] : operand1.value;

  const rightValue =
    operand2.type === "variable" ? storage.variableStorage[String(operand2.value)] : operand2.value;

  if (leftValue === undefined || rightValue === undefined) {
    return { type: "error", value: false };
  }

  // compare operands via operator
  if (typeof leftValue !== typeof rightValue) {
    return { type: "error", value: false };
  }

  let isTrue = false;

  if (operator.value === "=") {
    isTrue = leftValue === rightValue;
  } else if (operator.value === "<>") {
    isTrue = leftValue !== rightValue;
  } else if (operator.value === "<") {
    isTrue = leftValue < rightValue;
  } else if (operator.value === "<=") {
    isTrue = leftValue <= rightValue;
  } else if (operator.value === ">") {
    isTrue = leftValue > rightValue;
  } else if (operator.value === ">=") {
    isTrue = leftValue >= rightValue;
  }

  return { type: "success", value: isTrue };
}
