const fs = require('fs');
const path = require('path');

const saveJsonFile = (fileName, folderPath, json) => {

    // Create the directory if it does not already exist at the provided path.
    if (!fs.existsSync(folderPath)) fs.mkdirSync(folderPath);

    const filePath = path.join(folderPath, fileName);

    fs.writeFile(filePath, json, (error) => {

        if (error) throw error;

        console.log('File written successfully.');

    });

};

module.exports = saveJsonFile;
