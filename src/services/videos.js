const fetch = require('node-fetch');
const { ACCEPT, AUTHORIZATION, MAX_PAGE_RESULTS, VIMEO_API_BASE_URL } = require('@constants');

// VIDEOS - ESSENTIAL SERVICES
const getVideo = async (id, fields = '') => {

    try {

        const queryParams = new URLSearchParams({ fields });
        
        const url = `${VIMEO_API_BASE_URL}/videos/${id}?${queryParams}`;

        const options = { headers: { ...AUTHORIZATION, ...ACCEPT } };

        const response = await fetch(url, options);

        if (!response.ok) {

            /**
             * Represents the error message returned by the Vimeo API.
             * @type {string}
             */
            const { error } = await response.json();

            throw new Error(`Failed to fetch the video.`, {
                cause: { statusCode: response.status, error, video: id }
            });

        };

        const data = await response.json();

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

}; //!GETVIDEO-END

const editVideo = async (id, data = {}, fields = '') => {

    try {

        const query = new URLSearchParams({ fields });
        
        const url = `${VIMEO_API_BASE_URL}/videos/${id}?${query}`;

        const options = {
            method: 'PATCH',
            body: JSON.stringify(data),
            headers: {
                ...AUTHORIZATION,
                'Content-Type': 'application/json',
                ...ACCEPT
            }
        };

        const response = await fetch(url, options);

        if (!response.ok) {

            /**
             * Represents the error message returned by the Vimeo API.
             * @type {string}
             */
            const { error } = await response.json();

            throw new Error('Failed to edit the video.', {
                cause: { statusCode: response.status, error, video: id }
            });

        }

        const cosa = await response.json();

        return { ok: true, data: cosa };

    } catch (error) {
        
        console.error(`\n${error.message}`);

        const statusCode = error.cause?.statusCode ?? 500;

        return {
            ok: false,
            statusCode,
            message: error.message,
            ...error.cause
        };

    }

}; //!EDITVIDEO-END

// VIDEOS - TEXT TRACKS SERVICES
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

module.exports = {
    editVideo,
    getAllTextTracks,
    getVideo
};
