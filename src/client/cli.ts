import { program } from "commander";
import { DateTime } from "luxon";

import generateAndPrintReport from "../application/createReport";
import createConfig from "../application/createConfig";
import * as config from "../config";

program.name("timereg").description("A tool for generating time reports");

program.command("config").action(() => createConfig());

program
  .command("report", "generate a report")
  .option(
    "--filePath <filePath>",
    "path to file with time sheet, overriding default configuration"
  )
  .option(
    "--date <date>",
    "the date to generate the report for",
    DateTime.now().toFormat("yyyy-MM-dd")
  )
  .option("-v, --verbose", "use verbose output")
  .action((options) => {
    const configs = config.readConfig();
    const mergedOptions = { ...configs, ...options };
    generateAndPrintReport(mergedOptions);
  });

program.parse();
