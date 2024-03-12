const router = require('express')?.Router();
const { checkShowcasesPrivacy, generateShowcasesCsv } = require('@controllers')?.showcasesControllers;

router.post('/generate-csv', generateShowcasesCsv);

router.post('/check-privacy', checkShowcasesPrivacy);

module.exports = router;
