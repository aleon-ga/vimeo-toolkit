const { createFolder, getAllVideosInFolder } = require('@services/folders');

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

/**
 * Controller responsible for handling the creation of folders in Vimeo.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 */
const handleCreateFolders = async (req, res) => {

    let foldersCreated = 0;

    try {
        /**
         * The request body object.
         * @type {Object}
         * @prop {string} fields - 
         * @prop {string[]} folderNames - 
         * @prop {string} parent_folder_uri - 
         */
        const { fields, folderNames, parentFolderUri } = req.body;

        for (const name of folderNames) {

            const createFolderResult = await createFolder(name, 12345, fields);

            if (!createFolderResult.ok) {

                const { error } = createFolderResult;

                console.error(`${error.name}: ${error.message}\n`, error.cause);

                continue;

            }

            const { uri } = createFolderResult.data;

            console.log(`\nThe folder was successfully created: ${uri}`);

            foldersCreated += 1;

        }

        if (!foldersCreated) {

            throw new Error('All attempts to create folders failed.');

        }
        
        res.status(201).json({ message: `${foldersCreated} out of ${folderNames.length} folders were created.` });
        
    } catch (error) {
        
        console.error(error);

        res.status(500).json({ message: error.message });

    }

}; //!HANDLECREATEFOLDERS-END

module.exports = {
    getVideosIdsByFolder,
    handleCreateFolders
};
