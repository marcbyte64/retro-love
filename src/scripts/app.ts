/** C=64 Basic V2 Interpreter **/
import { dom } from './ui/dom';
import { eventListeners } from './ui/eventListeners';
import { injectTestData } from './tests/injectTestData';

eventListeners.addEventListeners();
dom.outputLine(`Ready.`);

// TODO: only run in dev -> if (import.meta.env.DEV) injectTestData(dispatchCommand, storage.storeVariable);
injectTestData();

import * as strings from './utils/strings';
const tokens = strings.tokenize('This a variable "This a string"');
console.log(...tokens);
