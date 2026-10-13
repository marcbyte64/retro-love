import { programState } from '../app/state';
import { inputMode } from '../app/constants';

import { dispatcher } from '../app/dispatcher';
import { dom } from '../ui/dom';

function createEventListeners() {
  function addEventListeners(): void {
    const { input } = dom;

    // move cursor on input
    //TODO: blinking cursor movement with arrow-keys
    input.addEventListener('input', () => {
      const inputSize = input.value.length ? input.value.length : 1;
      input.size = inputSize;
      input.style.width = input.value.length === 0 ? '0px' : 'auto';
    });

    // force input focus
    input.addEventListener('blur', () => {
      input.focus();
    });

    // handle input
    // TODO: remove syntax error on empty enter
    const keysDown:string[] = [];
    input.addEventListener('keydown', (e) => {
      const key = e.key;

      if (!programState.isInputEnabled) {
        e.preventDefault();

        // handle pressed keys
        if (keysDown.indexOf(e.key) === -1) {
          keysDown.push(e.key);
        }

        if (keysDown.length > 1 && keysDown.includes('c') && keysDown.includes('Control')) {
          programState.abortProgram = true;
        }

        return;
      }

      if (key === 'Enter' && programState.activeInputMode === inputMode.PROMPT) {
        const inputValue = input.value.toLowerCase().trim();
        dom.clearInput();
        dom.outputLine(inputValue);
        dispatcher.dispatchCommand(inputValue);
        return;
      }
    });

    input.addEventListener('keyup', (e) => {
      const index = keysDown.indexOf(e.key);

      if (index !== -1) {
        keysDown.splice(index, 1);
      }
    });
  }

  return { addEventListeners };
}

export const eventListeners = createEventListeners();
