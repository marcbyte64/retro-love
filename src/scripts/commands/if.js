import { commandTypes } from '../app/constants.js';
import * as strings from '../../scripts/utils/strings.js';

export async function IF(args) {
  const tokens = strings.tokenize(args);
  console.log(tokens);
  return { type: commandTypes.DEFAULT, value: null };
}
