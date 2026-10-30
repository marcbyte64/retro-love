import type { CommandHandler } from "../types/command";

import { CLR } from "./clr";
import { EXIT } from "./exit";
import { GET } from "./get";
import { GOTO } from "./goto";
import { IF } from "./if";
import { INPUT } from "./input";
import { LET } from "./let";
import { LIST } from "./list";
import { LOAD } from "./load";
import { PRINT } from "./print";
import { REM } from "./rem";
import { RUN } from "./run";

type CommandDefinition = {
  args: "none" | "required" | "optional";
  fn: CommandHandler;
};

export const commands: Record<string, CommandDefinition> = {
  clr: { args: "none", fn: CLR },
  exit: { args: "none", fn: EXIT },
  get: { args: "required", fn: GET },
  goto: { args: "required", fn: GOTO },
  if: { args: "required", fn: IF },
  input: { args: "required", fn: INPUT },
  let: { args: "required", fn: LET },
  list: { args: "none", fn: LIST },
  load: { args: "required", fn: LOAD },
  print: { args: "optional", fn: PRINT },
  rem: { args: "required", fn: REM },
  run: { args: "none", fn: RUN },
};

export const keywords = ["or", "and", "then"];
