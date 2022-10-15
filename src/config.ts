import * as os from "os";
import * as path from "path";

import * as fs from "./utils/fs";

const CONFIG_DIRECTORY = ".timereg";
const CONFIG_FILE_NAME = "config.json";

export interface JiraConfig {
  url: string;
  username: string;
  accessToken: string;
}

export interface Config {
  jira?: JiraConfig;
  filePath: string;
}

function getConfigFolder(): string {
  const homedir = os.homedir();
  const folderPath = path.join(homedir, CONFIG_DIRECTORY);
  return folderPath;
}

function getConfigPath(): string {
  const folderPath = getConfigFolder();
  const filePath = path.join(folderPath, CONFIG_FILE_NAME);
  return filePath;
}

function createConfigIfNotExisting() {
  const folderPath = getConfigFolder();
  if (!fs.fileExists(folderPath)) {
    fs.createFolder(folderPath);
  }

  const filePath = getConfigPath();
  if (fs.fileExists(filePath)) {
    return;
  }

  const defaultConfig = {};
  fs.writeJSONFile(filePath, defaultConfig);
}

export function readConfig(): Config {
  const filePath = getConfigPath();
  const config = fs.readJSONFile(filePath);
  return config;
}

export function writeConfig(newConfig: Partial<Config>): void {
  createConfigIfNotExisting();

  const oldConfig = readConfig();
  const mergedConfig: Config = { ...oldConfig, ...newConfig };

  const filePath = getConfigPath();
  fs.writeJSONFile(filePath, mergedConfig);
}
