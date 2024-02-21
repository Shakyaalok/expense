const express = require('express');
const router = express.Router();
const { showleaderBoad } = require('../controllers/leaderBoadControllers');
const { auth } = require('../middlewares/auth');



router.use(auth)
router.get('/', showleaderBoad);














module.exports = router;