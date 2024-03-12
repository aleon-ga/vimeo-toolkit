const router = require('express')?.Router();
const { generateShowcaseCsv } = require('@controllers')?.showcasesControllers;

router.post('/generate-csv', generateShowcaseCsv);

module.exports = router;
