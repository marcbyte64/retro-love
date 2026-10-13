import { commandType } from '../app/constants';

export async function GET(args: string) {
  return { type: commandType.DEFAULT, value: null };
}
