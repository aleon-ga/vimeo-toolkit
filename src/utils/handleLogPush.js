/**
 * Pushes information from data object into an array of logs.
 * @param {Array} arr - The array of logs to which information will be pushed.
 * @param {Object} data - The data object containing information to push.
 * @param {boolean} [data.ok=false] - Whether the operation was successful. Defaults to false.
 */
const handleLogPush = (arr, data) => {

    const { ok, ...info } = data;

    arr.push(info);

};

module.exports = handleLogPush;
