import { registerHotkeys } from "./hotkeys";
import { dom } from "./dom";
import { dispatcher } from "../app/dispatcher";
import { programState } from "../app/state";
import { inputMode } from "../app/constants";

function updateInputSize(): void {
  const { input } = dom;

  input.size = Math.max(input.value.length, 1);
  input.style.width = input.value.length === 0 ? "0px" : "auto";
}

function submitPrompt(): void {
  const value = dom.input.value.trim().toLowerCase();

  dom.clearInput();
  dom.outputLine(value);
  dispatcher.dispatchCommand(value);
}

function registerInputListeners(): void {
  const { input } = dom;

  input.addEventListener("input", updateInputSize);

  input.addEventListener("blur", () => {
    input.focus();
  });

  input.addEventListener("keydown", (event) => {
    if (!programState.isInputEnabled) {
      event.preventDefault();
      return;
    }

    if (event.key === "Enter" && programState.activeInputMode === inputMode.PROMPT) {
      event.preventDefault();
      submitPrompt();
    }
  });
}

export const terminalInput = {
  initialize(): void {
    registerInputListeners();
    registerHotkeys();
  },
};
