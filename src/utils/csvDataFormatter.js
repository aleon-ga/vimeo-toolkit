/**
 * Formats an array of objects into CSV format.
 * @param {Object[]} data - Array of objects representing the data to format into CSV.
 * @returns {string} - The formatted CSV string.
 */
const csvDataFormatter = (data) => {

    /**
     * Represents the headers of the CSV file.
     * @type {string}
     */
    const headers = Object.keys(data[0]).join(',');

    const rows = data.map(obj => Object.values(obj).map(value => {

        if (typeof value === 'string') {

            /**
             * Escape double quotes within the values.
             * This ensures that double quotes within strings are doubled to avoid interfering with the CSV format.
             */
            return `"${value.replace(/"/g, '""')}"`;

        };

        // If the value is not a string, the value is returned unchanged.
        return value;

    }).join(','));

    // Concatenate headers and rows with line breaks
    return headers + '\n' + rows.join('\n');

};

module.exports = csvDataFormatter;
