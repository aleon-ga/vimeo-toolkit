const router = require('express')?.Router();
const { getVideosIdsByFolder, handleCreateFolders } = require('@controllers/folders');

router.get('/:id/videos', getVideosIdsByFolder);

router.post('/create', handleCreateFolders);

module.exports = router;
