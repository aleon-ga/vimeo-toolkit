const fs = require('fs');
const path = require('path');

/**
 * Saves a file locally to the specified folder path with the given file name.
 * @param {string} folderPath - The path of the folder where the file will be saved.
 * @param {string} fileName - The name of the file.
 * @param {Buffer | string} file - The content of the file to be saved.
 * @returns {Promise<Object>} - A promise that resolves to an object indicating the result of the operation:
 * - `ok`: {boolean} - Indicates whether the operation was successful.
 * - `statusCode`: {number} - The status code associated with the error, if `ok` is `false`.
 * - `message`: {string} - A message describing the outcome of the operation.
 * - `error`: {string} - The error message, if `ok` is `false`.
 * - Additional properties may be present in the returned object if an error occurs during the operation.
 */
const saveFileLocally = async (folderPath, fileName, file) => {

    try {

        // Create the directory if it does not already exist at the provided path.
        if (!fs.existsSync(folderPath)) fs.mkdirSync(folderPath, { recursive: true });

        const filePath = path.join(folderPath, fileName);

        await fs.promises.writeFile(filePath, file);

        return { ok: true };

    } catch (error) {

        const message = 'Failed to save the file locally.';

        console.error('\n' + message);

        return {
            ok: false,
            statusCode: 500,
            message,
            error: error.message,
            ...error
        };

    };

};

module.exports = saveFileLocally;
