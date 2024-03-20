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

const editVideo = async (id, requestData = {}, fields = '') => {

    try {

        const query = new URLSearchParams({ fields });

        const url = `${VIMEO_API_BASE_URL}/videos/${id}?${query}`;

        const options = {
            method: 'PATCH',
            body: JSON.stringify(requestData),
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

        const responseData = await response.json();

        return { ok: true, data: responseData };

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

// VIDEOS - UPLOADS SERVICES
/**
 * Adds a video placeholder to the Vimeo account: https://developer.vimeo.com/api/upload/videos.
 * This placeholder continues to exist, even if you don't subsequently upload a video file to it.
 * @param {Object} [data={}] - The body request.
 */
const createVideoPlaceholder = async (requestData = {}, fields = '') => {

    try {

        const queryParams = new URLSearchParams({ fields });

        const url = `${VIMEO_API_BASE_URL}/me/videos?${queryParams}`;

        const options = {
            method: 'POST',
            body: JSON.stringify(requestData),
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

            throw new Error(`Failed to add a video placeholder to the Vimeo account.`, {
                cause: { statusCode: response.status, error }
            });

        }

        const responseData = await response.json();

        return { ok: true, data: responseData };

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

}; //!CREATEVIDEOPLACEHOLDER-END

const uploadVideoFile = async (url, binaryData, offset = 0) => {

    try {

        const options = {
            method: 'PATCH',
            body: binaryData,
            headers: {
                'Tus-Resumable': '1.0.0',
                'Upload-Offset': offset,
                'Content-Type': 'application/offset+octet-stream'
            }
        };

        const response = await fetch(url, options);

        if (!response.ok) {

            /**
             * Represents the error message returned by the Vimeo API.
             * @type {string}
             */
            const { error } = await response.json();

            throw new Error(`Failed to upload the video file.`, {
                cause: { statusCode: response.status, error }
            });

        }

        const uploadOffset = parseInt(response.headers.get('Upload-Offset'));

        return {
            ok: true,
            data: { uploadOffset }
        };

    } catch (error) {

        const statusCode = error.cause?.statusCode ?? 500;

        return {
            ok: false,
            statusCode,
            message: error.message,
            ...error.cause
        };

    }

}; //!UPLOADVIDEOFILE-END

module.exports = {
    createVideoPlaceholder,
    editVideo,
    getAllTextTracks,
    getVideo,
    uploadVideoFile
};
