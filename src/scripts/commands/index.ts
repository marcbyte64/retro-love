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
  args: number;
  fn: CommandHandler;
};

export const commands: Record<string, CommandDefinition> = {
  run: { args: 0, fn: RUN }, // run stored prompts
  goto: { args: 1, fn: GOTO }, // jump to line
  if: { args: 1, fn: IF }, // if statement
  input: { args: 1, fn: INPUT }, // input string
  get: { args: 1, fn: GET }, // input string char by char
  print: { args: 1, fn: PRINT }, // print string
  list: { args: 0, fn: LIST }, // list stored prompts
  clr: { args: 0, fn: CLR }, // clear screen
  rem: { args: 1, fn: REM }, // comment
  exit: { args: 0, fn: EXIT }, // exit program
};
