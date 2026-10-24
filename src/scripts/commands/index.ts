import { CommandHandler } from "../types/command";

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
  run: { args: "none", fn: RUN }, // run stored prompts
  goto: { args: "required", fn: GOTO }, // jump to line
  if: { args: "required", fn: IF }, // if statement
  input: { args: "required", fn: INPUT }, // input string
  get: { args: "required", fn: GET }, // input string char by char
  print: { args: "optional", fn: PRINT }, // print string
  list: { args: "none", fn: LIST }, // list stored prompts
  clr: { args: "none", fn: CLR }, // clear screen
  rem: { args: "required", fn: REM }, // comment
  exit: { args: "none", fn: EXIT }, // exit program
};

export const keywords = ["or", "and", "then"];
