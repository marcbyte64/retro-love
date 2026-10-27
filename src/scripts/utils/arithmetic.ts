import type { Token } from "../types/token";

export function calculate(tokens: Token[]): string {
  const expression = [...tokens];

  if (expression.length === 0) {
    throw new Error("Empty arithmetic expression");
  }

  // validate number / operator sequence
  for (let i = 0; i < expression.length; i++) {
    const expectedType = i % 2 === 0 ? "number" : "operator";

    if (expression[i].type !== expectedType) {
      throw new Error("Invalid arithmetic expression");
    }
  }

  if (expression.length % 2 === 0) {
    throw new Error("Incomplete arithmetic expression");
  }

  // multiply, divide
  for (let i = 0; i < expression.length; i++) {
    if (
      expression[i].type === "operator" &&
      (expression[i].value === "*" || expression[i].value === "/")
    ) {
      expression[i] = {
        value: applyOperator(expression[i - 1], expression[i + 1], expression[i]),
        type: "number",
      };
      expression.splice(i + 1, 1);
      expression.splice(i - 1, 1);
      i = i - 2;
    }
  }

  // add, subtract
  for (let i = 0; i < expression.length; i++) {
    if (
      expression[i].type === "operator" &&
      (expression[i].value === "+" || expression[i].value === "-")
    ) {
      expression[i] = {
        value: applyOperator(expression[i - 1], expression[i + 1], expression[i]),
        type: "number",
      };
      expression.splice(i + 1, 1);
      expression.splice(i - 1, 1);
      i = i - 2;
    }
  }

  return String(expression[0].value);
}

function applyOperator(left: Token, right: Token, operator: Token): number {
  if (operator.value === "+") {
    return Number(left.value) + Number(right.value);
  } else if (operator.value === "-") {
    return Number(left.value) - Number(right.value);
  } else if (operator.value === "*") {
    return Number(left.value) * Number(right.value);
  } else if (operator.value === "/") {
    return Number(left.value) / Number(right.value);
  }

  throw new Error("Invalid arithmetic operator");
}
