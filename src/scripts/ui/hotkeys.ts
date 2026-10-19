import { programState } from "../app/state";
import { dom } from "./dom";

type Hotkey = {
  keys: readonly string[];
  action: () => void;
};

// possible key-combos
const hotkeyDefinitions: Hotkey[] = [
  {
    keys: ["control", "c"],
    action: () => {
      programState.abortProgram = true;
    },
  },
];

// register keypresses and look up combos
export function registerHotkeys(): void {
  const keysDown = new Set<string>();

  dom.input.addEventListener("keydown", (event) => {
    const key = event.key.toLowerCase();

    keysDown.add(key);

    if (!programState.isInputEnabled) {
      event.preventDefault();

      const hotkey = hotkeyDefinitions.find(
        ({ keys }) => keys.length === keysDown.size && keys.every((key) => keysDown.has(key)),
      );

      if (hotkey) {
        hotkey.action();
      }
    }
  });

  // remove released keys
  dom.input.addEventListener("keyup", (event) => {
    keysDown.delete(event.key.toLowerCase());
  });

  // clear all keys when losing focus
  window.addEventListener("blur", () => {
    keysDown.clear();
  });
}
