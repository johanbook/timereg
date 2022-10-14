import * as fs from "fs";

/** Reads file from path */
export function readFile(filePath: string): string {
  try {
    const file = fs.readFileSync(filePath);
    const text = file.toString();
    return text;
  } catch {
    console.error("Unable to read file:", filePath);
    process.exit(1);
  }
}

/** Parses arry until token is found. Return index */
export function findLineIndex(lines: string[], token: string): number {
  let index;
  for (index = 0; index < lines.length; index++) {
    const line = lines[index];

    if (line.includes(token)) {
      return index + 1;
    }
  }

  console.error("Unable to find:", token);
  process.exit(1);
}
