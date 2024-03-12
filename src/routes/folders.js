const router = require('express')?.Router();
const { getVideosIdsByFolder } = require('@controllers')?.foldersControllers;

router.get('/:id/videos', getVideosIdsByFolder);

module.exports = router;
