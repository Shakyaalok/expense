const express = require('express');
const router = express.Router();
const { pagination } = require('../controllers/paginationControllers')
const { auth } = require('../middlewares/auth')

router.use(auth)

router.get('/:userId', pagination)











module.exports = router;