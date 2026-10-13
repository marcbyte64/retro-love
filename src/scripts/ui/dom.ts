import { getElement } from "../utils/html";

function createDom() {
  const input = getElement<HTMLInputElement>('.input');
  const output = getElement<HTMLTextAreaElement>('.output');

  function outputLine(value: string | number): void {
    output.value += `\n${value}`;
    output.scrollTop = output.scrollHeight;
  }

  function clearOutput(): void {
    output.value = '';
  }

  function clearInput(): void {
    input.value = '';
    input.style.width = '0px';
  }

  function resetInput(ready = false): void {
    if (ready) outputLine(`\nReady.`);
  }

  return { input, output, outputLine, clearOutput, clearInput, resetInput };
}

export const dom = createDom();
