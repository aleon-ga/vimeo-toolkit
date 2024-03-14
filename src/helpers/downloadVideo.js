const fetch = require('node-fetch');
const fs = require('fs');
const path = require('path');
const { getVideo } = require('@services')?.videosServices;

const downloadVideo = async (id) => {

    const FIELDS = 'download.link,download.quality,download.rendition,download.size,download.type';

    try {

        //TODO: Step 1 - Retrieve the video with the necessary download parameters.
        const video = await getVideo(id, FIELDS);

        if (!video.ok) {

            const { ok, ...error } = video;

            throw error;

        };

        //TODO: Step 2 - Extract the information from the video with the best quality.
        const videoFilesList = video.data?.download;

        /**
         * The function filters and sorts a list of video files to select the highest-quality downloadable video,
         * prioritizing files with the 'mp4' format and sorting them by size in descending order.
         * @type {Object}
         * @prop {string} link - The direct link to the video file.
         * @prop {string} quality - The video quality as determined by height and width.
         * @prop {string} rendition - The video rendition.
         * @prop {number} size - The approximate size in bytes of the video file.
         * @prop {string} type - The type of video file.
         */
        const downloadableVideo = videoFilesList.filter(({ type }) => type.includes('mp4')).sort((a, b) => b.size - a.size)[0];

        if (!downloadableVideo) {

            throw new Error('No video was found for downloading.', {
                cause: { statusCode: 404, video: id }
            });

        };

        //TODO: Step 3 - Save the video file locally.
        const { link, quality, rendition, size, type } = downloadableVideo;

        const response = await fetch(link);

        if (!response.ok) {

            throw new Error('Failed to fetch the video download.', {
                cause: { statusCode: response.status, video: id }
            });

        };

        const fileFormat = type.split('/')[type.split('/').length - 1];

        const fileName = `${id}_${quality}_${rendition}.${fileFormat}`;

        const filePath = path.join(__dirname, '../', 'downloads', 'videos', fileName);

        const writeStream = fs.createWriteStream(filePath);

        const readerStream = response.body;

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

        readerStream.on('data', (chunk) => {

            bytesReceived += chunk.length;

            const progress = Math.floor((bytesReceived / size) * 100);

            // Check if the progress has increased by at least 10 since the last time it was printed.
            if (progress - lastProgress >= 10) {

                console.log(`Download progress: ${progress} %`);

                lastProgress = progress; // Update the last printed progress.

            };

        });

        // Pipe the downloaded content to the local file.
        readerStream.pipe(writeStream);

        return new Promise((resolve, reject) => {

            writeStream.on('finish', () => {
                console.log('The video has been downloaded successfully.');
                resolve({
                    ok: true,
                    data: { name: fileName, path: filePath }
                });
            });

            writeStream.on('error', (error) => {
                reject(new Error('Failed to save the video locally.', {
                    cause: { statusCode: 500, error: error.message, video: id }
                }));
            });

        });

    } catch (error) {

        console.error(`\n${error.message}`);

        const statusCode = error.statusCode ?? error.cause?.statusCode ?? 500;

        return {
            ok: false,
            statusCode,
            message: error.message,
            ...error.cause
        };

    };

};

module.exports = downloadVideo;
