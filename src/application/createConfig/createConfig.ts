import { prompt, booleanPrompt } from "../../utils/utils";
import * as config from "../../config";
import * as fs from "../../utils/fs";

async function createJiraConfig(): Promise<config.JiraConfig> {
  const jiraConfig: Partial<config.JiraConfig> = {};
  jiraConfig.url = await prompt("- URL: ");
  jiraConfig.username = await prompt("- Username: ");
  jiraConfig.accessToken = await prompt("- Access: ");
  return jiraConfig as config.JiraConfig;
}

export async function createConfig(): Promise<void> {
  const newConfig: Partial<config.Config> = {};

  newConfig.filePath = await prompt("Enter file path of time sheet: ");

  if (!fs.fileExists(newConfig.filePath)) {
    console.error(`Path does not exist: ${newConfig.filePath}`);
    console.error(`Previous configurations were not overwritten`);
    process.exit(1);
  }

  if (await booleanPrompt("Use Jira integration")) {
    newConfig.jira = await createJiraConfig();
  }

  config.writeConfig(newConfig);

  console.log("\nConfigurations successfully created!");
  process.exit(0);
}
