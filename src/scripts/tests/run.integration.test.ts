import { beforeEach, describe, expect, it, vi } from "vite-plus/test";
import { commandType, inputMode } from "../app/constants";
import { programState } from "../app/state";
import * as storage from "../app/storage";
import { commands } from "../commands/index";
import { RUN } from "../commands/run";
import { registerHotkeys } from "../ui/hotkeys";
import { dom } from "../ui/dom";

// Keep the real command implementations and storage. Only replace the browser DOM.
vi.mock("../ui/dom", () => ({
  dom: {
    input: new EventTarget(),
    outputLine: vi.fn(),
    clearInput: vi.fn(),
  },
}));

const input = dom.input as EventTarget & { value: string };
const outputLine = vi.mocked(dom.outputLine);

function addLine(lineNumber: number, name: keyof typeof commands, args = "") {
  storage.storeCommand({ lineNumber, name, args, fn: commands[name].fn });
}

function press(key: string, type: "keydown" | "keyup" = "keydown") {
  const event = new Event(type, { cancelable: true });
  Object.defineProperty(event, "key", { value: key });
  input.dispatchEvent(event);
}

async function advanceRun() {
  // RUN waits 10 ms between stored lines.
  await vi.advanceTimersByTimeAsync(20);
}

beforeEach(() => {
  vi.useRealTimers();
  vi.clearAllMocks();
  storage.clearAllStorage();
  programState.activeInputMode = inputMode.PROMPT;
  programState.isInputEnabled = true;
  programState.abortProgram = false;
  input.value = "";
});

describe("RUN integration", () => {
  it("executes stored lines in order and evaluates arithmetic", async () => {
    vi.useFakeTimers();
    addLine(10, "print", '"START"');
    addLine(20, "print", "2+3*4");
    addLine(30, "print", '"END"');

    const running = RUN();
    await vi.runAllTimersAsync();
    const result = await running;

    expect(result.type).toBe(commandType.DEFAULT);
    expect(outputLine.mock.calls.map(([value]) => value)).toEqual(["START", "14", "END"]);
    expect(programState.activeInputMode).toBe(inputMode.PROMPT);
    expect(programState.isInputEnabled).toBe(true);
  });

  it("follows GOTO and skips intervening lines", async () => {
    vi.useFakeTimers();
    addLine(10, "print", '"FIRST"');
    addLine(20, "goto", "40");
    addLine(30, "print", '"SKIPPED"');
    addLine(40, "print", '"LAST"');

    const running = RUN();
    await vi.runAllTimersAsync();
    await running;

    expect(outputLine.mock.calls.map(([value]) => value)).toEqual(["FIRST", "LAST"]);
  });

  it("pauses for INPUT, stores the answer, and resumes the program", async () => {
    vi.useFakeTimers();
    addLine(10, "print", '"START"');
    addLine(20, "input", "A");
    addLine(30, "print", "A*2");

    const running = RUN();
    await advanceRun();

    expect(programState.activeInputMode).toBe(inputMode.INPUTVAR);
    expect(programState.isInputEnabled).toBe(true);
    expect(outputLine).toHaveBeenCalledWith("START");

    input.value = "7";
    press("Enter");
    await vi.runAllTimersAsync();
    await running;

    expect(storage.variableStorage.a).toBe(7);
    expect(outputLine.mock.calls.map(([value]) => value)).toEqual(["START", "7", "14"]);
    expect(programState.activeInputMode).toBe(inputMode.PROMPT);
    expect(programState.isInputEnabled).toBe(true);
  });

  it("retries INPUT after invalid numeric input", async () => {
    vi.useFakeTimers();
    addLine(10, "input", "A");
    addLine(20, "print", "A");

    const running = RUN();
    await Promise.resolve();
    expect(programState.activeInputMode).toBe(inputMode.INPUTVAR);

    input.value = "NOT A NUMBER";
    press("Enter");
    // Let RUN handle the rejection and install the next INPUT listener.
    await vi.runAllTimersAsync();

    expect(outputLine).toHaveBeenCalledWith("?REDO FROM START");
    expect(storage.variableStorage.a).toBeUndefined();

    input.value = "12";
    press("Enter");
    await vi.runAllTimersAsync();
    await running;

    expect(storage.variableStorage.a).toBe(12);
    expect(outputLine).toHaveBeenCalledWith("12");
  });

  it("cancels INPUT with Ctrl+C and can run another program afterward", async () => {
    vi.useFakeTimers();
    // registerHotkeys uses window.addEventListener("blur", ...).
    // Provide just that browser boundary in this DOM-free test environment.
    vi.stubGlobal("window", new EventTarget());

    try {
      registerHotkeys();
      addLine(10, "print", '"BEFORE"');
      addLine(20, "input", "A");
      addLine(30, "print", '"SHOULD NOT PRINT"');

      const running = RUN();
      await advanceRun();
      expect(programState.activeInputMode).toBe(inputMode.INPUTVAR);

      press("Control");
      press("c");
      press("c", "keyup");
      press("Control", "keyup");
      await running;

      expect(outputLine).not.toHaveBeenCalledWith("SHOULD NOT PRINT");
      expect(programState.activeInputMode).toBe(inputMode.PROMPT);
      expect(programState.isInputEnabled).toBe(true);
      expect(programState.abortProgram).toBe(false);

      storage.clearCommandStorage();
      outputLine.mockClear();
      addLine(10, "print", '"WORKS AGAIN"');
      const secondRun = RUN();
      await vi.runAllTimersAsync();
      await secondRun;

      expect(outputLine).toHaveBeenCalledWith("WORKS AGAIN");
    } finally {
      vi.unstubAllGlobals();
    }
  });
});
