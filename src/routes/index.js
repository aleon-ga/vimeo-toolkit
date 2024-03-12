const router = require('express')?.Router();
const foldersRoutes = require('./folders');
const showcasesRoutes = require('./showcases');
const videosRoutes = require('./videos');

router.use('/folders', foldersRoutes);

router.use('/showcase', showcasesRoutes);

router.use('/videos', videosRoutes);

router.get('/health-check', (req, res) => {

    res.status(200).json({ ok: true });

});

module.exports = router;
