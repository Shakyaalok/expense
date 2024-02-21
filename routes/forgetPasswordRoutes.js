const express = require('express');
const router = express.Router();
const { forgetPassword, resetandUpdatePassword } = require('../controllers/forgetPasswordControllers');





router.post('/forgotpassword', forgetPassword); // check the route carefully if it contains space then it throw an error 404
router.post('/resetandupdate/:id', resetandUpdatePassword);









module.exports = router;