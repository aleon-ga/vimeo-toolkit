const fetch = require('node-fetch');
const path = require('path');
const { ACCEPT, AUTHORIZATION, MAX_PAGE_RESULTS, VIMEO_API_BASE_URL } = require('@constants');
const { mergeArrays, saveFileLocally } = require('@utils');

const getVideosIdsByFolder = async (req, res) => {

    const FIELDS = 'uri', idsArr = [];

    try {

        const { id } = req.params; // CC for Claudio: https://vimeo.com/user/84334492/folder/10499935

        const query = new URLSearchParams({
            per_page: MAX_PAGE_RESULTS,
            fields: FIELDS
        });

        let url = `${VIMEO_API_BASE_URL}/me/projects/${id}/videos?${query}`;

        const options = { headers: { ...AUTHORIZATION, ...ACCEPT } };

        do {

            const response = await fetch(url, options);

            if (!response.ok) {

                throw new Error(`Failed to fetch all the videos in folder ${id}.`, { cause: response.status });

            };

            const { total, paging, data } = await response.json();

            if (total === 0) {

                throw new Error(`No videos were found in folder ${id}.`, { cause: response.status });

            };

            /**
             * 
             * @type {string[]}
             */
            const ids = data.map(video => video.uri.split('/')[video.uri.split('/').length - 1]); // The last element of the array is the video ID.

            idsArr.push(ids);

            url = paging.next ? `${VIMEO_API_BASE_URL}${paging.next}` : null; // => E.g., "https://api.vimeo.com/me/projects/10499935/videos?per_page=100&fields=uri&page=2".

        } while (url); // While `url` is not `null`.

        const videos = mergeArrays(idsArr);

        const jsonVideos = JSON.stringify({ videos });

        const fileName = `folder_${id}.json`;

        const folderPath = path.join(__dirname, '../', 'downloads');

        saveFileLocally(fileName, folderPath, jsonVideos);

        res.status(200).json({ success: true });

    } catch (error) {

        console.error(error);

        res.status(error.cause || 500).json({ message: error.message });

    };

}; //!GETVIDEOSIDSBYFOLDER-END

module.exports = { getVideosIdsByFolder };
