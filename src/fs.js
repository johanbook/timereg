const fs = require("fs");

exports.readFile = function (filePath) {
  try {
    const file = fs.readFileSync(filePath);
    const text = file.toString();
    return text;
  } catch {
    console.error("Unable to read file:", filePath);
    process.exit(1);
  }
};

exports.findLineIndex = function (lines, token) {
  let index;
  for (index = 0; index < lines.length; index++) {
    const line = lines[index];

    if (line.includes(token)) {
      return index + 1;
    }
  }

  console.error("Unable to find:", token);
  process.exit(1);
};
