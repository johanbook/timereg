import { DateTime, Interval } from "luxon";

import { readFile, findLineIndex } from "../../utils/fs";
import { printLine, sum } from "../../utils/utils";

import * as jira from "../../integrations/jira";
import { Options, Report } from "./interfaces";
import { generateReportFromLines } from "./parser";

function printReport(results: Record<string, number>): void {
  if (Object.keys(results).length === 0) {
    console.error("No matching data to report on");
    process.exit(1);
  }

  console.log("Task\t Hours");
  printLine();
  for (const key in results) {
    console.log(`${key}\t${results[key].toFixed(1)}`);
  }

  printLine();
  const total = sum(Object.values(results));
  console.log(`Total\t${total.toFixed(1)}`);
}

async function getJiraInfo(report: Report): Promise<void> {
  for (const issueId in report.byIssue) {
    console.log(issueId);
    const issue = await jira.getIssue(issueId);
    console.log({ issue });
  }
}

export async function generateAndPrintReport(options: Options): Promise<void> {
  const lines = readFile(options.filePath).split("\n");

  const lineStartIndex = findLineIndex(lines, options.date);
  const report = generateReportFromLines(
    lines,
    lineStartIndex,
    options.verbose
  );

  if (options.jira) {
    jira.initializeClient(options.jira);
    await getJiraInfo(report);
  }

  console.log("TIME REPORT", options.date);
  printLine();

  if (options.verbose) {
    console.log("\nREPORT BY TASK");
    printReport(report.byIssue);
  }

  console.log("\nREPORT BY CATEGORY");
  printReport(report.byCategory);
}
