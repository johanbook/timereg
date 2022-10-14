const { stdin, stdout } = process;

/** Prints separing line to stdout */
export function printLine(num = 16, char = "="): void {
  console.log(char.repeat(num));
}

/** Prompt user for input */
export async function prompt(question: string): Promise<string> {
  return new Promise((resolve, reject) => {
    stdin.resume();
    stdout.write(question);

    stdin.on("data", (data) => resolve(data.toString().trim()));
    stdin.on("error", (err) => reject(err));
  });
}

/** Sums numbers in array */
export function sum(array: number[]): number {
  let result = 0;
  for (const value of array) {
    result += value;
  }
  return result;
}
