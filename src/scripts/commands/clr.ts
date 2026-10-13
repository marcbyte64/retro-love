import { commandType } from '../app/constants';
import { dom } from '../ui/dom';

// TODO: CLR should actually clear the variables
export async function CLR() {
  dom.clearOutput();
  dom.clearInput();

  return { type: commandType.DEFAULT, value: null };
}
