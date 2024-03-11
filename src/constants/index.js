module.exports = {
    ACCEPT: { Accept: 'application/vnd.vimeo.*+json;version=3.4' },
    AUTHORIZATION: { Authorization: `Bearer ${process.env.VIMEO_PERSONAL_ACCESS_TOKEN}` },
    MAX_PAGE_RESULTS: 100,
    VIMEO_API_BASE_URL: 'https://api.vimeo.com'
};
