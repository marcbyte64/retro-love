/** C=64 Basic V2 Interpreter **/
import { dom } from './ui/dom.js';
import { eventListeners } from './ui/eventListeners.js';
import { injectTestData } from './tests/injectTestData.js';

eventListeners.addEventListeners(dom);
dom.outputLine(`Ready.`);

// TODO: only run in dev -> if (import.meta.env.DEV) injectTestData(dispatchCommand, storage.storeVariable);
injectTestData();

import * as strings from './utils/strings.js';
const tokens = strings.tokenize('This a variable "This a string"');
console.log(...tokens);
