const fetch = require('node-fetch');
const { ACCEPT, AUTHORIZATION, MAX_PAGE_RESULTS, VIMEO_API_BASE_URL } = require('@constants');

const getAllTextTracks = async (id, fields) => {

    try {

        const queryParams = new URLSearchParams({ fields, per_page: MAX_PAGE_RESULTS });

        const url = `${VIMEO_API_BASE_URL}/videos/${id}/texttracks?${queryParams}`;

        const options = { headers: { ...AUTHORIZATION, ...ACCEPT } };

        const response = await fetch(url, options);

        if (!response.ok) {

            /**
             * Represents the error message returned by the Vimeo API.
             * @type {string}
             */
            const { error } = await response.json();

            throw new Error(`Failed to fetch all the text tracks.`, { cause: { statusCode: response.status, error } });

        };

        const { data, total } = await response.json();

        if (total === 0) {

            throw new Error(`No text tracks were found.`, { cause: { statusCode: 404 } });

        };

        return { ok: true, data };

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

}; //!GETALLTEXTTRACKS-END

module.exports = { getAllTextTracks };
