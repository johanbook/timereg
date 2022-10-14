import * as fs from "fs";

export function createFolder(path: string): void {
  fs.mkdirSync(path);
}

export function fileExists(path: string): boolean {
  return fs.existsSync(path);
}

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

export function readJSONFile(filePath: string): any {
  const data = readFile(filePath);
  return JSON.parse(data);
}

export function writeFile(filePath: string, data: string): void {
  fs.writeFileSync(filePath, data);
}

export function writeJSONFile(filePath: string, data: unknown): void {
  const jsonifiedData = JSON.stringify(data, null, 2);
  writeFile(filePath, jsonifiedData);
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
