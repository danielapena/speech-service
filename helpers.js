const fs = require("fs");

function writeToFile(filePath, data) {
  fs.appendFile(filePath, data + "\n", (err) => {
    if (err) throw err;
  });
}

module.exports = { writeToFile };
