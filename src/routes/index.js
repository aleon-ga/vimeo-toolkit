const router = require('express')?.Router();
const foldersRoutes = require('./folders');

router.use('/folders', foldersRoutes);

router.get('/health-check', (req, res) => {

    res.status(200).json({ ok: true });

});

module.exports = router;
