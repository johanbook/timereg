const fs = require("fs");
const { DateTime, Interval } = require("luxon");

const PATH = process.argv[2];

function getFile(filePath) {
  try {
    const file = fs.readFileSync(filePath);
    const text = file.toString();
    return text;
  } catch {
    console.error("Unable to read file:", filePath);
    process.exit(1);
  }
}

function readUntilToken(lines, token) {
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
  const [hours, category] = line.split(" ");
  const duration = parseDuration(hours);
  return [category, duration];
}

function readLines(lines, index) {
  const results = {};

  for (; index < lines.length; index++) {
    const line = lines[index];

    if (!line) {
      break;
    }

    const [category, hours] = parseLine(line);
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

if (!PATH) {
  console.error("timereg [path]");
  console.error("run it like this");
  process.exit(1);
}

const content = getFile(PATH);
const lines = content.split("\n");

const index = readUntilToken(lines, "2022-10-03");

const result = readLines(lines, index);
printResults(result);
