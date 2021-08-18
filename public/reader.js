var fs = require("fs");

module.exports = (filePath) => {
  var data = fs.readFileSync(filePath, { encoding: 'utf8', flag: 'r' });
  data = data.split(/\r\n|\r|\n/);

  let sizeString = data[0].split(" ");
  let size = [parseInt(sizeString[0]), parseInt(sizeString[1])];

  let index = 1;
  let colorData = new Array(size[0]);
  for (let i = 0; i < size[0]; i++) {
    colorData[i] = new Array(size[1]);
    for (let j = 0; j < size[1]; j++) {
      colorData[i][j] = data[index++].split(" ");
    }
  }

  return {
    "size": size,
    "data": colorData
  };
}