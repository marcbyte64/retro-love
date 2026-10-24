import type { CommandHandler } from "../types/command";

import { RUN } from "./run";
import { GOTO } from "./goto";
import { IF } from "./if";
import { INPUT } from "./input";
import { GET } from "./get";
import { PRINT } from "./print";
import { LIST } from "./list";
import { CLR } from "./clr";
import { REM } from "./rem";
import { EXIT } from "./exit";

type CommandDefinition = {
  args: "none" | "required" | "optional";
  fn: CommandHandler;
};

export const commands: Record<string, CommandDefinition> = {
  run: { args: "none", fn: RUN },
  goto: { args: "required", fn: GOTO },
  if: { args: "required", fn: IF },
  input: { args: "required", fn: INPUT },
  get: { args: "required", fn: GET },
  print: { args: "optional", fn: PRINT },
  list: { args: "none", fn: LIST },
  clr: { args: "none", fn: CLR },
  rem: { args: "required", fn: REM },
  exit: { args: "none", fn: EXIT },
};

export const keywords = ["or", "and", "then"];
