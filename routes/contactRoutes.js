const express = require('express');
const router = express.Router();
const { contact, contactVisit } = require('../controllers/contactControllers');
const { auth } = require('../middlewares/auth')


router.post('/visit', contactVisit)
router.use(auth)
router.post('/', contact)













module.exports = router;