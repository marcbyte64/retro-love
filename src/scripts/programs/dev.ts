import * as storage from "../app/storage";
import { dispatcher } from "../app/dispatcher";

export function injectTestData() {
  const testVariables: Record<string, string | number> = {
    A: 123,
    AB: 9,
    B: 2,
    C: 3,
    C$: "STRING",
    "D%": 3.1415,
  };

  const testPrompts = ['10 PRINT "HELLO WORLD"'];

  // inject test prompts
  for (const prompt of testPrompts) {
    dispatcher.dispatchCommand(prompt);
  }

  // inject test variables
  for (const [name, value] of Object.entries(testVariables)) {
    storage.storeVariable(name, value);
  }

  // run prompts
  dispatcher.dispatchCommand("run");
}
