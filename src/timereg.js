require("dotenv").config();

const { program } = require("commander");
const fs = require("fs");
const { DateTime, Interval } = require("luxon");

function readFile(filePath) {
  try {
    const file = fs.readFileSync(filePath);
    const text = file.toString();
    return text;
  } catch {
    console.error("Unable to read file:", filePath);
    process.exit(1);
  }
}

function findLineIndex(lines, token) {
  let index;
  for (index = 0; index < lines.length; index++) {
    const line = lines[index];

    if (line.includes(token)) {
      return index + 1;
    }
  }

  return -1;
}

function parseDuration(line) {
  const [start, end] = line.split("-");
  const startTime = DateTime.fromISO(start);
  const endTime = DateTime.fromISO(end);
  const interval = Interval.fromDateTimes(startTime, endTime);
  return interval.length("hours");
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

function generateAndPrintReport(filePath, options) {
  console.log("TIME REPORT", options.date);
  if (options.verbose) {
    printLine();
  }

  const lines = readFile(filePath).split("\n");
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
}

program
  .name("timereg")
  .description("A tool for generating time reports")
  .argument("<filePath>", "path to file with time data")
  .option(
    "--date <date>",
    "the date to generate the report for",
    DateTime.now().toFormat("yyyy-MM-dd")
  )
  .option("-v, --verbose", "use verbose output")
  .action((filePath, options) => generateAndPrintReport(filePath, options));

program.parse();
