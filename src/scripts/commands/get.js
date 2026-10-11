import { commandTypes } from '../app/constants.js';

export async function GET(args) {
  return { type: commandTypes.DEFAULT, value: null };
}
