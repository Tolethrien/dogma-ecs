export default class EngineDebugger {
  public static showError(msg: string) {
    console.error(msg);
  }
  public static showWarn(msg: string) {
    console.warn(msg);
  }
  public static programBreak(msg?: string) {
    throw new Error(msg ?? "Engine breaks on break command");
  }
  public static AssertValue(value: unknown, msg?: string): asserts value {
    if (!value) {
      throw new TypeError(
        msg ? `\n${msg}` : `value assertion failed, value = ${value}`
      );
    }
  }
}
