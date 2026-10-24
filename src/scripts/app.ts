/** C=64 Basic V2 Interpreter **/
import { dom } from "./ui/dom";
import { basicInput } from "./ui/basicInput";

basicInput.initialize();
dom.resetInput(true);

// import test-data in dev-env
if (import.meta.env.DEV) {
  void import("./tests/dummyData")
    .then(({ injectTestData }) => {
      injectTestData();
    })
    .catch((error: unknown) => {
      console.error("Failed to load test data:", error);
    });
}
