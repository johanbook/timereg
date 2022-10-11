const { DateTime, Interval } = require("luxon");
const { readFile, findLineIndex } = require("./fs");

function parseDuration(line) {
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

function parseLine(line, delimiter = " ") {
  const [hours, category, taskNumber] = line.split(delimiter);
  if (hours == undefined || category == undefined) {
    console.error(`Unable to parse line: '${line}'`);
    process.exit(1);
  }

  const duration = parseDuration(hours);
  return [category, duration, taskNumber];
}

function generateReportFromLines(lines, startingIndex = 0, verbose = false) {
  const hoursByCategory = {};
  const hoursByTask = {};

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
      console.log(`- ${hours.toFixed(1)} registered on ${category} (${task})`);
    }

    if (category in hoursByCategory) {
      hoursByCategory[category] += hours;
    } else {
      hoursByCategory[category] = hours;
    }

    if (!task) {
      continue;
    }

    if (task in hoursByTask) {
      hoursByTask[task] += hours;
    } else {
      hoursByTask[task] = hours;
    }
  }

  return [hoursByCategory, hoursByTask];
}

function sum(arr) {
  let result = 0;
  for (const value of arr) {
    result += value;
  }
  return result;
}

function printLine(num = 16, char = "=") {
  console.log(char.repeat(num));
}

function printReport(results) {
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

exports.generateAndPrintReport = function (filePath, options) {
  const lines = readFile(filePath).split("\n");

  console.log("TIME REPORT", options.date);
  if (options.verbose) {
    printLine();
  }

  const lineStartIndex = findLineIndex(lines, options.date);
  const [reportByCategory, reportByTask] = generateReportFromLines(
    lines,
    lineStartIndex,
    options.verbose
  );

  if (options.verbose) {
    console.log("\nREPORT BY TASK");
    printReport(reportByTask);
  }

  console.log("\nREPORT BY CATEGORY");
  printReport(reportByCategory);
};
