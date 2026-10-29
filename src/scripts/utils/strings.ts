/**
 * Parses String char by char and tokenizes it into an array of objects.
 * Each object contains a value and a type.
 * Types can be: 'string', 'number', 'variable', 'operator', 'separator'.
 *
 * @param {string} string - The string to be evaluated and tokenized.
 * @param {object} variables - An object containing variables to be substituted in the string.
 * @return {Array} An array of objects representing the tokenized string, with each object containing a value and a type.
 */

import type { Token } from "../types/token";
import { commands, keywords } from "../commands/index";
import { calculate } from "./arithmetic";

// create array of tokens
export function tokenize(string: string): Token[] {
  const operators = ["+", "-", "*", "/"];
  const comparisonOperators = ["=", "<>", "<", "<=", ">", ">="];
  const outputSeparators = [";", ","];
  const types = ["$", "%"];
  const tokens: Token[] = [];
  let buffer = "";
  let stringmode = false;
  let nummode = false;
  let varmode = false;
  let isInMode = false;

  for (let i = 0; i <= string.length; i++) {
    const char = string[i];

    // turn stringmode off
    if (char === '"' && stringmode) {
      tokens.push({ value: buffer, type: "string" });
      stringmode = false;
      isInMode = false;
      buffer = "";
      continue;
    }
    // turn nummode off
    if (!/^[0-9.]$/.test(char) && nummode) {
      tokens.push({ value: Number(buffer), type: "number" });
      buffer = "";
      nummode = false;
      isInMode = false;
    }
    // turn varmode off
    if (!stringmode && !/^[A-Za-z]$/.test(char) && Object.hasOwn(commands, buffer.toLowerCase())) {
      tokens.push({ value: buffer.toLowerCase(), type: "command" });
      buffer = "";
      varmode = false;
      isInMode = false;
    }
    if (!stringmode && !/^[A-Za-z]$/.test(char) && keywords.includes(buffer.toLowerCase())) {
      tokens.push({ value: buffer.toLowerCase(), type: "keyword" });
      buffer = "";
      varmode = false;
      isInMode = false;
    }
    if ((!/^[A-Za-z]$/.test(char) || types.includes(char)) && varmode) {
      if (types.includes(char)) {
        buffer += char;
        tokens.push({ value: buffer.toLowerCase(), type: "variable" });
        buffer = "";
        varmode = false;
        isInMode = false;
        continue;
      }

      tokens.push({ value: buffer.toLowerCase(), type: "variable" });
      buffer = "";
      varmode = false;
      isInMode = false;
    }

    // remove spaces if not in stringmode
    if (!stringmode && char === " ") {
      continue;
    }

    // turn stringmode on
    if (char === '"' && !stringmode && !isInMode) {
      stringmode = true;
      isInMode = true;
      continue;
    }

    // add char to string-buffer
    if (stringmode && char !== undefined) {
      buffer += char;
      continue;
    }

    // turn nummode on
    if (/^[0-9.]$/.test(char) && !nummode && !isInMode) {
      nummode = true;
      isInMode = true;
      buffer += char;
      continue;
    }

    // add number to number-buffer
    if (/^[0-9.]$/.test(char) && nummode) {
      // reject multiple decimal points
      if (char === "." && buffer.includes(".")) {
        throw new Error("Invalid number");
      }

      buffer += char;
      continue;
    }

    // turn varmode on
    if (/^[A-Za-z]$/.test(char) && !varmode && !isInMode) {
      varmode = true;
      isInMode = true;
      buffer += char;
      continue;
    }

    // add char to variable-buffer
    if (/^[A-Za-z]$/.test(char) && varmode) {
      buffer += char;
      continue;
    }

    // operators
    if (operators.includes(char)) {
      tokens.push({ value: char, type: "operator" });
      continue;
    }

    // comparison operators
    const operator = comparisonOperators.includes(string.slice(i, i + 2))
      ? string.slice(i, i + 2)
      : char;

    if (comparisonOperators.includes(operator)) {
      tokens.push({ value: operator, type: "comparisonoperator" });
      i += operator.length - 1;
      continue;
    }

    // separators
    if (outputSeparators.includes(char)) {
      tokens.push({ value: char, type: "separator" });
      continue;
    }

    // reject unknown characters
    if (char !== undefined) {
      throw new Error(`Unexpected character: ${char}`);
    }
  }

  if (stringmode) {
    tokens.push({ value: buffer, type: "string" });
  }

  return tokens;
}

// replace variables with their values
export function substituteVariables(
  tokens: Token[],
  variables: Record<string, string | number>,
): Token[] {
  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i];

    if (token.type === "variable") {
      const value = variables[String(token.value)];

      if (value === undefined) {
        throw new Error(`Undefined variable: ${token.value}`);
      }

      tokens[i] = {
        value,
        type: typeof value === "number" ? "number" : "string",
      };
    }
  }

  return tokens;
}

// calculate expressions
export function parse(tokens: Token[]): string {
  let output = "";
  let calculation: Token[] = [];

  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i];

    // finish calculation before a non-arithmetic token
    if (calculation.length && token.type !== "number" && token.type !== "operator") {
      output += calculate(calculation);
      calculation = [];
    }

    if (token.type === "string") {
      output += token.value;
      continue;
    }

    if (token.type === "separator") {
      output += " ";
      continue;
    }

    if (token.type === "number") {
      if (calculation.length) {
        calculation.push(token);
      } else if (tokens[i + 1]?.type === "operator") {
        calculation.push(token);
      } else {
        output += token.value;
      }

      continue;
    }

    if (token.type === "operator") {
      calculation.push(token);
      continue;
    }
  }

  // finish calculation at end of input
  if (calculation.length) {
    output += calculate(calculation);
  }

  return output;
}

// determine variable type by variable name
export function determineVariableType(variableName: string) {
  if (variableName.slice(-1) === "$") {
    return "string";
  }
  if (variableName.slice(-1) === "%") {
    return "integer";
  }
  return "float";
}

// get variable type by prompt
export function assignVariableType(prompt: string) {
  const trimmed = prompt.trim();

  if (/^[-+]?\d+$/.test(trimmed)) {
    return "integer";
  }

  if (/^[-+]?(?:\d+\.\d*|\.\d+)$/.test(trimmed)) {
    return "float";
  }

  return "string";
}

// check if variable type is compatible with prompt type
export function isTypeCompatible(variableName: string, prompt: string) {
  const expectedType = determineVariableType(variableName);
  const actualType = assignVariableType(prompt);

  // everything fits into string, float and int fit into everything
  return expectedType === "string" || actualType !== "string";
}

export function convertToType(value: string, type: string): string | number {
  const trimmed = value.trim();

  if (type === "string") {
    return trimmed;
  }

  if (type === "integer") {
    return Math.trunc(Number(trimmed)) || 0;
  }

  if (type === "float") {
    return parseFloat(trimmed);
  }

  throw new Error(`Unknown variable type: ${type}`);
}
