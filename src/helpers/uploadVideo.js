const fs = require('fs');
const { createVideoPlaceholder, uploadVideoFile } = require('@services').videosServices;
const { DEFAULT_EMBED_DOMAINS_LIST, DEFAULT_VIDEO_PRIVACY_SETTINGS } = require('@constants');

const uploadVideo = async (video, folder, approach) => {

    try {

        const { name, description, file } = video;

        //TODO: Step 1 - Create the video placeholder.
        const videoMetadata = {
            description,
            // embed: { logos: { vimeo: false } }, //?
            embed_domains: DEFAULT_EMBED_DOMAINS_LIST,
            folder_uri: folder,
            hide_from_vimeo: true, // According to the documentation, the `view` privacy field is deprecated.
            name,
            privacy: { ...DEFAULT_VIDEO_PRIVACY_SETTINGS },
            upload: approach
        };

        const videoPlaceholder = await createVideoPlaceholder(videoMetadata, 'upload.upload_link'); // 'upload.upload_link' => fields to return.

        if (!videoPlaceholder.ok) {

            const { ok, ...error } = videoPlaceholder;

            throw error;

        }

        //TODO: Step 2 - Upload the video file.
        const { upload: { upload_link } } = videoPlaceholder.data;

        console.log(upload_link);

        /**
         * Size of the block for file upload in bytes.
         * @type {number}
         * @constant
         * @default
         * @description The block size is defined in megabytes by multiplying the desired amount in megabytes by 1024 twice.
         *              This provides the size in bytes.
         */
        const chunkSize = 10 * 1024 * 1024;

        const fileSize = fs.statSync(file.path).size;

        let offset = 0;

        while (offset < fileSize) {

            const chunk = fs.readFileSync(file.path, {
                encoding: null, // Specifies that the file should be read as a Buffer object rather than a string.
                flag: 'r', // 'Read mode' (this is the default mode).
                start: offset,
                end: offset + chunkSize - 1 // This ensures that we don't exceed the specified chunk size.
            });

            const videoUpload = await uploadVideoFile(upload_link, chunk, offset);

            if (!videoUpload.ok) {
                
                //TODO: Handle error

                break;

            }

            const { uploadOffset } = videoUpload.data;

            if (uploadOffset === fileSize) console.log('Vimeo received the entire file.');

            if (uploadOffset < fileSize) console.log('Vimeo did not receive the entire file.');

            offset += chunk.length;

        }

        console.log('Terminé');

    } catch (error) {

        console.error(`\n${error.message}`);

        const statusCode = error.statusCode ?? error.cause?.statusCode ?? 500;

        return {
            ok: false,
            statusCode,
            message: error.message,
            ...error.cause
        };

    }

}; //!UPLOADVIDEO-END

module.exports = uploadVideo;
