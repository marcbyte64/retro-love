import { commandType } from '../app/constants';
import { storeVariable } from '../app/storage';
import * as strings from '../../scripts/utils/strings';
import { dom } from '../ui/dom';

export async function INPUT(args: string) {
  const tokens = strings.tokenize(args);

  // check if input starts with prompt request
  if (tokens.length >= 3 && tokens[0].type === 'string' && tokens[1].value === ';' && tokens[2].type === 'variable') {
    dom.outputLine(tokens[0].value);
  }

  // extract variables
  const vars = tokens.slice(2);

  const lastElement = vars.slice(-1)[0];
  const separatorsValid = vars.every((value, index) =>
    index % 2 === 1 ? value.value === ',' : true,
  );
  const variablesValid = vars.every((value, index) =>
    index % 2 === 0 ? value.type === 'variable' : true,
  );

  if (lastElement.type !== 'variable') {
    return { type: commandType.ERROR, value: null };
  }

  // invalild input
  if (!separatorsValid || !variablesValid || lastElement.type !== 'variable') {
    return { type: commandType.ERROR, value: null };
  }

  const requestedVariables = vars.filter((_, i) => i % 2 === 0);
  return { type: commandType.INPUT, value: requestedVariables };
}

// TODO: ability to cancel input with CTRL+C
export async function waitForUserInput(variableName: string) {
  return new Promise((resolve, reject) => {
    const handler = (e: KeyboardEvent): void => {
      if (e.key === 'Enter') {
        const inputValue = dom.input.value.trim();
        const isCompatible = strings.isTypeCompatible(variableName, inputValue);
        const expectedType = strings.determineVariableType(variableName);

        // reject if type is invalid
        if (!isCompatible) {
          dom.input.removeEventListener('keydown', handler);
          dom.outputLine(inputValue);
          dom.outputLine(`?REDO FROM START`);
          dom.clearInput();
          reject(new Error('InvalidType'));
          return;
        }

        // store if valid
        const value = strings.convertToType(inputValue, expectedType);
        storeVariable(variableName, value);
        dom.outputLine(inputValue);
        dom.clearInput();
        dom.input.removeEventListener('keydown', handler);
        resolve(inputValue);
      }
    };
    // add temporary event listener
    dom.input.addEventListener('keydown', handler);
  });
}
