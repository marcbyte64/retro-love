import { RUN } from './run.js';
import { GOTO } from './goto.js';
import { IF } from './if.js';
import { INPUT } from './input.js';
import { GET } from './get.js';
import { PRINT } from './print.js';
import { LIST } from './list.js';
import { CLR } from './clr.js';
import { REM } from './rem.js';
import { EXIT } from './exit.js';

export const commands = {
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
