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

        const csvSave = await saveFileLocally(folderPath, fileName, csvData);

        if (!csvSave.ok) {

            const { ok, ...error } = csvSave;

            throw error;

        };

        const file = csvSave.data;

        res.status(200).json({
            message: 'The CSV file has been successfully saved locally.',
            file,
            logs
        });

    } catch (error) {

        console.error('\n', error, '\n');

        const statusCode = error.statusCode ?? error.cause?.statusCode ?? 500;

        res.status(statusCode).json({
            message: error.message,
            logs
        });

    };

}; //!GENERATESHOWCASECSV-END

const checkShowcasesPrivacy = async (req, res) => {

    const updates = [], logs = [];

    try {

        const { body } = req;

        for (const term in body) {

            console.log(`\nIterating over term ${term}...`);

            const universities = body[term];

            for (const university of universities) {

                console.log(`\nIterating over university ${university}...`);

                const searchQuery = `${university}-${term}`;

                const showcases = await getAllShowcases({ query: searchQuery, fields: 'uri' });

                if (!showcases.ok) {

                    const { ok, ...info } = showcases;

                    logs.push({ term, university, ...info });

                    continue;

                };

                for (const { uri } of showcases.data) {

                    const id = extractShowcaseId(uri);

                    const showcase = await getShowcaseById(id, 'privacy'); // fields => 'privacy'.

                    if (!showcase.ok) {

                        const { ok, ...info } = showcase;

                        logs.push({ term, university, ...info });

                        continue;

                    };

                    const { privacy } = showcase.data;

                    if (privacy.view === 'embed_only') {

                        console.log(`\nShowcase ${id} privacy settings are correct.`);

                        continue;

                    };

                    console.log(`\nShowcase ${id} requires updating its privacy settings.`);

                    const showcasePrivacyUpdate = await editShowcase(id, { privacy: 'embed_only' });

                    if (!showcasePrivacyUpdate.ok) {

                        const { ok, ...info } = showcasePrivacyUpdate;

                        logs.push({ term, university, ...info });

                        continue;

                    };

                    console.log(`\nShowcase ${id} privacy settings updated successfully.`);

                    updates.push(id);

                };

            };

        };

        res.status(200).json({
            message: "Verification of showcases' privacy settings completed successfully.",
            updates,
            logs
        });

    } catch (error) {

        console.error('\n', error, '\n');

        const statusCode = error.statusCode ?? error.cause?.statusCode ?? 500;

        res.status(statusCode).json({
            message: error.message,
            logs
        });

    };

}; //!CHECKSHOWCASESPRIVACY

module.exports = { generateShowcasesCsv, checkShowcasesPrivacy };
