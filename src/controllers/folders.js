const { getAllVideosInFolder } = require('@services')?.foldersServices;

const getVideosIdsByFolder = async (req, res) => {

    try {

        const { id } = req.params; // CC folder for "Claudio": https://vimeo.com/me/folder/10499935.

        const folderVideos = await getAllVideosInFolder(id, 'uri');

        if (!folderVideos.ok) {

            const { ok, ...error } = folderVideos;

            throw error;

        };

        const { data } = folderVideos;

        res.status(200).json({ videos: data });

    } catch (error) {

        const statusCode = error.statusCode ?? 500;

        res.status(statusCode).json({ message: error.message });

    };

}; //!GETVIDEOSIDSBYFOLDER-END

module.exports = { getVideosIdsByFolder };
