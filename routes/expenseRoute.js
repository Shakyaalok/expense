const express = require('express');
const router = express.Router();
const { addExpense, getExpenses, getOneExpense, deleteExpense } = require('../controllers/expenseController');
const { auth } = require('../middlewares/auth');



router.use(auth)
router.get('/', getExpenses)
router.get('/:id', getOneExpense)
router.delete('/delete/:id', deleteExpense)
router.post('/add', addExpense)











module.exports = router;