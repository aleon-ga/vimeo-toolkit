/**
 * Extracts the showcase ID from an URI.
 * @param {string} uri - The URI from which to extract the showcase ID.
 * @returns {string} - The extracted showcase ID.
 */
const extractShowcaseId = (uri) => uri.split('/')[uri.split('/').length - 1];

module.exports = extractShowcaseId;