const fs = require('fs');
const { DEFAULT_EMBED_DOMAINS_LIST, DEFAULT_VIDEO_PRIVACY_SETTINGS } = require('@constants');
const { createVideoPlaceholder, uploadVideoFile } = require('@services').videosServices;

const uploadVideo = async (video, folder, approach) => {

    try {

        const { name, description, file } = video;

        //TODO: Step 1 - Create the video placeholder.
        const videoMetadata = {
            description,
            embed: { logos: { vimeo: false } },
            embed_domains: DEFAULT_EMBED_DOMAINS_LIST,
            folder_uri: folder,
            hide_from_vimeo: true, // According to the documentation, the `view` privacy field is deprecated.
            // locale,
            name,
            privacy: { ...DEFAULT_VIDEO_PRIVACY_SETTINGS },
            upload: approach
        };

        const videoPlaceholder = await createVideoPlaceholder(videoMetadata, 'upload.upload_link'); // 'upload.upload_link' => fields to return.

        if (!videoPlaceholder.ok) {

            const { ok, ...error } = videoPlaceholder;

            throw error;

        }

        console.log('\nVideo placeholder created successfully.');

        //TODO: Step 2 - Upload the video file.
        const { upload: { upload_link } } = videoPlaceholder.data;

        console.log('\nThe upload link is:', upload_link);

        /**
         * Max size of the block for file upload in bytes.
         * @type {number}
         * @constant
         * @default
         * @description The block size is defined in megabytes by multiplying the desired amount in megabytes by 1024 twice. This provides the size in bytes.
         */
        const chunkMaxSize = 128 * 1024 * 1024; // => 128 MB

        const fileSize = fs.statSync(file.path)?.size;

        let offset = 0;

        while (offset < fileSize) {

            const fileDataBuffer = await readFileChunk(file.path, chunkMaxSize, offset);

            const videoUpload = await uploadVideoFile(upload_link, fileDataBuffer, offset);

            if (!videoUpload.ok) {

                const { ok, ...error } = videoUpload;

                throw error; // `break` the loop.

            }

            const { uploadOffset } = videoUpload.data;

            if (uploadOffset === fileSize) console.log('\nVimeo received the entire file.');

            offset += fileDataBuffer.byteLength;

        }

        return { ok: true };

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

const readFileChunk = async (filePath, chunkMaxSize, offset = 0) => {

    const chunks = [];

    return new Promise((resolve, reject) => {

        const options = {
            start: offset,
            end: (offset + chunkMaxSize - 1) // This ensures that we don't exceed the specified chunk size.
        };

        const readerStream = fs.createReadStream(filePath, options);

        readerStream.on('data', (chunk) => chunks.push(chunk));

        readerStream.on('end', () => resolve(Buffer.concat(chunks)));

        readerStream.on('error', (error) => reject(error));

    });

}; //!READFILECHUNK-END

module.exports = uploadVideo;
