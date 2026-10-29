import { LOAD } from "../commands/load";
import { RUN } from "../commands/run";
import { commandType } from "./constants";

export async function startApp(): Promise<void> {
  const program = import.meta.env.PROD ? "website" : "dev";
  const result = await LOAD(`"${program}"`);

  if (result.type === commandType.ERROR) {
    return;
  }

  await RUN();
}
