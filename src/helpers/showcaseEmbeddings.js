const showcaseEmbeddings = (id) => {

    const fixedEmbed = `<p>&nbsp;</p><p style='text-align: center;'><iframe src='https://vimeo.com/showcase/${id}/embed' width='700' height='394' allowfullscreen='allowfullscreen'></iframe></p><p>&nbsp;</p>`;

    const responsiveEmbed = `<p>&nbsp;</p><div style='padding: 56.25% 0px 0px; position: relative; text-align: center;'><iframe style='position: absolute; top: 0; left: 0; width: 100%; height: 100%;' src='https://vimeo.com/showcase/${id}/embed' allowfullscreen='allowfullscreen'></iframe></div><p>&nbsp;</p>`;

    return { fixedEmbed, responsiveEmbed };

};

module.exports = showcaseEmbeddings;
