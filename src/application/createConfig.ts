import { prompt } from "../utils/utils";
import * as config from "../config";
import * as fs from "../utils/fs";

export async function createConfig(): Promise<void> {
  const filePath = await prompt("Enter file path of time sheet: ");

  if (!fs.fileExists(filePath)) {
    console.error(`Path does not exist: ${filePath}`);
    console.error(`Previous configurations were not overwritten`);
    process.exit(1);
  }

  config.writeConfig({ filePath });

  console.log("\nConfigurations successfully created!");
  process.exit(0);
}
