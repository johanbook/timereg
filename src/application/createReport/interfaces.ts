import { Config } from "../../config";

export interface Options extends Config {
  filePath: string;
  date: string;
  verbose?: boolean;
}

export interface Report {
  byCategory: Record<string, number>;
  byIssue: Record<string, number>;
  issues: Record<string, string>;
}
