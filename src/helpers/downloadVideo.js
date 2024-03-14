const fetch = require('node-fetch');
const path = require('path');
const { getVideo } = require('@services')?.videosServices;
const { saveVideoLocally } = require('@utils');

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
        const { link, quality, rendition, size: fileSize, type } = downloadableVideo;

        const response = await fetch(link);

        if (!response.ok) {

            throw new Error('Failed to fetch the video download.', {
                cause: { statusCode: response.status, video: id }
            });

        };

        const fileFormat = type.split('/')[type.split('/').length - 1];

        const folderPath = path.join(__dirname, '../', 'downloads', 'videos');

        const fileName = `${id}_${quality}_${rendition}.${fileFormat}`;

        const fileContent = response.body;

        const videoSave = await saveVideoLocally(folderPath, fileName, fileContent, fileSize);

        if (!videoSave.ok) {

            const { ok, ...error } = videoSave;

            throw error;

        };

        return {
            ok: true,
            data: videoSave.data
        };

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
