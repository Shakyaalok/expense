const express = require('express');
const router = express.Router();
const { download, reportDownload } = require('../controllers/downloadControllers');
const { auth } = require('../middlewares/auth');



router.use(auth)
router.get('/', download);
router.get('/report/:userId', reportDownload)














module.exports = router;