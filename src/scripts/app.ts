/** C=64 Basic V2 Interpreter **/
import { dom } from './ui/dom';
import { eventListeners } from './ui/eventListeners';

eventListeners.addEventListeners();
dom.outputLine(`Ready.`);

// TODO: only run in dev -> if (import.meta.env.DEV) injectTestData(dispatchCommand, storage.storeVariable);
if (import.meta.env.DEV) {
  import('./tests/injectTestData').then(({ injectTestData }) => {
    injectTestData();
  });
}

import * as strings from './utils/strings';
const tokens = strings.tokenize('This a variable "This a string"');
console.log(...tokens);
