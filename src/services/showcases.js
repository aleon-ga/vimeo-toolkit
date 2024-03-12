const fetch = require('node-fetch');
const { ACCEPT, AUTHORIZATION, MAX_PAGE_RESULTS, VIMEO_API_BASE_URL } = require('@constants');
const { mergeArrays } = require('@utils');

const getAllShowcases = async (searchQuery, fields) => {

    const showcases = [];

    try {

        const queryParams = new URLSearchParams({
            fields,
            page_size: MAX_PAGE_RESULTS,
            query: searchQuery,
            sort: 'alphabetical'
        });

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

module.exports = { getAllShowcases };
