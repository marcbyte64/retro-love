/**
 * Parses String char by char and tokenizes it into an array of objects.
 * Each object contains a value and a type.
 * Types can be: 'string', 'number', 'variable', 'operator', 'separator'.
 *
 * @param {string} string - The string to be evaluated and tokenized.
 * @param {object} variables - An object containing variables to be substituted in the string.
 * @return {Array} An array of objects representing the tokenized string, with each object containing a value and a type.
 */

// create array of tokens
export function tokenize(string) {
  const operators = ['+', '-', '*', '/', '%'];
  const outputSeparators = [';', ','];
  const types = ['$', '%'];
  let tokens = [];
  let buffer = '';
  let stringmode = false;
  let nummode = false;
  let varmode = false;
  let isInMode = false;

  for (let i = 0; i <= string.length; i++) {
    const char = string[i];

    // remove spaces if not in stringmode
    if (!stringmode && char === ' ') {
      continue;
    }

    // turn stringmode off
    if (char === '"' && stringmode) {
      tokens.push({ value: buffer, type: 'string' });
      stringmode = false;
      isInMode = false;
      buffer = '';
      continue;
    }
    // turn nummode off
    if (!/^[0-9.]$/.test(char) && nummode) {
      tokens.push({ value: Number(buffer), type: 'number' });
      buffer = '';
      nummode = false;
      isInMode = false;
    }
    // turn varmode off
    if ((!/^[A-Za-z]$/.test(char) || types.includes(char)) && varmode) {
      if (types.includes(char)) {
        buffer += char;
        tokens.push({ value: buffer, type: 'variable' });
        buffer = '';
        varmode = false;
        isInMode = false;
        continue;
      }

      tokens.push({ value: buffer, type: 'variable' });
      buffer = '';
      varmode = false;
      isInMode = false;
    }

    // turn stringmode on
    if (char === '"' && !stringmode && !isInMode) {
      stringmode = true;
      isInMode = true;
      continue;
    }

    // add char to string-buffer
    if (stringmode) {
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
      // if decimal is already set, start new number
      if (char === '.' && buffer.includes('.')) {
        tokens.push({ value: Number(buffer), type: 'number' });
        buffer = char;
        continue;
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
      tokens.push({ value: char, type: 'operator' });
    }

    // separators
    if (outputSeparators.includes(char)) {
      tokens.push({ value: char, type: 'separator' });
    }
  }

  return tokens;
}

// replace variables with their values
export function substituteVariables(tokens, variables) {
  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i];
    if (token.type === 'variable') {
      tokens[i] = {
        value: variables[token.value],
        type: typeof variables[token.value],
      };
    }
  }

  return tokens;
}

// calculate expressions
export function parse(tokens) {
  let output = '';
  let calculation = null;

  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i];

    if (token.type === 'string') {
      output += token.value;
      continue;
    }

    if (calculation && (token.type === 'separator' || i === tokens.length - 1)) {
      // execute calculation
      if (i === tokens.length - 1) calculation += token.value;
      output += eval(calculation);
      output += ' ';
      calculation = null;
      continue;
    }

    if (token.type === 'separator') {
      output += ' ';
    }

    if (token.type === 'number') {
      if (calculation) {
        calculation += token.value;
        continue;
      }
      if (tokens[i + 1] && tokens[i + 1].type === 'operator') {
        calculation = token.value;
        continue;
      }
      output += token.value;
      continue;
    }

    if (token.type === 'operator') {
      if (calculation) {
        calculation += token.value;
        continue;
      }
    }
  }
  console.log(output);
  return output;
}

// determine variable type by variable name
export function determineVariableType(variableName) {
  if (variableName.slice(-1) === '$') {
    return 'string';
  }
  if (variableName.slice(-1) === '%') {
    return 'integer';
  }
  return 'float';
}

// get variable type by prompt
export function assignVariableType(prompt) {
  const trimmed = prompt.trim();

  if (/^[-+]?\d+$/.test(trimmed)) {
    return 'integer';
  }

  if (/^[-+]?\d*\.\d+$/.test(trimmed)) {
    return 'float';
  }

  return 'string';
}

// check if variable type is compatible with prompt type
export function isTypeCompatible(variableName, prompt) {
  const expectedType = determineVariableType(variableName);
  const actualType = assignVariableType(prompt);

  if (expectedType === 'string') {
    return true;
  }

  if (expectedType === 'integer' && actualType === 'float') {
    return true;
  }

  if ((expectedType === 'integer' || expectedType === 'float') && actualType === 'string') {
    return false;
  }

  return true;
}

export function convertToType(value, type) {
  const trimmed = value.trim();

  if (type === 'string') {
    return trimmed.toString();
  }

  if (type === 'integer') {
    return Math.trunc(trimmed);
  }

  if (type === 'float') {
    return parseFloat(trimmed);
  }
}
