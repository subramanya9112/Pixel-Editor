var fs = require("fs");

module.exports = (filePath, colorData) => {
    let size = colorData["size"];
    let data = size.join(" ");

    let colorDataOnly = colorData["data"];
    for (let i = 0; i < size[0]; i++)
        for (let j = 0; j < size[1]; j++)
            data += "\n" + colorDataOnly[i][j].join(" ");

    fs.writeFile(filePath, data, () => { });
}