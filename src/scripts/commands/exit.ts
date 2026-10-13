import { commandType } from '../app/constants';

export async function EXIT() {
  return { type: commandType.DEFAULT, value: null };
}
