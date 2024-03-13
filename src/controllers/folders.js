const path = require('path');
const { getAllVideosInFolder } = require('@services')?.foldersServices;
const { saveFileLocally } = require('@utils');

const getVideosIdsByFolder = async (req, res) => {

    try {

        const { params: { id }, query: { generateJson } } = req; // CC folder for "Claudio": https://vimeo.com/me/folder/10499935.

        const folderVideos = await getAllVideosInFolder(id, 'uri');

        if (!folderVideos.ok) {

            const { ok, ...error } = folderVideos;

            throw error

        };

        const { data: videos } = folderVideos;

        if (generateJson) {

            const jsonStr = JSON.stringify({ videos });

            const fileName = `folder_${id}.json`;

            const folderPath = path.join(__dirname, '../', 'downloads');

            await saveFileLocally(fileName, folderPath, jsonStr);

        };

        res.status(200).json({ videos });

    } catch (error) {

        const statusCode = (!isNaN(error.cause)) ? error.cause : 500;

        res.status(statusCode).json({ message: error.message });

    };

}; //!GETVIDEOSIDSBYFOLDER-END

module.exports = { getVideosIdsByFolder };
