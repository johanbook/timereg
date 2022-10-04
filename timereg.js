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

function parseLine(line) {
  const [hours, category, taskNumber] = line.split(" ");
  const duration = parseDuration(hours);
  return [category, duration, taskNumber];
}

function readLines(lines, startingIndex = 0, verbose = false) {
  const results = {};

  for (let index = startingIndex; index < lines.length; index++) {
    const line = lines[index];

    if (!line) {
      break;
    }

    if (line.startsWith("#")) {
      break;
    }

    const [category, hours, taskNumber] = parseLine(line);

    if (verbose) {
      console.log(hours.toFixed(1), category, taskNumber);
    }

    if (category in results) {
      results[category] += hours;
    } else {
      results[category] = hours;
    }
  }

  return results;
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

function printResults(results) {
  console.log("Task\t Hours");
  printLine();
  for (const key in results) {
    console.log(`${key}\t${results[key].toFixed(1)}`);
  }

  printLine();
  const total = sum(Object.values(results));
  console.log(`Total\t${total.toFixed(1)}`);
}

function printReport(filePath, options) {
  console.log("TIME REPORT", options.date);
  if (options.verbose) {
    printLine();
  }

  const content = readFile(filePath);
  const lines = content.split("\n");

  const index = findLineIndex(lines, options.date);

  const result = readLines(lines, index, options.verbose);
  printResults(result);
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
  .action((filePath, options) => printReport(filePath, options));

program.parse();
