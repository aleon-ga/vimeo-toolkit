const fetch = require('node-fetch');
const { ACCEPT, AUTHORIZATION, MAX_PAGE_RESULTS, VIMEO_API_BASE_URL } = require('@constants');
const { mergeArrays } = require('@utils');

const getAllShowcases = async ({ query, fields = '', sort = 'alphabetical' }) => {

    const showcases = [];

    try {

        const queryParams = new URLSearchParams({ fields, page_size: MAX_PAGE_RESULTS, sort });

        // Include the search query in `queryParams` only when it has a value to avoid false results (empty array).
        if (query) queryParams.append('query', query);

        let url = `${VIMEO_API_BASE_URL}/me/albums?${queryParams}`;

        const options = { headers: { ...AUTHORIZATION, ...ACCEPT } };

        do {

            const response = await fetch(url, options);

            if (!response.ok) {

                /**
                 * Represents the error message returned by the Vimeo API.
                 * @type {string}
                 */
                const { error } = await response.json();

                throw new Error('Failed to fetch all showcases.', {
                    cause: { statusCode: response.status, error }
                });

            };

            const { total, paging, data } = await response.json();

            if (total === 0) {

                throw new Error('No showcases were found.', { cause: { statusCode: 404 } });

            };

            showcases.push(data);

            url = paging.next ? `${VIMEO_API_BASE_URL}${paging.next}` : null;

        } while (url) // While `url` is not `null` => a next page exists.

        return {
            ok: true,
            data: mergeArrays(showcases)
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

}; //!GETALLSHOWCASES-END

const getShowcaseById = async (id, fields = '') => {

    try {

        const queryParams = new URLSearchParams({ fields });

        const url = `${VIMEO_API_BASE_URL}/me/albums/${id}?${queryParams}`;

        const options = { headers: { ...AUTHORIZATION, ...ACCEPT } };

        const response = await fetch(url, options);

        if (!response.ok) {

            /**
             * Represents the error message returned by the Vimeo API.
             * @type {string}
             */
            const { error } = await response.json();

            throw new Error('Failed to fetch the showcase.', {
                cause: { statusCode: response.status, error, showcase: id }
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

}; //!GETSHOWCASEBYID-END

const editShowcase = async (id, data = {}) => {

    try {

        const url = `${VIMEO_API_BASE_URL}/me/albums/${id}`;

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

            throw new Error(`Failed to edit the showcase.`, {
                cause: { statusCode: response.status, error, showcase: id }
            });

        };

        return { ok: true };

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

}; //!EDITSHOWCASE-END

module.exports = { getAllShowcases, getShowcaseById, editShowcase };
