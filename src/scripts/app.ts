/** C=64 Basic V2 Interpreter **/
import { dom } from "./ui/dom";
import { basicInput } from "./ui/basicInput";
import { startApp } from "./app/startup";

// init ui
basicInput.initialize();
dom.resetInput(true);

// start application
await startApp();
