const fetch = require('node-fetch');
const { ACCEPT, AUTHORIZATION, MAX_PAGE_RESULTS, VIMEO_API_BASE_URL } = require('@constants');
const { mergeArrays } = require('@utils');

const getAllShowcases = async (query = '', fields = '', sort = 'alphabetical') => {

    const showcases = [];

    try {

        const queryParams = new URLSearchParams({ fields, page_size: MAX_PAGE_RESULTS, query, sort });

        let url = `${VIMEO_API_BASE_URL}/me/albums?${queryParams}`;

        const options = { headers: { ...AUTHORIZATION, ...ACCEPT } };

        do {

            const response = await fetch(url, options);

            if (!response.ok) {

                throw new Error('Failed to fetch all showcases.', { cause: response.status });

            };

            const { total, paging, data } = await response.json();

            if (total > 0) showcases.push(data);

            url = paging.next ? `${VIMEO_API_BASE_URL}${paging.next}` : null;

        } while (url) // While `url` is not `null` => a next page exists.

        return mergeArrays(showcases);

    } catch (error) { throw error };

}; //!GETALLSHOWCASES-END

const getShowcaseById = async (id, fields = '') => {

    try {

        const queryParams = new URLSearchParams({ fields });

        const url = `${VIMEO_API_BASE_URL}/me/albums/${id}?${queryParams}`;

        const options = { headers: { ...AUTHORIZATION, ...ACCEPT } };

        const response = await fetch(url, options);

        if (!response.ok) {

            throw new Error(`Failed to fetch the showcase ${id}.`, { cause: response.status });

        };

        const data = await response.json();

        return { ok: true, data };

    } catch (error) { handleError(error) };

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

            throw new Error(`Failed to edit the showcase ${id}.`, { cause: response.status });

        };

        return { ok: true };

    } catch (error) { handleError(error) };

}; //!EDITSHOWCASE-END

const handleError = (error) => {

    console.error(error.message);

    return {
        ok: false,
        statusCode: error.cause || 500,
        message: error.message
    };

}; //!HANDLE-ERROR

module.exports = { getAllShowcases, getShowcaseById, editShowcase };
