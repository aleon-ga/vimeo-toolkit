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

        console.log('\nVideo placeholder created successfully.');

        //TODO: Step 2 - Upload the video file.
        const { upload: { upload_link } } = videoPlaceholder.data;

        console.log('\n', upload_link);

        /**
         * Size of the block for file upload in bytes.
         * @type {number}
         * @constant
         * @default
         * @description The block size is defined in megabytes by multiplying the desired amount in megabytes by 1024 twice.
         *              This provides the size in bytes.
         */
        const chunkMaxSize = 50 * 1024 * 1024; // => 128 MB

        console.log('CHUNK MAX SIZE:', chunkMaxSize);

        const fileSize = fs.statSync(file.path)?.size;

        console.log('FILE SIZE:', fileSize);

        let offset = 0;

        while (offset < fileSize) {

            console.log(offset);

            const fileDataBuffer = await readFileChunk(file.path, fileSize, chunkMaxSize, offset);

            const videoUpload = await uploadVideoFile(upload_link, fileDataBuffer, offset);

            if (!videoUpload.ok) {

                //TODO: Handle error

                console.log(videoUpload);

                break;

            }

            const { uploadOffset } = videoUpload.data;

            console.log(uploadOffset)

            if (uploadOffset === fileSize) console.log('Vimeo received the entire file.');

            if (uploadOffset < fileSize) console.log('Vimeo did not receive the entire file.');

            offset += fileDataBuffer.byteLength;

        }

        console.log('Terminé');

    } catch (error) {

        console.error(`\n${error.message}`);

        console.error(error);

        const statusCode = error.statusCode ?? error.cause?.statusCode ?? 500;

        return {
            ok: false,
            statusCode,
            message: error.message,
            ...error.cause
        };

    }

}; //!UPLOADVIDEO-END

const readFileChunk = async (filePath, fileSize, chunkMaxSize, offset = 0) => {

    return new Promise((resolve, reject) => {

        const chunks = [];
        /**
         * Variable to track the progress of the download.
         * @type {number}
         */
        let bytesReceived = 0;
        /**
         * Represents the last progress value printed to the console.
         * @type {number}
         */
        let lastProgress = 0;

        const readerStream = fs.createReadStream(filePath, {
            start: offset,
            end: (offset + chunkMaxSize - 1) // This ensures that we don't exceed the specified chunk size.
        });

        readerStream.on('data', (chunk) => {

            bytesReceived += chunk.length;

            const progress = Math.floor((bytesReceived / fileSize) * 100);

            if (progress - lastProgress >= 10) {

                console.log(`Upload progress: ${progress} %`);

                lastProgress = progress;

            };

            chunks.push(chunk);

        });

        readerStream.on('end', () => resolve(Buffer.concat(chunks)));

        readerStream.on('error', (error) => reject(error));

    });

}; //!READFILECHUNK-END

module.exports = uploadVideo;
