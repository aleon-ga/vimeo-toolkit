const path = require('path');
const { showcaseEmbeddings } = require('@helpers');
const { getAllShowcases } = require('@services')?.showcasesServices;
const { csvDataFormatter, saveFileLocally } = require('@utils');

const generateShowcaseCsv = async (req, res) => {

    const data = [];

    try {

        const { body, query: { fields } } = req;

        for (const term in body) {

            const universities = body[term];

            for (const university of universities) {

                const searchQuery = `${university}-${term}`;

                const showcases = await getAllShowcases(searchQuery, fields);

                if (!showcases.length) {

                    console.log(`No showcases were found for ${searchQuery}.`);

                    continue;

                };

                for (const { name, uri } of showcases) {

                    const id = uri.split('/')[uri.split('/').length - 1];

                    const { fixedEmbed, responsiveEmbed } = showcaseEmbeddings(id);

                    data.push({ id, name, fixedEmbed, responsiveEmbed });

                };

            };

        };

        const csvData = csvDataFormatter(data);

        const fileName = 'showcases.csv';

        const folderPath = path.join(__dirname, '../', 'downloads');

        saveFileLocally(fileName, folderPath, csvData);

        res.status(200).json({ success: true });

    } catch (error) {

        console.error(error);

        res.status(error.cause || 500).json({ message: error.message });

    };

}; //!GENERATESHOWCASECSV-END

module.exports = { generateShowcaseCsv };
