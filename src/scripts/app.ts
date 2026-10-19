/** C=64 Basic V2 Interpreter **/
import { dom } from "./ui/dom";
import { terminalInput } from "./ui/terminalInput";

terminalInput.initialize();
dom.resetInput(true);

// import test-data in dev-env
if (import.meta.env.DEV) {
  import("./tests/dummyData").then(({ injectTestData }) => {
    injectTestData();
  });
}
