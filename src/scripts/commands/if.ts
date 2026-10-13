import type { CommandResult } from '../types/command';
import { commandType } from '../app/constants';
import * as strings from '../../scripts/utils/strings';

export async function IF(args: string): Promise<CommandResult> {
  const tokens = strings.tokenize(args);
  console.log(tokens);
  return { type: commandType.DEFAULT, value: null };
}
