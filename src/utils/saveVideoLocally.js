const fs = require('fs');
const path = require('path');
const { pipeline } = require('stream');
const { promisify } = require('util');

// Convert the `pipeline` to a promisified version.
const asyncPipeline = promisify(pipeline);

const saveVideoLocally = async (folderPath, fileName, readerStream, totalSize) => {

    try {

        // Create the directory if it does not already exist at the provided path.
        ensureFolderExists(folderPath);

        const filePath = path.join(folderPath, fileName);

        // Create a local writing stream.
        const writeStream = fs.createWriteStream(filePath);

        trackDownloadProgress(readerStream, totalSize);

        await asyncPipeline(readerStream, writeStream);

        return {
            ok: true,
            data: { name: fileName, path: filePath }
        };

    } catch (error) {

        return {
            ok: false,
            message: error.message
        };

    };

}; //!SAVEVIDEOLOCALLY-END

const ensureFolderExists = (folderPath) => {

    if (!fs.existsSync(folderPath)) {

        fs.mkdirSync(folderPath, { recursive: true });

    };

}; //!ENSUREFOLDEREXISTS-END

const trackDownloadProgress = (readerStream, totalSize) => {

    /**
     * Variable to track the progress of the download.
     * @type {number}
     */
    let bytesReceived = 0;

    /**
     * Represents the last progress value printed to the console.
     * @type {number}
     */
    let lastProgress = 0;

    readerStream.on('data', (chunk) => {

        bytesReceived += chunk.length;

        const progress = Math.floor((bytesReceived / totalSize) * 100);

        if (progress - lastProgress >= 10) {

            console.log(`Download progress: ${progress} %`);

            lastProgress = progress;

        };

    });

}; //!TRACKDOWNLOADPROGRESS-END

module.exports = saveVideoLocally;
