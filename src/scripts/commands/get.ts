import type { CommandResult } from '../types/command';
import { commandType } from '../app/constants';

export async function GET(args: string): Promise<CommandResult> {
  return { type: commandType.DEFAULT, value: null };
}
