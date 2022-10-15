import { DateTime, Interval } from "luxon";

import { Report } from "./interfaces";

/** Parses duration. Time is expected to be on format `09:00-12:00` */
function parseDuration(line: string): number {
  const [start, end] = line.split("-");
  const startTime = DateTime.fromISO(start);
  const endTime = DateTime.fromISO(end);
  const interval = Interval.fromDateTimes(startTime, endTime);
  const hours = interval.length("hours");

  if (!hours) {
    console.log(`Unable to parse duration: ${line}`);
    process.exit(1);
  }

  return hours;
}

function parseLine(line: string, delimiter = " "): [string, number, string?] {
  const [hours, category, taskNumber] = line.split(delimiter);
  if (hours == undefined || category == undefined) {
    console.error(`Unable to parse line: '${line}'`);
    process.exit(1);
  }

  const duration = parseDuration(hours);
  return [category, duration, taskNumber];
}

export function generateReportFromLines(
  lines: string[],
  startingIndex = 0,
  verbose = false
): Report {
  if (verbose) {
    console.debug("> Starting to generate report");
  }

  const report: Report = { byCategory: {}, byIssue: {}, issues: {} };

  for (let index = startingIndex; index < lines.length; index++) {
    const line = lines[index].trim();

    if (!line) {
      break;
    }

    if (line.startsWith("#")) {
      break;
    }

    const [category, hours, task] = parseLine(line);

    if (verbose) {
      console.log(`- ${hours.toFixed(1)}h registered on ${category} (${task})`);
    }

    if (category in report.byCategory) {
      report.byCategory[category] += hours;
    } else {
      report.byCategory[category] = hours;
    }

    if (!task) {
      continue;
    }

    if (task in report.byIssue) {
      report.byIssue[task] += hours;
    } else {
      report.byIssue[task] = hours;
    }
  }

  if (verbose) {
    console.log("> Report data generated");
  }

  return report;
}
