/** Prints separing line to stdout */
export function printLine(num = 16, char = "="): void {
  console.log(char.repeat(num));
}

/** Sums numbers in array */
export function sum(array: number[]): number {
  let result = 0;
  for (const value of array) {
    result += value;
  }
  return result;
}
