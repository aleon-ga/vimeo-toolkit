const path = require('path');
const { extractShowcaseId, showcaseEmbeddings } = require('@helpers');
const { editShowcase, getAllShowcases, getShowcaseById } = require('@services')?.showcasesServices;
const { csvDataFormatter, saveFileLocally } = require('@utils');

const generateShowcasesCsv = async (req, res) => {

    const showcasesData = [], logs = [];

    try {

        const { body, query: { fields } } = req;

        for (const term in body) {

            console.log(`\nIterating over term ${term}...`);

            const universities = body[term];

            for (const university of universities) {

                console.log(`\nIterating over university ${university}...`);

                const searchQuery = `${university}-${term}`;

                const showcases = await getAllShowcases({ query: searchQuery, fields });

                if (!showcases.ok) {

                    const { ok, ...info } = showcases;

                    logs.push({ term, university, ...info });

                    continue;

                };

                for (const { name, uri } of showcases.data) {

                    const id = extractShowcaseId(uri);

                    const { fixedEmbed, responsiveEmbed } = showcaseEmbeddings(id);

                    showcasesData.push({ id, name, fixedEmbed, responsiveEmbed });

                };

            };

        };

        // The array is empty.
        if (!showcasesData.length) {

            throw new Error('Failed to retrieve any data from the showcases. CSV file generation cannot be completed.', {
                cause: { statusCode: 400 }
            });

        };

        const csvData = csvDataFormatter(showcasesData);

        const fileName = 'showcases.csv';

        const folderPath = path.join(__dirname, '../', 'downloads');

        const saveFileProcess = await saveFileLocally(folderPath, fileName, csvData);

        if (!saveFileProcess.ok) {

            const { ok, ...error } = saveFileProcess;

            throw error;

        };

        const { filePath } = saveFileProcess;

        res.status(200).json({
            message: 'The CSV file has been successfully saved locally.',
            filePath,
            logs
        });

    } catch (error) {

        console.error('\n', error, '\n');

        const statusCode = error.statusCode ?? error.cause.statusCode ?? 500;

        res.status(statusCode).json({
            message: error.message,
            logs
        });

    };

}; //!GENERATESHOWCASECSV-END

const checkShowcasesPrivacy = async (req, res) => {

    const updates = [], failures = [];

    try {

        const { body } = req;

        for (const term in body) {

            const universities = body[term];

            for (const university of universities) {

                const searchQuery = `${university}-${term}`;

                const showcases = await getAllShowcases(searchQuery, 'uri'); // fields => 'uri'.

                if (!showcases.length) {

                    console.log(`\nNo showcases were found for ${searchQuery}.`);

                    continue;

                };

                for (const { uri } of showcases) {

                    const id = extractShowcaseId(uri);

                    const showcase = await getShowcaseById(id, 'privacy'); // fields => 'privacy'.

                    if (!showcase.ok) {

                        const { ok, ...errorInfo } = showcase;

                        failures.push(errorInfo);

                        continue;

                    };

                    const { privacy } = showcase.data;

                    if (privacy.view === 'embed_only') {

                        console.log(`\nShowcase ${id} privacy settings are correct.`);

                        continue;

                    };

                    console.log(`\nShowcase ${id} requires updating privacy settings.`);

                    const showcasePrivacyUpdate = await editShowcase(id, { privacy: 'embed_only' });

                    if (!showcasePrivacyUpdate.ok) {

                        const { ok, ...errorInfo } = showcasePrivacyUpdate;

                        failures.push(errorInfo);

                        continue;

                    };

                    console.log(`\nShowcase ${id} privacy settings updated successfully.`);

                    updates.push(id);

                };

            };

        };

        res.status(200).json({ updates, failures });

    } catch (error) {

        console.error(error);

        res.status(error.cause || 500).json({ message: error.message });

    };

}; //!CHECKSHOWCASESPRIVACY

module.exports = { generateShowcasesCsv, checkShowcasesPrivacy };
