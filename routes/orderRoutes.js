const express = require('express');
const router = express.Router();
const { purchasepremium, updateTransactions } = require('../controllers/orderControllers');
const { auth } = require('../middlewares/auth');



router.use(auth)
router.get('/payment', purchasepremium);
router.post('/updatetransactions', updateTransactions)







module.exports = router;