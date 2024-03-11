const router = require('express')?.Router();
const { foldersControllers } = require('@controllers');
const { getVideosIdsByFolder } = foldersControllers;

router.get('/:id/videos', getVideosIdsByFolder);

module.exports = router;
