import * as dotenv from "dotenv";
import { DateTime } from "luxon";

import { program } from "commander";
import { generateAndPrintReport } from "./report";

dotenv.config();

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
