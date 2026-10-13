import { commandType } from '../app/constants';
import type { Token } from './token';

export type CommandResult =
  | { type: commandType.DEFAULT; value: null }
  | { type: commandType.ERROR; value: null }
  | { type: commandType.GOTO; value: number }
  | { type: commandType.INPUT; value: Token[] };

export type CommandHandler = (args: string) => Promise<CommandResult>;

export type Command = {
  lineNumber: number;
  name: string;
  fn: CommandHandler;
  args: string;
};
