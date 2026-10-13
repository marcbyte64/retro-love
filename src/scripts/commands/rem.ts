import { commandType } from '../app/constants';

export async function REM(message: string) {
  return { type: commandType.DEFAULT, value: null };
}
