const fetch = require('node-fetch');
const { ACCEPT, AUTHORIZATION, MAX_PAGE_RESULTS, VIMEO_API_BASE_URL } = require('@constants');
// const { extractShowcaseId } = require('@helpers');
const { mergeArrays } = require('@utils');

/**
 * Retrieves all the videos that belong to the specified folder.
 * @param {string} id - Folder ID.
 * @param {string} fields - Fields to retrieve.
 * @returns {Promise<Object>} - A promise that resolves to an object. The object includes:
 * - `ok`: {boolean} - Indicates whether the operation was successful.
 * - `data`: {string[]} - An array of videos IDs, present if `ok` is `true`.
 * - `statusCode`: {number} - The status code, present if `ok` is `false`.
 * - `message`: {string} - The error message, present if `ok` is `false`.
 */
const getAllVideosInFolder = async (id, fields = '') => {

    const videos = [];

    try {

        const queryParams = new URLSearchParams({ fields, per_page: MAX_PAGE_RESULTS });

        let url = `${VIMEO_API_BASE_URL}/me/projects/${id}/videos?${queryParams}`;

        const options = { headers: { ...AUTHORIZATION, ...ACCEPT } };

        do {

            const response = await fetch(url, options);

            if (!response.ok) {

                /**
                 * Represents the error message returned by the Vimeo API.
                 * @type {string}
                 */
                const { error } = await response.json();

                throw new Error(`Failed to fetch all videos.`, {
                    cause: { statusCode: response.status, error, folder: id }
                });

            };

            const { total, paging, data } = await response.json();

            if (total === 0) {

                throw new Error(`No videos were found.`, {
                    cause: { statusCode: response.status, folder: id }
                });

            };

            /**
             * Maps each item in the `data` array to extract the showcase ID from its URI.
             * This operation utilizes the `extractShowcaseId` function to process each `uri` found within the `data` array.
             * @type {string[]} - An array of extracted showcase IDs.
             */
            // const ids = data.map(({ uri }) => extractShowcaseId(uri));
            const ids = data.map(({ uri }) => uri.split('/')[uri.split('/').length - 1]);

            videos.push(ids);

            url = paging.next ? `${VIMEO_API_BASE_URL}${paging.next}` : null;

        } while (url) // While `url` is not `null` => a next page exists.

        return {
            ok: true,
            data: mergeArrays(videos)
        };

    } catch (error) {

        console.error(`\n${error.message}`);

        const statusCode = error.cause?.statusCode ?? 500;

        return {
            ok: false,
            statusCode,
            message: error.message,
            ...error.cause
        };

    };

}; //!GETALLVIDEOSINFOLDER

module.exports = { getAllVideosInFolder };
